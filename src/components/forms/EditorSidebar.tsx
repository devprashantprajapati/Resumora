import { useState, useRef, useEffect, useMemo } from 'react';
import { PersonalInfoForm } from './PersonalInfoForm';
import { ExperienceForm } from './ExperienceForm';
import { EducationForm } from './EducationForm';
import { SkillsForm } from './SkillsForm';
import { ProjectsForm } from './ProjectsForm';
import { CertificationsForm } from './CertificationsForm';
import { LanguagesForm } from './LanguagesForm';
import { InterestsForm } from './InterestsForm';
import { ReferencesForm } from './ReferencesForm';
import { SettingsForm } from './SettingsForm';
import { AIToolsForm } from './AIToolsForm';
import { LayoutForm } from './LayoutForm';
import { CustomSectionForm } from './CustomSectionForm';
import { User, Briefcase, GraduationCap, Wrench, FolderGit2, Award, Palette, RotateCcw, Languages, Heart, Users, Bot, LayoutTemplate, FilePlus2 } from 'lucide-react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '../ui/Button';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const STATIC_CONTENT_SECTIONS = [
  { id: 'personal', label: 'Personal Info', icon: User, component: PersonalInfoForm },
  { id: 'experience', label: 'Experience', icon: Briefcase, component: ExperienceForm },
  { id: 'education', label: 'Education', icon: GraduationCap, component: EducationForm },
  { id: 'skills', label: 'Skills', icon: Wrench, component: SkillsForm },
  { id: 'projects', label: 'Projects', icon: FolderGit2, component: ProjectsForm },
  { id: 'certifications', label: 'Certifications', icon: Award, component: CertificationsForm },
  { id: 'languages', label: 'Languages', icon: Languages, component: LanguagesForm },
  { id: 'interests', label: 'Interests', icon: Heart, component: InterestsForm },
  { id: 'references', label: 'References', icon: Users, component: ReferencesForm },
];

const SETTINGS_SECTION = { id: 'settings', label: 'Design & Settings', icon: Palette, component: SettingsForm };

export function EditorSidebar() {
  const { data } = useResumeStore();
  const [activeSection, setActiveSection] = useState(STATIC_CONTENT_SECTIONS[0].id);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const activeItemRef = useRef<HTMLButtonElement>(null);

  const CONTENT_SECTIONS = useMemo(() => {
    const customTabs = (data.customSections || []).map(cs => ({
      id: `custom_${cs.id}`,
      label: cs.name || 'Custom Section',
      icon: FilePlus2,
      component: () => <CustomSectionForm sectionId={cs.id} />
    }));
    return [
      ...STATIC_CONTENT_SECTIONS,
      ...customTabs,
      { id: 'layout', label: 'Layout & Sections', icon: LayoutTemplate, component: LayoutForm },
      { id: 'ai-tools', label: 'AI Career Tools', icon: Bot, component: AIToolsForm },
    ];
  }, [data.customSections]);

  const ALL_SECTIONS = [...CONTENT_SECTIONS, SETTINGS_SECTION];
  const ActiveComponent = ALL_SECTIONS.find(s => s.id === activeSection)?.component || PersonalInfoForm;

  useEffect(() => {
    if (activeItemRef.current && scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      const item = activeItemRef.current;
      
      const containerRect = container.getBoundingClientRect();
      const itemRect = item.getBoundingClientRect();

      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const scrollLeft = container.scrollLeft + itemRect.left - containerRect.left - containerRect.width / 2 + itemRect.width / 2;
        container.scrollTo({
          left: scrollLeft,
          behavior: 'smooth'
        });
      } else {
        const scrollTop = container.scrollTop + itemRect.top - containerRect.top - containerRect.height / 2 + itemRect.height / 2;
        container.scrollTo({
          top: scrollTop,
          behavior: 'smooth'
        });
      }
    }
  }, [activeSection]);

  return (
    <div className="flex flex-col-reverse md:flex-row h-full bg-transparent relative">
      {/* Navigation */}
      <div className="w-full md:w-24 lg:w-[30%] lg:min-w-[200px] lg:max-w-[280px] border-t md:border-t-0 md:border-r border-zinc-200/60 bg-white/80 backdrop-blur-2xl flex flex-row md:flex-col shrink-0 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.02)] md:shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        
        {/* Scrollable Content Sections */}
        <div 
          ref={scrollContainerRef}
          className="flex flex-row md:flex-col flex-1 p-2 md:p-6 gap-1 md:gap-3 min-w-0 md:min-h-0 items-center md:items-stretch overflow-x-auto md:overflow-y-auto scrollbar-hide"
        >
          <div className="flex flex-row md:flex-col gap-1 md:gap-3 min-w-max md:min-w-0 h-full">
            {CONTENT_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  ref={isActive ? activeItemRef : null}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    "flex flex-col md:flex-row items-center justify-center md:justify-start gap-1 md:gap-4 px-3 md:px-5 py-2 md:py-4 rounded-xl md:rounded-[1.25rem] transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group relative shrink-0 z-10",
                    isActive 
                      ? "text-indigo-600 md:text-white" 
                      : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-100"
                  )}
                >
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-bg"
                      className="absolute inset-0 bg-indigo-50 md:bg-white md:bg-gradient-to-br md:from-indigo-600 md:to-violet-700 rounded-xl md:rounded-[1.25rem] -z-10 shadow-sm md:shadow-lg md:shadow-indigo-900/20 border border-indigo-100 md:border-indigo-500/30" 
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                  {!isActive && (
                    <div className="absolute inset-0 bg-gradient-to-br from-zinc-100/0 to-zinc-100/0 group-hover:from-zinc-100/50 group-hover:to-zinc-200/30 rounded-[1.25rem] -z-10 transition-all duration-300 hidden md:block" />
                  )}
                  <Icon className={cn(
                    "w-4 h-4 md:w-5 md:h-5 shrink-0 transition-transform duration-300", 
                    isActive ? "scale-110" : "group-hover:scale-110"
                  )} />
                  <span className={cn(
                    "text-[10px] lg:text-[13px] font-bold transition-colors tracking-tight",
                    isActive ? "opacity-100 block md:hidden lg:block text-indigo-600 md:text-white md:drop-shadow-sm" : "opacity-70 group-hover:opacity-100 hidden lg:block"
                  )}>
                    {section.label}
                  </span>
                  {isActive && (
                    <motion.div 
                      layoutId="active-nav-indicator"
                      className="hidden lg:block absolute right-4 w-1.5 h-1.5 rounded-full bg-white/60"
                    />
                  )}
                </button>
              );
            })}
            {/* Spacer for mobile scrolling right padding issue */}
            <div className="w-2 md:hidden shrink-0" />
            <div className="h-2 hidden md:block lg:hidden shrink-0" />
          </div>
        </div>

        {/* Mobile Fixed Right Area (Design & Settings) */}
        <div className="flex md:hidden items-center p-2 border-l border-zinc-200/60 bg-white/95 shrink-0 z-30 shadow-[-8px_0_16px_rgba(0,0,0,0.03)]">
          <button
            onClick={() => setActiveSection(SETTINGS_SECTION.id)}
            className={cn(
              "flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-xl transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group relative z-10",
              activeSection === SETTINGS_SECTION.id 
                ? "text-indigo-600" 
                : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
            )}
          >
            {activeSection === SETTINGS_SECTION.id && (
              <motion.div 
                layoutId="active-nav-bg"
                className="absolute inset-0 bg-indigo-50 rounded-xl -z-10 shadow-sm border border-indigo-100" 
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Palette className={cn("w-5 h-5 shrink-0 transition-all duration-500", activeSection === SETTINGS_SECTION.id ? "scale-110 text-indigo-600" : "group-hover:scale-110")} />
            <span className={cn("text-[10px] font-bold transition-colors tracking-tight", activeSection === SETTINGS_SECTION.id ? "text-indigo-600" : "")}>
              Design
            </span>
          </button>
        </div>

        {/* Desktop Fixed Bottom Area */}
        <div className="hidden md:flex flex-col p-3 md:p-6 mt-auto border-t border-zinc-200/60 gap-3 bg-zinc-50/50">
          <button
            onClick={() => setActiveSection(SETTINGS_SECTION.id)}
            className={cn(
              "flex flex-col md:flex-row items-center justify-center lg:justify-start gap-1 lg:gap-4 px-3 lg:px-5 py-2 lg:py-4 rounded-xl lg:rounded-[1.25rem] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group relative shrink-0 z-10",
              activeSection === SETTINGS_SECTION.id 
                ? "text-white" 
                : "text-zinc-600 hover:text-zinc-900 hover:bg-white border border-transparent hover:border-zinc-200/60 shadow-sm hover:shadow-md"
            )}
          >
            {activeSection === SETTINGS_SECTION.id && (
              <motion.div 
                layoutId="active-nav-bg"
                className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-violet-700 rounded-xl lg:rounded-[1.25rem] -z-10 shadow-lg shadow-indigo-900/20 border border-indigo-500/30" 
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
              />
            )}
            <Palette className={cn("w-4 h-4 md:w-5 md:h-5 shrink-0 transition-all duration-500", activeSection === SETTINGS_SECTION.id ? "scale-110" : "group-hover:scale-110")} />
            <span className={cn("text-[10px] lg:text-[13px] font-bold transition-colors tracking-tight hidden lg:block", activeSection === SETTINGS_SECTION.id ? "opacity-100" : "opacity-70 group-hover:opacity-100")}>
              Design & Settings
            </span>
            {activeSection === SETTINGS_SECTION.id && (
              <motion.div 
                layoutId="active-nav-indicator"
                className="hidden lg:block absolute right-4 w-1.5 h-1.5 rounded-full bg-white/40"
              />
            )}
          </button>
        </div>
      </div>

      {/* Form Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-12 lg:p-16 bg-transparent lg:bg-white/50 scroll-smooth relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-5 pointer-events-none" />
        <div className="max-w-3xl mx-auto relative z-10">
          <div className="flex items-center gap-6 mb-12">
            <motion.div 
              key={activeSection + 'icon'}
              initial={{ scale: 0.8, opacity: 0, rotate: -10 }}
              animate={{ scale: 1, opacity: 1, rotate: 0 }}
              className="p-4 bg-gradient-to-br from-indigo-500 to-violet-600 text-white rounded-[2rem] shadow-2xl shadow-indigo-500/20 ring-4 ring-white"
            >
              {(() => {
                const ActiveIcon = ALL_SECTIONS.find(s => s.id === activeSection)?.icon || User;
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
                {ALL_SECTIONS.find(s => s.id === activeSection)?.label}
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
          <div className="pb-8 md:pb-10">
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
            
            {/* Navigation Buttons */}
            <div className="mt-12 pt-8 border-t border-zinc-200/60 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between pb-16 md:pb-0">
              {(() => {
                const currentIndex = ALL_SECTIONS.findIndex(s => s.id === activeSection);
                const prevSection = currentIndex > 0 ? ALL_SECTIONS[currentIndex - 1] : null;
                const nextSection = currentIndex < ALL_SECTIONS.length - 1 ? ALL_SECTIONS[currentIndex + 1] : null;
                
                return (
                  <>
                    <div className="flex-1">
                      {prevSection && (
                        <Button 
                          variant="outline" 
                          onClick={() => setActiveSection(prevSection.id)}
                          className="w-full sm:w-auto h-auto py-3 px-6 text-zinc-600 group"
                        >
                          <span className="mr-2 transform group-hover:-translate-x-1 transition-transform">&larr;</span>
                          <span className="truncate">Back<span className="hidden sm:inline"> to {prevSection.label}</span></span>
                        </Button>
                      )}
                    </div>
                    <div className="flex-1 flex justify-end">
                      {nextSection ? (
                        <Button 
                          onClick={() => setActiveSection(nextSection.id)}
                          className="w-full sm:w-auto h-auto py-3 px-6 bg-zinc-900 hover:bg-zinc-800 text-white shadow-md group"
                        >
                          <span className="truncate">Proceed<span className="hidden sm:inline"> to {nextSection.label}</span></span>
                          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Button>
                      ) : (
                        <Button 
                          onClick={() => {
                            // On mobile, we might want to toggle preview, but here we just show a success message
                            // or do nothing since it's the last step.
                            const previewBtn = document.querySelector('button:has(.lucide-eye)') as HTMLButtonElement;
                            if (previewBtn) previewBtn.click();
                          }}
                          className="w-full sm:w-auto h-auto py-3 px-6 bg-indigo-600 hover:bg-indigo-700 text-white shadow-md group border-none ring-0 focus-visible:ring-offset-2"
                        >
                          View Resume Preview 
                          <span className="ml-2 transform group-hover:translate-x-1 transition-transform">&rarr;</span>
                        </Button>
                      )}
                    </div>
                  </>
                );
              })()}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

