import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPublishedResume, incrementResumeViews, PublishedResume } from '@/lib/resumeService';
import { ModernTemplate } from '@/components/preview/templates/ModernTemplate';
import { MinimalTemplate } from '@/components/preview/templates/MinimalTemplate';
import { CorporateTemplate } from '@/components/preview/templates/CorporateTemplate';
import { CreativeTemplate } from '@/components/preview/templates/CreativeTemplate';
import { Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';

export function PublicResume() {
  const { slug } = useParams<{ slug: string }>();
  const [resume, setResume] = useState<PublishedResume | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      if (!slug) return;
      
      try {
        const data = await getPublishedResume(slug);
        if (data) {
          setResume(data);
          // Increment view count
          // In a real app, you might want to use an IP-based location service
          // For now, we just pass basic info
          incrementResumeViews(slug, 'Web Visitor', navigator.userAgent);
        } else {
          setError('Resume not found');
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Failed to load resume');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResume();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !resume) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
        <Logo />
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Resume Not Found</h1>
          <p className="text-zinc-600">The resume you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  const renderTemplate = () => {
    const props = { data: resume.data };
    switch (resume.data.settings.template) {
      case 'minimal':
        return <MinimalTemplate {...props} />;
      case 'corporate':
        return <CorporateTemplate {...props} />;
      case 'creative':
        return <CreativeTemplate {...props} />;
      case 'modern':
      default:
        return <ModernTemplate {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-zinc-100 py-8 px-4 sm:px-8 flex flex-col items-center">
      <div className="w-full max-w-[210mm] mb-6 flex justify-between items-center">
        <Logo />
        <a 
          href="/" 
          className="text-sm font-medium text-indigo-600 hover:text-indigo-700 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-200"
        >
          Create your own resume
        </a>
      </div>
      
      <div className="w-full max-w-[210mm] bg-white shadow-2xl rounded-sm overflow-hidden" style={{ minHeight: '297mm' }}>
        {renderTemplate()}
      </div>
    </div>
  );
}
