import React from 'react';
import { Compass, Users, Sparkles, BookOpen, Heart, ArrowDown } from 'lucide-react';

interface HeroProps {
  onEnterClassroom: () => void;
  onExploreStudents: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onEnterClassroom, onExploreStudents }) => {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28 bg-[#FFF9F0]">
      {/* Decorative Subtle Floaters (Clean SVG icons & geometry, no slop) */}
      <div className="absolute top-12 left-[8%] text-blue-400/40 pointer-events-none select-none animate-bounce duration-1000 hidden lg:block" style={{ animationDuration: '6s' }}>
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M22 2L11 13" />
          <path d="M22 2L15 22L11 13L2 9L22 2Z" />
        </svg>
      </div>

      <div className="absolute top-28 right-[10%] text-amber-500/30 pointer-events-none select-none hidden lg:block animate-pulse" style={{ animationDuration: '4s' }}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </div>

      <div className="absolute bottom-16 left-[14%] text-rose-400/30 pointer-events-none select-none hidden lg:block">
        <BookOpen className="w-8 h-8" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Clean unboxed kicker */}
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700">
              <span>Digital Classroom Archive</span>
              <span aria-hidden="true">·</span>
              <span>14 Classmates</span>
              <span aria-hidden="true">·</span>
              <span>Class 11-A</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-[#172554] leading-[1.1] [text-wrap:balance]">
              Our Class, <span className="text-blue-600 font-serif italic">Our Memories.</span>
            </h1>

            {/* Uzbek Subtitle */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-900/10">
              <p className="text-base sm:text-lg font-serif italic text-amber-950 leading-relaxed">
                “Har birimiz alohida hikoya, birgalikda esa unutilmas xotiramiz.”
              </p>
              <p className="text-xs text-amber-800/80 mt-1 font-sans">
                Each of us is a unique story, and together we are an unforgettable memory.
              </p>
            </div>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-xl">
              Welcome to our digital home. An interactive virtual classroom built to honor our 14 students, revisit cherished milestones, explore shared photographs, and keep our bond alive across the years.
            </p>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onEnterClassroom}
                className="relative group px-6 py-3.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg transition-all active:scale-95 flex items-center gap-2.5 overflow-hidden"
              >
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity" />
                <span className="relative flex items-center gap-2 text-sm sm:text-base font-semibold">
                  <Compass className="w-5 h-5 text-white animate-spin" style={{ animationDuration: '12s' }} />
                  Enter Our Classroom
                </span>
              </button>

              <button
                onClick={onExploreStudents}
                className="px-5 py-3.5 rounded-xl font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-sm transition-all text-sm sm:text-base flex items-center gap-2"
              >
                <Users className="w-4 h-4 text-slate-500" />
                <span>Meet the 14 Students</span>
              </button>
            </div>

            {/* Clean Metadata Adjacency (No pills) */}
            <div className="pt-4 flex items-center gap-3 text-xs text-slate-500">
              <span>Interactive 3D Desks</span>
              <span aria-hidden="true">·</span>
              <span>Verified Profiles</span>
              <span aria-hidden="true">·</span>
              <span>Yearbook Timeline</span>
              <span aria-hidden="true">·</span>
              <span>Live Memory Wall</span>
            </div>
          </div>

          {/* Right Column: Visual Container with Classroom Preview */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-amber-900/15 shadow-xl bg-slate-900 group">
              <img
                src="/src/assets/images/classroom_hero_banner_1791877402377.jpg"
                alt="Sunlit Classroom with wooden desks and chalkboard"
                className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

              {/* Overlay card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-[#FFF9F0]/95 backdrop-blur-md border border-amber-900/10 text-left shadow-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-[#172554]">
                      Virtual Classroom 3D
                    </h3>
                    <p className="text-xs text-slate-600 mt-0.5">
                      14 dedicated student desks with personal nameplates
                    </p>
                  </div>
                  <button
                    onClick={onEnterClassroom}
                    className="p-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                    title="Launch 3D view"
                  >
                    <ArrowDown className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
