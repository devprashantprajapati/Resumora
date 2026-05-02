import { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, TabStopType, TabStopPosition, BorderStyle, ISectionOptions } from 'docx';
import { ResumeData } from '@/types/resume';
import domtoimage from 'dom-to-image-more';
import { jsPDF } from 'jspdf';

export const exportPDF = async (element: HTMLElement, data: ResumeData) => {
  try {
    // Wait for all fonts to load before capturing
    await document.fonts.ready;

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
    
    // Use dom-to-image-more with a high scale for crisp, high-quality text
    const scale = 4; // Very high resolution
    const imgData = await domtoimage.toPng(clone, {
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
    let finalHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    // Handle multi-page PDF rendering correctly without shrinking vertically
    let heightLeft = finalHeight;
    let position = 0;

    pdf.addImage(imgData, 'PNG', 0, position, finalWidth, finalHeight, undefined, 'FAST');
    heightLeft -= pdfHeight;

    while (heightLeft > 0) {
      position = heightLeft - finalHeight; // Move image up
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, finalWidth, finalHeight, undefined, 'FAST');
      heightLeft -= pdfHeight;
    }
    
    pdf.save(`${data.personalInfo.firstName || 'My'}_${data.personalInfo.lastName || 'Resume'}.pdf`.replace(/\s+/g, '_'));
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw error;
  }
};

export const exportTXT = (data: ResumeData) => {
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;
  let txt = `${personalInfo.firstName} ${personalInfo.lastName}\n`;
  if (personalInfo.title) txt += `${personalInfo.title}\n`;
  
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ');
  if (contact) txt += `${contact}\n`;
  
  const linkedin = personalInfo.links?.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links?.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links?.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;
  
  const links = [linkedin, github, website].filter(Boolean).join(' | ');
  if (links) txt += `${links}\n`;
  
  txt += '\n';

  if (personalInfo.summary) {
    txt += `SUMMARY\n${'-'.repeat(20)}\n${personalInfo.summary}\n\n`;
  }

  if (experience && experience.length > 0) {
    txt += `EXPERIENCE\n${'-'.repeat(20)}\n`;
    experience.forEach(exp => {
      txt += `${exp.position} at ${exp.company}\n`;
      txt += `${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}\n`;
      if (exp.description) txt += `${exp.description}\n`;
      txt += '\n';
    });
  }

  if (education && education.length > 0) {
    txt += `EDUCATION\n${'-'.repeat(20)}\n`;
    education.forEach(edu => {
      txt += `${edu.degree} in ${edu.field} from ${edu.school}\n`;
      txt += `${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}\n`;
      if (edu.description) txt += `${edu.description}\n`;
      txt += '\n';
    });
  }

  if (skills && skills.length > 0) {
    txt += `SKILLS\n${'-'.repeat(20)}\n`;
    txt += skills.map(s => `${s.name} (${s.level})`).join(', ') + '\n\n';
  }

  if (settings.showProjects !== false && projects && projects.length > 0) {
    txt += `PROJECTS\n${'-'.repeat(20)}\n`;
    projects.forEach(proj => {
      txt += `${proj.name}`;
      if (proj.url) txt += ` - ${proj.url}`;
      txt += `\n${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}\n`;
      if (proj.description) txt += `${proj.description}\n`;
      txt += '\n';
    });
  }

  if (settings.showCertifications !== false && certifications && certifications.length > 0) {
    txt += `CERTIFICATIONS\n${'-'.repeat(20)}\n`;
    certifications.forEach(cert => {
      txt += `${cert.name} from ${cert.issuer}\n`;
      if (cert.date) txt += `${cert.date}\n`;
      if (cert.url) txt += `${cert.url}\n`;
      txt += '\n';
    });
  }

  if (settings.showLanguages !== false && languages && languages.length > 0) {
    txt += `LANGUAGES\n${'-'.repeat(20)}\n`;
    txt += languages.map(l => `${l.name} (${l.proficiency})`).join(', ') + '\n\n';
  }

  if (settings.showInterests !== false && interests && interests.length > 0) {
    txt += `INTERESTS\n${'-'.repeat(20)}\n`;
    txt += interests.map(i => i.name).join(', ') + '\n\n';
  }

  if (settings.showReferences !== false && references && references.length > 0) {
    txt += `REFERENCES\n${'-'.repeat(20)}\n`;
    references.forEach(ref => {
      txt += `${ref.name}\n`;
      if (ref.position && ref.company) txt += `${ref.position} at ${ref.company}\n`;
      const refContact = [ref.email, ref.phone].filter(Boolean).join(' | ');
      if (refContact) txt += `${refContact}\n`;
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
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;
  
  const linkedin = personalInfo.links?.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links?.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links?.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

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
    work: (experience || []).map(exp => ({
      name: exp.company,
      position: exp.position,
      startDate: exp.startDate,
      endDate: exp.endDate,
      summary: exp.description
    })),
    education: (education || []).map(edu => ({
      institution: edu.school,
      area: edu.field,
      studyType: edu.degree,
      startDate: edu.startDate,
      endDate: edu.endDate,
      score: edu.description
    })),
    skills: (skills || []).map(skill => ({
      name: skill.name,
      level: skill.level
    })),
    projects: settings.showProjects !== false ? (projects || []).map(proj => ({
      name: proj.name,
      startDate: proj.startDate,
      endDate: proj.endDate,
      description: proj.description,
      url: proj.url
    })) : [],
    certificates: settings.showCertifications !== false ? (certifications || []).map(cert => ({
      name: cert.name,
      date: cert.date,
      issuer: cert.issuer,
      url: cert.url
    })) : [],
    languages: settings.showLanguages !== false ? (languages || []).map(lang => ({
      language: lang.name,
      fluency: lang.proficiency
    })) : [],
    interests: settings.showInterests !== false ? (interests || []).map(interest => ({
      name: interest.name
    })) : [],
    references: settings.showReferences !== false ? (references || []).map(ref => ({
      name: ref.name,
      reference: `${ref.position ? ref.position + ' at ' : ''}${ref.company ? ref.company : ''}`,
      email: ref.email,
      phone: ref.phone
    })) : []
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
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

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

  const linkedin = personalInfo.links?.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links?.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links?.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

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
  if (experience && experience.length > 0) {
    children.push(
      new Paragraph({
        text: "Experience",
        heading: HeadingLevel.HEADING_3,
      })
    );
    experience.forEach(exp => {
      children.push(
        new Paragraph({
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX }
          ],
          children: [
            new TextRun({ text: exp.position, bold: true, size: 24 }),
            new TextRun({ text: ` at ${exp.company}`, size: 24 }),
            new TextRun({ text: `\t${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}`, italics: true, color: "666666" }),
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
  if (education && education.length > 0) {
    children.push(
      new Paragraph({
        text: "Education",
        heading: HeadingLevel.HEADING_3,
      })
    );
    education.forEach(edu => {
      children.push(
        new Paragraph({
          tabStops: [
            { type: TabStopType.RIGHT, position: TabStopPosition.MAX }
          ],
          children: [
            new TextRun({ text: `${edu.degree} in ${edu.field}`, bold: true, size: 24 }),
            new TextRun({ text: ` from ${edu.school}`, size: 24 }),
            new TextRun({ text: `\t${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}`, italics: true, color: "666666" }),
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
  if (skills && skills.length > 0) {
    children.push(
      new Paragraph({
        text: "Skills",
        heading: HeadingLevel.HEADING_3,
      })
    );
    const skillCategories = skills.reduce((acc, skill) => {
      acc[skill.level] = acc[skill.level] || [];
      acc[skill.level].push(skill.name);
      return acc;
    }, {} as Record<string, string[]>);
    
    Object.entries(skillCategories).forEach(([level, items]) => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: `${level}: `, bold: true }),
            new TextRun({ text: items.join(', ') })
          ]
        })
      );
    });
    children.push(new Paragraph({ text: "" }));
  }

  // Projects
  if (settings.showProjects !== false && projects && projects.length > 0) {
    children.push(
      new Paragraph({
        text: "Projects",
        heading: HeadingLevel.HEADING_3,
      })
    );
    projects.forEach(proj => {
      const projTitle = [
        new TextRun({ text: proj.name, bold: true, size: 24 })
      ];
      if (proj.url) {
        projTitle.push(new TextRun({ text: ` - ${proj.url}` }));
      }
      projTitle.push(new TextRun({ text: `\t${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}`, italics: true, color: "666666" }));
      
      children.push(new Paragraph({ 
        tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
        children: projTitle 
      }));
      
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
  if (settings.showCertifications !== false && certifications && certifications.length > 0) {
    children.push(
      new Paragraph({
        text: "Certifications",
        heading: HeadingLevel.HEADING_3,
      })
    );
    certifications.forEach(cert => {
      const certTitle = [
        new TextRun({ text: cert.name, bold: true, size: 24 }),
        new TextRun({ text: ` from ${cert.issuer}`, size: 24 }),
      ];
      if (cert.date) {
        certTitle.push(new TextRun({ text: `\t${cert.date}`, italics: true, color: "666666" }));
      }
      children.push(
        new Paragraph({
          tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
          children: certTitle,
        })
      );
      if (cert.url) {
        children.push(new Paragraph({ text: cert.url }));
      }
      children.push(new Paragraph({ text: "" }));
    });
  }

  // Languages
  if (settings.showLanguages !== false && languages && languages.length > 0) {
    children.push(
      new Paragraph({
        text: "Languages",
        heading: HeadingLevel.HEADING_3,
      })
    );
    const langText = languages.map(l => `${l.name} (${l.proficiency})`).join(' • ');
    children.push(new Paragraph({ text: langText }));
    children.push(new Paragraph({ text: "" }));
  }

  // Interests
  if (settings.showInterests !== false && interests && interests.length > 0) {
    children.push(
      new Paragraph({
        text: "Interests",
        heading: HeadingLevel.HEADING_3,
      })
    );
    const intText = interests.map(i => i.name).join(' • ');
    children.push(new Paragraph({ text: intText }));
    children.push(new Paragraph({ text: "" }));
  }

  // References
  if (settings.showReferences !== false && references && references.length > 0) {
    children.push(
      new Paragraph({
        text: "References",
        heading: HeadingLevel.HEADING_3,
      })
    );
    references.forEach(ref => {
      children.push(
        new Paragraph({
          children: [
            new TextRun({ text: ref.name, bold: true, size: 24 }),
          ],
        })
      );
      const refTitle = [ref.position, ref.company].filter(Boolean).join(' at ');
      if (refTitle) {
        children.push(new Paragraph({ text: refTitle }));
      }
      const refContact = [ref.email, ref.phone].filter(Boolean).join(' | ');
      if (refContact) {
        children.push(new Paragraph({ text: refContact }));
      }
      children.push(new Paragraph({ text: "" }));
    });
  }

  const doc = new Document({
    styles: {
      default: {
        document: {
          run: {
            font: "Helvetica",
            size: 22,
            color: "333333",
          },
        },
      },
      paragraphStyles: [
        {
          id: "Heading1",
          name: "Heading 1",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Helvetica", size: 48, bold: true, color: "111111" },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 120 } },
        },
        {
          id: "Heading2",
          name: "Heading 2",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Helvetica", size: 28, bold: true, color: "333333" },
          paragraph: { alignment: AlignmentType.CENTER, spacing: { after: 240 } },
        },
        {
          id: "Heading3",
          name: "Heading 3",
          basedOn: "Normal",
          next: "Normal",
          run: { font: "Helvetica", size: 28, bold: true, color: "111111" },
          paragraph: {
            spacing: { before: 240, after: 120 },
            border: {
              bottom: {
                color: "E5E7EB",
                space: 1,
                style: BorderStyle.SINGLE,
                size: 6,
              },
            },
          },
        },
      ]
    },
    sections: [{
      properties: {
        page: {
          margin: {
            top: 720,    // 0.5 inch
            right: 720,
            bottom: 720,
            left: 720,
          },
        },
      },
      children: children,
    } as ISectionOptions],
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
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;
  let md = `# ${personalInfo.firstName} ${personalInfo.lastName}\n`;
  if (personalInfo.title) md += `**${personalInfo.title}**\n\n`;
  
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' | ');
  if (contact) md += `${contact}\n\n`;
  
  const linkedin = personalInfo.links?.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links?.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links?.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

  const links = [
    linkedin && `[LinkedIn](${linkedin})`,
    github && `[GitHub](${github})`,
    website && `[Website](${website})`
  ].filter(Boolean).join(' | ');
  if (links) md += `${links}\n\n`;

  if (personalInfo.summary) {
    md += `## Summary\n${personalInfo.summary}\n\n`;
  }

  if (experience && experience.length > 0) {
    md += `## Experience\n`;
    experience.forEach(exp => {
      md += `### ${exp.position} at ${exp.company}\n`;
      md += `*${exp.startDate || 'Start'} - ${exp.endDate || 'Present'}*\n\n`;
      if (exp.description) md += `${exp.description}\n\n`;
    });
  }

  if (education && education.length > 0) {
    md += `## Education\n`;
    education.forEach(edu => {
      md += `### ${edu.degree} in ${edu.field} from ${edu.school}\n`;
      md += `*${edu.startDate || 'Start'} - ${edu.endDate || 'Present'}*\n\n`;
      if (edu.description) md += `${edu.description}\n\n`;
    });
  }

  if (skills && skills.length > 0) {
    md += `## Skills\n`;
    md += skills.map(s => `- **${s.name}** (${s.level})`).join('\n') + '\n\n';
  }

  if (settings.showProjects !== false && projects && projects.length > 0) {
    md += `## Projects\n`;
    projects.forEach(proj => {
      md += `### ${proj.name}`;
      if (proj.url) md += ` - [Link](${proj.url})`;
      md += `\n*${proj.startDate || 'Start'} - ${proj.endDate || 'Present'}*\n\n`;
      if (proj.description) md += `${proj.description}\n\n`;
    });
  }

  if (settings.showCertifications !== false && certifications && certifications.length > 0) {
    md += `## Certifications\n`;
    certifications.forEach(cert => {
      md += `### ${cert.name} from ${cert.issuer}\n`;
      if (cert.date) md += `*${cert.date}*\n\n`;
      if (cert.url) md += `[Link](${cert.url})\n\n`;
    });
  }

  if (settings.showLanguages !== false && languages && languages.length > 0) {
    md += `## Languages\n`;
    md += languages.map(l => `- **${l.name}** (${l.proficiency})`).join('\n') + '\n\n';
  }

  if (settings.showInterests !== false && interests && interests.length > 0) {
    md += `## Interests\n`;
    md += interests.map(i => `- ${i.name}`).join('\n') + '\n\n';
  }

  if (settings.showReferences !== false && references && references.length > 0) {
    md += `## References\n`;
    references.forEach(ref => {
      md += `### ${ref.name}\n`;
      if (ref.position && ref.company) md += `*${ref.position} at ${ref.company}*\n\n`;
      if (ref.email) md += `- Email: ${ref.email}\n`;
      if (ref.phone) md += `- Phone: ${ref.phone}\n`;
      md += '\n';
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
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;
  
  let html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${personalInfo.firstName} ${personalInfo.lastName} - Resume</title>
<style>
  :root {
    --primary: #2563eb;
    --text-main: #1f2937;
    --text-muted: #6b7280;
    --border: #e5e7eb;
    --bg-main: #ffffff;
    --bg-muted: #f3f4f6;
  }
  * { box-sizing: border-box; }
  body { 
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
    line-height: 1.6; 
    color: var(--text-main); 
    background: var(--bg-muted);
    margin: 0;
    padding: 2rem;
  }
  .page {
    max-width: 850px;
    margin: 0 auto;
    background: var(--bg-main);
    padding: 3rem 4rem;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    border-radius: 8px;
  }
  header { text-align: center; margin-bottom: 2.5rem; }
  h1 { color: #111; margin: 0 0 0.5rem 0; font-size: 2.5rem; letter-spacing: -0.025em; }
  h2 { 
    color: #111; 
    border-bottom: 2px solid var(--border); 
    padding-bottom: 0.5rem; 
    margin: 2.5rem 0 1.5rem 0;
    font-size: 1.5rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }
  .title { font-size: 1.25rem; color: var(--primary); font-weight: 500; margin-bottom: 1rem; }
  .contact-info { color: var(--text-muted); font-size: 0.95rem; margin-bottom: 0.5rem; }
  .contact-info a { color: var(--text-muted); text-decoration: none; }
  .contact-info a:hover { color: var(--primary); }
  
  .section-item { margin-bottom: 1.5rem; }
  .item-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 0.25rem; }
  h3 { color: #111; margin: 0; font-size: 1.1rem; }
  .date { color: var(--text-muted); font-size: 0.9rem; font-weight: 500; white-space: nowrap; margin-left: 1rem; }
  .description { margin-top: 0.5rem; color: #374151; }
  .description p { margin: 0 0 0.5rem 0; }
  
  .skills-list { display: flex; flex-wrap: wrap; gap: 0.5rem; padding: 0; list-style: none; margin: 0; }
  .skill-item { background: var(--bg-muted); padding: 0.25rem 0.75rem; border-radius: 9999px; font-size: 0.875rem; color: #374151; border: 1px solid var(--border); }
  
  @media print {
    body { background: white; padding: 0; }
    .page { box-shadow: none; padding: 0; max-width: 100%; border-radius: 0; }
    @page { margin: 0.5in; }
  }
</style>
</head>
<body>
<div class="page">
  <header>
`;

  html += `<h1>${personalInfo.firstName} ${personalInfo.lastName}</h1>`;
  if (personalInfo.title) html += `<div class="title">${personalInfo.title}</div>`;
  
  const contact = [personalInfo.email, personalInfo.phone, personalInfo.city, personalInfo.country].filter(Boolean).join(' &bull; ');
  if (contact) html += `<div class="contact-info">${contact}</div>`;
  
  const linkedin = personalInfo.links?.find(l => l.label.toLowerCase() === 'linkedin')?.url;
  const github = personalInfo.links?.find(l => l.label.toLowerCase() === 'github')?.url;
  const website = personalInfo.links?.find(l => l.label.toLowerCase() === 'website' || l.label.toLowerCase() === 'portfolio')?.url;

  const links = [
    linkedin && `<a href="${linkedin}">LinkedIn</a>`,
    github && `<a href="${github}">GitHub</a>`,
    website && `<a href="${website}">Website</a>`
  ].filter(Boolean).join(' &bull; ');
  if (links) html += `<div class="contact-info">${links}</div>`;
  html += `</header>`;

  if (personalInfo.summary) {
    html += `<h2>Summary</h2><div class="description"><p>${personalInfo.summary.replace(/\n/g, '</p><p>')}</p></div>`;
  }

  if (experience && experience.length > 0) {
    html += `<h2>Experience</h2>`;
    experience.forEach(exp => {
      html += `<div class="section-item">
        <div class="item-header">
          <h3><strong>${exp.position}</strong>, ${exp.company}</h3>
          <div class="date">${exp.startDate || 'Start'} &ndash; ${exp.endDate || 'Present'}</div>
        </div>`;
      if (exp.description) html += `<div class="description"><p>${exp.description.replace(/\n/g, '</p><p>')}</p></div>`;
      html += `</div>`;
    });
  }

  if (education && education.length > 0) {
    html += `<h2>Education</h2>`;
    education.forEach(edu => {
      html += `<div class="section-item">
        <div class="item-header">
          <h3><strong>${edu.degree} in ${edu.field}</strong>, ${edu.school}</h3>
          <div class="date">${edu.startDate || 'Start'} &ndash; ${edu.endDate || 'Present'}</div>
        </div>`;
      if (edu.description) html += `<div class="description"><p>${edu.description.replace(/\n/g, '</p><p>')}</p></div>`;
      html += `</div>`;
    });
  }

  if (skills && skills.length > 0) {
    html += `<h2>Skills</h2>`;
    html += `<ul class="skills-list">`;
    skills.forEach(s => {
      html += `<li class="skill-item"><strong>${s.name}</strong> ${s.level !== 'Beginner' ? `<span style="color:#6b7280">(${s.level})</span>` : ''}</li>`;
    });
    html += `</ul>`;
  }

  if (settings.showProjects !== false && projects && projects.length > 0) {
    html += `<h2>Projects</h2>`;
    projects.forEach(proj => {
      html += `<div class="section-item">
        <div class="item-header">
          <h3><strong>${proj.name}</strong>${proj.url ? ` &bull; <a href="${proj.url}" target="_blank" style="font-weight:normal; font-size:0.9em;">View Link</a>` : ''}</h3>
          <div class="date">${proj.startDate || 'Start'} &ndash; ${proj.endDate || 'Present'}</div>
        </div>`;
      if (proj.description) html += `<div class="description"><p>${proj.description.replace(/\n/g, '</p><p>')}</p></div>`;
      html += `</div>`;
    });
  }

  if (settings.showCertifications !== false && certifications && certifications.length > 0) {
    html += `<h2>Certifications</h2>`;
    certifications.forEach(cert => {
      html += `<div class="section-item">
        <div class="item-header">
          <h3><strong>${cert.name}</strong>, ${cert.issuer}${cert.url ? ` &bull; <a href="${cert.url}" target="_blank" style="font-weight:normal; font-size:0.9em;">View Link</a>` : ''}</h3>
          ${cert.date ? `<div class="date">${cert.date}</div>` : ''}
        </div>
      </div>`;
    });
  }

  if (settings.showLanguages !== false && languages && languages.length > 0) {
    html += `<h2>Languages</h2>`;
    html += `<ul class="skills-list">`;
    languages.forEach(l => {
      html += `<li class="skill-item"><strong>${l.name}</strong> <span style="color:#6b7280">(${l.proficiency})</span></li>`;
    });
    html += `</ul>`;
  }

  if (settings.showInterests !== false && interests && interests.length > 0) {
    html += `<h2>Interests</h2>`;
    html += `<ul class="skills-list" style="margin-bottom: 2rem;">`;
    interests.forEach(i => {
      html += `<li class="skill-item">${i.name}</li>`;
    });
    html += `</ul>`;
  }

  if (settings.showReferences !== false && references && references.length > 0) {
    html += `<h2>References</h2>`;
    html += `<div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(250px, 1fr)); gap: 1.5rem;">`;
    references.forEach(ref => {
      html += `<div>
        <h3 style="margin-bottom: 0.25rem;">${ref.name}</h3>`;
      if (ref.position && ref.company) html += `<div style="color:var(--text-muted); font-size:0.9rem;">${ref.position}, ${ref.company}</div>`;
      if (ref.email) html += `<div style="font-size:0.9rem;"><a href="mailto:${ref.email}" style="color:#374151; text-decoration:none;">${ref.email}</a></div>`;
      if (ref.phone) html += `<div style="font-size:0.9rem;">${ref.phone}</div>`;
      html += `</div>`;
    });
    html += `</div>`;
  }

  html += `
</div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${personalInfo.firstName}_${personalInfo.lastName}_Resume.html`.replace(/\s+/g, '_');
  a.click();
  URL.revokeObjectURL(url);
};