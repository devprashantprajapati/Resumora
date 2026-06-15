import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { Button } from '../ui/Button';
import { RotateCcw, AlertTriangle, Cloud, LogOut, LogIn, Check, Sparkles, Wand2, Type, LayoutTemplate, Box, AlignLeft, Calendar, CheckCircle2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveResume } from '@/lib/resumeService';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

const containerVariants: any = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
};

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Sky', value: '#0ea5e9' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Crimson', value: '#dc2626' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#000000' },
  { name: 'Charcoal', value: '#334155' },
  { name: 'Navy', value: '#1e3a8a' },
  { name: 'Burgundy', value: '#7f1d1d' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
  { name: 'Lora', value: 'Lora, serif' },
  { name: 'Fira Code', value: '"Fira Code", monospace' },
  { name: 'Space Grotesk', value: '"Space Grotesk", sans-serif' },
];

function SettingCard({ title, icon: Icon, children, description }: { title: string, icon?: React.ElementType, children: React.ReactNode, description?: string }) {
  return (
    <div className="group p-6 sm:p-8 bg-white/80 backdrop-blur-xl rounded-[2rem] border border-zinc-200/80 shadow-sm hover:shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:border-zinc-300/80 transition-all duration-500 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-2">
          {Icon && (
            <div className="p-2.5 bg-zinc-100/80 text-zinc-600 group-hover:bg-indigo-50 group-hover:text-indigo-600 rounded-2xl transition-colors duration-500 shadow-sm">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <div>
            <h3 className="text-[1.1rem] font-bold text-zinc-900 tracking-tight">{title}</h3>
            {description && <p className="text-[13px] text-zinc-500 font-medium mt-0.5">{description}</p>}
          </div>
        </div>
        <div className="mt-8">
          {children}
        </div>
      </div>
    </div>
  );
}

function SegmentedControl({ options, value, onChange, style }: { options: readonly string[], value: string, onChange: (val: string) => void, style?: React.CSSProperties }) {
  return (
    <div className="flex bg-zinc-100/80 p-1.5 rounded-[1.1rem] border border-zinc-200/80 shadow-inner" style={style}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`relative flex-1 py-3 text-[13px] capitalize rounded-xl transition-all duration-300 ease-out font-bold tracking-wide ${
            value === opt
              ? 'bg-white shadow-[0_2px_12px_rgba(0,0,0,0.08)] text-indigo-700 ring-1 ring-zinc-200/50 scale-[1.02]'
              : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
          }`}
        >
          {opt}
        </button>
      ))}
    </div>
  );
}

function QuickToggle({ label, description, checked, onChange }: { label: string, description: string, checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <div className="flex sm:items-center justify-between flex-col sm:flex-row gap-4 p-5 bg-zinc-50/80 hover:bg-white border text-left border-zinc-200/80 rounded-[1.5rem] transition-all duration-300 hover:shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:border-zinc-300 cursor-pointer group" onClick={() => onChange(!checked)}>
      <div>
        <h4 className="font-bold text-[14px] text-zinc-900 group-hover:text-indigo-700 transition-colors tracking-tight">{label}</h4>
        <p className="text-[13px] text-zinc-500 mt-1 font-medium leading-relaxed">{description}</p>
      </div>
      <div
        className={`relative inline-flex h-7 w-12 flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none ${
          checked ? 'bg-indigo-600 shadow-inner' : 'bg-zinc-300'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-sm ring-0 transition duration-300 ease-in-out flex items-center justify-center ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        >
          {checked && <Check className="w-4 h-4 text-indigo-600 stroke-[3]" />}
        </span>
      </div>
    </div>
  );
}

export function SettingsForm() {
  const { data, updateSettings, resetData, updateData } = useResumeStore();
  const { settings } = data;
  const [isConfirmingReset, setIsConfirmingReset] = useState(false);
  const { user, openAuthModal, logout } = useAuth();
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    if (!user) {
      toast.error('Please log in to save your resume');
      return;
    }
    
    setIsSaving(true);
    try {
      const resumeId = user.uid + '_default';
      const title = `${data.personalInfo.firstName || 'My'} Resume`;
      await saveResume(resumeId, title, data);
      toast.success('Resume saved to cloud!');
    } catch (error) {
      toast.error('Failed to save resume');
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    if (isConfirmingReset) {
      resetData();
      setIsConfirmingReset(false);
    } else {
      setIsConfirmingReset(true);
      // Auto-reset the confirmation state after 3 seconds
      setTimeout(() => setIsConfirmingReset(false), 3000);
    }
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="show" className="space-y-8 pb-10">
      
      {/* Cloud Sync Banner */}
      <motion.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 p-5 sm:p-6 bg-white border border-zinc-200 rounded-2xl shadow-sm">
        <div className="flex items-start sm:items-center gap-4">
          <div className="shrink-0 w-11 h-11 rounded-full bg-indigo-50/80 border border-indigo-100 flex items-center justify-center text-indigo-600 shadow-inner">
            <Cloud className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <h3 className="font-semibold text-zinc-900 text-[15px] flex items-center gap-1.5">
              Cloud Sync Workspace
              {user && <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
            </h3>
            <p className="text-zinc-500 text-sm mt-0.5 leading-snug">
              {user 
                ? user.email
                : 'Sign in to seamlessly save and access your resume'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2.5 w-full sm:w-auto mt-1 sm:mt-0">
          {user ? (
            <>
              <Button
                onClick={handleSave}
                disabled={isSaving}
                className="flex-1 sm:flex-initial bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-5 py-2.5 h-10 rounded-xl text-sm transition-all shadow-sm"
              >
                {isSaving ? 'Syncing...' : 'Sync to Cloud'}
              </Button>
              <button
                onClick={logout}
                className="shrink-0 flex items-center justify-center w-10 h-10 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 text-zinc-600 hover:text-zinc-900 transition-colors"
                title="Log out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </>
          ) : (
            <Button
              onClick={openAuthModal}
              className="flex-1 sm:flex-initial justify-center bg-zinc-900 text-white hover:bg-zinc-800 font-medium px-5 py-2.5 h-10 rounded-xl text-sm transition-all shadow-sm flex items-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Sign in to Sync
            </Button>
          )}
        </div>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingCard title="Color Identity" icon={Wand2} description="Select a dominant color to highlight key elements and section headers.">
          <div className="flex flex-wrap gap-4 pt-2">
            {COLORS.map((color) => (
              <button
                key={color.value}
                onClick={() => updateSettings({ color: color.value })}
                className={`relative w-12 h-12 rounded-full transition-all duration-300 shadow-sm flex items-center justify-center group ${
                  settings.color === color.value ? 'scale-110 ring-[3px] ring-offset-4 ring-offset-zinc-50 shadow-md' : 'hover:scale-110 hover:shadow-md ring-1 ring-black/5 hover:ring-black/20 ring-offset-0'
                }`}
                style={{ 
                  backgroundColor: color.value,
                  ...(settings.color === color.value ? { '--tw-ring-color': color.value } as any : {})
                }}
                title={color.name}
              >
                 {settings.color === color.value && (
                    <Check className="w-5 h-5 text-white drop-shadow-md animate-in zoom-in stroke-[3]" />
                 )}
                 {!settings.color && color.value === '#3b82f6' && (
                    <Check className="w-5 h-5 text-white drop-shadow-md animate-in zoom-in stroke-[3]" />
                 )}
              </button>
            ))}
          </div>
        </SettingCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <SettingCard title="Body Typography" icon={Type} description="The font used for descriptions and regular text.">
          <div className="flex flex-col gap-2">
            {FONTS.map((font) => (
              <button
                key={font.value}
                onClick={() => updateSettings({ font: font.value })}
                className={`flex items-center justify-between py-2.5 px-4 rounded-xl border-2 text-left transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden group ${
                  settings.font === font.value
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-2 ring-indigo-600/10'
                    : 'border-zinc-200/60 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 text-zinc-700 hover:shadow-sm'
                }`}
              >
                <span style={{ fontFamily: font.value }} className="text-[1.05rem] font-semibold block">{font.name}</span>
                {settings.font === font.value && (
                  <div className="text-indigo-600 bg-indigo-100 p-1 rounded-full animate-in zoom-in flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </SettingCard>

        <SettingCard title="Heading Typography" icon={Type} description="The font used for your name and section titles.">
          <div className="flex flex-col gap-2">
            {FONTS.map((font) => (
              <button
                key={font.value}
                onClick={() => updateSettings({ headingFont: font.value })}
                className={`flex items-center justify-between py-2.5 px-4 rounded-xl border-2 text-left transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] relative overflow-hidden group ${
                  (settings.headingFont || settings.font) === font.value
                    ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 shadow-sm ring-2 ring-indigo-600/10'
                    : 'border-zinc-200/60 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 text-zinc-700 hover:shadow-sm'
                }`}
              >
                <span style={{ fontFamily: font.value }} className="text-[1.15rem] font-bold block tracking-tight">{font.name}</span>
                {(settings.headingFont || settings.font) === font.value && (
                  <div className="text-indigo-600 bg-indigo-100 p-1 rounded-full animate-in zoom-in flex-shrink-0">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </SettingCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingCard title="Optimization & Localization" icon={Sparkles} description="Language and parsing optimizations.">
          <div className="space-y-6">
             <QuickToggle
               label="ATS Optimization Mode"
               description="Strips complex formatting and columns to ensure maximum compatibility with Applicant Tracking Systems."
               checked={settings.isAtsOptimized || false}
               onChange={(checked) => updateSettings({ isAtsOptimized: checked })}
             />
             
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Document Language (Localization)</h4>
                <SegmentedControl 
                  options={['en', 'es', 'fr', 'de']} 
                  value={settings.documentLanguage || 'en'} 
                  onChange={(val) => updateSettings({ documentLanguage: val as any })} 
                />
             </div>
          </div>
        </SettingCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingCard title="Sizing" icon={Box} description="Adjust font size and line height.">
          <div className="space-y-6">
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Font Size</h4>
                <SegmentedControl 
                  options={['small', 'medium', 'large']} 
                  value={settings.fontSize || 'medium'} 
                  onChange={(val) => updateSettings({ fontSize: val as any })} 
                />
             </div>
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Line Height</h4>
                <SegmentedControl 
                  options={['tight', 'normal', 'loose']} 
                  value={settings.lineHeight || 'normal'} 
                  onChange={(val) => updateSettings({ lineHeight: val as any })} 
                />
             </div>
          </div>
        </SettingCard>

        <SettingCard title="Layout Density" icon={AlignLeft} description="Control spacing, margins, and borders.">
          <div className="space-y-6">
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Spacing & Density</h4>
                <SegmentedControl 
                  options={['compact', 'normal', 'relaxed']} 
                  value={settings.spacing || 'normal'} 
                  onChange={(val) => updateSettings({ spacing: val as any })} 
                />
             </div>
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Page Margins</h4>
                <SegmentedControl 
                  options={['small', 'medium', 'large']} 
                  value={settings.margins || 'medium'} 
                  onChange={(val) => updateSettings({ margins: val as any })} 
                />
             </div>
          </div>
        </SettingCard>
      </motion.div>

      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <SettingCard title="Alignment & Shape" icon={LayoutTemplate} description="Refine borders and text alignment.">
          <div className="space-y-6">
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Element Corners</h4>
                <SegmentedControl 
                  options={['sharp', 'rounded', 'pill']} 
                  value={settings.borderRadius || 'rounded'} 
                  onChange={(val) => updateSettings({ borderRadius: val as any })} 
                />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Headers</h4>
                  <SegmentedControl 
                    options={['left', 'center', 'right']} 
                    value={settings.headerAlignment || 'left'} 
                    onChange={(val) => updateSettings({ headerAlignment: val as any })}
                    style={{ width: '140px' }}
                  />
                </div>
                <div>
                  <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Body Text</h4>
                  <SegmentedControl 
                    options={['left', 'justify']} 
                    value={settings.bodyAlignment || 'left'} 
                    onChange={(val) => updateSettings({ bodyAlignment: val as any })}
                    style={{ width: '140px' }}
                  />
                </div>
             </div>
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Photo Shape</h4>
                <SegmentedControl 
                  options={['circle', 'square', 'rounded']} 
                  value={settings.photoShape || 'circle'} 
                  onChange={(val) => updateSettings({ photoShape: val as any })} 
                />
             </div>
          </div>
        </SettingCard>

        <SettingCard title="Format & Meta" icon={Calendar} description="Date formatting and paper sizing.">
          <div className="space-y-6">
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Date Format</h4>
                <SegmentedControl 
                  options={['MM/YYYY', 'MMM YYYY', 'YYYY', 'Month YYYY']} 
                  value={settings.dateFormat || 'MMM YYYY'} 
                  onChange={(val) => updateSettings({ dateFormat: val as any })} 
                />
             </div>
             <div>
                <h4 className="font-semibold text-[14px] text-zinc-900 mb-3 block tracking-tight">Paper Size</h4>
                <SegmentedControl 
                  options={['a4', 'letter']} 
                  value={settings.paperSize || 'a4'} 
                  onChange={(val) => updateSettings({ paperSize: val as any })} 
                />
             </div>
          </div>
        </SettingCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingCard title="Section Visibility" icon={Check} description="Toggle optional sections on or off.">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { key: 'showPhoto', label: 'Profile Photo' },
              { key: 'showReferences', label: 'References' },
              { key: 'showInterests', label: 'Interests' },
              { key: 'showLanguages', label: 'Languages' },
              { key: 'showCertifications', label: 'Certifications' },
              { key: 'showProjects', label: 'Projects' },
            ].map(({ key, label }) => {
              const isVisible = settings[key as keyof typeof settings] !== false;
              return (
                <button
                  key={key}
                  onClick={() => updateSettings({ [key]: !isVisible })}
                  className={`px-4 py-6 rounded-[1.5rem] border-2 text-center transition-all duration-300 relative group overflow-hidden ${
                    isVisible
                      ? 'border-indigo-600 bg-indigo-50/50 shadow-md shadow-indigo-100/50 ring-4 ring-indigo-600/10 scale-[1.02]'
                      : 'border-zinc-200/80 bg-zinc-50/50 hover:bg-white hover:border-zinc-300 hover:shadow-md hover:-translate-y-0.5'
                  }`}
                >
                  {isVisible && (
                    <div className="absolute top-3 right-3 bg-indigo-100 text-indigo-600 p-1 rounded-full animate-in zoom-in">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}
                  <div className={`font-bold text-[15px] tracking-tight ${isVisible ? 'text-indigo-700' : 'text-zinc-700'}`}>{label}</div>
                  <div className={`text-[11px] font-bold mt-1.5 uppercase tracking-widest ${isVisible ? 'text-indigo-500' : 'text-zinc-400'}`}>{isVisible ? 'Visible' : 'Hidden'}</div>
                </button>
              );
            })}
          </div>
        </SettingCard>
      </motion.div>

      <motion.div variants={itemVariants}>
        <SettingCard title="Advanced Modules & Publishing" icon={Sparkles} description="Enhance your published resume with rich media links and customize the web player.">
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <QuickToggle
                 label="Publish QR Code"
                 description="Add a scannable QR code directly on your PDF resume linking to your live web version."
                 checked={settings.showQrCode || false}
                 onChange={(checked) => updateSettings({ showQrCode: checked })}
              />
              <QuickToggle
                 label="Resumora Watermark"
                 description='Display a small "Created with Resumora" watermark at the bottom of your resume.'
                 checked={settings.showWatermark !== false}
                 onChange={(checked) => updateSettings({ showWatermark: checked })}
              />
              <QuickToggle
                 label="Page Numbers"
                 description="Show page numbers at the bottom of multi-page resumes."
                 checked={settings.showPageNumbers || false}
                 onChange={(checked) => updateSettings({ showPageNumbers: checked })}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-5 bg-zinc-50/80 border border-zinc-200/80 rounded-[1.5rem] transition-colors hover:bg-zinc-50 space-y-4">
                <div>
                  <h4 className="font-semibold text-[15px] text-zinc-900">Video Pitch Embed URL</h4>
                  <p className="text-[13px] text-zinc-500 mt-1 leading-relaxed">Include a YouTube or Loom URL to feature a video introduction on your published resume.</p>
                </div>
                <input
                  type="url"
                  value={settings.videoPitchUrl || ''}
                  onChange={(e) => updateSettings({ videoPitchUrl: e.target.value })}
                  placeholder="https://youtu.be/..."
                  className="w-full rounded-xl border border-zinc-300/80 bg-white px-4 py-3 text-[14px] text-zinc-900 font-medium focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all shadow-sm placeholder:font-normal"
                />
              </div>
              
              <div className="p-6 bg-zinc-50/80 border border-zinc-200/80 rounded-[1.5rem] space-y-6">
                 <div>
                    <h4 className="font-semibold text-[15px] text-zinc-900 mb-4 block">Web Publish Theme</h4>
                    <SegmentedControl 
                      options={['light', 'dark', 'system']} 
                      value={settings.publishTheme || 'light'} 
                      onChange={(val) => updateSettings({ publishTheme: val as any })} 
                    />
                 </div>
                 <div>
                   <h4 className="font-semibold text-[15px] text-zinc-900 mb-4 block">Web Publish Animation</h4>
                   <SegmentedControl 
                     options={['fade', 'slide', 'none']} 
                     value={settings.publishAnimation || 'fade'} 
                     onChange={(val) => updateSettings({ publishAnimation: val as any })} 
                   />
                 </div>
              </div>
            </div>
          </div>
        </SettingCard>
      </motion.div>
      
      <motion.div variants={itemVariants} className="pt-6 pb-2 space-y-4">
        <div className="p-6 sm:p-8 relative overflow-hidden bg-white/80 border border-indigo-200/60 shadow-[0_8px_30px_rgb(99,102,241,0.04)] rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-[1.1rem] font-bold text-indigo-700 flex items-center gap-2 tracking-tight">
              <Wand2 className="w-5 h-5 flex-shrink-0" />
              Load Example Data
            </h3>
            <p className="text-[13px] font-medium text-indigo-900/60 mt-1 max-w-lg leading-relaxed">
              Populate the editor with a complete sample resume. This is great for testing different templates without typing.
            </p>
          </div>
          <Button 
            variant="outline"
            onClick={() => {
              import('@/types/resume').then(({ initialResumeData }) => {
                updateData(initialResumeData);
                toast.success('Example data loaded successfully!');
              });
            }} 
            className="relative z-10 w-full sm:w-auto transition-all py-3 flex items-center gap-2 px-6 font-bold tracking-wide rounded-xl duration-300 text-indigo-700 bg-white/80 backdrop-blur border-indigo-200 hover:bg-indigo-50 hover:border-indigo-300 shadow-sm"
          >
            <Sparkles className="w-4 h-4" />
            Load Example
          </Button>
        </div>

        <div className="p-6 sm:p-8 relative overflow-hidden bg-white/80 border border-red-200/60 shadow-[0_8px_30px_rgb(220,38,38,0.04)] rounded-[2rem] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="absolute inset-0 bg-gradient-to-br from-red-50/50 to-transparent pointer-events-none" />
          <div className="relative z-10">
            <h3 className="text-[1.1rem] font-bold text-red-600 flex items-center gap-2 tracking-tight">
              <AlertTriangle className="w-5 h-5 flex-shrink-0" />
              Reset Workspace
            </h3>
            <p className="text-[13px] font-medium text-red-900/60 mt-1 max-w-lg leading-relaxed">
              This will permanently delete all your local resume progress and reset the editor to a clean state. This action cannot be undone.
            </p>
          </div>
          <Button 
            variant={isConfirmingReset ? "danger" : "outline"}
            onClick={handleReset} 
            className={`relative z-10 w-full sm:w-auto transition-all py-3 flex items-center gap-2 px-6 font-bold tracking-wide rounded-xl duration-300 ${
              isConfirmingReset 
                ? "bg-red-600 hover:bg-red-700 text-white border-red-600 shadow-lg shadow-red-600/30 ring-4 ring-red-600/10 scale-[1.02]" 
                : "text-red-700 bg-white/80 backdrop-blur border-red-200 hover:bg-red-50 hover:border-red-300 shadow-sm"
            }`}
          >
            {isConfirmingReset ? (
              <>
                <AlertTriangle className="w-4 h-4" />
                Click again to confirm
              </>
            ) : (
              <>
                <RotateCcw className="w-4 h-4" />
                Clear Local Data
              </>
            )}
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

