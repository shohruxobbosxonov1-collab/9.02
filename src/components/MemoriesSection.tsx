import React, { useState } from 'react';
import { Calendar, Plus, Eye, Sparkles } from 'lucide-react';
import { Memory } from '../types';
import { useClassData } from '../context/ClassDataContext';

interface MemoriesSectionProps {
  onAddMemory?: () => void;
  onEditMemory?: (memory: Memory) => void;
}

export const MemoriesSection: React.FC<MemoriesSectionProps> = ({
  onAddMemory,
  onEditMemory,
}) => {
  const { memories, isAdmin, openLightbox } = useClassData();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Milestones', 'Trips', 'Celebrations', 'Competitions', 'Daily Life'];

  const filteredMemories =
    selectedCategory === 'All'
      ? memories
      : memories.filter((m) => m.category === selectedCategory);

  const handleOpenLightbox = (index: number) => {
    openLightbox(
      filteredMemories.map((m) => ({
        imageUrl: m.imageUrl,
        title: m.title,
        caption: m.description,
        date: m.date,
      })),
      index
    );
  };

  return (
    <section id="memories" className="py-20 md:py-28 bg-[#FFF9F0] border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
              <span>Digital Yearbook</span>
              <span aria-hidden="true">·</span>
              <span>Cherished Chapters</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172554] [text-wrap:balance]">
              Our Memories & Milestones
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Chronicles of school excursions, science triumphs, holiday celebrations, and spontaneous moments of joy.
            </p>
          </div>

          {isAdmin && onAddMemory && (
            <button
              onClick={onAddMemory}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add Class Memory</span>
            </button>
          )}
        </div>

        {/* Interactive Filter Tabs (Functional segmented buttons) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Timeline / Memory Cards Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {filteredMemories.map((memory, index) => (
            <div
              key={memory.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              {/* Image Container with Scrim */}
              <div
                className="relative h-64 sm:h-72 overflow-hidden cursor-pointer bg-slate-900"
                onClick={() => handleOpenLightbox(index)}
              >
                <img
                  src={memory.imageUrl}
                  alt={memory.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

                {/* View cue */}
                <div className="absolute top-4 right-4 p-2 rounded-full bg-black/40 text-white backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
                  <Eye className="w-4 h-4" />
                </div>

                {/* Bottom image overlay metadata */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs text-white">
                  <span className="font-mono text-white/90">{memory.category}</span>
                  {memory.date && (
                    <span className="flex items-center gap-1.5 text-white/90">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>{memory.date}</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Text Info */}
              <div className="p-6 sm:p-8 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-[#172554] tracking-tight mb-2 group-hover:text-blue-600 transition-colors">
                    {memory.title}
                  </h3>
                  <p className="text-sm text-slate-600 leading-relaxed">
                    {memory.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="font-mono">Chapter #{index + 1}</span>
                  {isAdmin && onEditMemory && (
                    <button
                      onClick={() => onEditMemory(memory)}
                      className="text-blue-600 hover:underline font-semibold"
                    >
                      Edit Memory
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredMemories.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600 font-medium">No memories found in this category.</p>
            <button
              onClick={() => setSelectedCategory('All')}
              className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
            >
              Show all memories
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
