import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export function CreativeTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { mb: 'mb-4', spaceY: 'space-y-4', p: 'p-4' };
      case 'relaxed': return { mb: 'mb-10', spaceY: 'space-y-8', p: 'p-10' };
      default: return { mb: 'mb-8', spaceY: 'space-y-6', p: 'p-8' };
    }
  };

  const getBorderRadius = (element: 'photo' | 'badge' | 'card') => {
    switch (settings.borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: 
        if (element === 'photo') return 'rounded-2xl';
        if (element === 'card') return 'rounded-xl';
        return 'rounded-lg';
    }
  };

  const getAlignment = () => {
    switch (settings.headerAlignment) {
      case 'left': return 'items-start text-left';
      case 'right': return 'items-end text-right';
      default: return 'items-center text-center';
    }
  };

  const spacing = getSpacing();
  const alignment = getAlignment();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  return (
    <div className="w-full h-full bg-white text-zinc-900 leading-relaxed flex" style={{ fontFamily: settings.font }}>
      {/* Left Sidebar */}
      <div className={`w-1/3 p-6 text-white h-full min-h-[297mm]`} style={{ backgroundColor: color }}>
        <div className={`flex flex-col ${alignment} mb-8`}>
          {settings.showPhoto && personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="Profile" className={`w-28 h-28 object-cover border-4 border-white/20 mb-4 shadow-lg ${getBorderRadius('photo')}`} />
          )}
          <h1 className="text-2xl font-bold uppercase tracking-wider mb-1.5">
            {personalInfo.firstName} <br /> {personalInfo.lastName}
          </h1>
          <h2 className="text-xs font-medium tracking-widest uppercase text-white/80">{personalInfo.title}</h2>
        </div>

        <div className="space-y-6">
          {/* Contact Info */}
          <section>
            <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3 border-b border-white/20 pb-1.5">
              Contact
            </h3>
            <div className="space-y-2 text-xs text-white/90">
              {personalInfo.email && (
                <div className="flex items-center gap-3">
                  <Mail className="w-4 h-4 shrink-0 text-white/70" />
                  <span className="break-all">{personalInfo.email}</span>
                </div>
              )}
              {personalInfo.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 shrink-0 text-white/70" />
                  <span>{personalInfo.phone}</span>
                </div>
              )}
              {(personalInfo.city || personalInfo.country) && (
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 shrink-0 text-white/70" />
                  <span>{personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}</span>
                </div>
              )}
              {(personalInfo.links || []).map(link => (
                <div key={link.id} className="flex items-center gap-3">
                  <LinkIcon className="w-4 h-4 shrink-0 text-white/70" />
                  <a href={`https://${link.url.replace(/^https?:\/\//, '')}`} className="hover:underline hover:text-white transition-colors break-all">{link.label}</a>
                </div>
              ))}
            </div>
          </section>

          {/* Education */}
          {education.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3 border-b border-white/20 pb-1.5">
                Education
              </h3>
              <div className={spacing.spaceY}>
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-xs text-white">{edu.degree}</h4>
                    <div className="text-xs text-white/80 mt-0.5">{edu.field}</div>
                    <div className="text-xs text-white/70 mt-1">{edu.school}</div>
                    <div className="text-[11px] font-medium text-white/60 mt-1">
                      {edu.startDate} – {edu.current ? 'Present' : edu.endDate}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Skills */}
          {skills.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3 border-b border-white/20 pb-1.5">
                Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {skills.map(skill => (
                  <span key={skill.id} className={`px-2.5 py-1 text-[11px] font-medium bg-white/10 text-white border border-white/20 ${getBorderRadius('badge')}`}>
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages?.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3 border-b border-white/20 pb-1.5">
                Languages
              </h3>
              <div className="space-y-1.5">
                {languages.map(lang => (
                  <div key={lang.id} className="flex justify-between text-xs text-white/90">
                    <span className="font-bold">{lang.name}</span>
                    <span className="text-white/70">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests?.length > 0 && (
            <section>
              <h3 className="text-[11px] font-bold uppercase tracking-widest text-white/60 mb-3 border-b border-white/20 pb-1.5">
                Interests
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {interests.map(interest => (
                  <span key={interest.id} className={`px-2.5 py-1 text-[11px] font-medium bg-white/10 text-white border border-white/20 ${getBorderRadius('badge')}`}>
                    {interest.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className={`w-2/3 ${spacing.p} bg-zinc-50`}>
        {/* Summary */}
        {personalInfo.summary && (
          <section className={spacing.mb}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color }}>
              Profile
            </h3>
            <p className={`text-xs leading-relaxed text-zinc-700 ${bodyAlignClass}`}>
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className={spacing.mb}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color }}>
              Experience
            </h3>
            <div className={spacing.spaceY}>
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current" style={{ color }}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-zinc-900 text-sm">{exp.position}</h4>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase whitespace-nowrap ml-3">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-xs font-medium text-zinc-600 mb-2">{exp.company}</div>
                  <div className={`text-xs text-zinc-700 whitespace-pre-line leading-relaxed ${bodyAlignClass}`}>
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className={spacing.mb}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color }}>
              Projects
            </h3>
            <div className={spacing.spaceY}>
              {projects.map(proj => (
                <div key={proj.id} className="relative pl-5 before:absolute before:left-0 before:top-1.5 before:w-1.5 before:h-1.5 before:rounded-full before:bg-current" style={{ color }}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="font-bold text-zinc-900 text-sm">
                      {proj.name}
                    </h4>
                    <span className="text-[10px] font-bold text-zinc-500 tracking-wider uppercase whitespace-nowrap ml-3">
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  {proj.url && <div className="text-[11px] text-zinc-500 mb-1.5 italic">{proj.url}</div>}
                  <div className={`text-xs text-zinc-700 whitespace-pre-line leading-relaxed mt-1.5 ${bodyAlignClass}`}>
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className={spacing.mb}>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color }}>
              Certifications
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {certifications.map(cert => (
                <div key={cert.id} className={`bg-white p-3 shadow-sm border border-zinc-200/60 ${getBorderRadius('card')}`}>
                  <h4 className="font-bold text-zinc-900 text-xs mb-0.5">{cert.name}</h4>
                  <div className="text-[11px] text-zinc-600">{cert.issuer}</div>
                  <div className="text-[10px] font-medium text-zinc-500 mt-1.5 tracking-wider uppercase">{cert.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* References */}
        {references?.length > 0 && (
          <section>
            <h3 className="text-sm font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color }}>
              References
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {references.map(ref => (
                <div key={ref.id} className={`bg-white p-3 shadow-sm border border-zinc-200/60 ${getBorderRadius('card')}`}>
                  <h4 className="font-bold text-zinc-900 text-xs mb-0.5">{ref.name}</h4>
                  {ref.position && ref.company && (
                    <div className="text-[11px] text-zinc-600">{ref.position}, {ref.company}</div>
                  )}
                  {(ref.email || ref.phone) && (
                    <div className="text-[10px] font-medium text-zinc-500 mt-1.5">
                      {ref.email && <div>{ref.email}</div>}
                      {ref.phone && <div>{ref.phone}</div>}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
