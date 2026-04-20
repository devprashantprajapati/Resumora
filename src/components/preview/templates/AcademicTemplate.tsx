import { useResumeStore } from '@/store/useResumeStore';
import { ResumeData } from '@/types/resume';

export function AcademicTemplate({ data: propData }: { data?: ResumeData }) {
  const storeData = useResumeStore(state => state.data);
  const data = propData || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;
  // Academic typical fonts fallback
  const fallbackSerif = '"Times New Roman", Times, serif';
  const headingFont = settings.headingFont || settings.font || fallbackSerif;
  const bodyFont = settings.font || fallbackSerif;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { gap: 'gap-4', spaceY: 'space-y-4', mt: 'mt-4' };
      case 'relaxed': return { gap: 'gap-8', spaceY: 'space-y-8', mt: 'mt-10' };
      default: return { gap: 'gap-6', spaceY: 'space-y-6', mt: 'mt-6' };
    }
  };

  const spacing = getSpacing();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-white text-black p-10 md:p-14" style={{ fontFamily: bodyFont }}>
      
      {/* Header */}
      <header className={`text-center border-b-2 pb-6 mb-8`} style={{ borderColor: color }}>
        <h1 className="text-3xl font-bold tracking-wide uppercase mb-2" style={{ fontFamily: headingFont }}>
          {personalInfo.firstName} {personalInfo.lastName}
        </h1>
        {personalInfo.title && (
          <h2 className="text-lg font-medium italic text-gray-700 mb-4" style={{ fontFamily: headingFont }}>
            {personalInfo.title}
          </h2>
        )}
        
        <div className="flex flex-wrap justify-center gap-x-4 gap-y-1 text-[13px] text-gray-800">
          {personalInfo.email && <span>{personalInfo.email}</span>}
          {personalInfo.email && personalInfo.phone && <span>•</span>}
          {personalInfo.phone && <span>{personalInfo.phone}</span>}
          {(personalInfo.email || personalInfo.phone) && (personalInfo.city || personalInfo.country) && <span>•</span>}
          {(personalInfo.city || personalInfo.country) && (
            <span>{personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}</span>
          )}
        </div>
        
        {personalInfo.links && personalInfo.links.length > 0 && (
          <div className="flex justify-center gap-3 text-[13px] text-gray-700 mt-2">
            {personalInfo.links.map((link, idx) => (
              <span key={link.id}>
                {idx > 0 && <span className="mx-2">•</span>}
                <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline" style={{ color }}>{link.label}</a>
              </span>
            ))}
          </div>
        )}
      </header>

      {/* Main Content */}
      <div className={spacing.spaceY}>
        
        {/* Education (Often first in Academic CVs) */}
        {education.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
              Education
            </h3>
            <div className={`space-y-4`}>
              {education.map(edu => (
                <div key={edu.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[15px]">{edu.school}</h4>
                    <span className="text-[14px] text-gray-600 font-medium whitespace-nowrap ml-4">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </span>
                  </div>
                  <div className="text-[14px] font-medium italic text-gray-800">
                    {edu.degree}{edu.field ? `, ${edu.field}` : ''}
                  </div>
                  {edu.description && (
                    <div className={`text-[13px] text-gray-700 mt-1.5 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                      {edu.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Summary (if not placed at top conventionally) */}
        {personalInfo.summary && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
              Research / Professional Summary
            </h3>
            <p className={`text-[14px] leading-relaxed text-gray-800 ${bodyAlignClass}`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
              Academic & Professional Experience
            </h3>
            <div className={`space-y-4`}>
              {experience.map(exp => (
                <div key={exp.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[15px]">{exp.position}</h4>
                    <span className="text-[14px] text-gray-600 font-medium whitespace-nowrap ml-4">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[14px] font-medium italic text-gray-800 mb-1.5">
                    {exp.company}
                  </div>
                  <div className={`text-[13px] text-gray-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects / Publications */}
        {settings.showProjects !== false && projects.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
              Projects & Publications
            </h3>
            <div className={`space-y-4`}>
              {projects.map(proj => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-[15px]">
                      {proj.name}
                      {proj.url && <span className="font-normal text-sm ml-2">- <a href={`https://${proj.url.replace(/^https?:\/\//, '')}`} className="italic hover:underline text-gray-600 border-none inline">{proj.url}</a></span>}
                    </h4>
                    <span className="text-[14px] text-gray-600 font-medium whitespace-nowrap ml-4">
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  <div className={`text-[13px] text-gray-700 mt-1 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Skills & Certifications side-by-side or stacked cleanly */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {skills.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
                Skills & Technical Expertise
              </h3>
              <ul className="list-disc list-inside text-[14px] text-gray-800 space-y-1">
                {skills.map(skill => (
                  <li key={skill.id}>
                    <span className="font-semibold">{skill.name}</span>
                    {skill.level && <span className="italic text-gray-500 text-[13px] ml-1">({skill.level})</span>}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {settings.showCertifications !== false && certifications.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
                Certifications & Awards
              </h3>
              <div className="space-y-2">
                {certifications.map(cert => (
                  <div key={cert.id} className="text-[14px]">
                    <span className="font-bold">{cert.name}</span>, <span className="italic">{cert.issuer}</span>
                    <span className="text-gray-500 float-right">{cert.date}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Optional small sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {settings.showLanguages !== false && languages.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
                Languages
              </h3>
              <div className="text-[14px] flex flex-wrap gap-x-6 gap-y-2">
                {languages.map(lang => (
                  <div key={lang.id}>
                    <span className="font-bold">{lang.name}</span>
                    <span className="italic text-gray-600 block text-[13px]">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {settings.showInterests !== false && interests.length > 0 && (
            <section>
              <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
                Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <span key={interest.id} className="text-[13px] border px-2 py-0.5 rounded-sm bg-gray-50 text-gray-700">
                    {interest.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>

        {settings.showReferences !== false && references.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-3 pb-1 border-b" style={{ fontFamily: headingFont, color, borderColor: 'rgba(0,0,0,0.1)' }}>
              References
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {references.map(ref => (
                <div key={ref.id} className="text-[14px]">
                  <div className="font-bold">{ref.name}</div>
                  <div className="italic text-gray-700">{ref.position}, {ref.company}</div>
                  <div className="text-sm mt-1">
                    {ref.email && <div className="text-gray-600">{ref.email}</div>}
                    {ref.phone && <div className="text-gray-600">{ref.phone}</div>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

      </div>
    </div>
  );
}
