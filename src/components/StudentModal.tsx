import React, { useEffect } from 'react';
import { X, ArrowLeft, Heart, Award, Sparkles, BookOpen, Camera, Edit3, User } from 'lucide-react';
import { Student } from '../types';
import { useClassData } from '../context/ClassDataContext';

interface StudentModalProps {
  student: Student | null;
  onClose: () => void;
  onEditStudent?: (student: Student) => void;
}

export const StudentModal: React.FC<StudentModalProps> = ({
  student,
  onClose,
  onEditStudent,
}) => {
  const { isAdmin, openLightbox } = useClassData();

  // Close on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!student) return null;

  const scrollToClassroom = () => {
    onClose();
    const elem = document.getElementById('classroom');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-3xl bg-[#FFF9F0] rounded-3xl shadow-2xl border border-amber-900/15 overflow-hidden text-slate-800 my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon with Accent Color */}
        <div
          className="h-28 sm:h-36 relative"
          style={{
            background: `linear-gradient(135deg, ${student.accentColor} 0%, #172554 100%)`,
          }}
        >
          <div className="absolute top-4 right-4 flex items-center gap-2">
            {isAdmin && onEditStudent && (
              <button
                onClick={() => onEditStudent(student)}
                className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white backdrop-blur-sm transition-colors text-xs flex items-center gap-1.5 px-3"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Profile</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black/20 hover:bg-black/40 text-white backdrop-blur-sm transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="absolute bottom-3 left-6 text-white/80 text-xs font-mono">
            Class Home · Desk #{student.deskNumber}
          </div>
        </div>

        {/* Profile Card Body */}
        <div className="px-6 sm:px-10 pb-8 pt-0">
          {/* Avatar & Main Info Lockup */}
          <div className="flex flex-col sm:flex-row items-start sm:items-end gap-5 -mt-14 sm:-mt-16 mb-6">
            <div
              className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden bg-white border-4 border-white shadow-xl shrink-0"
              style={{ boxShadow: `0 10px 25px -5px ${student.accentColor}40` }}
            >
              {student.avatar ? (
                <img
                  src={student.avatar}
                  alt={student.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    (e.target as HTMLElement).style.display = 'none';
                  }}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-slate-100 text-slate-400">
                  <User className="w-12 h-12" />
                </div>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-xs font-mono uppercase tracking-wider text-blue-700">
                Classmate Profile
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#172554] tracking-tight">
                {student.name}
              </h2>
              <div className="flex items-center gap-2 text-xs text-slate-500 mt-1">
                <span>Desk #{student.deskNumber}</span>
                <span aria-hidden="true">·</span>
                <span>Row {student.row}, Column {student.col}</span>
              </div>
            </div>
          </div>

          {/* Personal Quote */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-900/10 mb-6">
            <div className="text-xs font-semibold uppercase tracking-wider text-amber-900/70 mb-1 flex items-center gap-1.5">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Personal Quote</span>
            </div>
            <p className="text-sm sm:text-base font-serif italic text-slate-800">
              {student.personalQuote
                ? `“${student.personalQuote}”`
                : 'Quote not added yet.'}
            </p>
          </div>

          {/* Grid of Attributes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {/* Hobbies & Interests */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                <span>Hobbies & Interests</span>
              </h4>
              {student.hobbies && student.hobbies.length > 0 ? (
                <div className="flex items-center gap-2 text-sm text-slate-700 flex-wrap">
                  {student.hobbies.map((h, i) => (
                    <React.Fragment key={i}>
                      <span className="font-medium">{h}</span>
                      {i < student.hobbies.length - 1 && <span aria-hidden="true" className="text-slate-400">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Hobby not added yet.</p>
              )}
            </div>

            {/* Achievements */}
            <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-500" />
                <span>Achievements & Honors</span>
              </h4>
              {student.achievements && student.achievements.length > 0 ? (
                <ul className="space-y-1.5 text-sm text-slate-700">
                  {student.achievements.map((ach, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-amber-500 font-bold">✓</span>
                      <span>{ach}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-xs text-slate-400 italic">Achievements not added yet.</p>
              )}
            </div>
          </div>

          {/* Favorite Memories */}
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm mb-6">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span>Favorite Class Memories</span>
            </h4>
            {student.memories && student.memories.length > 0 ? (
              <div className="space-y-2">
                {student.memories.map((m, i) => (
                  <div key={i} className="text-sm text-slate-700 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    {m}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">
                Memories to be shared soon.
              </p>
            )}
          </div>

          {/* Personal Photo Gallery */}
          {student.photos && student.photos.length > 0 && (
            <div className="mb-6">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                <Camera className="w-3.5 h-3.5 text-blue-600" />
                <span>Photographs ({student.photos.length})</span>
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {student.photos.map((pUrl, i) => (
                  <div
                    key={i}
                    onClick={() =>
                      openLightbox(
                        student.photos.map((p, idx) => ({
                          imageUrl: p,
                          title: `${student.name} - Photo #${idx + 1}`,
                        })),
                        i
                      )
                    }
                    className="aspect-square rounded-xl overflow-hidden bg-slate-100 cursor-pointer border border-slate-200 hover:opacity-90 transition-opacity"
                  >
                    <img
                      src={pUrl}
                      alt={`${student.name} memory ${i + 1}`}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Bar */}
          <div className="pt-4 border-t border-slate-200/80 flex items-center justify-between">
            <button
              onClick={scrollToClassroom}
              className="text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Classroom View</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs sm:text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
