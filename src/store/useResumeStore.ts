import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ContactInfo {
  fullName: string;
  email: string;
  phone: string;
  linkedin: string;
  website: string;
  country: string;
  state: string;
  city: string;
}

export interface Experience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string[];
}

export interface Education {
  id: string;
  degree: string;
  school: string;
  location: string;
  date: string;
  minor: string;
  gpa: string;
  additionalInfo: string;
}

export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string[];
}

export interface ResumeData {
  contact: ContactInfo;
  summary: string;
  experience: Experience[];
  education: Education[];
  projects: Project[];
  skills: string; // The screenshot shows a comma-separated string for skills
}

interface ResumeStore {
  data: ResumeData;
  updateContact: (contact: Partial<ContactInfo>) => void;
  updateSummary: (summary: string) => void;
  
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;

  addEducation: (edu: Education) => void;
  updateEducation: (id: string, edu: Partial<Education>) => void;
  removeEducation: (id: string) => void;

  addProject: (proj: Project) => void;
  updateProject: (id: string, proj: Partial<Project>) => void;
  removeProject: (id: string) => void;

  updateSkills: (skills: string) => void;
}

const initialData: ResumeData = {
  contact: {
    fullName: '',
    email: '',
    phone: '',
    linkedin: '',
    website: '',
    country: '',
    state: '',
    city: '',
  },
  summary: '',
  experience: [],
  education: [],
  projects: [],
  skills: '',
};

export const useResumeStore = create<ResumeStore>()(
  persist(
    (set) => ({
      data: initialData,
      
      updateContact: (contact) => set((state) => ({
        data: { ...state.data, contact: { ...state.data.contact, ...contact } }
      })),
      
      updateSummary: (summary) => set((state) => ({
        data: { ...state.data, summary }
      })),

      addExperience: (exp) => set((state) => ({
        data: { ...state.data, experience: [...state.data.experience, exp] }
      })),
      updateExperience: (id, expUpdate) => set((state) => ({
        data: { 
          ...state.data, 
          experience: state.data.experience.map(e => e.id === id ? { ...e, ...expUpdate } : e)
        }
      })),
      removeExperience: (id) => set((state) => ({
        data: {
          ...state.data,
          experience: state.data.experience.filter(e => e.id !== id)
        }
      })),

      addEducation: (edu) => set((state) => ({
        data: { ...state.data, education: [...state.data.education, edu] }
      })),
      updateEducation: (id, eduUpdate) => set((state) => ({
        data: { 
          ...state.data, 
          education: state.data.education.map(e => e.id === id ? { ...e, ...eduUpdate } : e)
        }
      })),
      removeEducation: (id) => set((state) => ({
        data: {
          ...state.data,
          education: state.data.education.filter(e => e.id !== id)
        }
      })),

      addProject: (proj) => set((state) => ({
        data: { ...state.data, projects: [...state.data.projects, proj] }
      })),
      updateProject: (id, projUpdate) => set((state) => ({
        data: { 
          ...state.data, 
          projects: state.data.projects.map(p => p.id === id ? { ...p, ...projUpdate } : p)
        }
      })),
      removeProject: (id) => set((state) => ({
        data: {
          ...state.data,
          projects: state.data.projects.filter(p => p.id !== id)
        }
      })),

      updateSkills: (skills) => set((state) => ({
        data: { ...state.data, skills }
      })),
    }),
    {
      name: 'resume-storage', // key in localStorage
    }
  )
);
