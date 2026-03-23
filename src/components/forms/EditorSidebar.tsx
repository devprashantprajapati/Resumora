import { useState } from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { SettingsForm } from './SettingsForm';
import { User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, Palette, RotateCcw } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';

const SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User, component: PersonalInfoForm },
  { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceForm },
  { id: 'education', label: 'Education', icon: GraduationCap, component: EducationForm },
  { id: 'skills', label: 'Skills', icon: Wrench, component: SkillsForm },
  { id: 'projects', label: 'Projects', icon: FolderGit2, component: ProjectsForm },
  { id: 'certifications', label: 'Certifications', icon: Award, component: CertificationsForm },
  { id: 'settings', label: 'Design & Settings', icon: Palette, component: SettingsForm },
];

export function EditorSidebar() {
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const { resetData } = useResumeStore();

  const ActiveComponent = SECTIONS.find(s => s.id === activeSection)?.component || PersonalInfoForm;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      resetData();
    }
  };

  return (
    <div className="flex flex-col-reverse md:flex-row h-full bg-transparent relative">
      {/* Navigation */}
      <div className="w-full md:w-24 lg:w-64 border-t md:border-t-0 md:border-r border-slate-200/60 bg-white/80 backdrop-blur-xl flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-hide z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] md:shadow-none">
        <div className="flex flex-row md:flex-col flex-1 p-2 md:p-4 gap-1 md:gap-2 min-w-max md:min-w-0">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-3 px-3 md:px-4 py-2 md:py-3 rounded-xl transition-all duration-300 group relative",
                  isActive 
                    ? "text-indigo-600 md:bg-indigo-50 md:text-indigo-700" 
                    : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
                )}
              >
                {isActive && (
                  <div className="absolute inset-0 bg-indigo-50 rounded-xl md:hidden -z-10" />
                )}
                <Icon className={cn(
                  "w-5 h-5 shrink-0 transition-all duration-300", 
                  isActive ? "text-indigo-600 scale-110" : "text-slate-400 group-hover:text-slate-600"
                )} />
                <span className={cn(
                  "text-[10px] md:text-sm font-medium transition-colors",
                  isActive ? "text-indigo-700" : "text-slate-500",
                  "md:block",
                  !isActive && "hidden md:block lg:block"
                )}>
                  {section.label}
                </span>
              </button>
            );
          })}
        </div>
        <div className="p-2 md:p-4 mt-auto border-l md:border-l-0 md:border-t border-slate-200/60 flex items-center justify-center lg:justify-start">
          <Button variant="ghost" onClick={handleReset} className="w-full text-red-500 hover:text-red-700 hover:bg-red-50 justify-center lg:justify-start px-3 rounded-xl h-10 md:h-11">
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 shrink-0 lg:mr-3" />
            <span className="hidden lg:block text-sm font-medium">Clear All Data</span>
          </Button>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-8 lg:p-10 bg-slate-50/30">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-white text-indigo-600 rounded-2xl shadow-sm border border-slate-200/60">
              {(() => {
                const ActiveIcon = SECTIONS.find(s => s.id === activeSection)?.icon || User;
                return <ActiveIcon className="w-6 h-6" />;
              })()}
            </div>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </h2>
              <p className="text-sm text-slate-500 mt-1">Fill in your details to update the resume.</p>
            </div>
          </div>
          <div className="pb-24 md:pb-10">
            <ActiveComponent />
          </div>
        </div>
      </div>
    </div>
  );
}
