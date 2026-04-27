import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { useAuth } from '../contexts/AuthContext';
import { getUserResumes, saveResume, deleteResume, renameResume, SavedResume } from '../lib/resumeService';
import { emptyResumeData } from '../types/resume';
import { Logo } from '../components/Logo';
import { Button } from '../components/ui/Button';
import { Plus, FileText, MoreVertical, Trash2, Edit2, Loader2, User as UserIcon, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { AuthModal } from '../components/auth/AuthModal';

export function Dashboard() {
  const { user, openAuthModal, logout } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<SavedResume[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState<string>('');
  const [isRenaming, setIsRenaming] = useState(false);

  useEffect(() => {
    // Dismiss confirm states if clicking outside (handled simply by navigating away or setting a timer, but let's just keep it simple)
    const handleClickOutside = () => setConfirmDeleteId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  useEffect(() => {
    if (user) {
      loadResumes();
    } else {
      setIsLoading(false);
      setResumes([]);
    }
  }, [user]);

  const loadResumes = async () => {
    setIsLoading(true);
    try {
      const data = await getUserResumes();
      setResumes(data);
    } catch (error) {
      console.error("Failed to load resumes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNew = async () => {
    if (!user) {
      openAuthModal();
      return;
    }
    
    setIsCreating(true);
    try {
      const newId = uuidv4();
      try {
        // Attempt to pre-save the newly created blank state to the database directly
        await saveResume(newId, 'Untitled Resume', emptyResumeData, true);
      } catch (error: any) {
        console.warn("Failed to save resume in cloud, continuing in local mode:", error);
      }
      navigate(`/editor/${newId}`);
    } catch (error: any) {
      console.error("Failed to create resume:", error);
      alert(`Error creating: ${error.message || String(error)}`);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Inline confirmation check to prevent iframe window.confirm blocking
    if (confirmDeleteId !== id) {
      setConfirmDeleteId(id);
      return;
    }
    
    setConfirmDeleteId(null);
    setDeletingId(id);
    try {
      await deleteResume(id);
      setResumes(prev => prev.filter(r => r.id !== id));
    } catch (error) {
      console.error("Failed to delete resume:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const handleStartRename = (resume: SavedResume, e: React.MouseEvent) => {
    e.stopPropagation();
    setRenamingId(resume.id);
    setRenameValue(resume.title || 'Untitled Resume');
  };

  const submitRename = async (id: string, e?: React.MouseEvent | React.FormEvent) => {
    if (e) e.stopPropagation();
    if (!renameValue.trim() || isRenaming) return;
    
    // Check if title actually changed
    const currentResume = resumes.find(r => r.id === id);
    if (currentResume && currentResume.title === renameValue.trim()) {
      setRenamingId(null);
      return;
    }
    
    setIsRenaming(true);
    try {
      await renameResume(id, renameValue.trim());
      setResumes(prev => prev.map(r => r.id === id ? { ...r, title: renameValue.trim() } : r));
    } catch (error) {
      console.error("Failed to rename resume:", error);
    } finally {
      setIsRenaming(false);
      setRenamingId(null);
    }
  };

  const handleKeyDown = (id: string, e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      submitRename(id);
    } else if (e.key === 'Escape') {
      setRenamingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-mesh-pattern flex flex-col font-sans selection:bg-zinc-900 selection:text-white relative overflow-hidden">
      <AuthModal />
      
      {/* Animated Background Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10 bg-zinc-50/30">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-400/10 blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-violet-400/10 blur-[120px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Navigation */}
      <header className="h-16 lg:h-20 glass-nav lg:bg-white/40 lg:backdrop-blur-3xl lg:border-b lg:border-white/60 lg:shadow-[0_4px_30px_rgba(0,0,0,0.03)] flex items-center px-4 sm:px-8 shrink-0 z-40 relative transition-all duration-500">
        <Logo />
        <div className="ml-auto flex items-center gap-4 text-sm text-zinc-500 font-medium h-[44px] w-[150px]">
          {user ? (
            <div className="flex items-center gap-3 bg-white/80 backdrop-blur-md border border-zinc-200/60 w-full h-full px-4 rounded-full shadow-sm hover:shadow-md transition-all duration-300">
              <div className="w-6 h-6 shrink-0 rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center text-white font-bold text-xs shadow-inner">
                {user.displayName?.charAt(0).toUpperCase() || user.email?.charAt(0).toUpperCase() || <UserIcon className="w-3 h-3" />}
              </div>
              <span className="text-sm font-medium text-zinc-700 truncate flex-1">{user.displayName || user.email}</span>
              <button 
                onClick={logout}
                className="p-1.5 shrink-0 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                title="Sign out"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Button 
              onClick={openAuthModal}
              variant="outline" 
              className="rounded-full w-full h-full text-[15px] font-semibold border-zinc-200/60 hover:bg-zinc-50 hover:text-zinc-900 shadow-sm transition-all duration-300"
            >
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 sm:px-10 py-12 relative z-10">

        {isLoading ? (
          <div className="flex justify-center items-center py-32 relative z-10 w-full h-[400px] glass-panel rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
            <Loader2 className="w-8 h-8 text-indigo-500 animate-spin" />
          </div>
        ) : !user ? (
          <div className="text-center py-32 glass-panel rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <h2 className="text-2xl font-bold text-zinc-900 mb-2 relative z-10 tracking-tight">Sign in to sync your resumes</h2>
            <p className="text-zinc-500 mb-8 max-w-sm mx-auto relative z-10">Your data is securely stored and accessible from anywhere.</p>
            <Button onClick={openAuthModal} className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-8 h-12 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all relative z-10">
              Sign In to Continue
            </Button>
          </div>
        ) : resumes.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col justify-center items-center py-32 glass-panel rounded-[2rem] shadow-[0_8px_30px_rgb(0,0,0,0.04)] border-dashed border-2 relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-violet-500/5 pointer-events-none" />
            <div className="w-20 h-20 bg-gradient-to-br from-white to-zinc-50 border border-zinc-100/50 rounded-[2rem] flex items-center justify-center mb-6 relative z-10 shadow-lg shadow-indigo-500/5">
              <FileText className="w-10 h-10 text-indigo-500" />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2 relative z-10 tracking-tight">No resumes yet</h2>
            <p className="text-zinc-500 mb-8 max-w-sm text-center relative z-10">Create your first resume to start matching with your dream jobs.</p>
            <Button onClick={handleCreateNew} className="rounded-full bg-zinc-900 hover:bg-zinc-800 text-white px-8 h-12 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.12)] transition-all relative z-10">
              <Plus className="w-5 h-5 mr-2" /> Create Resume
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* Inline Create New Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0 }}
              onClick={handleCreateNew}
              className="group relative bg-white border-2 border-dashed border-zinc-200 rounded-[2rem] p-6 hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:border-indigo-400/60 transition-all duration-300 cursor-pointer flex flex-col items-center justify-center h-[280px] overflow-hidden"
            >
               <div className="absolute inset-0 bg-zinc-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
               <div className="w-16 h-16 bg-white border border-zinc-100 rounded-full shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-all duration-300">
                  {isCreating ? <Loader2 className="w-6 h-6 animate-spin text-indigo-500" /> : <Plus className="w-6 h-6 text-zinc-400 group-hover:text-indigo-600" />}
               </div>
               <span className="font-semibold text-zinc-600 group-hover:text-indigo-600 transition-colors">Start from scratch</span>
            </motion.div>

            <AnimatePresence>
              {resumes.map((resume, idx) => (
                <motion.div
                  key={resume.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: (idx + 1) * 0.05 }}
                  onClick={() => navigate(`/editor/${resume.id}`)}
                  className="group relative bg-white border border-zinc-200/80 rounded-[2rem] p-6 shadow-sm hover:shadow-[0_20px_40px_rgb(0,0,0,0.06)] hover:-translate-y-1 hover:border-indigo-200 transition-all duration-300 cursor-pointer flex flex-col h-[280px] overflow-hidden"
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                  
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity z-10 duration-300 flex flex-col gap-2">
                    <button 
                      onClick={(e) => handleStartRename(resume, e)}
                      className="p-2 bg-white rounded-full text-zinc-400 hover:text-indigo-600 hover:bg-indigo-50 shadow-sm border border-zinc-200/60 transition-all hover:scale-105 active:scale-95"
                      title="Rename"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    {confirmDeleteId === resume.id ? (
                      <button 
                        onClick={(e) => handleDelete(resume.id, e)}
                        disabled={deletingId === resume.id}
                        className="px-4 py-2 bg-red-600 rounded-full text-white font-medium text-sm shadow-sm transition-colors hover:bg-red-700 active:scale-95 flex items-center gap-2"
                      >
                        {deletingId === resume.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                        Confirm
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => handleDelete(resume.id, e)}
                        disabled={deletingId === resume.id}
                        className="p-2 bg-white rounded-full text-zinc-400 hover:text-red-600 hover:bg-red-50 shadow-sm border border-zinc-200/60 transition-all hover:scale-105 active:scale-95"
                        title="Delete"
                      >
                        {deletingId === resume.id ? <Loader2 className="w-4 h-4 animate-spin text-red-500" /> : <Trash2 className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  
                  <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 shrink-0 group-hover:scale-105 group-hover:-rotate-3 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-300 shadow-sm border border-indigo-100 group-hover:border-indigo-600">
                    <FileText className="w-6 h-6" />
                  </div>
                  
                  {renamingId === resume.id ? (
                    <div className="mb-1.5 relative z-20" onClick={(e) => e.stopPropagation()}>
                      <div className="relative flex items-center">
                        <input 
                          type="text" 
                          autoFocus
                          value={renameValue}
                          onChange={(e) => setRenameValue(e.target.value)}
                          onKeyDown={(e) => handleKeyDown(resume.id, e)}
                          onBlur={() => submitRename(resume.id)}
                          className="w-full bg-white border-2 border-indigo-500 rounded-lg py-1 px-2 text-lg font-bold text-zinc-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/10"
                        />
                        {isRenaming && (
                          <div className="absolute right-2 text-indigo-500">
                             <Loader2 className="w-4 h-4 animate-spin" />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <h3 className="text-lg font-bold text-zinc-900 mb-1.5 line-clamp-2 group-hover:text-indigo-900 transition-colors">{resume.title || 'Untitled Resume'}</h3>
                  )}
                  <div className="text-sm text-zinc-500 mb-4 line-clamp-1 font-medium">
                    {resume.data?.personalInfo?.firstName || ''} {resume.data?.personalInfo?.lastName || ''} {resume.data?.personalInfo?.firstName ? '• ' : ''}{resume.data?.personalInfo?.title || 'No Role'}
                  </div>
                  
                  <div className="mt-auto pt-4 border-t border-zinc-100 flex items-center justify-between text-[11px] uppercase tracking-wider font-semibold text-zinc-400">
                    <span>
                      {formatDistanceToNow(resume.updatedAt, { addSuffix: true })}
                    </span>
                    <div className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity font-bold">
                      Edit
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </main>
    </div>
  );
}
