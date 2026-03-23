import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon } from 'lucide-react';

export function CreativeTemplate() {
  const { data } = useResumeStore();
  const { personalInfo, experience, education, skills, projects, certifications, settings } = data;

  const color = settings.color;

  return (
    <div className="w-full h-full bg-white text-zinc-900 leading-relaxed flex" style={{ fontFamily: settings.font }}>
      {/* Left Sidebar */}
      <div className="w-1/3 p-8 text-white h-full min-h-[297mm]" style={{ backgroundColor: color }}>
        <div className="flex flex-col items-center text-center mb-10">
          {personalInfo.photoUrl && (
            <img src={personalInfo.photoUrl} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-white/20 mb-6 shadow-lg" />
          )}
          <h1 className="text-3xl font-bold uppercase tracking-wider mb-2">
            {personalInfo.firstName} <br /> {personalInfo.lastName}
          </h1>
          <h2 className="text-sm font-medium tracking-widest uppercase text-white/80">{personalInfo.title}</h2>
        </div>

        <div className="space-y-8">
          {/* Contact Info */}
          <section>
            <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 border-b border-white/20 pb-2">
              Contact
            </h3>
            <div className="space-y-3 text-sm text-white/90">
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
              {personalInfo.links.map(link => (
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
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 border-b border-white/20 pb-2">
                Education
              </h3>
              <div className="space-y-5">
                {education.map(edu => (
                  <div key={edu.id}>
                    <h4 className="font-bold text-sm text-white">{edu.degree}</h4>
                    <div className="text-sm text-white/80 mt-0.5">{edu.field}</div>
                    <div className="text-sm text-white/70 mt-1">{edu.school}</div>
                    <div className="text-xs font-medium text-white/60 mt-1.5">
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
              <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-4 border-b border-white/20 pb-2">
                Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <span key={skill.id} className="px-3 py-1.5 text-xs font-medium rounded-lg bg-white/10 text-white border border-white/20">
                    {skill.name}
                  </span>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Right Content Area */}
      <div className="w-2/3 p-10 bg-zinc-50">
        {/* Summary */}
        {personalInfo.summary && (
          <section className="mb-10">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-4 flex items-center gap-2" style={{ color }}>
              Profile
            </h3>
            <p className="text-[15px] leading-relaxed text-zinc-700 text-justify">
              {personalInfo.summary}
            </p>
          </section>
        )}

        {/* Experience */}
        {experience.length > 0 && (
          <section className="mb-10">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color }}>
              Experience
            </h3>
            <div className="space-y-8">
              {experience.map(exp => (
                <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-zinc-900 text-[16px]">{exp.position}</h4>
                    <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase whitespace-nowrap ml-4">
                      {exp.startDate} – {exp.current ? 'Present' : exp.endDate}
                    </span>
                  </div>
                  <div className="text-[15px] font-medium text-zinc-600 mb-3">{exp.company}</div>
                  <div className="text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed">
                    {exp.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Projects */}
        {projects.length > 0 && (
          <section className="mb-10">
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color }}>
              Projects
            </h3>
            <div className="space-y-8">
              {projects.map(proj => (
                <div key={proj.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-current" style={{ color }}>
                  <div className="flex justify-between items-baseline mb-1">
                    <h4 className="font-bold text-zinc-900 text-[16px]">
                      {proj.name}
                    </h4>
                    <span className="text-xs font-bold text-zinc-500 tracking-wider uppercase whitespace-nowrap ml-4">
                      {proj.startDate} – {proj.endDate}
                    </span>
                  </div>
                  {proj.url && <div className="text-[14px] text-zinc-500 mb-2 italic">{proj.url}</div>}
                  <div className="text-[14px] text-zinc-700 whitespace-pre-line leading-relaxed mt-2">
                    {proj.description}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Certifications */}
        {certifications.length > 0 && (
          <section>
            <h3 className="text-lg font-bold uppercase tracking-wider mb-6 flex items-center gap-2" style={{ color }}>
              Certifications
            </h3>
            <div className="grid grid-cols-2 gap-6">
              {certifications.map(cert => (
                <div key={cert.id} className="bg-white p-4 rounded-xl shadow-sm border border-zinc-200/60">
                  <h4 className="font-bold text-zinc-900 text-[14px] mb-1">{cert.name}</h4>
                  <div className="text-[13px] text-zinc-600">{cert.issuer}</div>
                  <div className="text-[12px] font-medium text-zinc-500 mt-2 tracking-wider uppercase">{cert.date}</div>
                </div>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
