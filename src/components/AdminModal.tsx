import React, { useState } from 'react';
import {
  X,
  Lock,
  LogOut,
  User,
  Image,
  Calendar,
  School,
  MessageSquare,
  Save,
  Trash2,
  Plus,
  RefreshCw,
  Download,
  Upload,
  Check,
  AlertCircle,
} from 'lucide-react';
import { useClassData } from '../context/ClassDataContext';
import { Student, Memory, GalleryItem, ClassInfo } from '../types';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialSelectedStudentId?: string | null;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
  initialSelectedStudentId,
}) => {
  const {
    isAdmin,
    loginAdmin,
    logoutAdmin,
    students,
    updateStudent,
    memories,
    addMemory,
    updateMemory,
    deleteMemory,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    classInfo,
    updateClassInfo,
    notes,
    deleteNote,
    toggleNoteApproval,
    exportDataJSON,
    importDataJSON,
    resetAllToDefaults,
  } = useClassData();

  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<
    'students' | 'memories' | 'gallery' | 'classInfo' | 'wall' | 'backup'
  >('students');

  // Student editing state
  const [selectedStudentId, setSelectedStudentId] = useState<string>(
    initialSelectedStudentId || students[0]?.id || 's-1'
  );
  const currentStudent = students.find((s) => s.id === selectedStudentId) || students[0];

  const [studentForm, setStudentForm] = useState<Student>(currentStudent);

  // Sync form when student selected changes
  React.useEffect(() => {
    if (currentStudent) {
      setStudentForm(currentStudent);
    }
  }, [selectedStudentId, students]);

  // Memory form state
  const [newMemory, setNewMemory] = useState<Omit<Memory, 'id'>>({
    title: '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    category: 'Milestones',
    description: '',
    imageUrl: '/src/assets/images/classroom_hero_banner_1791877402377.jpg',
  });

  // Gallery form state
  const [newGalleryPhoto, setNewGalleryPhoto] = useState<Omit<GalleryItem, 'id'>>({
    title: '',
    category: 'Daily Life',
    imageUrl: '/src/assets/images/class_group_photo_1791877402090.jpg',
    date: '2025',
    caption: '',
  });

  // Class Info form state
  const [classInfoForm, setClassInfoForm] = useState<ClassInfo>(classInfo);
  React.useEffect(() => {
    setClassInfoForm(classInfo);
  }, [classInfo]);

  // JSON Import state
  const [importText, setImportText] = useState('');
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  if (!isOpen) return null;

  const showSuccess = (msg: string) => {
    setSaveSuccessMsg(msg);
    setTimeout(() => setSaveSuccessMsg(''), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const success = loginAdmin(passwordInput);
    if (!success) {
      setAuthError('Incorrect administrative password. Default passkey is: admin');
    } else {
      setPasswordInput('');
    }
  };

  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    updateStudent(studentForm);
    showSuccess(`Profile for ${studentForm.name} saved successfully!`);
  };

  const handleCreateMemory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMemory.title || !newMemory.imageUrl) return;
    addMemory(newMemory);
    setNewMemory({
      title: '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category: 'Milestones',
      description: '',
      imageUrl: '/src/assets/images/classroom_hero_banner_1791877402377.jpg',
    });
    showSuccess('New memory added to yearbook!');
  };

  const handleCreateGalleryPhoto = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGalleryPhoto.title || !newGalleryPhoto.imageUrl) return;
    addGalleryItem(newGalleryPhoto);
    setNewGalleryPhoto({
      title: '',
      category: 'Daily Life',
      imageUrl: '/src/assets/images/class_group_photo_1791877402090.jpg',
      date: '2025',
      caption: '',
    });
    showSuccess('Photograph added to gallery!');
  };

  const handleSaveClassInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateClassInfo(classInfoForm);
    showSuccess('Class details updated!');
  };

  const handleExport = () => {
    const dataStr = exportDataJSON();
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `class-home-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showSuccess('Class data exported to JSON!');
  };

  const handleImport = () => {
    if (!importText.trim()) return;
    const ok = importDataJSON(importText);
    if (ok) {
      setImportText('');
      showSuccess('Class data imported successfully!');
    } else {
      alert('Invalid JSON structure. Please check the backup file content.');
    }
  };

  // Helper for image file uploads converting to base64
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onUrlReady: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select an image file (JPEG, PNG, WebP).');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert('File is too large. Max file size is 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onUrlReady(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden text-slate-800 my-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Lock className="w-5 h-5 text-blue-400" />
            <div>
              <h3 className="text-base font-bold tracking-tight">
                Class Home Administrator Panel
              </h3>
              <p className="text-[11px] text-slate-400">
                {isAdmin
                  ? 'Authenticated Session · Authorized Management'
                  : 'Administrative Access Verification'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdmin && (
              <button
                onClick={logoutAdmin}
                className="p-1.5 rounded-lg text-slate-300 hover:text-rose-400 hover:bg-slate-800 transition-colors text-xs flex items-center gap-1.5"
                title="Log out of admin"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Success toast inside modal */}
        {saveSuccessMsg && (
          <div className="bg-emerald-500 text-white px-6 py-2.5 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
            <Check className="w-4 h-4" />
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {/* AUTHENTICATION FORM IF NOT LOGGED IN */}
        {!isAdmin ? (
          <div className="p-8 sm:p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4 border border-blue-100 shadow-sm">
              <Lock className="w-7 h-7" />
            </div>

            <h4 className="text-xl font-bold text-slate-900 mb-2">
              Administrator Authentication
            </h4>
            <p className="text-xs text-slate-500 mb-6">
              Enter your administrative passkey to edit the 14 student profiles, manage photographs, and maintain class memories.
            </p>

            {authError && (
              <div className="p-3 mb-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2 text-left">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter passkey..."
                required
                className="w-full px-4 py-3 rounded-xl border border-slate-300 text-sm focus:ring-2 focus:ring-blue-600 focus:outline-none"
              />
              <div className="text-[11px] text-slate-400 text-left">
                Default passkey: <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-700">admin</code>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-md transition-colors"
              >
                Unlock Administrator Panel
              </button>
            </form>
          </div>
        ) : (
          /* AUTHENTICATED TABS INTERFACE */
          <div>
            {/* Tab navigation */}
            <div className="flex items-center gap-1 overflow-x-auto border-b border-slate-200 px-6 pt-3 bg-slate-50 scrollbar-none">
              <button
                onClick={() => setActiveTab('students')}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'students'
                    ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Students (14)</span>
              </button>

              <button
                onClick={() => setActiveTab('memories')}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'memories'
                    ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>Yearbook Memories</span>
              </button>

              <button
                onClick={() => setActiveTab('gallery')}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'gallery'
                    ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Image className="w-3.5 h-3.5" />
                <span>Photo Gallery</span>
              </button>

              <button
                onClick={() => setActiveTab('classInfo')}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'classInfo'
                    ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <School className="w-3.5 h-3.5" />
                <span>Class Details</span>
              </button>

              <button
                onClick={() => setActiveTab('wall')}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'wall'
                    ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>Memory Wall ({notes.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('backup')}
                className={`px-3.5 py-2.5 text-xs font-semibold rounded-t-xl transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                  activeTab === 'backup'
                    ? 'bg-white text-blue-700 border-t border-x border-slate-200 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Backup & Data</span>
              </button>
            </div>

            {/* TAB CONTENT PANE */}
            <div className="p-6 max-h-[68vh] overflow-y-auto">
              {/* TAB 1: STUDENTS */}
              {activeTab === 'students' && (
                <div className="space-y-6">
                  {/* Select Student Selector */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                      Select Student to Edit (All 14 Available)
                    </label>
                    <select
                      value={selectedStudentId}
                      onChange={(e) => setSelectedStudentId(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-300 text-sm font-medium bg-white focus:ring-2 focus:ring-blue-600"
                    >
                      {students.map((s) => (
                        <option key={s.id} value={s.id}>
                          Desk #{s.deskNumber}: {s.name} (Row {s.row}, Col {s.col})
                        </option>
                      ))}
                    </select>
                  </div>

                  <form onSubmit={handleSaveStudent} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name (Preserved exact student name) */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Student Name (Official)
                        </label>
                        <input
                          type="text"
                          value={studentForm.name}
                          readOnly
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700 cursor-not-allowed"
                        />
                        <span className="text-[11px] text-slate-400">
                          Official name from the class roster (exact spelling preserved).
                        </span>
                      </div>

                      {/* Accent Color */}
                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Desk & Station Accent Color
                        </label>
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={studentForm.accentColor}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, accentColor: e.target.value })
                            }
                            className="w-10 h-10 rounded border border-slate-200 cursor-pointer"
                          />
                          <input
                            type="text"
                            value={studentForm.accentColor}
                            onChange={(e) =>
                              setStudentForm({ ...studentForm, accentColor: e.target.value })
                            }
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Avatar URL & Upload */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Profile Avatar (URL or Upload Image)
                      </label>
                      <div className="flex items-center gap-3">
                        <input
                          type="text"
                          value={studentForm.avatar}
                          onChange={(e) =>
                            setStudentForm({ ...studentForm, avatar: e.target.value })
                          }
                          placeholder="Image URL..."
                          className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                        <label className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer border border-slate-200 transition-colors flex items-center gap-1.5 shrink-0">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleFileUpload(e, (url) =>
                                setStudentForm({ ...studentForm, avatar: url })
                              )
                            }
                          />
                        </label>
                      </div>
                    </div>

                    {/* Personal Quote */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Personal Quote
                      </label>
                      <input
                        type="text"
                        value={studentForm.personalQuote || ''}
                        onChange={(e) =>
                          setStudentForm({ ...studentForm, personalQuote: e.target.value })
                        }
                        placeholder="e.g. Always strive for your highest potential..."
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    {/* Hobbies (comma-separated) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Hobbies & Interests (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={studentForm.hobbies.join(', ')}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            hobbies: e.target.value
                              .split(',')
                              .map((h) => h.trim())
                              .filter(Boolean),
                          })
                        }
                        placeholder="Chess, Astronomy, Graphic Design"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    {/* Achievements (one per line) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Achievements & Honors (one per line)
                      </label>
                      <textarea
                        value={studentForm.achievements.join('\n')}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            achievements: e.target.value
                              .split('\n')
                              .map((a) => a.trim())
                              .filter(Boolean),
                          })
                        }
                        rows={3}
                        placeholder="Math Olympiad Finalist&#10;School Basketball Champion"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    {/* Favorite Memories (one per line) */}
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Favorite Memories (one per line)
                      </label>
                      <textarea
                        value={studentForm.memories.join('\n')}
                        onChange={(e) =>
                          setStudentForm({
                            ...studentForm,
                            memories: e.target.value
                              .split('\n')
                              .map((m) => m.trim())
                              .filter(Boolean),
                          })
                        }
                        rows={3}
                        placeholder="The snowy day when we built a giant snowman outside our classroom&#10;Navruz festival cooking together"
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    <div className="pt-3 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2"
                      >
                        <Save className="w-4 h-4" />
                        <span>Save Student Profile</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 2: MEMORIES */}
              {activeTab === 'memories' && (
                <div className="space-y-8">
                  {/* Create Memory Form */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Add New Yearbook Memory</span>
                    </h4>

                    <form onSubmit={handleCreateMemory} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Memory Title
                          </label>
                          <input
                            type="text"
                            value={newMemory.title}
                            onChange={(e) =>
                              setNewMemory({ ...newMemory, title: e.target.value })
                            }
                            placeholder="e.g. Graduation Trip to Samarkand"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Date
                          </label>
                          <input
                            type="text"
                            value={newMemory.date}
                            onChange={(e) =>
                              setNewMemory({ ...newMemory, date: e.target.value })
                            }
                            placeholder="e.g. May 2025"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Category
                          </label>
                          <select
                            value={newMemory.category}
                            onChange={(e) =>
                              setNewMemory({
                                ...newMemory,
                                category: e.target.value as Memory['category'],
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          >
                            <option value="Milestones">Milestones</option>
                            <option value="Trips">Trips</option>
                            <option value="Celebrations">Celebrations</option>
                            <option value="Competitions">Competitions</option>
                            <option value="Daily Life">Daily Life</option>
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Photo URL or File Upload
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newMemory.imageUrl}
                              onChange={(e) =>
                                setNewMemory({ ...newMemory, imageUrl: e.target.value })
                              }
                              placeholder="Image URL..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                            />
                            <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer shrink-0">
                              <Upload className="w-3.5 h-3.5 inline mr-1" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, (url) =>
                                    setNewMemory({ ...newMemory, imageUrl: url })
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Description
                        </label>
                        <textarea
                          value={newMemory.description}
                          onChange={(e) =>
                            setNewMemory({ ...newMemory, description: e.target.value })
                          }
                          rows={3}
                          placeholder="What made this moment special?..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                        >
                          Add to Memories
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Memories List */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Existing Memories ({memories.length})
                    </h4>
                    <div className="space-y-3">
                      {memories.map((m) => (
                        <div
                          key={m.id}
                          className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <img
                                src={m.imageUrl}
                                alt={m.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-sm font-bold text-slate-900 truncate">
                                {m.title}
                              </div>
                              <div className="text-xs text-slate-500">
                                {m.category} · {m.date}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteMemory(m.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete memory"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: GALLERY */}
              {activeTab === 'gallery' && (
                <div className="space-y-8">
                  {/* Add Photo Form */}
                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-1.5">
                      <Plus className="w-4 h-4 text-blue-600" />
                      <span>Add Photograph to Gallery</span>
                    </h4>

                    <form onSubmit={handleCreateGalleryPhoto} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Photo Title
                          </label>
                          <input
                            type="text"
                            value={newGalleryPhoto.title}
                            onChange={(e) =>
                              setNewGalleryPhoto({ ...newGalleryPhoto, title: e.target.value })
                            }
                            placeholder="e.g. Spring Morning in Class"
                            required
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Category
                          </label>
                          <select
                            value={newGalleryPhoto.category}
                            onChange={(e) =>
                              setNewGalleryPhoto({
                                ...newGalleryPhoto,
                                category: e.target.value as GalleryItem['category'],
                              })
                            }
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm bg-white"
                          >
                            <option value="Daily Life">Daily Life</option>
                            <option value="Events">Events</option>
                            <option value="Trips">Trips</option>
                            <option value="Projects">Projects</option>
                            <option value="Portraits">Portraits</option>
                          </select>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Image URL or Upload
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newGalleryPhoto.imageUrl}
                              onChange={(e) =>
                                setNewGalleryPhoto({
                                  ...newGalleryPhoto,
                                  imageUrl: e.target.value,
                                })
                              }
                              placeholder="Image URL..."
                              className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                            />
                            <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer shrink-0">
                              <Upload className="w-3.5 h-3.5 inline mr-1" />
                              <span>Upload</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={(e) =>
                                  handleFileUpload(e, (url) =>
                                    setNewGalleryPhoto({ ...newGalleryPhoto, imageUrl: url })
                                  )
                                }
                              />
                            </label>
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-slate-600 mb-1">
                            Date / Season
                          </label>
                          <input
                            type="text"
                            value={newGalleryPhoto.date}
                            onChange={(e) =>
                              setNewGalleryPhoto({ ...newGalleryPhoto, date: e.target.value })
                            }
                            placeholder="e.g. October 2024"
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-slate-600 mb-1">
                          Caption
                        </label>
                        <input
                          type="text"
                          value={newGalleryPhoto.caption}
                          onChange={(e) =>
                            setNewGalleryPhoto({ ...newGalleryPhoto, caption: e.target.value })
                          }
                          placeholder="Short narrative or caption..."
                          className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                        />
                      </div>

                      <div className="flex justify-end">
                        <button
                          type="submit"
                          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold"
                        >
                          Add Photograph
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* Existing Photos */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                      Current Photos ({gallery.length})
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {gallery.map((g) => (
                        <div
                          key={g.id}
                          className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-3"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 shrink-0">
                              <img
                                src={g.imageUrl}
                                alt={g.title}
                                className="w-full h-full object-cover"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <div className="min-w-0">
                              <div className="text-xs font-bold text-slate-900 truncate">
                                {g.title}
                              </div>
                              <div className="text-[11px] text-slate-500">
                                {g.category} · {g.date}
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => deleteGalleryItem(g.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete photo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: CLASS DETAILS */}
              {activeTab === 'classInfo' && (
                <form onSubmit={handleSaveClassInfo} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Class Name
                      </label>
                      <input
                        type="text"
                        value={classInfoForm.className}
                        onChange={(e) =>
                          setClassInfoForm({ ...classInfoForm, className: e.target.value })
                        }
                        required
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        School / Lyceum Name
                      </label>
                      <input
                        type="text"
                        value={classInfoForm.schoolName}
                        onChange={(e) =>
                          setClassInfoForm({ ...classInfoForm, schoolName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Teacher / Homeroom Advisor
                      </label>
                      <input
                        type="text"
                        value={classInfoForm.teacherName}
                        onChange={(e) =>
                          setClassInfoForm({ ...classInfoForm, teacherName: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-600 mb-1">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        value={classInfoForm.academicYear}
                        onChange={(e) =>
                          setClassInfoForm({ ...classInfoForm, academicYear: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Class Motto (Shiorimiz)
                    </label>
                    <input
                      type="text"
                      value={classInfoForm.motto}
                      onChange={(e) =>
                        setClassInfoForm({ ...classInfoForm, motto: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Uzbek Subtitle
                    </label>
                    <input
                      type="text"
                      value={classInfoForm.uzbekSubtitle}
                      onChange={(e) =>
                        setClassInfoForm({ ...classInfoForm, uzbekSubtitle: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Class Story / Description
                    </label>
                    <textarea
                      value={classInfoForm.description}
                      onChange={(e) =>
                        setClassInfoForm({ ...classInfoForm, description: e.target.value })
                      }
                      rows={4}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Official Group Photo URL or Upload
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={classInfoForm.groupPhoto}
                        onChange={(e) =>
                          setClassInfoForm({ ...classInfoForm, groupPhoto: e.target.value })
                        }
                        className="flex-1 px-3 py-2 rounded-lg border border-slate-200 text-sm"
                      />
                      <label className="px-3 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-xs font-semibold cursor-pointer shrink-0">
                        <Upload className="w-3.5 h-3.5 inline mr-1" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleFileUpload(e, (url) =>
                              setClassInfoForm({ ...classInfoForm, groupPhoto: url })
                            )
                          }
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-3 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2"
                    >
                      <Save className="w-4 h-4" />
                      <span>Update Class Information</span>
                    </button>
                  </div>
                </form>
              )}

              {/* TAB 5: MEMORY WALL MODERATION */}
              {activeTab === 'wall' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Visitor and Classmate Notes ({notes.length})
                    </h4>
                    <span className="text-xs text-slate-400">
                      Moderate or remove unwanted notes
                    </span>
                  </div>

                  <div className="space-y-3">
                    {notes.map((note) => (
                      <div
                        key={note.id}
                        className="p-4 bg-white border border-slate-200 rounded-xl flex items-center justify-between gap-4"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm font-bold text-slate-900">
                              {note.author}
                            </span>
                            <span className="text-[11px] text-slate-400">· {note.date}</span>
                          </div>
                          <p className="text-xs text-slate-600 italic">“{note.message}”</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => deleteNote(note.id)}
                            className="p-2 text-slate-400 hover:text-rose-600 transition-colors"
                            title="Delete note"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: BACKUP & DATA */}
              {activeTab === 'backup' && (
                <div className="space-y-6">
                  <div className="p-5 bg-blue-50 rounded-2xl border border-blue-200">
                    <h4 className="text-sm font-bold text-blue-900 mb-1 flex items-center gap-2">
                      <Download className="w-4 h-4" />
                      <span>Export All Class Data</span>
                    </h4>
                    <p className="text-xs text-blue-700 mb-4">
                      Download a complete JSON snapshot of all 14 student profiles, memories, gallery items, and settings.
                    </p>
                    <button
                      onClick={handleExport}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-sm flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download JSON Backup</span>
                    </button>
                  </div>

                  <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
                      <Upload className="w-4 h-4 text-slate-600" />
                      <span>Import / Restore from JSON</span>
                    </h4>
                    <p className="text-xs text-slate-500 mb-3">
                      Paste a previously exported Class Home JSON backup to restore all data:
                    </p>
                    <textarea
                      value={importText}
                      onChange={(e) => setImportText(e.target.value)}
                      rows={4}
                      placeholder="Paste JSON content here..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs font-mono mb-3"
                    />
                    <button
                      onClick={handleImport}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-xl text-xs font-semibold"
                    >
                      Restore Data
                    </button>
                  </div>

                  <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200">
                    <h4 className="text-sm font-bold text-rose-900 mb-1 flex items-center gap-2">
                      <AlertCircle className="w-4 h-4" />
                      <span>Reset to Initial State</span>
                    </h4>
                    <p className="text-xs text-rose-700 mb-4">
                      Restore the original initial 14 students and default memories.
                    </p>
                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            'Are you sure you want to reset all profiles and memories to their defaults?'
                          )
                        ) {
                          resetAllToDefaults();
                          showSuccess('Reset to defaults complete!');
                        }
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-semibold"
                    >
                      Reset to Defaults
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
