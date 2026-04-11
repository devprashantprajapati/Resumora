import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Globe, Loader2, Copy, Check, BarChart3, ExternalLink, X, Rocket, Sparkles, CheckCircle2, LogIn } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);
  const { user, openAuthModal } = useAuth();

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-zinc-900/40 backdrop-blur-sm z-[100] flex items-start sm:items-center justify-center p-4 sm:p-6 overflow-hidden"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-lg bg-white rounded-3xl shadow-2xl flex flex-col max-h-[calc(100dvh-2rem)] sm:max-h-[90vh] mt-2 sm:mt-0 overflow-hidden border border-zinc-100"
          >
            {/* Decorative Header Background */}
            <div className="h-32 bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 relative overflow-hidden shrink-0">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 mix-blend-overlay"></div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
              
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="px-6 sm:px-8 pb-32 sm:pb-8 pt-0 overflow-y-auto flex-1 relative -mt-12">
              {/* Icon Circle */}
              <div className="w-24 h-24 bg-white rounded-full p-2 shadow-xl shadow-indigo-500/10 mb-6 mx-auto relative">
                <div className="w-full h-full bg-indigo-50 rounded-full flex items-center justify-center border border-indigo-100">
                  {publishedUrl ? (
                    <CheckCircle2 className="w-10 h-10 text-green-500" />
                  ) : (
                    <Globe className="w-10 h-10 text-indigo-600" />
                  )}
                </div>
                {!publishedUrl && (
                  <div className="absolute -top-1 -right-1 w-8 h-8 bg-amber-100 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                    <Sparkles className="w-4 h-4 text-amber-500" />
                  </div>
                )}
              </div>

              {!user ? (
                <div className="text-center py-8 px-4">
                  <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-indigo-100">
                    <LogIn className="w-8 h-8 text-indigo-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-zinc-900 mb-2">Sign in to Publish</h2>
                  <p className="text-zinc-500 mb-8 max-w-sm mx-auto">You need an account to publish your resume to the web, claim your custom URL, and track visitor analytics.</p>
                  <Button 
                    onClick={openAuthModal}
                    className="w-full sm:w-auto bg-zinc-900 hover:bg-zinc-800 text-white py-6 px-8 rounded-2xl text-lg font-bold shadow-xl shadow-zinc-900/20 transition-all active:scale-[0.98]"
                  >
                    <LogIn className="w-5 h-5 mr-2" />
                    Sign In to Publish
                  </Button>
                </div>
              ) : publishedUrl ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-8 text-center"
                >
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">You're Live! 🎉</h2>
                    <p className="text-zinc-500">Your resume is now published and accessible to anyone with the link. Changes will sync automatically.</p>
                  </div>

                  <div className="bg-zinc-50 p-4 rounded-2xl border border-zinc-200/80 shadow-inner">
                    <Label className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-3 block text-left">Your Public Link</Label>
                    <div className="flex items-center gap-2 bg-white p-1.5 rounded-xl border border-zinc-200 shadow-sm">
                      <div className="flex-1 px-3 text-sm font-medium text-zinc-700 truncate select-all text-left">
                        {publishedUrl}
                      </div>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={copyToClipboard} 
                        className={`shrink-0 rounded-lg transition-colors ${copied ? 'bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700' : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'}`}
                      >
                        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <Button 
                      className="flex-1 h-12 bg-white border-2 border-zinc-200 text-zinc-700 hover:bg-zinc-50 hover:border-zinc-300 rounded-xl font-semibold transition-all"
                      onClick={() => window.open(publishedUrl, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      View Live
                    </Button>
                    <Button 
                      className="flex-1 h-12 bg-zinc-900 text-white hover:bg-zinc-800 rounded-xl font-semibold shadow-md shadow-zinc-900/20 transition-all"
                      onClick={() => window.open(`/analytics/${slug}`, '_blank')}
                    >
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-zinc-900 mb-2">Publish to Web</h2>
                    <p className="text-zinc-500 text-sm px-4">
                      Create a custom URL to share your resume online. Track views and see where your visitors are coming from.
                    </p>
                  </div>

                  <div className="space-y-3 pt-4">
                    <Label className="text-sm font-semibold text-zinc-900 ml-1">Claim your custom URL</Label>
                    <div className="flex items-center bg-zinc-50 border-2 border-zinc-200 rounded-2xl overflow-hidden focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-500/10 transition-all duration-300">
                      <div className="px-4 py-4 bg-zinc-100/80 text-zinc-500 text-sm font-medium border-r border-zinc-200 select-none flex items-center gap-2 shrink-0">
                        <Globe className="w-4 h-4" />
                        <span className="hidden sm:inline">{window.location.host}/p/</span>
                        <span className="sm:hidden">/p/</span>
                      </div>
                      <input 
                        value={slug}
                        onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                        placeholder="johndoe"
                        className="flex-1 px-4 py-4 bg-transparent outline-none text-zinc-900 font-bold placeholder:text-zinc-300 placeholder:font-medium w-full min-w-0"
                      />
                    </div>
                    <p className="text-xs text-zinc-500 ml-1 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />
                      Only lowercase letters, numbers, and hyphens.
                    </p>
                  </div>

                  <div className="pt-6">
                    <Button 
                      onClick={handlePublish} 
                      disabled={isPublishing || !slug.trim()}
                      className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white py-6 rounded-2xl text-lg font-bold shadow-xl shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-70 disabled:active:scale-100"
                    >
                      {isPublishing ? (
                        <>
                          <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                          Publishing to Web...
                        </>
                      ) : (
                        <>
                          <Rocket className="w-5 h-5 mr-2" />
                          Publish Resume Now
                        </>
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
  );

  return (
    <>
      <Button
        onClick={() => setIsOpen(true)}
        onPointerDown={(e) => e.stopPropagation()}
        className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-full h-8 md:h-11 px-3 md:px-5 transition-all duration-300 flex items-center gap-2 active:scale-95"
      >
        <Globe className="w-4 h-4" />
        <span className="hidden md:inline text-xs md:text-sm font-bold">Publish</span>
      </Button>

      {mounted && createPortal(modalContent, document.body)}
    </>
  );
}
