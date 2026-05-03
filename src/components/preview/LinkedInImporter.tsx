import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Linkedin, Loader2, Upload, FileText, Info, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { extractTextFromPDF } from '@/lib/pdfParser';
import { structureResumeData } from '@/services/ai';
import { useResumeStore } from '@/store/useResumeStore';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

export function LinkedInImporter() {
  const [isImporting, setIsImporting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { updateData } = useResumeStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const processFile = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please upload a valid PDF file.');
      return;
    }

    setIsImporting(true);
    try {
      let text = '';
      try {
        text = await extractTextFromPDF(file);
      } catch (err) {
        console.warn('PDF.js text extraction failed:', err);
      }
      
      let base64 = '';
      try {
        const buffer = await file.arrayBuffer();
        base64 = btoa(
          new Uint8Array(buffer).reduce((data, byte) => data + String.fromCharCode(byte), '')
        );
      } catch (err) {
        console.warn('Failed to convert to base64:', err);
      }

      if (!text && !base64) {
        throw new Error("Could not extract any text from the PDF. The file might be scanned or image-based.");
      }
      console.log("Extracted PDF Text Length:", text.length, "Base64 Length:", base64.length);
      
      const structuredData = await structureResumeData(text, base64);
      console.log("Structured Data Keys:", Object.keys(structuredData));
      
      updateData(structuredData);
      toast.success(`LinkedIn profile imported successfully!`);
      setIsOpen(false);
    } catch (error: any) {
      console.error('Import error:', error);
      if (error?.message?.includes('429') || error?.message?.toLowerCase().includes('rate')) {
        toast.error('AI Rate Limit Exceeded', { description: 'Please wait a moment before trying again.' });
      } else {
        toast.error(`Failed to import LinkedIn profile: ${error?.message || 'Unknown error'}`);
      }
    } finally {
      setIsImporting(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (isImporting) return;
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      await processFile(file);
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 pointer-events-auto"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-2xl shadow-2xl z-50 overflow-hidden pointer-events-auto"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <Linkedin className="w-6 h-6 text-[#0A66C2]" />
                  <h2 className="text-xl font-bold text-zinc-900">Import from LinkedIn</h2>
                </div>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm flex gap-3 border border-blue-100">
                  <Info className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold mb-2">How to export your LinkedIn profile:</p>
                    <ol className="list-decimal list-inside space-y-1.5 text-blue-700">
                      <li>Go to your LinkedIn profile page.</li>
                      <li>Click the <strong>More</strong> button in your introduction section.</li>
                      <li>Select <strong>Save to PDF</strong> from the dropdown.</li>
                      <li>Upload the downloaded PDF below.</li>
                    </ol>
                  </div>
                </div>

                <div 
                  className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-colors group cursor-pointer
                    ${isDragging ? 'border-[#0A66C2] bg-blue-50' : 'border-zinc-300 bg-zinc-50 hover:bg-zinc-100'}
                  `}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isImporting && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />
                  {isImporting ? (
                    <div className="flex flex-col items-center gap-4 text-zinc-500">
                      <Loader2 className="w-8 h-8 animate-spin text-[#0A66C2]" />
                      <p className="text-sm font-medium">Extracting profile data...</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-zinc-500">
                      <div className="p-4 bg-white rounded-full shadow-sm group-hover:shadow-md transition-shadow">
                        <FileText className="w-8 h-8 text-[#0A66C2]" />
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-zinc-900 mb-1">Click to upload PDF</p>
                        <p className="text-xs text-zinc-500">or drag and drop</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        onPointerDown={(e) => e.stopPropagation()}
        className="bg-[#0A66C2] hover:bg-[#004182] text-white rounded-full h-8 md:h-9 px-3 md:px-4 transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <Linkedin className="w-4 h-4" />
        <span className="hidden md:inline text-xs font-bold whitespace-nowrap">Import LinkedIn</span>
      </Button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
