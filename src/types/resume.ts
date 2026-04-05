export type ResumeData = {
  personalInfo: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    country: string;
    title: string;
    summary: string;
    photoUrl?: string;
    links: { id: string; label: string; url: string }[];
  };
  experience: {
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  education: {
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    current: boolean;
    description: string;
  }[];
  skills: {
    id: string;
    name: string;
    level: string;
  }[];
  projects: {
    id: string;
    name: string;
    description: string;
    url: string;
    startDate: string;
    endDate: string;
  }[];
  certifications: {
    id: string;
    name: string;
    issuer: string;
    date: string;
    url: string;
  }[];
  languages: {
    id: string;
    name: string;
    proficiency: string;
  }[];
  interests: {
    id: string;
    name: string;
  }[];
  references: {
    id: string;
    name: string;
    position: string;
    company: string;
    email: string;
    phone: string;
  }[];
  settings: {
    template: 'modern' | 'minimal' | 'corporate' | 'creative';
    color: string;
    font: string;
    fontSize: 'small' | 'medium' | 'large';
    spacing: 'compact' | 'normal' | 'relaxed';
    borderRadius: 'sharp' | 'rounded' | 'pill';
    showPhoto: boolean;
    paperSize: 'a4' | 'letter';
    headerAlignment: 'left' | 'center' | 'right';
    bodyAlignment: 'left' | 'justify';
    publishedSlug?: string;
  };
};

export const emptyResumeData: ResumeData = {
  personalInfo: {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    title: '',
    summary: '',
    links: [],
  },
  experience: [],
  education: [],
  skills: [],
  projects: [],
  certifications: [],
  languages: [],
  interests: [],
  references: [],
  settings: {
    template: 'modern',
    color: '#3b82f6',
    font: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    borderRadius: 'rounded',
    showPhoto: true,
    paperSize: 'a4',
    headerAlignment: 'left',
    bodyAlignment: 'left',
  }
};

export const initialResumeData: ResumeData = {
  personalInfo: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    address: '123 Main St',
    city: 'San Francisco',
    country: 'USA',
    title: 'Senior Software Engineer',
    summary: 'Passionate and results-driven software engineer with 5+ years of experience in full-stack development. Proven ability to architect scalable solutions and lead cross-functional teams to deliver high-quality products.',
    links: [
      { id: '1', label: 'LinkedIn', url: 'linkedin.com/in/johndoe' },
      { id: '2', label: 'GitHub', url: 'github.com/johndoe' },
    ],
  },
  experience: [
    {
      id: '1',
      company: 'Tech Innovators Inc.',
      position: 'Senior Software Engineer',
      startDate: '2020-01',
      endDate: '',
      current: true,
      description: '• Led the development of a microservices architecture, improving system scalability by 40%.\n• Mentored junior developers and established code review best practices.\n• Reduced page load times by 30% through frontend optimization techniques.',
    },
    {
      id: '2',
      company: 'Web Solutions LLC',
      position: 'Software Engineer',
      startDate: '2017-06',
      endDate: '2019-12',
      current: false,
      description: '• Developed and maintained multiple client-facing web applications using React and Node.js.\n• Integrated third-party APIs for payment processing and analytics.\n• Collaborated with UX designers to implement responsive and accessible interfaces.',
    }
  ],
  education: [
    {
      id: '1',
      school: 'University of California, Berkeley',
      degree: 'Bachelor of Science',
      field: 'Computer Science',
      startDate: '2013-08',
      endDate: '2017-05',
      current: false,
      description: 'Graduated with Honors. Relevant coursework: Data Structures, Algorithms, Database Systems.',
    }
  ],
  skills: [
    { id: '1', name: 'JavaScript/TypeScript', level: 'Expert' },
    { id: '2', name: 'React & Next.js', level: 'Expert' },
    { id: '3', name: 'Node.js & Express', level: 'Advanced' },
    { id: '4', name: 'PostgreSQL & MongoDB', level: 'Advanced' },
    { id: '5', name: 'AWS & Docker', level: 'Intermediate' },
  ],
  projects: [
    {
      id: '1',
      name: 'E-commerce Platform',
      description: 'Built a scalable e-commerce platform handling 10k+ daily active users using Next.js, Stripe, and Supabase.',
      url: 'github.com/johndoe/ecommerce',
      startDate: '2022-01',
      endDate: '2022-06',
    }
  ],
  certifications: [
    {
      id: '1',
      name: 'AWS Certified Solutions Architect',
      issuer: 'Amazon Web Services',
      date: '2021-08',
      url: '',
    }
  ],
  languages: [
    { id: '1', name: 'English', proficiency: 'Native' },
    { id: '2', name: 'Spanish', proficiency: 'Intermediate' }
  ],
  interests: [
    { id: '1', name: 'Open Source Contribution' },
    { id: '2', name: 'Photography' }
  ],
  references: [
    {
      id: '1',
      name: 'Jane Smith',
      position: 'CTO',
      company: 'Tech Innovators Inc.',
      email: 'jane.smith@example.com',
      phone: '+1 (555) 987-6543'
    }
  ],
  settings: {
    template: 'modern',
    color: '#3b82f6', // blue-500
    font: 'Inter',
    fontSize: 'medium',
    spacing: 'normal',
    borderRadius: 'rounded',
    showPhoto: true,
    paperSize: 'a4',
    headerAlignment: 'left',
    bodyAlignment: 'left',
  }
};
