import { useResumeStore } from '@/store/useResumeStore';
import { Mail, Phone, MapPin, Link as LinkIcon, Briefcase, GraduationCap, Award, Code, User, Globe, Heart, Star } from 'lucide-react';
import { ResumeData } from '@/types/resume';

const PremiumTemplate = ({ data: propData }: { data?: ResumeData }) => {
  const storeData = useResumeStore(state => state.data);
  const data = propData || storeData;
  const { personalInfo, experience, education, skills, projects, certifications, languages, interests, references, settings } = data;

  const color = settings.color;
  const headingFont = settings.headingFont || settings.font;

  const getSpacing = () => {
    switch (settings.spacing) {
      case 'compact': return { gap: 'gap-4', spaceY: 'space-y-4', mt: 'mt-4' };
      case 'relaxed': return { gap: 'gap-10', spaceY: 'space-y-8', mt: 'mt-8' };
      default: return { gap: 'gap-8', spaceY: 'space-y-6', mt: 'mt-6' };
    }
  };

  const getBorderRadius = (element: 'photo' | 'badge') => {
    switch (settings.borderRadius) {
      case 'sharp': return 'rounded-none';
      case 'pill': return 'rounded-full';
      default: return element === 'photo' ? 'rounded-2xl' : 'rounded-lg';
    }
  };

  const spacing = getSpacing();
  const bodyAlignClass = settings.bodyAlignment === 'justify' ? 'text-justify' : 'text-left';

  // Helper for rendering section headers
  const renderSectionHeader = (title: string, Icon: any) => (
    <div className="flex items-center gap-3 mb-4 border-b pb-2" style={{ borderColor: `${color}40` }}>
      <div className="p-2 rounded-lg text-white" style={{ backgroundColor: color }}>
        <Icon className="w-4 h-4" />
      </div>
      <h3 className="text-lg font-bold uppercase tracking-widest text-zinc-900" style={{ fontFamily: headingFont }}>
        {title}
      </h3>
    </div>
  );

  return (
    <div className="w-full h-full bg-[#fcfcfc] text-zinc-800 flex flex-col" style={{ fontFamily: settings.font }}>
      {/* Top Header */}
      <header className="relative overflow-hidden bg-zinc-900 text-white px-10 py-12 flex flex-col md:flex-row items-center md:items-start gap-8">
        {/* Decorative background element */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-96 h-96 opacity-10 blur-3xl translate-y-1/2 -translate-x-1/4 rounded-full" style={{ backgroundColor: color }} />

        {settings.showPhoto && personalInfo.photoUrl && (
          <div className="relative z-10 shrink-0">
            <div className={`w-36 h-36 p-1 bg-white/10 backdrop-blur-sm ${getBorderRadius('photo')}`}>
              <img src={personalInfo.photoUrl} alt="Profile" className={`w-full h-full object-cover ${getBorderRadius('photo')}`} />
            </div>
          </div>
        )}
        
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h1 className="text-5xl font-black tracking-tight uppercase mb-2 text-white" style={{ fontFamily: headingFont }}>
            {personalInfo.firstName} <span style={{ color }}>{personalInfo.lastName}</span>
          </h1>
          <h2 className="text-xl font-medium tracking-widest uppercase mb-6 text-zinc-300" style={{ fontFamily: headingFont }}>
            {personalInfo.title}
          </h2>
          
          <div className="flex flex-wrap justify-center md:justify-start gap-x-6 gap-y-3 text-sm text-zinc-300 font-medium">
            {personalInfo.email && (
              <span className="flex items-center gap-2 hover:text-white transition-colors"><Mail className="w-4 h-4" style={{ color }} /> {personalInfo.email}</span>
            )}
            {personalInfo.phone && (
              <span className="flex items-center gap-2 hover:text-white transition-colors"><Phone className="w-4 h-4" style={{ color }} /> {personalInfo.phone}</span>
            )}
            {(personalInfo.city || personalInfo.country) && (
              <span className="flex items-center gap-2 hover:text-white transition-colors">
                <MapPin className="w-4 h-4" style={{ color }} /> {personalInfo.city}{personalInfo.city && personalInfo.country ? ', ' : ''}{personalInfo.country}
              </span>
            )}
            {(personalInfo.links || []).map(link => (
              <span key={link.id} className="flex items-center gap-2 hover:text-white transition-colors">
                <LinkIcon className="w-4 h-4" style={{ color }} /> <a href={`https://${link.url.replace(/^https?:\/\//, '')}`}>{link.label}</a>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className={`flex-1 grid grid-cols-1 md:grid-cols-12 gap-8 p-10`}>
        
        {/* Left Column (Main Content) */}
        <div className={`md:col-span-8 ${spacing.spaceY}`}>
          
          {/* Summary */}
          {personalInfo.summary && (
            <section>
              {renderSectionHeader("Professional Summary", User)}
              <p className={`text-[15px] leading-relaxed text-zinc-600 ${bodyAlignClass}`}>{personalInfo.summary}</p>
            </section>
          )}

          {/* Experience */}
          {experience.length > 0 && (
            <section>
              {renderSectionHeader("Experience", Briefcase)}
              <div className={spacing.spaceY}>
                {experience.map(exp => (
                  <div key={exp.id} className="relative pl-6 before:absolute before:left-0 before:top-2 before:w-2 before:h-2 before:rounded-full before:bg-zinc-300 after:absolute after:left-[3px] after:top-4 after:bottom-[-16px] after:w-0.5 after:bg-zinc-200 last:after:hidden">
                    <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-2">
                      <div>
                        <h4 className="text-lg font-bold text-zinc-900">{exp.position}</h4>
                        <div className="text-base font-medium" style={{ color }}>{exp.company}</div>
                      </div>
                      <div className="text-sm font-semibold text-zinc-500 bg-zinc-100 px-3 py-1 rounded-full w-fit mt-2 sm:mt-0">
                        {settings.dateFormat === 'YYYY' ? exp.startDate.split(' ')[1] || exp.startDate : exp.startDate} - {exp.current ? 'Present' : (settings.dateFormat === 'YYYY' ? exp.endDate.split(' ')[1] || exp.endDate : exp.endDate)}
                      </div>
                    </div>
                    <p className={`text-sm text-zinc-600 leading-relaxed whitespace-pre-wrap ${bodyAlignClass}`}>{exp.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {projects.length > 0 && (
            <section>
              {renderSectionHeader("Projects", Code)}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {projects.map(project => (
                  <div key={project.id} className="bg-white p-5 rounded-xl border border-zinc-200 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-base font-bold text-zinc-900">{project.name}</h4>
                      {project.url && (
                        <a href={`https://${project.url.replace(/^https?:\/\//, '')}`} className="text-zinc-400 hover:text-zinc-900">
                          <LinkIcon className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                    <p className={`text-sm text-zinc-600 leading-relaxed mb-4 ${bodyAlignClass}`}>{project.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Right Column (Sidebar) */}
        <div className={`md:col-span-4 ${spacing.spaceY}`}>
          
          {/* Skills */}
          {skills.length > 0 && (
            <section>
              {renderSectionHeader("Skills", Star)}
              <div className="flex flex-wrap gap-2">
                {skills.map(skill => (
                  <div key={skill.id} className={`px-3 py-1.5 text-sm font-medium text-white shadow-sm ${getBorderRadius('badge')}`} style={{ backgroundColor: color }}>
                    {skill.name}
                    {skill.level && <span className="ml-2 opacity-70 text-xs">| {skill.level}</span>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education */}
          {education.length > 0 && (
            <section>
              {renderSectionHeader("Education", GraduationCap)}
              <div className="space-y-5">
                {education.map(edu => (
                  <div key={edu.id} className="bg-zinc-50 p-4 rounded-xl border border-zinc-100">
                    <h4 className="text-base font-bold text-zinc-900 leading-tight mb-1">{edu.degree}</h4>
                    <div className="text-sm font-medium mb-2" style={{ color }}>{edu.school}</div>
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="font-semibold">{settings.dateFormat === 'YYYY' ? edu.startDate.split(' ')[1] || edu.startDate : edu.startDate} - {settings.dateFormat === 'YYYY' ? edu.endDate.split(' ')[1] || edu.endDate : edu.endDate}</span>
                    </div>
                    {edu.description && <p className={`text-sm text-zinc-600 mt-3 ${bodyAlignClass}`}>{edu.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Certifications */}
          {certifications.length > 0 && (
            <section>
              {renderSectionHeader("Certifications", Award)}
              <div className="space-y-4">
                {certifications.map(cert => (
                  <div key={cert.id} className="flex gap-3">
                    <div className="w-1.5 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div>
                      <h4 className="text-sm font-bold text-zinc-900">{cert.name}</h4>
                      <div className="text-xs text-zinc-500 mt-1">{cert.issuer} • {cert.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Languages */}
          {languages.length > 0 && (
            <section>
              {renderSectionHeader("Languages", Globe)}
              <div className="space-y-3">
                {languages.map(lang => (
                  <div key={lang.id} className="flex items-center justify-between">
                    <span className="text-sm font-bold text-zinc-800">{lang.name}</span>
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-zinc-100 text-zinc-600">{lang.proficiency}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Interests */}
          {interests.length > 0 && (
            <section>
              {renderSectionHeader("Interests", Heart)}
              <div className="flex flex-wrap gap-2">
                {interests.map((interest) => (
                  <span key={interest.id} className="text-sm text-zinc-600 bg-white border border-zinc-200 px-3 py-1 rounded-full shadow-sm">
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
};

export { PremiumTemplate };
