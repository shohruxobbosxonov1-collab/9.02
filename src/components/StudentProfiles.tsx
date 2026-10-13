import React, { useState } from 'react';
import { Search, User, ArrowUpRight, Edit3 } from 'lucide-react';
import { Student } from '../types';
import { useClassData } from '../context/ClassDataContext';

interface StudentProfilesProps {
  onEditStudent?: (student: Student) => void;
}

export const StudentProfiles: React.FC<StudentProfilesProps> = ({ onEditStudent }) => {
  const { students, setSelectedStudent, isAdmin } = useClassData();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredStudents = students.filter((s) =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
  );

  return (
    <section id="students" className="py-20 md:py-28 bg-[#FFF9F0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
              <span>The Cohort</span>
              <span aria-hidden="true">·</span>
              <span>14 Dedicated Spaces</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172554] [text-wrap:balance]">
              Our 14 Classmates
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Every classmate brings an irreplaceable spark to our story. Explore each individual profile, photos, and shared memories.
            </p>
          </div>

          {/* Search Filter */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search classmate..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-800 placeholder-slate-400 shadow-sm"
            />
          </div>
        </div>

        {/* 14 Student Cards Grid (3-in-a-row on desktop as per portfolio skill) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              onClick={() => setSelectedStudent(student)}
              className="group relative bg-white rounded-2xl p-6 border border-slate-200/80 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between cursor-pointer"
            >
              {/* Accent colored top accent */}
              <div
                className="absolute top-0 left-6 right-6 h-1 rounded-b"
                style={{ backgroundColor: student.accentColor }}
              />

              <div>
                <div className="flex items-start justify-between gap-4 mb-5">
                  {/* Avatar */}
                  <div className="relative">
                    <div
                      className="w-20 h-20 rounded-2xl overflow-hidden bg-slate-100 border-2 transition-transform duration-300 group-hover:scale-105"
                      style={{ borderColor: student.accentColor }}
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
                        <div className="w-full h-full flex items-center justify-center text-slate-400 bg-slate-50">
                          <User className="w-8 h-8" />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Desk index metadata */}
                  <div className="text-right">
                    <span className="text-xs font-mono text-slate-500 block">
                      Desk #{student.deskNumber}
                    </span>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Row {student.row}
                    </span>
                  </div>
                </div>

                {/* Name */}
                <h3 className="text-xl font-bold text-[#172554] tracking-tight group-hover:text-blue-600 transition-colors">
                  {student.name}
                </h3>

                {/* Quote / Placeholder */}
                <p className="text-sm text-slate-500 mt-2 line-clamp-2 italic font-serif">
                  {student.personalQuote
                    ? `“${student.personalQuote}”`
                    : 'Personal quote not added yet.'}
                </p>

                {/* Hobbies / Clean Unboxed Metadata */}
                <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-xs text-slate-500 flex-wrap">
                  {student.hobbies && student.hobbies.length > 0 ? (
                    student.hobbies.slice(0, 3).map((h, i) => (
                      <React.Fragment key={i}>
                        <span>{h}</span>
                        {i < Math.min(student.hobbies.length, 3) - 1 && (
                          <span aria-hidden="true">·</span>
                        )}
                      </React.Fragment>
                    ))
                  ) : (
                    <span className="text-slate-400 italic">Hobbies not added yet</span>
                  )}
                </div>
              </div>

              {/* Bottom Action Footer */}
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-blue-600">
                <span className="group-hover:translate-x-0.5 transition-transform">
                  View Profile & Memories
                </span>
                <div className="flex items-center gap-2">
                  {isAdmin && onEditStudent && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditStudent(student);
                      }}
                      className="p-1.5 rounded-md hover:bg-slate-100 text-slate-500 hover:text-slate-900 transition-colors"
                      title="Edit Student"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl border border-slate-200">
            <p className="text-slate-600 font-medium">No student found matching "{searchQuery}"</p>
            <button
              onClick={() => setSearchQuery('')}
              className="mt-3 text-sm text-blue-600 font-semibold hover:underline"
            >
              Clear search
            </button>
          </div>
        )}
      </div>
    </section>
  );
};
