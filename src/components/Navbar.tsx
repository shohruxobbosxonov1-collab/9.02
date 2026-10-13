import React, { useState } from 'react';
import { Sparkles, Lock, Menu, X, Compass, ShieldCheck } from 'lucide-react';
import { useClassData } from '../context/ClassDataContext';

interface NavbarProps {
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAdmin }) => {
  const { isAdmin } = useClassData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FFF9F0]/90 backdrop-blur-md border-b border-amber-900/10 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-8">
        {/* Zone 1: Brand Wordmark (Single text element) */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="flex items-center gap-2 text-xl font-bold tracking-tight text-[#172554] whitespace-nowrap shrink-0 hover:text-blue-600 transition-colors"
        >
          <span className="w-8 h-8 rounded-lg bg-[#172554] text-[#FFF9F0] flex items-center justify-center font-serif text-lg font-bold shadow-sm">
            CH
          </span>
          <span>Class Home</span>
        </a>

        {/* Zone 2: 4–5 single-line clean navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-700">
          <button
            onClick={() => scrollToSection('classroom')}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Our Classroom
          </button>
          <button
            onClick={() => scrollToSection('students')}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Students
          </button>
          <button
            onClick={() => scrollToSection('memories')}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Memories
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection('memory-wall')}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            Memory Wall
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="hover:text-blue-600 transition-colors whitespace-nowrap shrink-0"
          >
            About
          </button>
        </nav>

        {/* Zone 3: 1 Primary Action + Admin Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAdmin}
            title={isAdmin ? 'Admin Console (Authenticated)' : 'Admin Access'}
            className={`p-2 rounded-lg text-xs font-medium border transition-colors flex items-center gap-1.5 ${
              isAdmin
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {isAdmin ? <ShieldCheck className="w-4 h-4 text-emerald-600" /> : <Lock className="w-4 h-4 text-slate-500" />}
            <span className="hidden sm:inline">{isAdmin ? 'Admin Active' : 'Admin'}</span>
          </button>

          <button
            onClick={() => scrollToSection('classroom')}
            className="px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 active:scale-95 rounded-lg shadow-sm hover:shadow transition-all whitespace-nowrap shrink-0 flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Explore Classroom</span>
          </button>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg focus:outline-none"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-amber-900/10 bg-[#FFF9F0] px-4 pt-2 pb-6 space-y-2">
          <button
            onClick={() => scrollToSection('classroom')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-amber-100/50"
          >
            Our Classroom
          </button>
          <button
            onClick={() => scrollToSection('students')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-amber-100/50"
          >
            Students (14)
          </button>
          <button
            onClick={() => scrollToSection('memories')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-amber-100/50"
          >
            Memories
          </button>
          <button
            onClick={() => scrollToSection('gallery')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-amber-100/50"
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToSection('memory-wall')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-amber-100/50"
          >
            Memory Wall
          </button>
          <button
            onClick={() => scrollToSection('about')}
            className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-slate-800 hover:bg-amber-100/50"
          >
            About Our Class
          </button>
        </div>
      )}
    </header>
  );
};
