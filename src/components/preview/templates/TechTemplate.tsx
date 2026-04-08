import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon, Terminal, Code2, Database, Cpu } from 'lucide-react';
import { ResumeData } from '@/types/resume';

export function TechTemplate({ data: propData }: { data?: ResumeData }) {
  const storeData = useResumeStore(state => state.data);
  const data = propData || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;
  const headingFont = settings.headingFont || settings.font;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { gap: 'gap-4', spaceY: 'space-y-4', mt: 'mt-6' };
      case 'relaxed': return { gap: 'gap-10', spaceY: 'space-y-10', mt: 'mt-12' };
      default: return { gap: 'gap-8', spaceY: 'space-y-8', mt: 'mt-8' };
    }
  };

  const spacing = getSpacing();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-white text-zinc-800 leading-relaxed border-l-8" style={{ fontFamily: settings.font, borderColor: color }}>
      <div className="p-8 pb-0">
        <header className="flex flex-col md:flex-row justify-between items-start gap-6 border-b-2 pb-8" style={{ borderColor: `${color}30` }}>
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-6 h-6" style={{ color }} />
              <h1 className="text-4xl font-black tracking-tight" style={{ fontFamily: headingFont }}>
                {personalInfo.firstName} {personalInfo.lastName}
              </h1>
            </div>
            <h2 className="text-xl font-mono text-zinc-500 mb-4">&gt; {personalInfo.title}</h2>
            
            {personalInfo.summary && (
              <p className={`text-sm text-zinc-600 font-mono leading-relaxed bg-zinc-50 p-4 rounded-md border border-zinc-200 ${bodyAlignClass}`}>
                {personalInfo.summary}
              </p>
            )}
          </div>

          <div className="flex flex-col gap-2 text-sm font-mono text-zinc-600 bg-zinc-50 p-4 rounded-md border border-zinc-200 min-w-[250px]">
            {personalInfo.email && (
              <span className="flex items-center gap-2"><Mail className="w-4 h-4" style={{ color }} /> {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2"><Phone className="w-4 h-4" style={{ color }} /> {personalInfo.phone}</span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2">
                <MapPin className="w-4 h-4" style={{ color }} /> {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}
              </span>
            )}
            {(personalInfo.links || []).map(link => (
              <span key={link.id} className="flex items-center gap-2">
                <LinkIcon className="w-4 h-4" style={{ color }} /> <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline">{link.label}</a>
              </span>
            ))}
          </div>
        </header>

        <div className={`grid grid-cols-1 md:grid-cols-3 ${spacing.gap} mt-8`}>
          <div className={`md:col-span-2 ${spacing.spaceY}`}>
            {experience.length > 0 && (
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 font-mono" style={{ color }}>
                  <Code2 className="w-5 h-5" /> Experience
                </h3>
                <div className={spacing.spaceY}>
                  {experience.map(exp => (
                    <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: `${color}50` }}>
                      <div className="flex justify-between items-baseline mb-1">
                        <h4 className="font-bold text-zinc-900 text-[16px]">{exp.position}</h4>
                        <span className="text-xs font-mono text-zinc-500 bg-zinc-100 px-2 py-1 rounded">
                          {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      <div className="text-sm font-bold mb-3" style={{ color }}>@{exp.company}</div>
                      <div className={`text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                        {exp.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {settings.showProjects !== false && projects.length > 0 && (
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 font-mono mt-8" style={{ color }}>
                  <Database className="w-5 h-5" /> Projects
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {projects.map(proj => (
                    <div key={proj.id} className="border border-zinc-200 rounded-md p-4 bg-zinc-50/50 hover:border-zinc-300 transition-colors">
                      <div className="flex justify-between items-baseline mb-2">
                        <h4 className="font-bold text-zinc-900 text-[15px]">{proj.name}</h4>
                        <span className="text-xs font-mono text-zinc-500">
                          {proj.startDate} – {proj.endDate}
                        </span>
                      </div>
                      {proj.url && <div className="text-xs font-mono mb-2" style={{ color }}>{proj.url}</div>}
                      <div className={`text-[13px] text-zinc-600 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                        {proj.description}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

          <div className={spacing.spaceY}>
            {skills.length > 0 && (
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 font-mono" style={{ color }}>
                  <Cpu className="w-5 h-5" /> Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {skills.map(skill => (
                    <span 
                      key={skill.id} 
                      className="px-2.5 py-1 text-xs font-mono font-medium bg-zinc-100 text-zinc-800 border border-zinc-200 rounded"
                    >
                      {skill.name}
                    </span>
                  ))}
                </div>
              </section>
            )}

            {education.length > 0 && (
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 font-mono mt-8" style={{ color }}>
                  Education
                </h3>
                <div className={spacing.spaceY}>
                  {education.map(edu => (
                    <div key={edu.id} className="bg-zinc-50 p-3 rounded border border-zinc-100">
                      <h4 className="font-bold text-zinc-900 text-[14px]">{edu.degree}</h4>
                      <div className="text-sm text-zinc-700 mt-1">{edu.field}</div>
                      <div className="text-xs font-mono text-zinc-500 mt-2">{edu.school}</div>
                      <div className="text-xs font-mono text-zinc-400 mt-1">
                        {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {settings.showCertifications !== false && certifications.length > 0 && (
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 font-mono mt-8" style={{ color }}>
                  Certs
                </h3>
                <div className={spacing.spaceY}>
                  {certifications.map(cert => (
                    <div key={cert.id} className="text-sm">
                      <h4 className="font-bold text-zinc-900">{cert.name}</h4>
                      <div className="text-zinc-600 text-xs mt-1">{cert.issuer}</div>
                      <div className="text-zinc-400 text-xs font-mono mt-1">{cert.date}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}
            
            {settings.showLanguages !== false && languages?.length > 0 && (
              <section>
                <h3 className="text-lg font-black uppercase tracking-widest mb-6 flex items-center gap-2 font-mono mt-8" style={{ color }}>
                  Languages
                </h3>
                <div className="space-y-2">
                  {languages.map(lang => (
                    <div key={lang.id} className="flex justify-between items-center text-sm">
                      <span className="font-medium text-zinc-800">{lang.name}</span>
                      <span className="text-xs font-mono text-zinc-500">{lang.proficiency}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}