import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '../ui/Button';
import { Plus, Trash2, GripVertical, Settings2, LayoutTemplate } from 'lucide-react';
import { Reorder } from 'framer-motion';

const defaultSectionLabels: Record<string, string> = {
  experience: 'Experience',
  education: 'Education',
  skills: 'Skills',
  projects: 'Projects',
  certifications: 'Certifications',
  languages: 'Languages',
  interests: 'Interests',
  references: 'References',
  personalInfo: 'Personal Info'
};

export function LayoutForm() {
  const { data, updateSettings, addCustomSection, removeCustomSection } = useResumeStore();
  
  const sectionOrder = data.settings?.sectionOrder || ['experience', 'projects', 'skills', 'education', 'certifications', 'languages', 'interests', 'references'];
  const customSections = data.customSections || [];

  const handleReorder = (newOrder: string[]) => {
    updateSettings({ sectionOrder: newOrder });
  };

  const activeSections = sectionOrder.filter(s => {
    if (s.startsWith('custom_')) return true;
    const key = `show${s.charAt(0).toUpperCase() + s.slice(1)}`;
    return (data.settings as any)[key] !== false;
  });

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between bg-zinc-50 border border-zinc-200/60 p-5 rounded-2xl">
        <div className="space-y-1">
          <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
            <LayoutTemplate className="w-4 h-4 text-indigo-500" />
            Global Section Order
          </h3>
          <p className="text-xs text-zinc-500 leading-relaxed max-w-[280px]">
            Drag to reorder sections. Use the button below to add custom sections like "Volunteer Work" or "Publications".
          </p>
        </div>
      </div>

      <Reorder.Group 
        axis="y" 
        values={activeSections} 
        onReorder={handleReorder}
        className="space-y-3"
      >
        {activeSections.map((sectionId) => {
          const isCustom = sectionId.startsWith('custom_');
          const customId = isCustom ? sectionId.replace('custom_', '') : null;
          const customSection = isCustom ? customSections.find(s => s.id === customId) : null;
          
          const label = isCustom ? (customSection?.name || 'Custom Section') : defaultSectionLabels[sectionId];

          return (
            <Reorder.Item 
              key={sectionId} 
              value={sectionId} 
              className="flex items-center justify-between p-4 bg-white border border-zinc-200/80 rounded-xl shadow-sm cursor-grab active:cursor-grabbing group hover:border-indigo-200 transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="p-1 text-zinc-400 group-hover:text-indigo-500 transition-colors bg-zinc-50 rounded-md group-hover:bg-indigo-50">
                  <GripVertical className="w-4 h-4" />
                </div>
                <span className="font-medium text-zinc-700 text-sm">{label}</span>
              </div>
              
              {isCustom && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeCustomSection(customId!);
                  }}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              )}
            </Reorder.Item>
          );
        })}
      </Reorder.Group>

      <Button 
        variant="outline" 
        className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group"
        onClick={() => {
          addCustomSection({
            id: crypto.randomUUID(),
            name: 'New Section',
            items: []
          });
        }}
      >
        <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" /> 
        Add Custom Section
      </Button>
    </div>
  );
}
