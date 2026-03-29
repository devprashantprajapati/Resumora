import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '../ui/Label';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { RotateCcw } from 'lucide-react';

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
  { name: 'Amber', value: '#f59e0b' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Fuchsia', value: '#d946ef' },
  { name: 'Slate', value: '#475569' },
  { name: 'Black', value: '#000000' },
];

const FONTS = [
  { name: 'Inter', value: 'Inter, sans-serif' },
  { name: 'Roboto', value: 'Roboto, sans-serif' },
  { name: 'Open Sans', value: '"Open Sans", sans-serif' },
  { name: 'Merriweather', value: 'Merriweather, serif' },
  { name: 'Playfair Display', value: '"Playfair Display", serif' },
];

export function SettingsForm() {
  const { data, updateSettings, resetData } = useResumeStore();
  const { settings } = data;

  const handleReset = () => {
    if (window.confirm('Are you sure you want to clear all data? This cannot be undone.')) {
      resetData();
    }
  };

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Template</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['modern', 'minimal', 'corporate', 'creative'] as const).map((template) => (
            <button
              key={template}
              onClick={() => updateSettings({ template })}
              className={`p-4 rounded-2xl border-2 text-center capitalize transition-all duration-200 ${
                settings.template === template
                  ? 'border-zinc-600 bg-zinc-50/80 text-zinc-700 font-semibold shadow-sm shadow-zinc-100'
                  : 'border-zinc-200 bg-white/50 hover:bg-white hover:border-zinc-300 text-zinc-600'
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
                settings.color === color.value ? 'border-zinc-900 scale-110 ring-4 ring-zinc-900/10' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Typography (Font)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => updateSettings({ font: font.value })}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                settings.font === font.value
                  ? 'border-zinc-600 bg-zinc-50/80 text-zinc-700 shadow-sm shadow-zinc-100'
                  : 'border-zinc-200 bg-white/50 hover:bg-white hover:border-zinc-300 text-zinc-700'
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
        <Label className="text-base font-semibold text-zinc-900">Font Size</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.fontSize === size
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Spacing & Density</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
          {(['compact', 'normal', 'relaxed'] as const).map((spacing) => (
            <button
              key={spacing}
              onClick={() => updateSettings({ spacing })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.spacing === spacing
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {spacing}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Element Styling (Borders)</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
          {(['sharp', 'rounded', 'pill'] as const).map((radius) => (
            <button
              key={radius}
              onClick={() => updateSettings({ borderRadius: radius })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.borderRadius === radius
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {radius}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Header Alignment</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
          {(['left', 'center', 'right'] as const).map((alignment) => (
            <button
              key={alignment}
              onClick={() => updateSettings({ headerAlignment: alignment })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.headerAlignment === alignment
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {alignment}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-zinc-900">Body Text Alignment</Label>
        <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
          {(['left', 'justify'] as const).map((alignment) => (
            <button
              key={alignment}
              onClick={() => updateSettings({ bodyAlignment: alignment })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.bodyAlignment === alignment
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              {alignment}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Paper Size</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
            {(['a4', 'letter'] as const).map((size) => (
              <button
                key={size}
                onClick={() => updateSettings({ paperSize: size })}
                className={`flex-1 py-2.5 text-sm uppercase rounded-lg transition-all duration-200 ${
                  settings.paperSize === size
                    ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <Label className="text-base font-semibold text-zinc-900">Profile Photo</Label>
          <div className="flex bg-zinc-100/80 p-1.5 rounded-xl border border-zinc-200/60">
            <button
              onClick={() => updateSettings({ showPhoto: true })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.showPhoto
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Show
            </button>
            <button
              onClick={() => updateSettings({ showPhoto: false })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                !settings.showPhoto
                  ? 'bg-white shadow-sm text-zinc-700 font-semibold ring-1 ring-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-900 hover:bg-zinc-200/50'
              }`}
            >
              Hide
            </button>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-200/60">
          <div className="space-y-4">
            <Label className="text-base font-semibold text-red-600">Danger Zone</Label>
            <p className="text-sm text-zinc-500">
              This action will permanently delete all your resume data. This cannot be undone.
            </p>
            <Button 
              variant="outline" 
              onClick={handleReset} 
              className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All Data
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
