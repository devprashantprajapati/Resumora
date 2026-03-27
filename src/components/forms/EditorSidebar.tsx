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
import { motion, AnimatePresence } from 'framer-motion';

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
      <div className="w-full md:w-24 lg:w-72 border-t md:border-t-0 md:border-r border-zinc-200/60 bg-white/80 backdrop-blur-2xl flex flex-row md:flex-col overflow-x-auto md:overflow-y-auto shrink-0 scrollbar-hide z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-row md:flex-col md:flex-1 p-2 md:p-6 gap-1 md:gap-3 min-w-max md:min-w-0 items-center md:items-stretch">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 px-3 md:px-5 py-2 md:py-4 rounded-xl md:rounded-[1.25rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group relative shrink-0",
                  isActive 
                    ? "text-zinc-900 md:bg-zinc-900 md:text-white shadow-md md:shadow-xl shadow-zinc-200/50" 
                    : "text-zinc-400 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-mobile"
                    className="absolute inset-0 bg-zinc-100 rounded-xl md:rounded-[1.25rem] md:hidden -z-10" 
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <Icon className={cn(
                  "w-4 h-4 md:w-5 md:h-5 shrink-0 transition-all duration-500", 
                  isActive ? "scale-110" : "group-hover:scale-110"
                )} />
                <span className={cn(
                  "text-[10px] md:text-[13px] font-bold transition-colors tracking-tight",
                  isActive ? "opacity-100" : "opacity-70 group-hover:opacity-100",
                  "md:block",
                  !isActive && "hidden md:block lg:block"
                )}>
                  {section.label}
                </span>
                {isActive && (
                  <motion.div 
                    layoutId="active-nav-indicator"
                    className="hidden lg:block absolute right-4 w-1.5 h-1.5 rounded-full bg-white/40"
                  />
                )}
              </button>
            );
          })}
          
          {/* Mobile Clear Button */}
          <div className="w-px h-6 bg-zinc-200/60 md:hidden mx-0.5 shrink-0" />
          <Button 
            variant="ghost" 
            onClick={handleReset} 
            className="md:hidden text-red-500 hover:text-white hover:bg-red-500 justify-center px-3 rounded-xl h-10 transition-all duration-500 group shrink-0"
            title="Clear All Data"
          >
            <RotateCcw className="w-4 h-4 shrink-0 group-hover:rotate-[-120deg] transition-transform duration-500" />
          </Button>
          
          {/* Spacer for mobile scrolling right padding issue */}
          <div className="w-1 md:hidden shrink-0" />
        </div>

        {/* Desktop Clear Button */}
        <div className="hidden md:flex p-3 md:p-6 mt-auto border-t border-zinc-200/60 items-center justify-center lg:justify-start">
          <Button 
            variant="ghost" 
            onClick={handleReset} 
            className="w-full text-red-500 hover:text-white hover:bg-red-500 justify-center lg:justify-start px-4 rounded-2xl h-12 md:h-14 transition-all duration-500 group"
          >
            <RotateCcw className="w-4 h-4 md:w-5 md:h-5 shrink-0 lg:mr-3 group-hover:rotate-[-120deg] transition-transform duration-500" />
            <span className="hidden lg:block text-sm font-bold tracking-tight">Clear All Data</span>
          </Button>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 bg-transparent scroll-smooth">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <motion.div 
              key={activeSection + 'icon'}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="p-4 bg-zinc-900 text-white rounded-[2rem] shadow-2xl shadow-zinc-200 ring-4 ring-zinc-50"
            >
              {(() => {
                const ActiveIcon = SECTIONS.find(s => s.id === activeSection)?.icon || User;
                return <ActiveIcon className="w-7 h-7" />;
              })()}
            </motion.div>
            <div>
              <motion.h2 
                key={activeSection + 'title'}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="text-3xl md:text-4xl font-black text-zinc-900 tracking-tighter"
              >
                {SECTIONS.find(s => s.id === activeSection)?.label}
              </motion.h2>
              <motion.p 
                key={activeSection + 'desc'}
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-sm md:text-base font-medium text-zinc-500 mt-1.5"
              >
                Update your details to refine your professional profile.
              </motion.p>
            </div>
          </div>
          <div className="pb-24 md:pb-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeSection}
                initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
                transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
              >
                <ActiveComponent />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
