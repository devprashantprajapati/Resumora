import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } from 'docx';
import { ResumeData } from '@/types/resume';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

export const exportPDF = async (element: HTMLElement, data: ResumeData) => {
  try {
    // Create a clone of the element to avoid modifying the visible UI
    const clone = element.cloneNode(true) as HTMLElement;
    
    // Apply necessary styles to the clone for perfect capturing
    clone.style.position = 'absolute';
    clone.style.left = '-9999px';
    clone.style.top = '0';
    clone.style.transform = 'none';
    clone.style.boxShadow = 'none';
    clone.style.borderRadius = '0';
    clone.style.margin = '0';
    clone.className = clone.className.replace(/my-\d+/g, '').replace(/md:my-\d+/g, '').replace(/shadow-\[[^\]]*\]/g, '');
    
    // Hide watermark in clone
    const watermark = clone.querySelector('#resume-watermark') as HTMLElement;
    if (watermark) {
      watermark.style.display = 'none';
    }
    
    // Append clone to body so we can compute styles and dom-to-image can render it
    document.body.appendChild(clone);
    
    // FIX FOR BLACK LINES: Tailwind sets global border-style: solid with border-width: 0.
    // dom-to-image sometimes misinterprets this and draws thick black lines.
    // We explicitly set border-style: none on elements that have 0px border width.
    const originalElements = [element, ...Array.from(element.querySelectorAll('*'))];
    const clonedElements = [clone, ...Array.from(clone.querySelectorAll('*'))];
    
    originalElements.forEach((el, index) => {
      if (!(el instanceof HTMLElement)) return;
      const clonedEl = clonedElements[index] as HTMLElement;
      if (!clonedEl) return;
      
      const compStyle = window.getComputedStyle(el);
      if (compStyle.borderTopWidth === '0px') clonedEl.style.borderTopStyle = 'none';
      if (compStyle.borderRightWidth === '0px') clonedEl.style.borderRightStyle = 'none';
      if (compStyle.borderBottomWidth === '0px') clonedEl.style.borderBottomStyle = 'none';
      if (compStyle.borderLeftWidth === '0px') clonedEl.style.borderLeftStyle = 'none';
    });
    
    // Use dom-to-image-more which supports modern CSS like oklch
    const scale = 2; // Higher resolution
    const imgData = await domtoimage.toJpeg(clone, {
      quality: 1.0,
      bgcolor: '#ffffff',
      width: element.clientWidth * scale,
      height: element.clientHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: `${element.clientWidth}px`,
        height: `${element.clientHeight}px`
      }
    });
    
    // Clean up the clone
    document.body.removeChild(clone);
    
    const isA4 = data.settings.paperSize === 'a4';
    const pdfWidth = isA4 ? 210 : 215.9; // mm (A4 or Letter)
    const pdfHeight = isA4 ? 297 : 279.4; // mm
    
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: isA4 ? 'a4' : 'letter'
    });
    
    const imgProps = pdf.getImageProperties(imgData);
    const pdfRatio = pdfWidth / pdfHeight;
    const imgRatio = imgProps.width / imgProps.height;
    
    let finalWidth = pdfWidth;
    let finalHeight = pdfHeight;
    
    // Ensure the image fits perfectly without distortion
    if (imgRatio > pdfRatio) {
      finalHeight = pdfWidth / imgRatio;
    } else {
      finalWidth = pdfHeight * imgRatio;
    }
    
    pdf.addImage(imgData, 'JPEG', 0, 0, finalWidth, finalHeight);
    pdf.save(`${data.personalInfo.firstName || 'My'}_${data.personalInfo.lastName || 'Resume'}.pdf`.replace(/\s+/g, '_'));
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const exportTXT = (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;
  let txt = `${personalInfo.firstName} ${personalInfo.lastName}\n`;
  if (personalInfo.title) txt += `${personalInfo.title}\n`;
  
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ');
  if (contact) txt += `${contact}\n`;
  
  const linkedin = personalInfo.links.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;
  
  const links = [linkedin, github, website].filter(Boolean).join(' | ');
  if (links) txt += `${links}\n`;
  
  txt += '\n';

  if (personalInfo.summary) {
    txt += `SUMMARY\n${'-'.repeat(20)}\n${personalInfo.summary}\n\n`;
  }

  if (experience.length > 0) {
    txt += `EXPERIENCE\n${'-'.repeat(20)}\n`;
    experience.forEach(exp => {
      txt += `${exp.position} at ${exp.company}\n`;
      txt += `${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}\n`;
      if (exp.description) txt += `${exp.description}\n`;
      txt += '\n';
    });
  }

  if (education.length > 0) {
    txt += `EDUCATION\n${'-'.repeat(20)}\n`;
    education.forEach(edu => {
      txt += `${edu.degree} in ${edu.field} from ${edu.school}\n`;
      txt += `${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}\n`;
      if (edu.description) txt += `${edu.description}\n`;
      txt += '\n';
    });
  }

  if (skills.length > 0) {
    txt += `SKILLS\n${'-'.repeat(20)}\n`;
    txt += skills.map(s => `${s.name} (${s.level})`).join(', ') + '\n\n';
  }

  if (projects.length > 0) {
    txt += `PROJECTS\n${'-'.repeat(20)}\n`;
    projects.forEach(proj => {
      txt += `${proj.name}`;
      if (proj.url) txt += ` - ${proj.url}`;
      txt += `\n${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}\n`;
      if (proj.description) txt += `${proj.description}\n`;
      txt += '\n';
    });
  }

  if (certifications.length > 0) {
    txt += `CERTIFICATIONS\n${'-'.repeat(20)}\n`;
    certifications.forEach(cert => {
      txt += `${cert.name} from ${cert.issuer}\n`;
      if (cert.date) txt += `${cert.date}\n`;
      if (cert.url) txt += `${cert.url}\n`;
      txt += '\n';
    });
  }

  const blob = new Blob([txt], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.txt`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
};

export const exportJSON = (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;
  
  const linkedin = personalInfo.links.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

  const profiles = [];
  if (linkedin) profiles.push({ network: 'LinkedIn', url: linkedin });
  if (github) profiles.push({ network: 'GitHub', url: github });
  if (website) profiles.push({ network: 'Website', url: website });

  const jsonResume = {
    basics: {
      name: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
      label: personalInfo.title,
      image: personalInfo.photoUrl,
      email: personalInfo.email,
      phone: personalInfo.phone,
      url: website,
      summary: personalInfo.summary,
      location: {
        address: [personalInfo.address, personalInfo.city, personalInfo.country].filter(Boolean).join(', ')
      },
      profiles
    },
    work: experience.map(exp => ({
      name: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      summary: exp.description
    })),
    education: education.map(edu => ({
      institution: edu.school,
      area: edu.field,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      score: edu.description
    })),
    skills: skills.map(skill => ({
      name: skill.name,
      level: skill.level
    })),
    projects: projects.map(proj => ({
      name: proj.name,
      startDate: proj.startDate,
      endDate: proj.endDate,
      description: proj.description,
      url: proj.url
    })),
    certificates: certifications.map(cert => ({
      name: cert.name,
      date: cert.date,
      issuer: cert.issuer,
      url: cert.url
    }))
  };

  const blob = new Blob([JSON.stringify(jsonResume, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.json`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
};

export const exportDOCX = async (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;

  const children: any[] = [];

  // Name
  children.push(
    new Paragraph({
      text: `${personalInfo.firstName} ${personalInfo.lastName}`.trim(),
      heading: HeadingLevel.HEADING_1,
      alignment: AlignmentType.CENTER,
    })
  );

  // Title
  if (personalInfo.title) {
    children.push(
      new Paragraph({
        text: personalInfo.title,
        heading: HeadingLevel.HEADING_2,
        alignment: AlignmentType.CENTER,
      })
    );
  }

  // Contact Info
  const contactInfo = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ');
  if (contactInfo) {
    children.push(
      new Paragraph({
        text: contactInfo,
        alignment: AlignmentType.CENTER,
      })
    );
  }

  const linkedin = personalInfo.links.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

  // Links
  const links = [linkedin, github, website].filter(Boolean).join(' | ');
  if (links) {
    children.push(
      new Paragraph({
        text: links,
        alignment: AlignmentType.CENTER,
      })
    );
  }
  
  children.push(new Paragraph({ text: "" })); // spacing

  // Summary
  if (personalInfo.summary) {
    children.push(
      new Paragraph({
        text: "Professional Summary",
        heading: HeadingLevel.HEADING_3,
      })
    );
    children.push(
      new Paragraph({
        text: personalInfo.summary,
      })
    );
    children.push(new Paragraph({ text: "" }));
  }

  // Experience
  if (experience.length > 0) {
    children.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_3,
      })
    );
    experience.forEach(exp => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: exp.position, bold: true }),
            new TextRun({ text: ` at ${exp.company}` }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}`, italics: true }),
          ],
        })
      );
      if (exp.description) {
        exp.description.split('\n').forEach(line => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                text: line.trim(),
                bullet: { level: 0 }
              })
            );
          }
        });
      }
      children.push(new Paragraph({ text: "" }));
    });
  }

  // Education
  if (education.length > 0) {
    children.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_3,
      })
    );
    education.forEach(edu => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true }),
            new TextRun({ text: ` from ${edu.school}` }),
          ],
        })
      );
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}`, italics: true }),
          ],
        })
      );
      if (edu.description) {
        children.push(new Paragraph({ text: edu.description }));
      }
      children.push(new Paragraph({ text: "" }));
    });
  }

  // Skills
  if (skills.length > 0) {
    children.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_3,
      })
    );
    const skillText = skills.map(s => `${s.name} (${s.level})`).join(', ');
    children.push(new Paragraph({ text: skillText }));
    children.push(new Paragraph({ text: "" }));
  }

  // Projects
  if (projects.length > 0) {
    children.push(
      new Paragraph({
        text: "Projects",
        heading: HeadingLevel.HEADING_3,
      })
    );
    projects.forEach(proj => {
      const projTitle = [
        new TextRun({ text: proj.name, bold: true })
      ];
      if (proj.url) {
        projTitle.push(new TextRun({ text: ` - ${proj.url}` }));
      }
      children.push(new Paragraph({ children: projTitle }));
      
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}`, italics: true }),
          ],
        })
      );
      
      if (proj.description) {
        proj.description.split('\n').forEach(line => {
          if (line.trim()) {
            children.push(
              new Paragraph({
                text: line.trim(),
                bullet: { level: 0 }
              })
            );
          }
        });
      }
      children.push(new Paragraph({ text: "" }));
    });
  }

  // Certifications
  if (certifications.length > 0) {
    children.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_3,
      })
    );
    certifications.forEach(cert => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: cert.name, bold: true }),
            new TextRun({ text: ` from ${cert.issuer}` }),
          ],
        })
      );
      if (cert.date) {
        children.push(
          new Paragraph({
            children: [
              new TextRun({ text: cert.date, italics: true }),
            ],
          })
        );
      }
      if (cert.url) {
        children.push(new Paragraph({ text: cert.url }));
      }
      children.push(new Paragraph({ text: "" }));
    });
  }

  const doc = new Document({
    sections: [{
      properties: {},
      children: children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.docx`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
};

export const exportMarkdown = (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;
  let md = `# ${personalInfo.firstName} ${personalInfo.lastName}\n`;
  if (personalInfo.title) md += `**${personalInfo.title}**\n\n`;
  
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ');
  if (contact) md += `${contact}\n\n`;
  
  const linkedin = personalInfo.links.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

  const links = [
    linkedin && `[LinkedIn](${linkedin})`,
    github && `[GitHub](${github})`,
    website && `[Website](${website})`
  ].filter(Boolean).join(' | ');
  if (links) md += `${links}\n\n`;

  if (personalInfo.summary) {
    md += `## Summary\n${personalInfo.summary}\n\n`;
  }

  if (experience.length > 0) {
    md += `## Experience\n`;
    experience.forEach(exp => {
      md += `### ${exp.position} at ${exp.company}\n`;
      md += `*${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}*\n\n`;
      if (exp.description) md += `${exp.description}\n\n`;
    });
  }

  if (education.length > 0) {
    md += `## Education\n`;
    education.forEach(edu => {
      md += `### ${edu.degree} in ${edu.field} from ${edu.school}\n`;
      md += `*${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}*\n\n`;
      if (edu.description) md += `${edu.description}\n\n`;
    });
  }

  if (skills.length > 0) {
    md += `## Skills\n`;
    md += skills.map(s => `- **${s.name}** (${s.level})`).join('\n') + '\n\n';
  }

  if (projects.length > 0) {
    md += `## Projects\n`;
    projects.forEach(proj => {
      md += `### ${proj.name}`;
      if (proj.url) md += ` - [Link](${proj.url})`;
      md += `\n*${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}*\n\n`;
      if (proj.description) md += `${proj.description}\n\n`;
    });
  }

  if (certifications.length > 0) {
    md += `## Certifications\n`;
    certifications.forEach(cert => {
      md += `### ${cert.name} from ${cert.issuer}\n`;
      if (cert.date) md += `*${cert.date}*\n\n`;
      if (cert.url) md += `[Link](${cert.url})\n\n`;
    });
  }

  const blob = new Blob([md], { type: 'text/markdown' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.md`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
};

export const exportHTML = (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications } = data;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${personalInfo.firstName} ${personalInfo.lastName} - Resume</title>
<style>
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 800px; margin: 0 auto; padding: 2rem; }
  h1 { color: #2c3e50; margin-bottom: 0.5rem; }
  h2 { color: #34495e; border-bottom: 2px solid #eee; padding-bottom: 0.5rem; margin-top: 2rem; }
  h3 { color: #2c3e50; margin-bottom: 0.2rem; }
  .contact-info { color: #7f8c8d; margin-bottom: 1rem; }
  .date { color: #7f8c8d; font-style: italic; font-size: 0.9rem; margin-bottom: 0.5rem; }
  .description { margin-top: 0.5rem; }
  a { color: #3498db; text-decoration: none; }
  a:hover { text-decoration: underline; }
  .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0; list-style: none; }
  .skill-item { background: #f1f2f6; padding: 0.2rem 0.8rem; border-radius: 15px; font-size: 0.9rem; }
</style>
</head>
<body>
`;

  html += `<h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>`;
  if (personalInfo.title) html += `<h3>${personalInfo.title}</h3>`;
  
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ');
  if (contact) html += `<div class="contact-info">${contact}</div>`;
  
  const linkedin = personalInfo.links.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

  const links = [
    linkedin && `<a href="${linkedin}">LinkedIn</a>`,
    github && `<a href="${github}">GitHub</a>`,
    website && `<a href="${website}">Website</a>`
  ].filter(Boolean).join(' | ');
  if (links) html += `<div class="contact-info">${links}</div>`;

  if (personalInfo.summary) {
    html += `<h2>Summary</h2><p>${personalInfo.summary.replace(/\n/g, '<br>')}</p>`;
  }

  if (experience.length > 0) {
    html += `<h2>Experience</h2>`;
    experience.forEach(exp => {
      html += `<h3>${exp.position} at ${exp.company}</h3>`;
      html += `<div class="date">${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}</div>`;
      if (exp.description) html += `<div class="description">${exp.description.replace(/\n/g, '<br>')}</div>`;
    });
  }

  if (education.length > 0) {
    html += `<h2>Education</h2>`;
    education.forEach(edu => {
      html += `<h3>${edu.degree} in ${edu.field} from ${edu.school}</h3>`;
      html += `<div class="date">${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}</div>`;
      if (edu.description) html += `<div class="description">${edu.description.replace(/\n/g, '<br>')}</div>`;
    });
  }

  if (skills.length > 0) {
    html += `<h2>Skills</h2><ul class="skills-list">`;
    skills.forEach(s => {
      html += `<li class="skill-item"><strong>${s.name}</strong> (${s.level})</li>`;
    });
    html += `</ul>`;
  }

  if (projects.length > 0) {
    html += `<h2>Projects</h2>`;
    projects.forEach(proj => {
      html += `<h3>${proj.name}${proj.url ? ` - <a href="${proj.url}">Link</a>` : ''}</h3>`;
      html += `<div class="date">${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}</div>`;
      if (proj.description) html += `<div class="description">${proj.description.replace(/\n/g, '<br>')}</div>`;
    });
  }

  if (certifications.length > 0) {
    html += `<h2>Certifications</h2>`;
    certifications.forEach(cert => {
      html += `<h3>${cert.name} from ${cert.issuer}</h3>`;
      if (cert.date) html += `<div class="date">${cert.date}</div>`;
      if (cert.url) html += `<a href="${cert.url}">Link</a>`;
    });
  }

  html += `\n</body>\n</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.html`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
};