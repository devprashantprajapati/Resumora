import { useState } from 'react';
import { useResumeStore } from '@/store/useResumeStore';
import { emptyResumeData } from '@/types/resume';
import { Label } from '../ui/Label';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RotateCcw, AlertTriangle, Cloud, LogOut, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { saveResume } from '@/lib/resumeService';
import { toast } from 'sonner';

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

export function SettingsForm() {
  const { data, updateSettings, resetData } = useResumeStore();
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
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Cloud Sync</Label>
        <div className="p-4 bg-zinc-50/80 rounded-2xl border border-zinc-200/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-sm text-zinc-600">
            {user ? (
              <>Signed in as <span className="font-semibold text-zinc-900">{user.email}</span></>
            ) : (
              'Sign in to save your resume to the cloud and access it from anywhere.'
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {user ? (
              <>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex-1 sm:flex-none flex items-center gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                >
                  <Cloud className="w-4 h-4" />
                  {isSaving ? 'Saving...' : 'Save to Cloud'}
                </Button>
                <Button
                  variant="outline"
                  onClick={logout}
                  className="px-3 text-zinc-600 hover:text-zinc-900"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <Button
                onClick={openAuthModal}
                variant="outline"
                className="w-full sm:w-auto flex items-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                Sign in to Save
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Template</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {(['modern', 'minimal', 'corporate', 'creative', 'elegant', 'tech', 'executive', 'premium', 'academic', 'studio'] as const).map((template) => (
            <button
              key={template}
              onClick={() => updateSettings({ template })}
              className={`p-4 rounded-[1rem] border-2 text-center capitalize transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                settings.template === template
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-md shadow-indigo-200/50 scale-[1.02] ring-1 ring-indigo-600/30 ring-offset-1'
                  : 'border-zinc-200/60 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-zinc-300 text-zinc-600 shadow-sm hover:shadow-md hover:scale-[1.01]'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Accent Color</Label>
        <div className="flex flex-wrap gap-4 p-4 bg-white/50 rounded-2xl border border-zinc-200/60">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSettings({ color: color.value })}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm ${
                settings.color === color.value ? 'border-indigo-600 scale-110 ring-4 ring-indigo-600/10' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Typography (Body Font)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => updateSettings({ font: font.value })}
              className={`p-4 rounded-[1rem] border-2 text-left transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                settings.font === font.value
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-md shadow-indigo-200/50 scale-[1.02] ring-1 ring-indigo-600/30 ring-offset-1'
                  : 'border-zinc-200/60 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-zinc-300 text-zinc-700 shadow-sm hover:shadow-md hover:scale-[1.01]'
              }`}
              style={{ fontFamily: font.value }}
            >
              <span className="text-lg">{font.name}</span>
              <span className="block text-xs text-zinc-400 mt-1 font-sans">The quick brown fox jumps over the lazy dog</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Typography (Heading Font)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => updateSettings({ headingFont: font.value })}
              className={`p-4 rounded-[1rem] border-2 text-left transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                (settings.headingFont || settings.font) === font.value
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-md shadow-indigo-200/50 scale-[1.02] ring-1 ring-indigo-600/30 ring-offset-1'
                  : 'border-zinc-200/60 bg-white/60 backdrop-blur-sm hover:bg-white hover:border-zinc-300 text-zinc-700 shadow-sm hover:shadow-md hover:scale-[1.01]'
              }`}
              style={{ fontFamily: font.value }}
            >
              <span className="text-lg font-bold">{font.name}</span>
              <span className="block text-xs text-zinc-400 mt-1 font-sans">Heading Style Preview</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Font Size</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['small', 'medium', 'large'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ fontSize: size })}
                className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                  settings.fontSize === size
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Line Height</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['tight', 'normal', 'loose'] as const).map((lh) => (
              <button
                key={lh}
                onClick={() => updateSettings({ lineHeight: lh })}
                className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                  (settings.lineHeight || 'normal') === lh
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {lh}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Spacing & Density</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
              <button
                key={spacing}
                onClick={() => updateSettings({ spacing })}
                className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                  settings.spacing === spacing
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {spacing}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Page Margins</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['small', 'medium', 'large'] as const).map((margin) => (
              <button
                key={margin}
                onClick={() => updateSettings({ margins: margin })}
                className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                  (settings.margins || 'medium') === margin
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {margin}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Element Styling (Borders)</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
          {(['sharp', 'rounded', 'pill'] as const).map((radius) => (
            <button
              key={radius}
              onClick={() => updateSettings({ borderRadius: radius })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                settings.borderRadius === radius
                  ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {radius}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Header Alignment</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['left', 'center', 'right'] as const).map((alignment) => (
              <button
                key={alignment}
                onClick={() => updateSettings({ headerAlignment: alignment })}
                className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                  settings.headerAlignment === alignment
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {alignment}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Body Text Alignment</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['left', 'justify'] as const).map((alignment) => (
              <button
                key={alignment}
                onClick={() => updateSettings({ bodyAlignment: alignment })}
                className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-300 ${
                  settings.bodyAlignment === alignment
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {alignment}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Date Format</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
          {(['MM/YYYY', 'MMM YYYY', 'YYYY', 'Month YYYY'] as const).map((format) => (
            <button
              key={format}
              onClick={() => updateSettings({ dateFormat: format })}
              className={`flex-1 py-2.5 text-sm rounded-lg transition-all duration-300 ${
                (settings.dateFormat || 'MMM YYYY') === format
                  ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                  : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {format === 'MM/YYYY' ? '08/2023' : format === 'MMM YYYY' ? 'Aug 2023' : format === 'YYYY' ? '2023' : 'August 2023'}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Section Visibility</Label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                className={`p-3 rounded-xl border-2 text-center transition-all duration-300 ${
                  isVisible
                    ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-sm'
                    : 'border-zinc-200/60 bg-white/60 text-zinc-400 hover:border-zinc-300'
                }`}
              >
                <div className="text-sm">{label}</div>
                <div className="text-xs mt-1 opacity-70">{isVisible ? 'Visible' : 'Hidden'}</div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Paper Size</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60 shadow-inner">
            {(['a4', 'letter'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ paperSize: size })}
                className={`flex-1 py-2.5 text-sm uppercase rounded-lg transition-all duration-300 ${
                  settings.paperSize === size
                    ? 'bg-white shadow-md text-indigo-700 font-bold ring-1 ring-indigo-200/50 scale-[1.02]'
                    : 'text-zinc-500 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      <div className="pt-8 mt-8 border-t border-zinc-200/60">
          <div className="space-y-4">
            <Label className="text-base font-semibold text-red-600">Danger Zone</Label>
            <p className="text-sm text-zinc-500">
              This action will permanently delete all your resume data. This cannot be undone.
            </p>
            <Button 
              variant={isConfirmingReset ? "danger" : "outline"}
              onClick={handleReset} 
              className={`w-full sm:w-auto transition-all duration-200 ${
                isConfirmingReset 
                  ? "bg-red-600 hover:bg-red-700 text-white border-red-600" 
                  : "text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
              }`}
            >
              {isConfirmingReset ? (
                <>
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  Click again to confirm
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Clear All Data
                </>
              )}
            </Button>
          </div>
        </div>
    </div>
  );
}
