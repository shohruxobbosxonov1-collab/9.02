import React, { useState } from 'react';
import { Camera, Eye, Plus, Calendar } from 'lucide-react';
import { GalleryItem } from '../types';
import { useClassData } from '../context/ClassDataContext';

interface GallerySectionProps {
  onAddPhoto?: () => void;
}

export const GallerySection: React.FC<GallerySectionProps> = ({ onAddPhoto }) => {
  const { gallery, isAdmin, openLightbox } = useClassData();
  const [selectedFilter, setSelectedFilter] = useState<string>('All');

  const categories = ['All', 'Events', 'Trips', 'Daily Life', 'Projects', 'Portraits'];

  const filteredItems =
    selectedFilter === 'All'
      ? gallery
      : gallery.filter((item) => item.category === selectedFilter);

  const handleOpenPhoto = (index: number) => {
    openLightbox(
      filteredItems.map((item) => ({
        imageUrl: item.imageUrl,
        title: item.title,
        caption: item.caption,
        date: item.date,
      })),
      index
    );
  };

  return (
    <section id="gallery" className="py-20 md:py-28 bg-[#FFF9F0] border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
              <span>Photo Archive</span>
              <span aria-hidden="true">·</span>
              <span>Visual Gallery</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172554] [text-wrap:balance]">
              Class Photo Gallery
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Captured frames through the lens of our school years. Click any photograph to view in full resolution.
            </p>
          </div>

          {isAdmin && onAddPhoto && (
            <button
              onClick={onAddPhoto}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 transition-colors self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Add to Gallery</span>
            </button>
          )}
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors ${
                selectedFilter === cat
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 hover:text-slate-900 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Masonry/Grid */}
        {filteredItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredItems.map((item, index) => (
              <div
                key={item.id}
                onClick={() => handleOpenPhoto(index)}
                className="group relative rounded-2xl overflow-hidden bg-white border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white">
                      <Eye className="w-5 h-5" />
                    </span>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-[#172554] truncate group-hover:text-blue-600 transition-colors">
                      {item.title}
                    </h4>
                    {item.caption && (
                      <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                        {item.caption}
                      </p>
                    )}
                  </div>

                  <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.category}</span>
                    {item.date && (
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        <span>{item.date}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8">
            <Camera className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800">No photos in this category yet</h3>
            <p className="text-xs text-slate-500 mt-1">
              Select another filter or log in as administrator to upload photos.
            </p>
            <button
              onClick={() => setSelectedFilter('All')}
              className="mt-4 px-4 py-2 text-xs font-semibold text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
