import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { subscribeToResumeAnalytics } from '@/lib/resumeService';
import { BarChart3, Eye, Globe, Clock, ArrowLeft, Loader2 } from 'lucide-react';
import { Logo } from '@/components/Logo';
import { useAuth } from '@/contexts/AuthContext';

export function AnalyticsDashboard() {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const [analytics, setAnalytics] = useState<{ views: number, recentViews: any[] } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug || !user) {
      setIsLoading(false);
      return;
    }

    const unsubscribe = subscribeToResumeAnalytics(
      slug,
      (data) => {
        setAnalytics(data);
        setIsLoading(false);
        setError(null);
      },
      (err) => {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Failed to load analytics');
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [slug, user]);

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
        <Logo />
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Sign In Required</h1>
          <p className="text-zinc-600 mb-6">You need to be signed in to view analytics.</p>
          <Link to="/" className="text-indigo-600 hover:underline font-medium">Return Home</Link>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-zinc-50 p-4">
        <Logo />
        <div className="mt-8 text-center">
          <h1 className="text-2xl font-bold text-zinc-900 mb-2">Analytics Not Found</h1>
          <p className="text-zinc-600 mb-6">{error || "We couldn't find analytics for this resume."}</p>
          <Link to="/" className="text-indigo-600 hover:underline font-medium">Return Home</Link>
        </div>
      </div>
    );
  }

  // Calculate Top Location
  const locationCounts = analytics.recentViews.reduce((acc: Record<string, number>, view: any) => {
    if (view.location && view.location !== 'Unknown' && view.location !== 'Unknown Location' && view.location !== 'Web Visitor') {
      acc[view.location] = (acc[view.location] || 0) + 1;
    }
    return acc;
  }, {});
  
  let topLocation = 'N/A';
  let maxCount = 0;
  for (const [loc, count] of Object.entries(locationCounts)) {
    if ((count as number) > maxCount) {
      maxCount = count as number;
      topLocation = loc;
    }
  }

  // Calculate Avg Time Spent
  const viewsWithTime = analytics.recentViews.filter(v => v.timeSpent && v.timeSpent > 0);
  let avgTimeStr = '0s';
  if (viewsWithTime.length > 0) {
    const totalTime = viewsWithTime.reduce((sum, v) => sum + v.timeSpent, 0);
    const avgSeconds = Math.round(totalTime / viewsWithTime.length);
    if (avgSeconds < 60) {
      avgTimeStr = `${avgSeconds}s`;
    } else {
      const mins = Math.floor(avgSeconds / 60);
      const secs = avgSeconds % 60;
      avgTimeStr = `${mins}m ${secs}s`;
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 py-8 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <Logo />
          <Link to="/" className="flex items-center text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-white px-4 py-2 rounded-full shadow-sm border border-zinc-200">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Editor
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden mb-8">
          <div className="p-6 sm:p-8 border-b border-zinc-100 bg-zinc-50/50">
            <div className="flex items-center gap-3 mb-2">
              <BarChart3 className="w-6 h-6 text-indigo-600" />
              <h1 className="text-2xl font-bold text-zinc-900">Resume Analytics</h1>
            </div>
            <p className="text-zinc-500">
              Tracking views for <a href={`/p/${slug}`} target="_blank" rel="noreferrer" className="text-indigo-600 hover:underline font-medium">{window.location.host}/p/{slug}</a>
            </p>
          </div>

          <div className="p-6 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-indigo-600" />
                </div>
                <p className="text-sm font-medium text-zinc-500 mb-1">Total Views</p>
                <p className="text-4xl font-bold text-zinc-900">{analytics.views}</p>
              </div>
              
              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mb-4">
                  <Globe className="w-6 h-6 text-emerald-600" />
                </div>
                <p className="text-sm font-medium text-zinc-500 mb-1">Top Location</p>
                <p className="text-xl font-bold text-zinc-900 truncate w-full px-2" title={topLocation}>{topLocation}</p>
              </div>

              <div className="bg-white rounded-xl border border-zinc-200 p-6 shadow-sm flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <p className="text-sm font-medium text-zinc-500 mb-1">Avg. Time Spent</p>
                <p className="text-xl font-bold text-zinc-900">{avgTimeStr}</p>
              </div>
            </div>

            <div>
              <h2 className="text-lg font-bold text-zinc-900 mb-4">Recent Views</h2>
              {analytics.recentViews.length > 0 ? (
                <div className="border border-zinc-200 rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-zinc-50 border-b border-zinc-200 text-zinc-500">
                      <tr>
                        <th className="px-6 py-3 font-medium">Date & Time</th>
                        <th className="px-6 py-3 font-medium">Location</th>
                        <th className="px-6 py-3 font-medium">Time Spent</th>
                        <th className="px-6 py-3 font-medium">Device / Browser</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {analytics.recentViews.map((view) => {
                        // Simple user agent parsing for display
                        const isMobile = view.userAgent.toLowerCase().includes('mobile');
                        const browser = view.userAgent.includes('Chrome') ? 'Chrome' : 
                                        view.userAgent.includes('Safari') ? 'Safari' : 
                                        view.userAgent.includes('Firefox') ? 'Firefox' : 'Unknown';
                        
                        let timeStr = '0s';
                        if (view.timeSpent) {
                          if (view.timeSpent < 60) timeStr = `${view.timeSpent}s`;
                          else timeStr = `${Math.floor(view.timeSpent / 60)}m ${view.timeSpent % 60}s`;
                        }
                        
                        return (
                          <tr key={view.id} className="hover:bg-zinc-50/50">
                            <td className="px-6 py-4 text-zinc-900">
                              {view.viewedAt.toLocaleDateString()} at {view.viewedAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </td>
                            <td className="px-6 py-4 text-zinc-600">{view.location}</td>
                            <td className="px-6 py-4 text-zinc-600">{timeStr}</td>
                            <td className="px-6 py-4 text-zinc-600">
                              {isMobile ? 'Mobile' : 'Desktop'} • {browser}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 bg-zinc-50 rounded-xl border border-zinc-200 border-dashed">
                  <Eye className="w-8 h-8 text-zinc-300 mx-auto mb-3" />
                  <p className="text-zinc-500 font-medium">No views yet</p>
                  <p className="text-sm text-zinc-400 mt-1">Share your link to start tracking views!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
