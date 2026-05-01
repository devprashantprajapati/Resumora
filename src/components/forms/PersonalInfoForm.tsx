import { useResumeStore } from '@/store/useResumeStore';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Textarea } from '../ui/Textarea';
import { Button } from '../ui/Button';
import { generateSummaryStream } from '@/services/ai';
import React, { useState, useRef } from 'react';
import { Wand2, Plus, Trash2, Upload, X, ExternalLink, Loader2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

export function PersonalInfoForm() {
  const { data, updatePersonalInfo } = useResumeStore();
  const { personalInfo } = data;
  const [isGenerating, setIsGenerating] = useState(false);
  const [tone, setTone] = useState("Professional");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGenerateSummary = async () => {
    setIsGenerating(true);
    const experienceText = data.experience.map(e => `${e.position} at ${e.company}`).join(', ');
    const skillsText = data.skills.map(s => s.name).join(', ');
    
    try {
      updatePersonalInfo({ summary: '' });
      let fullText = '';
      const stream = generateSummaryStream(personalInfo.title, experienceText, skillsText, tone);
      for await (const chunk of stream) {
        fullText += chunk;
        updatePersonalInfo({ summary: fullText });
      }
    } catch (error: any) {
      console.error("Failed to generate summary:", error);
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', {
          description: 'Please wait a moment before trying again.',
        });
      } else {
        toast.error('Failed to generate summary', {
          description: 'An unexpected error occurred. Please try again.',
        });
      }
    } finally {
      setIsGenerating(false);
    }
  };

  const addLink = () => {
    updatePersonalInfo({
      links: [...(personalInfo.links || []), { id: uuidv4(), label: '', url: '' }]
    });
  };

  const updateLink = (id: string, field: 'label' | 'url', value: string) => {
    updatePersonalInfo({
      links: (personalInfo.links || []).map(link => 
        link.id === id ? { ...link, [field]: value } : link
      )
    });
  };

  const removeLink = (id: string) => {
    updatePersonalInfo({
      links: (personalInfo.links || []).filter(link => link.id !== id)
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updatePersonalInfo({ photoUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    updatePersonalInfo({ photoUrl: '' });
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-6 pb-6 border-b border-zinc-200/60">
        <div className="relative w-28 h-28 rounded-2xl bg-zinc-50 border-2 border-dashed border-zinc-300 flex items-center justify-center overflow-hidden shrink-0 group hover:border-zinc-400 hover:bg-zinc-50/50 transition-all shadow-sm">
          {personalInfo.photoUrl ? (
            <>
              <img src={personalInfo.photoUrl} alt="Profile" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-zinc-900/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
                <button onClick={removePhoto} className="text-white p-2 hover:bg-white/20 rounded-full transition-colors z-10 relative">
                  <X className="w-5 h-5" />
                </button>
              </div>
            </>
          ) : (
            <div className="text-zinc-400 flex flex-col items-center group-hover:text-zinc-500 transition-colors pointer-events-none">
              <Upload className="w-6 h-6 mb-2" />
              <span className="text-[11px] uppercase tracking-wider font-semibold">Upload</span>
            </div>
          )}
          {!personalInfo.photoUrl && (
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handlePhotoUpload} 
              accept="image/*" 
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              title="Upload profile photo"
            />
          )}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-zinc-900">Profile Photo</h3>
          <p className="text-sm text-zinc-500 mt-1.5 leading-relaxed">Upload a professional headshot. Recommended size: 400x400px. A clean background works best.</p>
        </div>
      </div>

      <div className="space-y-3 pb-6 border-b border-zinc-200/60">
        <div className="flex items-center justify-between">
          <Label htmlFor="summary">Professional Summary</Label>
          <div className="flex items-center bg-indigo-50/50 border border-indigo-200/60 rounded-[10px] p-0.5 shadow-sm">
            <div className="relative flex items-center">
              <select
                value={tone}
                onChange={(e) => setTone(e.target.value)}
                className="h-8 pl-3 pr-7 text-[11.5px] font-medium bg-transparent text-indigo-800 focus:outline-none cursor-pointer hover:bg-indigo-100/50 rounded-md transition-colors appearance-none relative z-10"
              >
                <option value="Professional">Professional</option>
                <option value="Confident">Confident</option>
                <option value="Creative">Creative</option>
                <option value="Enthusiastic">Enthusiastic</option>
              </select>
              <div className="absolute right-2 text-indigo-500 pointer-events-none z-0">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </div>
            </div>
            <div className="w-[1px] h-4 bg-indigo-200/60 mx-0.5" />
            <button 
              onClick={handleGenerateSummary}
              disabled={isGenerating}
              className="flex items-center h-8 px-3 ml-0.5 text-[11.5px] font-semibold text-indigo-700 hover:bg-indigo-100 hover:text-indigo-800 rounded-md transition-colors disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? <Loader2 className="w-3.5 h-3.5 mr-1.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 mr-1.5 text-indigo-500" />}
              Generate
            </button>
          </div>
        </div>
        <Textarea 
          id="summary" 
          value={personalInfo.summary} 
          onChange={(e) => updatePersonalInfo({ summary: e.target.value })} 
          placeholder="Briefly describe your professional background, key achievements, and career goals..."
          className="h-36 leading-relaxed"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label htmlFor="firstName">First Name</Label>
          <Input 
            id="firstName" 
            value={personalInfo.firstName} 
            onChange={(e) => updatePersonalInfo({ firstName: e.target.value })} 
            placeholder="John"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Last Name</Label>
          <Input 
            id="lastName" 
            value={personalInfo.lastName} 
            onChange={(e) => updatePersonalInfo({ lastName: e.target.value })} 
            placeholder="Doe"
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="title">Professional Title</Label>
          <Input 
            id="title" 
            value={personalInfo.title} 
            onChange={(e) => updatePersonalInfo({ title: e.target.value })} 
            placeholder="e.g. Senior Software Engineer"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email"
            value={personalInfo.email} 
            onChange={(e) => updatePersonalInfo({ email: e.target.value })} 
            placeholder="john@example.com"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone">Phone</Label>
          <Input 
            id="phone" 
            value={personalInfo.phone} 
            onChange={(e) => updatePersonalInfo({ phone: e.target.value })} 
            placeholder="+1 (234) 567-8900"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City</Label>
          <Input 
            id="city" 
            value={personalInfo.city} 
            onChange={(e) => updatePersonalInfo({ city: e.target.value })} 
            placeholder="San Francisco"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input 
            id="country" 
            value={personalInfo.country} 
            onChange={(e) => updatePersonalInfo({ country: e.target.value })} 
            placeholder="USA"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-zinc-200/60">
        <div>
          <Label>Social Links & Portfolio</Label>
          <p className="text-xs text-zinc-500 mt-1">Add links to your LinkedIn, GitHub, or personal website.</p>
        </div>
        
        <div className="space-y-3">
          {(personalInfo.links || []).map((link) => (
            <div key={link.id} className="flex items-center gap-2 bg-zinc-50/50 p-2 rounded-xl border border-zinc-200/60">
              <Input 
                placeholder="Label (e.g. LinkedIn)" 
                value={link.label}
                onChange={(e) => updateLink(link.id, 'label', e.target.value)}
                className="w-1/3 bg-white"
              />
              <div className="flex-1 relative flex items-center">
                <Input 
                  type="url"
                  placeholder="URL (e.g. linkedin.com/in/johndoe)" 
                  value={link.url}
                  onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                  className="w-full bg-white pr-10"
                />
                {link.url && (
                  <a 
                    href={link.url.startsWith('http') ? link.url : `https://${link.url}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="absolute right-2 p-1.5 text-zinc-400 hover:text-indigo-600 transition-colors rounded-md hover:bg-indigo-50"
                    title="Test Link"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeLink(link.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-11 w-11 rounded-lg shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>

        <Button variant="outline" className="w-full border-dashed border-2 border-zinc-300/80 bg-zinc-50/50 hover:border-indigo-300 hover:bg-indigo-50/50 text-zinc-600 hover:text-indigo-700 transition-all duration-300 rounded-xl h-12 shadow-sm hover:shadow-md font-semibold group" onClick={addLink}>
          <Plus className="w-5 h-5 mr-2 text-zinc-400 group-hover:text-indigo-500 transition-colors" />
          Add Link
        </Button>
      </div>
    </div>
  );
}
