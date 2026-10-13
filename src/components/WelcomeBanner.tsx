import React, { useState, useEffect } from 'react';
import { Compass, Sparkles, X } from 'lucide-react';

interface WelcomeBannerProps {
  onEnter: () => void;
}

export const WelcomeBanner: React.FC<WelcomeBannerProps> = ({ onEnter }) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already saw welcome modal in this session
    const seen = sessionStorage.getItem('class_home_welcome_seen');
    if (!seen) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('class_home_welcome_seen', 'true');
  };

  const handleStart = () => {
    handleDismiss();
    onEnter();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-300">
      <div
        className="relative w-full max-w-lg bg-[#FFF9F0] rounded-3xl p-6 sm:p-8 shadow-2xl border border-amber-900/15 text-center text-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleDismiss}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 rounded-full"
          aria-label="Skip welcome"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-14 h-14 rounded-2xl bg-[#172554] text-[#FFF9F0] font-serif text-2xl font-bold flex items-center justify-center mx-auto mb-4 shadow-md">
          CH
        </div>

        <h3 className="text-2xl font-extrabold text-[#172554] tracking-tight">
          Welcome to Class Home
        </h3>

        <div className="my-3 p-3 rounded-xl bg-amber-50 border border-amber-900/10">
          <p className="font-serif italic text-sm text-amber-950">
            “Har birimiz alohida hikoya, birgalikda esa unutilmas xotiramiz.”
          </p>
        </div>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-6">
          Step into our virtual 3D classroom celebrating our 14 students. Walk up to individual desks, revisit memorable school trips, explore the photo gallery, and leave a note on our memory wall.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleStart}
            className="w-full sm:w-auto px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <Compass className="w-4 h-4" />
            <span>Enter Our Classroom</span>
          </button>
          <button
            onClick={handleDismiss}
            className="w-full sm:w-auto px-5 py-3 rounded-xl font-medium text-slate-600 hover:text-slate-900 text-sm"
          >
            Skip to Page
          </button>
        </div>
      </div>
    </div>
  );
};
