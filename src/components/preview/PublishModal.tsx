import React, { useState } from 'react';
import { Globe, Loader2, Copy, Check, BarChart3, ExternalLink, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { useResumeStore } from '@/store/useResumeStore';
import { publishResume } from '@/lib/resumeService';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';

export function PublishModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const { data, updateSettings } = useResumeStore();
  const [slug, setSlug] = useState(data.settings.publishedSlug || '');
  const [publishedUrl, setPublishedUrl] = useState(data.settings.publishedSlug ? `${window.location.origin}/p/${data.settings.publishedSlug}` : '');
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();

  const handlePublish = async () => {
    if (!user) {
      toast.error('Please sign in to publish your resume.');
      return;
    }
    if (!slug.trim()) {
      toast.error('Please enter a URL slug.');
      return;
    }
    
    // Basic slug validation
    const validSlug = slug.toLowerCase().replace(/[^a-z0-9-]/g, '-');
    if (validSlug !== slug) {
      setSlug(validSlug);
      toast.error('Slug updated to be URL-friendly. Please confirm and publish again.');
      return;
    }

    setIsPublishing(true);
    try {
      await publishResume(validSlug, data);
      updateSettings({ publishedSlug: validSlug });
      const url = `${window.location.origin}/p/${validSlug}`;
      setPublishedUrl(url);
      toast.success('Resume published successfully! Changes will now sync automatically.');
    } catch (error: any) {
      console.error('Publish error:', error);
      if (error.message.includes('already taken')) {
        toast.error('This URL is already taken. Please choose another one.');
      } else {
        toast.error('Failed to publish resume. Please try again.');
      }
    } finally {
      setIsPublishing(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(publishedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Link copied to clipboard!');
  };

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-8 md:h-11 px-3 md:px-5 transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline text-xs md:text-sm font-bold">Publish</span>
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-hidden"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md bg-white rounded-2xl shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] mt-2 sm:mt-0"
            >
              <div className="p-5 sm:p-6 overflow-y-auto flex-1">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <div className="flex items-center gap-2">
                    <Globe className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600" />
                    <h2 className="text-lg sm:text-xl font-bold text-zinc-900">Publish to Web</h2>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 text-zinc-400 hover:text-zinc-600 hover:bg-zinc-100 rounded-full transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!user ? (
                  <div className="text-center py-6">
                    <p className="text-zinc-600 mb-4">You need to sign in to publish your resume to the web.</p>
                  </div>
                ) : publishedUrl ? (
                  <div className="space-y-5 sm:space-y-6">
                    <div className="bg-green-50 text-green-800 p-4 rounded-xl text-sm border border-green-100 text-center">
                      <p className="font-semibold text-base sm:text-lg mb-1">Your resume is live!</p>
                      <p>Anyone with the link can view it.</p>
                    </div>

                    <div className="space-y-2">
                      <Label>Your Public URL</Label>
                      <div className="flex gap-2">
                        <Input value={publishedUrl} readOnly className="bg-zinc-50 text-sm" />
                        <Button variant="outline" size="icon" onClick={copyToClipboard} className="shrink-0">
                          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 pt-2">
                      <Button 
                        className="flex-1" 
                        variant="outline"
                        onClick={() => window.open(publishedUrl, '_blank')}
                      >
                        <ExternalLink className="w-4 h-4 mr-2" />
                        View Live
                      </Button>
                      <Button 
                        className="flex-1 bg-zinc-900 text-white hover:bg-zinc-800"
                        onClick={() => window.open(`/analytics/${slug}`, '_blank')}
                      >
                        <BarChart3 className="w-4 h-4 mr-2" />
                        Analytics
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 sm:space-y-6">
                    <p className="text-sm text-zinc-600">
                      Create a custom URL to share your resume online. You can track views and see where your visitors are coming from.
                    </p>

                    <div className="space-y-2">
                      <Label>Custom URL Slug</Label>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-zinc-500 bg-zinc-100 px-3 py-2 rounded-lg border border-zinc-200 hidden sm:block">
                          {window.location.host}/p/
                        </span>
                        <Input 
                          value={slug}
                          onChange={(e) => setSlug(e.target.value)}
                          placeholder="Type your name (e.g. johndoe)"
                          className="flex-1 border-indigo-200 focus:border-indigo-500 text-base"
                          autoFocus
                        />
                      </div>
                      <p className="text-xs text-zinc-500">Only lowercase letters, numbers, and hyphens.</p>
                    </div>

                    <div className="pt-2 sm:pt-4">
                      <Button 
                        onClick={handlePublish} 
                        disabled={isPublishing || !slug.trim()}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-5 sm:py-6 text-base sm:text-lg shadow-lg"
                      >
                        {isPublishing ? (
                          <>
                            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                            Publishing...
                          </>
                        ) : (
                          'Publish Resume Now'
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
