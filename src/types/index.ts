export interface Student {
  id: string;
  name: string;
  deskNumber: number;
  avatar: string;
  personalQuote?: string;
  hobbies: string[];
  memories: string[];
  achievements: string[];
  photos: string[];
  accentColor: string;
  row: number;
  col: number;
}

export interface Memory {
  id: string;
  title: string;
  date: string;
  category: 'Trips' | 'Celebrations' | 'Daily Life' | 'Milestones' | 'Competitions';
  description: string;
  imageUrl: string;
  highlight?: boolean;
}

export interface GalleryItem {
  id: string;
  title: string;
  category: 'Events' | 'Trips' | 'Daily Life' | 'Projects' | 'Portraits';
  imageUrl: string;
  date: string;
  caption: string;
}

export interface MemoryNote {
  id: string;
  author: string;
  message: string;
  date: string;
  color: 'amber' | 'blue' | 'rose' | 'emerald' | 'purple';
  isApproved: boolean;
  likes: number;
}

export interface ClassInfo {
  className: string;
  schoolName: string;
  teacherName: string;
  academicYear: string;
  motto: string;
  uzbekSubtitle: string;
  description: string;
  groupPhoto: string;
}
