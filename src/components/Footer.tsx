import React from 'react';
import { Heart, Lock, ArrowUp } from 'lucide-react';
import { useClassData } from '../context/ClassDataContext';

interface FooterProps {
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin }) => {
  const { classInfo } = useClassData();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-slate-950 text-white py-14 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 pb-10 border-b border-slate-800">
          {/* Brand & Motto */}
          <div className="text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
              <span className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-serif text-sm font-bold">
                CH
              </span>
              <span className="font-bold text-lg text-white">Class Home</span>
            </div>
            <p className="text-xs text-slate-400 font-serif italic max-w-sm">
              “{classInfo.uzbekSubtitle}”
            </p>
          </div>

          {/* Clean text navigation links */}
          <div className="flex items-center gap-6 text-xs text-slate-400 flex-wrap justify-center">
            <a href="#classroom" className="hover:text-white transition-colors">
              Our Classroom
            </a>
            <a href="#students" className="hover:text-white transition-colors">
              Students (14)
            </a>
            <a href="#memories" className="hover:text-white transition-colors">
              Memories
            </a>
            <a href="#gallery" className="hover:text-white transition-colors">
              Gallery
            </a>
            <a href="#memory-wall" className="hover:text-white transition-colors">
              Memory Wall
            </a>
            <a href="#about" className="hover:text-white transition-colors">
              About
            </a>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenAdmin}
              className="px-3 py-1.5 rounded-lg border border-slate-800 hover:border-slate-700 text-xs text-slate-400 hover:text-white flex items-center gap-1.5 transition-colors"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <button
              onClick={scrollToTop}
              className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
              title="Back to top"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quiet copyright & 14 students tribute */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            Dedicated to our 14 classmates: Diyorbek, Muhammadshukur, Muhriddin, Xadichaxon, Ra'nogul, Zilola, Gulshona, Komilabonu, Hikmatillo, Marjona, Saodatxon, Otabek, Solijon, and Muhammadmuslim.
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>for our lifelong memories · {classInfo.academicYear}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
