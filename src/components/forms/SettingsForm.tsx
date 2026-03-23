import { useResumeStore } from '@/store/useResumeStore';
import { Label } from '../ui/Label';
import { Card } from '../ui/Card';

const COLORS = [
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#a855f7' },
  { name: 'Rose', value: '#f43f5e' },
  { name: 'Emerald', value: '#10b981' },
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
];

export function SettingsForm() {
  const { data, updateSettings } = useResumeStore();
  const { settings } = data;

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">Template</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {(['modern', 'minimal', 'corporate', 'creative'] as const).map((template) => (
            <button
              key={template}
              onClick={() => updateSettings({ template })}
              className={`p-4 rounded-2xl border-2 text-center capitalize transition-all duration-200 ${
                settings.template === template
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 font-semibold shadow-sm shadow-indigo-100'
                  : 'border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300 text-slate-600'
              }`}
            >
              {template}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">Accent Color</Label>
        <div className="flex flex-wrap gap-4 p-4 bg-white/50 rounded-2xl border border-slate-200/60">
          {COLORS.map((color) => (
            <button
              key={color.value}
              onClick={() => updateSettings({ color: color.value })}
              className={`w-10 h-10 rounded-full border-2 transition-all duration-200 shadow-sm ${
                settings.color === color.value ? 'border-slate-900 scale-110 ring-4 ring-slate-900/10' : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: color.value }}
              title={color.name}
            />
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">Typography (Font)</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {FONTS.map((font) => (
            <button
              key={font.value}
              onClick={() => updateSettings({ font: font.value })}
              className={`p-4 rounded-xl border-2 text-left transition-all duration-200 ${
                settings.font === font.value
                  ? 'border-indigo-600 bg-indigo-50/80 text-indigo-700 shadow-sm shadow-indigo-100'
                  : 'border-slate-200 bg-white/50 hover:bg-white hover:border-indigo-300 text-slate-700'
              }`}
              style={{ fontFamily: font.value }}
            >
              <span className="text-lg">{font.name}</span>
              <span className="block text-xs text-slate-400 mt-1 font-sans">The quick brown fox jumps over the lazy dog</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <Label className="text-base font-semibold text-slate-900">Font Size</Label>
        <div className="flex bg-slate-100/80 p-1.5 rounded-xl border border-slate-200/60">
          {(['small', 'medium', 'large'] as const).map((size) => (
            <button
              key={size}
              onClick={() => updateSettings({ fontSize: size })}
              className={`flex-1 py-2.5 text-sm capitalize rounded-lg transition-all duration-200 ${
                settings.fontSize === size
                  ? 'bg-white shadow-sm text-indigo-700 font-semibold ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
