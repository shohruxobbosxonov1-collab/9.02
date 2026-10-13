import React, { useState } from 'react';
import { Users, GraduationCap, School, Calendar, Heart, Sparkles, Edit3 } from 'lucide-react';
import { useClassData } from '../context/ClassDataContext';
import confetti from 'canvas-confetti';

interface AboutSectionProps {
  onEditClassInfo?: () => void;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ onEditClassInfo }) => {
  const { classInfo, students, memories, gallery, isAdmin, openLightbox } = useClassData();
  const [revealedMotto, setRevealedMotto] = useState(false);

  const handleMottoClick = () => {
    setRevealedMotto(true);
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#3B82F6', '#10B981', '#F59E0B', '#FB7185', '#C4B5FD'],
    });
  };

  return (
    <section id="about" className="py-20 md:py-28 bg-[#FFF9F0] border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
              <span>Our Identity</span>
              <span aria-hidden="true">·</span>
              <span>Collective Story</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172554] [text-wrap:balance]">
              About Our Class
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              14 unique personalities united by mutual respect, shared triumphs, and unforgettable memories.
            </p>
          </div>

          {isAdmin && onEditClassInfo && (
            <button
              onClick={onEditClassInfo}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors self-start md:self-auto"
            >
              <Edit3 className="w-4 h-4" />
              <span>Edit Class Details</span>
            </button>
          )}
        </div>

        {/* Group Photo Showcase */}
        <div className="relative rounded-3xl overflow-hidden border border-amber-900/15 shadow-xl bg-slate-900 mb-12 group">
          <div
            className="aspect-[16/9] sm:aspect-[21/9] max-h-[480px] w-full overflow-hidden cursor-pointer"
            onClick={() =>
              openLightbox([
                {
                  imageUrl: classInfo.groupPhoto,
                  title: `${classInfo.className} - Official Cohort Photograph`,
                  caption: classInfo.description,
                  date: classInfo.academicYear,
                },
              ])
            }
          >
            <img
              src={classInfo.groupPhoto}
              alt="Class Group Photo"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
          </div>

          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4 text-white">
            <div>
              <span className="text-xs font-mono uppercase tracking-wider text-blue-300">
                Official Cohort Photograph
              </span>
              <h3 className="text-xl sm:text-2xl font-bold tracking-tight">
                {classInfo.className} · {classInfo.academicYear}
              </h3>
            </div>
            <div className="text-xs text-slate-300 font-mono">
              14 Students · 1 Class Family
            </div>
          </div>
        </div>

        {/* Class Overview Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Main Description */}
          <div className="lg:col-span-7 bg-white p-8 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#172554] mb-4">
                The Story of Our Cohort
              </h3>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {classInfo.description}
              </p>

              {/* Uzbek Subtitle Box */}
              <div className="mt-6 p-4 rounded-xl bg-amber-50/70 border border-amber-900/10">
                <p className="text-sm sm:text-base font-serif italic text-amber-950">
                  “{classInfo.uzbekSubtitle}”
                </p>
              </div>
            </div>

            {/* Meta tags (unboxed text with separators) */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
              <span className="flex items-center gap-1.5">
                <School className="w-3.5 h-3.5 text-blue-600" />
                <span>{classInfo.schoolName}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-blue-600" />
                <span>{classInfo.teacherName}</span>
              </span>
              <span aria-hidden="true">·</span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-blue-600" />
                <span>{classInfo.academicYear}</span>
              </span>
            </div>
          </div>

          {/* Interactive Class Motto Card (Click to reveal/celebrate) */}
          <div
            onClick={handleMottoClick}
            className="lg:col-span-5 bg-gradient-to-br from-[#172554] to-slate-900 text-white p-8 rounded-3xl shadow-xl flex flex-col justify-between cursor-pointer group hover:border-blue-400 border border-transparent transition-all relative overflow-hidden"
          >
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono uppercase tracking-wider text-blue-300">
                  Class Motto · Shiorimiz
                </span>
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:rotate-12 transition-transform" />
              </div>
              <p className="text-xl sm:text-2xl font-serif italic font-bold leading-snug text-amber-100 mt-2">
                “{classInfo.motto}”
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/10 relative z-10 flex items-center justify-between text-xs text-slate-300">
              <span>Click to celebrate motto</span>
              <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            </div>
          </div>
        </div>

        {/* Real Class Statistics Strip (Quantitative Precision) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-6 bg-white rounded-2xl border border-slate-200/80 shadow-sm text-center">
          <div className="p-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-[#172554] font-mono tabular-nums">
              {students.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
              Classmates
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-blue-600 font-mono tabular-nums">
              {memories.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
              Yearbook Memories
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-amber-600 font-mono tabular-nums">
              {gallery.length}
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
              Archived Photographs
            </div>
          </div>

          <div className="p-2">
            <div className="text-3xl sm:text-4xl font-extrabold text-emerald-600 font-mono tabular-nums">
              100%
            </div>
            <div className="text-xs text-slate-500 font-medium mt-1 uppercase tracking-wider">
              Unbreakable Bond
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
