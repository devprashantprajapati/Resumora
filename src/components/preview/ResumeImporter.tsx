import React, { useState, useRef } from 'react';
import { Upload, Loader2, FileText } from 'lucide-react';
import { Button } from '../ui/Button';
import { extractTextFromPDF } from '@/lib/pdfParser';
import { structureResumeData } from '@/services/ai';
import { useResumeStore } from '@/store/useResumeStore';
import { toast } from 'sonner';

export function ResumeImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateData } = useResumeStore();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      const text = await extractTextFromPDF(file);
      const structuredData = await structureResumeData(text);
      updateData(structuredData);
      toast.success('Resume imported successfully!');
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Failed to import resume. Please try again.');
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".pdf"
        className="hidden"
      />
      <Button
        onClick={() => fileInputRef.current?.click()}
        disabled={isImporting}
        className="bg-zinc-900 hover:bg-zinc-800 text-white rounded-full h-8 md:h-11 px-3 md:px-5 transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        {isImporting ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : (
          <Upload className="w-4 h-4" />
        )}
        <span className="hidden md:inline text-xs md:text-sm font-bold">Import PDF</span>
      </Button>
    </>
  );
}
