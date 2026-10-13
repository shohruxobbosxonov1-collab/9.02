import React, { useEffect } from 'react';
import { X, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { useClassData } from '../context/ClassDataContext';

export const LightboxModal: React.FC = () => {
  const { lightboxMedia, closeLightbox, nextLightbox, prevLightbox } = useClassData();

  const { isOpen, currentIndex, items } = lightboxMedia;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') nextLightbox();
      if (e.key === 'ArrowLeft') prevLightbox();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeLightbox, nextLightbox, prevLightbox]);

  if (!isOpen || items.length === 0) return null;

  const currentItem = items[currentIndex];

  return (
    <div
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200 select-none"
      onClick={closeLightbox}
    >
      {/* Top Header Bar */}
      <div
        className="flex items-center justify-between text-white z-10"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-white/10 px-3 py-1 rounded-full text-slate-300">
            {currentIndex + 1} / {items.length}
          </span>
          <h3 className="text-sm sm:text-base font-bold text-white truncate max-w-xs sm:max-w-md">
            {currentItem.title}
          </h3>
        </div>

        <button
          onClick={closeLightbox}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close lightbox"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Center Image Container with Prev/Next Controls */}
      <div
        className="relative flex-1 flex items-center justify-center my-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {items.length > 1 && (
          <button
            onClick={prevLightbox}
            className="absolute left-2 sm:left-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/10 shadow-lg"
            aria-label="Previous photograph"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        <img
          src={currentItem.imageUrl}
          alt={currentItem.title}
          className="max-h-[75vh] max-w-full object-contain rounded-xl shadow-2xl transition-all duration-300"
          referrerPolicy="no-referrer"
        />

        {items.length > 1 && (
          <button
            onClick={nextLightbox}
            className="absolute right-2 sm:right-4 z-20 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/10 shadow-lg"
            aria-label="Next photograph"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Bottom Caption and Date */}
      <div
        className="text-center text-white max-w-2xl mx-auto z-10"
        onClick={(e) => e.stopPropagation()}
      >
        {currentItem.caption && (
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {currentItem.caption}
          </p>
        )}
        {currentItem.date && (
          <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 mt-2 font-mono">
            <Calendar className="w-3.5 h-3.5" />
            <span>{currentItem.date}</span>
          </div>
        )}
      </div>
    </div>
  );
};
