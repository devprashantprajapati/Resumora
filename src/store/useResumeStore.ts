import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ResumeData, initialResumeData, emptyResumeData } from '../types/resume';

interface ResumeStore {
  data: ResumeData;
  updatePersonalInfo: (info: Partial<ResumeData['personalInfo']>) => void;
  updateExperience: (id: string, exp: Partial<ResumeData['experience'][0]>) => void;
  addExperience: (exp: ResumeData['experience'][0]) => void;
  removeExperience: (id: string) => void;
  updateEducation: (id: string, edu: Partial<ResumeData['education'][0]>) => void;
  addEducation: (edu: ResumeData['education'][0]) => void;
  removeEducation: (id: string) => void;
  updateSkill: (id: string, skill: Partial<ResumeData['skills'][0]>) => void;
  addSkill: (skill: ResumeData['skills'][0]) => void;
  removeSkill: (id: string) => void;
  updateProject: (id: string, project: Partial<ResumeData['projects'][0]>) => void;
  addProject: (project: ResumeData['projects'][0]) => void;
  removeProject: (id: string) => void;
  updateCertification: (id: string, cert: Partial<ResumeData['certifications'][0]>) => void;
  addCertification: (cert: ResumeData['certifications'][0]) => void;
  removeCertification: (id: string) => void;
  updateLanguage: (id: string, lang: Partial<ResumeData['languages'][0]>) => void;
  addLanguage: (lang: ResumeData['languages'][0]) => void;
  removeLanguage: (id: string) => void;
  updateInterest: (id: string, interest: Partial<ResumeData['interests'][0]>) => void;
  addInterest: (interest: ResumeData['interests'][0]) => void;
  removeInterest: (id: string) => void;
  updateReference: (id: string, ref: Partial<ResumeData['references'][0]>) => void;
  addReference: (ref: ResumeData['references'][0]) => void;
  removeReference: (id: string) => void;
  updateSettings: (settings: Partial<ResumeData['settings']>) => void;
  resetData: () => void;
  reorderItems: <K extends keyof Omit<ResumeData, 'personalInfo' | 'settings'>>(
    section: K,
    startIndex: number,
    endIndex: number
  ) => void;
}

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: initialResumeData,
      updatePersonalInfo: (info) =>
        set((state) => ({
          data: { ...state.data, personalInfo: { ...state.data.personalInfo, ...info } },
        })),
      updateExperience: (id, exp) =>
        set((state) => ({
          data: {
            ...state.data,
            experience: state.data.experience.map((e) => (e.id === id ? { ...e, ...exp } : e)),
          },
        })),
      addExperience: (exp) =>
        set((state) => ({
          data: { ...state.data, experience: [...state.data.experience, exp] },
        })),
      removeExperience: (id) =>
        set((state) => ({
          data: { ...state.data, experience: state.data.experience.filter((e) => e.id !== id) },
        })),
      updateEducation: (id, edu) =>
        set((state) => ({
          data: {
            ...state.data,
            education: state.data.education.map((e) => (e.id === id ? { ...e, ...edu } : e)),
          },
        })),
      addEducation: (edu) =>
        set((state) => ({
          data: { ...state.data, education: [...state.data.education, edu] },
        })),
      removeEducation: (id) =>
        set((state) => ({
          data: { ...state.data, education: state.data.education.filter((e) => e.id !== id) },
        })),
      updateSkill: (id, skill) =>
        set((state) => ({
          data: {
            ...state.data,
            skills: state.data.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
          },
        })),
      addSkill: (skill) =>
        set((state) => ({
          data: { ...state.data, skills: [...state.data.skills, skill] },
        })),
      removeSkill: (id) =>
        set((state) => ({
          data: { ...state.data, skills: state.data.skills.filter((s) => s.id !== id) },
        })),
      updateProject: (id, project) =>
        set((state) => ({
          data: {
            ...state.data,
            projects: state.data.projects.map((p) => (p.id === id ? { ...p, ...project } : p)),
          },
        })),
      addProject: (project) =>
        set((state) => ({
          data: { ...state.data, projects: [...state.data.projects, project] },
        })),
      removeProject: (id) =>
        set((state) => ({
          data: { ...state.data, projects: state.data.projects.filter((p) => p.id !== id) },
        })),
      updateCertification: (id, cert) =>
        set((state) => ({
          data: {
            ...state.data,
            certifications: state.data.certifications.map((c) => (c.id === id ? { ...c, ...cert } : c)),
          },
        })),
      addCertification: (cert) =>
        set((state) => ({
          data: { ...state.data, certifications: [...state.data.certifications, cert] },
        })),
      removeCertification: (id) =>
        set((state) => ({
          data: { ...state.data, certifications: state.data.certifications.filter((c) => c.id !== id) },
        })),
      updateLanguage: (id, lang) =>
        set((state) => ({
          data: {
            ...state.data,
            languages: state.data.languages.map((l) => (l.id === id ? { ...l, ...lang } : l)),
          },
        })),
      addLanguage: (lang) =>
        set((state) => ({
          data: { ...state.data, languages: [...state.data.languages, lang] },
        })),
      removeLanguage: (id) =>
        set((state) => ({
          data: { ...state.data, languages: state.data.languages.filter((l) => l.id !== id) },
        })),
      updateInterest: (id, interest) =>
        set((state) => ({
          data: {
            ...state.data,
            interests: state.data.interests.map((i) => (i.id === id ? { ...i, ...interest } : i)),
          },
        })),
      addInterest: (interest) =>
        set((state) => ({
          data: { ...state.data, interests: [...state.data.interests, interest] },
        })),
      removeInterest: (id) =>
        set((state) => ({
          data: { ...state.data, interests: state.data.interests.filter((i) => i.id !== id) },
        })),
      updateReference: (id, ref) =>
        set((state) => ({
          data: {
            ...state.data,
            references: state.data.references.map((r) => (r.id === id ? { ...r, ...ref } : r)),
          },
        })),
      addReference: (ref) =>
        set((state) => ({
          data: { ...state.data, references: [...state.data.references, ref] },
        })),
      removeReference: (id) =>
        set((state) => ({
          data: { ...state.data, references: state.data.references.filter((r) => r.id !== id) },
        })),
      updateSettings: (settings) =>
        set((state) => ({
          data: { ...state.data, settings: { ...state.data.settings, ...settings } },
        })),
      resetData: () => set({ data: emptyResumeData }),
      reorderItems: (section, startIndex, endIndex) =>
        set((state) => {
          const result = Array.from((state.data[section] as any[]) || []);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return {
            data: {
              ...state.data,
              [section]: result,
            },
          };
        }),
    }),
    {
      name: 'resume-storage',
      merge: (persistedState: any, currentState) => {
        if (!persistedState) return currentState;
        return {
          ...currentState,
          data: {
            ...currentState.data,
            ...(persistedState.data || {}),
            personalInfo: {
              ...currentState.data.personalInfo,
              ...(persistedState.data?.personalInfo || {}),
              links: persistedState.data?.personalInfo?.links || currentState.data.personalInfo.links || [],
            },
            experience: persistedState.data?.experience || currentState.data.experience || [],
            education: persistedState.data?.education || currentState.data.education || [],
            skills: persistedState.data?.skills || currentState.data.skills || [],
            projects: persistedState.data?.projects || currentState.data.projects || [],
            certifications: persistedState.data?.certifications || currentState.data.certifications || [],
            languages: persistedState.data?.languages || currentState.data.languages || [],
            interests: persistedState.data?.interests || currentState.data.interests || [],
            references: persistedState.data?.references || currentState.data.references || [],
            settings: {
              ...currentState.data.settings,
              ...(persistedState.data?.settings || {}),
            },
          },
        };
      },
    }
  )
);
