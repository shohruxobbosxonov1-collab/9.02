import React, { createContext, useContext, useState, useEffect } from 'react';
import { Student, Memory, GalleryItem, MemoryNote, ClassInfo } from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_MEMORIES,
  INITIAL_GALLERY,
  INITIAL_NOTES,
  INITIAL_CLASS_INFO,
} from '../data/initialData';

interface ClassDataContextType {
  students: Student[];
  memories: Memory[];
  gallery: GalleryItem[];
  notes: MemoryNote[];
  classInfo: ClassInfo;
  isAdmin: boolean;
  selectedStudent: Student | null;
  setSelectedStudent: (student: Student | null) => void;
  lightboxMedia: {
    isOpen: boolean;
    currentIndex: number;
    items: { imageUrl: string; title: string; caption?: string; date?: string }[];
  };
  openLightbox: (items: { imageUrl: string; title: string; caption?: string; date?: string }[], index?: number) => void;
  closeLightbox: () => void;
  nextLightbox: () => void;
  prevLightbox: () => void;
  updateStudent: (student: Student) => void;
  addMemory: (memory: Omit<Memory, 'id'>) => void;
  updateMemory: (memory: Memory) => void;
  deleteMemory: (id: string) => void;
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  addNote: (author: string, message: string, color: MemoryNote['color']) => void;
  deleteNote: (id: string) => void;
  likeNote: (id: string) => void;
  toggleNoteApproval: (id: string) => void;
  updateClassInfo: (info: ClassInfo) => void;
  loginAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  exportDataJSON: () => string;
  importDataJSON: (jsonString: string) => boolean;
  resetAllToDefaults: () => void;
}

const ClassDataContext = createContext<ClassDataContextType | undefined>(undefined);

const STORAGE_KEYS = {
  STUDENTS: 'class_home_students_v1',
  MEMORIES: 'class_home_memories_v1',
  GALLERY: 'class_home_gallery_v1',
  NOTES: 'class_home_notes_v1',
  CLASS_INFO: 'class_home_info_v1',
  ADMIN_AUTH: 'class_home_admin_session_v1',
};

// Default administrative access passkey
const ADMIN_PASSWORD = 'admin';

export const ClassDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length === 14) {
          return parsed;
        }
      }
    } catch {
      // ignore error
    }
    return INITIAL_STUDENTS;
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_MEMORIES;
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_GALLERY;
  });

  const [notes, setNotes] = useState<MemoryNote[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_NOTES;
  });

  const [classInfo, setClassInfo] = useState<ClassInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CLASS_INFO);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_CLASS_INFO;
  });

  const [isAdmin, setIsAdmin] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
    } catch {
      return false;
    }
  });

  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  const [lightboxMedia, setLightboxMedia] = useState<{
    isOpen: boolean;
    currentIndex: number;
    items: { imageUrl: string; title: string; caption?: string; date?: string }[];
  }>({
    isOpen: false,
    currentIndex: 0,
    items: [],
  });

  // Local storage synchronization
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [gallery]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(notes));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [notes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.CLASS_INFO, JSON.stringify(classInfo));
    } catch (e) {
      console.warn('Storage error', e);
    }
  }, [classInfo]);

  const loginAdmin = (pass: string): boolean => {
    if (pass.trim() === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
      } catch {
        // ignore
      }
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdmin(false);
    try {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    } catch {
      // ignore
    }
  };

  const updateStudent = (updatedStudent: Student) => {
    setStudents((prev) =>
      prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s))
    );
    if (selectedStudent && selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
  };

  const addMemory = (memoryData: Omit<Memory, 'id'>) => {
    const newMem: Memory = {
      ...memoryData,
      id: `m-${Date.now()}`,
    };
    setMemories((prev) => [newMem, ...prev]);
  };

  const updateMemory = (updatedMemory: Memory) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === updatedMemory.id ? updatedMemory : m))
    );
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `g-${Date.now()}`,
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const addNote = (author: string, message: string, color: MemoryNote['color']) => {
    const newNote: MemoryNote = {
      id: `n-${Date.now()}`,
      author: author.trim() || 'Classmate',
      message: message.trim(),
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      color,
      isApproved: true,
      likes: 0,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const deleteNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  const likeNote = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n))
    );
  };

  const toggleNoteApproval = (id: string) => {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isApproved: !n.isApproved } : n))
    );
  };

  const updateClassInfo = (info: ClassInfo) => {
    setClassInfo(info);
  };

  const openLightbox = (
    items: { imageUrl: string; title: string; caption?: string; date?: string }[],
    index = 0
  ) => {
    setLightboxMedia({
      isOpen: true,
      currentIndex: Math.max(0, Math.min(index, items.length - 1)),
      items,
    });
  };

  const closeLightbox = () => {
    setLightboxMedia((prev) => ({ ...prev, isOpen: false }));
  };

  const nextLightbox = () => {
    setLightboxMedia((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex + 1) % prev.items.length,
    }));
  };

  const prevLightbox = () => {
    setLightboxMedia((prev) => ({
      ...prev,
      currentIndex: (prev.currentIndex - 1 + prev.items.length) % prev.items.length,
    }));
  };

  const exportDataJSON = () => {
    const data = {
      students,
      memories,
      gallery,
      notes,
      classInfo,
      exportedAt: new Date().toISOString(),
    };
    return JSON.stringify(data, null, 2);
  };

  const importDataJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (data.students && Array.isArray(data.students) && data.students.length === 14) {
        setStudents(data.students);
      }
      if (data.memories && Array.isArray(data.memories)) {
        setMemories(data.memories);
      }
      if (data.gallery && Array.isArray(data.gallery)) {
        setGallery(data.gallery);
      }
      if (data.notes && Array.isArray(data.notes)) {
        setNotes(data.notes);
      }
      if (data.classInfo) {
        setClassInfo(data.classInfo);
      }
      return true;
    } catch {
      return false;
    }
  };

  const resetAllToDefaults = () => {
    setStudents(INITIAL_STUDENTS);
    setMemories(INITIAL_MEMORIES);
    setGallery(INITIAL_GALLERY);
    setNotes(INITIAL_NOTES);
    setClassInfo(INITIAL_CLASS_INFO);
    try {
      localStorage.removeItem(STORAGE_KEYS.STUDENTS);
      localStorage.removeItem(STORAGE_KEYS.MEMORIES);
      localStorage.removeItem(STORAGE_KEYS.GALLERY);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.CLASS_INFO);
    } catch {
      // ignore
    }
  };

  return (
    <ClassDataContext.Provider
      value={{
        students,
        memories,
        gallery,
        notes,
        classInfo,
        isAdmin,
        selectedStudent,
        setSelectedStudent,
        lightboxMedia,
        openLightbox,
        closeLightbox,
        nextLightbox,
        prevLightbox,
        updateStudent,
        addMemory,
        updateMemory,
        deleteMemory,
        addGalleryItem,
        deleteGalleryItem,
        addNote,
        deleteNote,
        likeNote,
        toggleNoteApproval,
        updateClassInfo,
        loginAdmin,
        logoutAdmin,
        exportDataJSON,
        importDataJSON,
        resetAllToDefaults,
      }}
    >
      {children}
    </ClassDataContext.Provider>
  );
};

export const useClassData = () => {
  const context = useContext(ClassDataContext);
  if (!context) {
    throw new Error('useClassData must be used within a ClassDataProvider');
  }
  return context;
};
