import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon, Briefcase, GraduationCap, Code, Award, Languages, Heart, Users } from 'lucide-react';
import { ResumeData } from '@/types/resume';

export function StudioTemplate({ data: propData }: { data?: ResumeData }) {
  const storeData = useResumeStore(state => state.data);
  const data = propData || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;
  const headingFont = settings.headingFont || settings.font;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { gap: 'gap-6', spaceY: 'space-y-4', mt: 'mt-6', sectionMt: 'mt-6' };
      case 'relaxed': return { gap: 'gap-14', spaceY: 'space-y-8', mt: 'mt-12', sectionMt: 'mt-12' };
      default: return { gap: 'gap-10', spaceY: 'space-y-6', mt: 'mt-8', sectionMt: 'mt-8' };
    }
  };

  const getBorderRadius = (element: 'photo' | 'badge') => {
    switch (settings.borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return element === 'photo' ? 'rounded-full' : 'rounded-full';
      default: return element === 'photo' ? 'rounded-2xl' : 'rounded-md';
    }
  };

  const spacing = getSpacing();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  const formatPeriod = (start: string, end: string, current: boolean) => {
    if (!start && !end && !current) return '';
    return `${start || 'Present'} - ${current ? 'Present' : end || 'Present'}`;
  };

  return (
    <div className={`w-full h-full bg-white text-zinc-900 ${bodyAlignClass}`} style={{ fontFamily: settings.font }}>
      
      {/* Header Profile Info */}
      <header className="mb-8">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <h1 className="text-5xl font-black tracking-[-0.03em] uppercase leading-none" style={{ color: '#18181b', fontFamily: headingFont }}>
              {personalInfo.firstName} <span style={{ color }}>{personalInfo.lastName}</span>
            </h1>
            <h2 className="text-xl font-bold tracking-tight text-zinc-500 mt-3 uppercase" style={{ fontFamily: headingFont }}>
              {personalInfo.title}
            </h2>
          </div>
          {settings.showPhoto && personalInfo.photoUrl && (
            <div className="ml-6">
              <img 
                src={personalInfo.photoUrl} 
                alt="Profile" 
                className={`w-24 h-24 object-cover object-center grayscale hover:grayscale-0 transition-all duration-500 ring-2 ring-offset-2`} 
                style={{ '--tw-ring-color': color } as React.CSSProperties}
              />
            </div>
          )}
        </div>

        {/* Contact Strip */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-6 pt-5 border-t-2 border-zinc-100 text-[13px] font-medium text-zinc-600">
          {personalInfo.email && (
            <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" style={{ color }} /> {personalInfo.email}</span>
          )}
          {personalInfo.phone && (
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" style={{ color }} /> {personalInfo.phone}</span>
          )}
          {(personalInfo.city || personalInfo.country) && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" style={{ color }} /> 
              {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}
            </span>
          )}
          {(personalInfo.links || []).map(link => (
            <span key={link.id} className="flex items-center gap-1.5">
              <LinkIcon className="w-3.5 h-3.5" style={{ color }} /> 
              <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:text-zinc-900 transition-colors">{link.label}</a>
            </span>
          ))}
        </div>
      </header>

      <div className={`grid grid-cols-12 ${spacing.gap}`}>
        
        {/* Left Column - Takes 4/12 */}
        <div className={`col-span-4 space-y-8 pr-6 border-r-2 border-zinc-100`}>
          
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-3" style={{ fontFamily: headingFont }}>Profile</h3>
              <p className="text-[13px] leading-relaxed text-zinc-600 font-medium">{personalInfo.summary}</p>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4" style={{ fontFamily: headingFont }}>Education</h3>
              <div className="space-y-4">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="text-[14px] font-bold text-zinc-900 leading-tight" style={{ color }}>{edu.degree} {edu.field ? `in ${edu.field}` : ''}</h4>
                    <div className="text-[13px] font-medium text-zinc-700 mt-1">{edu.school}</div>
                    <div className="text-xs font-semibold text-zinc-400 mt-1 uppercase tracking-wider">{formatPeriod(edu.startDate, edu.endDate, edu.current)}</div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4" style={{ fontFamily: headingFont }}>Capabilities</h3>
              <div className="flex flex-col gap-2">
                {skills.map((skill) => (
                  <div key={skill.id} className="flex items-center justify-between">
                    <span className="text-[13px] font-bold text-zinc-700">{skill.name}</span>
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }}></span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {settings.showLanguages !== false && languages.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-4" style={{ fontFamily: headingFont }}>Languages</h3>
              <div className="space-y-2">
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between items-end">
                    <span className="text-[13px] font-bold text-zinc-800">{lang.name}</span>
                    <span className="text-xs font-medium text-zinc-500">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column - Takes 8/12 */}
        <div className={`col-span-8 ${spacing.spaceY}`}>
          
          {/* Experience */}
          {experience.length > 0 && (
            <section>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-5 border-b-2 border-zinc-100 pb-2" style={{ fontFamily: headingFont }}>Experience</h3>
              <div className={spacing.spaceY}>
                {experience.map(exp => (
                  <div key={exp.id} className="relative">
                    <header className="mb-2">
                      <div className="flex items-baseline justify-between mb-1">
                        <h4 className="text-[16px] font-bold text-zinc-900" style={{ fontFamily: headingFont }}>{exp.position}</h4>
                        <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">{formatPeriod(exp.startDate, exp.endDate, exp.current)}</span>
                      </div>
                      <div className="text-[14px] font-bold uppercase tracking-wider" style={{ color }}>{exp.company}</div>
                    </header>
                    {exp.description && (
                      <div className="text-[13px] text-zinc-600 leading-relaxed font-medium whitespace-pre-wrap mt-2">
                        {exp.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {settings.showProjects !== false && projects.length > 0 && (
            <section className={spacing.sectionMt}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-5 border-b-2 border-zinc-100 pb-2" style={{ fontFamily: headingFont }}>Selected Projects</h3>
              <div className="grid grid-cols-1 gap-5">
                {projects.map(project => (
                  <div key={project.id}>
                    <div className="flex items-baseline justify-between mb-1">
                      <h4 className="text-[15px] font-bold text-zinc-900">{project.name}</h4>
                      {project.url && (
                        <a href={`https://${project.url.replace(/^https?:\/\//, '')}`} className="text-xs font-bold hover:underline" style={{ color }}>
                          View Project ↗
                        </a>
                      )}
                    </div>
                    {project.description && (
                      <p className="text-[13px] text-zinc-600 leading-relaxed font-medium mt-1">{project.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {settings.showCertifications !== false && certifications.length > 0 && (
            <section className={spacing.sectionMt}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-5 border-b-2 border-zinc-100 pb-2" style={{ fontFamily: headingFont }}>Certifications</h3>
              <div className="grid grid-cols-2 gap-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="bg-zinc-50 p-4 border border-zinc-100">
                    <h4 className="text-[13px] font-bold text-zinc-900 leading-snug">{cert.name}</h4>
                    <div className="text-xs font-semibold text-zinc-500 mt-1 uppercase" style={{ color }}>{cert.issuer}</div>
                    {cert.date && <div className="text-xs tracking-wider text-zinc-400 mt-2">{cert.date}</div>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {settings.showInterests !== false && interests.length > 0 && (
            <section className={spacing.sectionMt}>
              <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-400 mb-5 border-b-2 border-zinc-100 pb-2" style={{ fontFamily: headingFont }}>Interests</h3>
              <div className="flex flex-wrap gap-2">
                {interests.map(interest => (
                  <span key={interest.id} className="text-xs font-bold uppercase tracking-widest text-zinc-700 px-3 py-1.5 border-2 border-zinc-100" style={{ color: color, borderColor: `${color}20`, backgroundColor: `${color}05` }}>
                    {interest.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
