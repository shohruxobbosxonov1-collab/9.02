import React from 'react';
import { Student } from '../types';
import { useClassData } from '../context/ClassDataContext';
import { User, Eye } from 'lucide-react';

export const SeatingChart2D: React.FC = () => {
  const { students, setSelectedStudent } = useClassData();

  // Group students by row for classroom layout
  const rows = [
    { rowNumber: 1, label: 'Row 1 (Front)', students: students.filter((s) => s.row === 1) },
    { rowNumber: 2, label: 'Row 2', students: students.filter((s) => s.row === 2) },
    { rowNumber: 3, label: 'Row 3', students: students.filter((s) => s.row === 3) },
    { rowNumber: 4, label: 'Row 4 (Back)', students: students.filter((s) => s.row === 4) },
  ];

  return (
    <div className="w-full bg-[#1b2b27] rounded-2xl p-6 sm:p-8 text-[#FFF9F0] border border-emerald-900/40 shadow-2xl relative overflow-hidden">
      {/* Blackboard Header */}
      <div className="max-w-2xl mx-auto mb-10 p-5 rounded-xl border-4 border-amber-900/60 bg-[#12231e] text-center shadow-inner relative">
        <div className="absolute top-2 left-4 text-xs font-mono text-emerald-400/60">CHALKBOARD</div>
        <h3 className="font-serif text-2xl sm:text-3xl font-bold tracking-wider text-emerald-100">
          CLASS HOME
        </h3>
        <p className="text-xs sm:text-sm font-serif italic text-emerald-200/80 mt-1">
          “Birimiz hamma uchun, hammamiz birimiz uchun”
        </p>
        <div className="mt-2 text-[11px] text-emerald-400/80">
          Teacher’s Podium & Interactive Blackboard
        </div>
      </div>

      {/* Classroom Desk Grid */}
      <div className="max-w-4xl mx-auto space-y-6">
        {rows.map((r) => (
          <div key={r.rowNumber} className="space-y-2">
            <div className="text-xs font-semibold text-emerald-300/70 uppercase tracking-wider text-left pl-2">
              {r.label}
            </div>

            <div
              className={`grid gap-4 ${
                r.rowNumber === 4
                  ? 'grid-cols-1 sm:grid-cols-2 max-w-lg mx-auto'
                  : 'grid-cols-2 sm:grid-cols-4'
              }`}
            >
              {r.students.map((student) => (
                <button
                  key={student.id}
                  onClick={() => setSelectedStudent(student)}
                  className="group relative p-4 rounded-xl bg-[#233a33] hover:bg-[#2b473e] border border-emerald-800/60 hover:border-emerald-400 transition-all text-left shadow-md hover:shadow-xl hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                >
                  {/* Accent strip */}
                  <div
                    className="absolute top-0 left-0 right-0 h-1.5 rounded-t-xl"
                    style={{ backgroundColor: student.accentColor }}
                  />

                  <div className="flex items-center gap-3">
                    {/* Student Avatar */}
                    <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-700 border-2 border-emerald-500/40 shrink-0 group-hover:scale-105 transition-transform">
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
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="text-[11px] font-mono text-emerald-300/80">
                        Desk #{student.deskNumber}
                      </div>
                      <div className="text-sm font-bold text-white truncate group-hover:text-emerald-200">
                        {student.name}
                      </div>
                    </div>
                  </div>

                  {/* Hover cue */}
                  <div className="mt-3 pt-2 border-t border-emerald-900/60 flex items-center justify-between text-[11px] text-emerald-300/70 group-hover:text-emerald-100">
                    <span>View Student</span>
                    <Eye className="w-3.5 h-3.5" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center text-xs text-emerald-300/60 font-sans">
        Click any student desk to open their individual yearbook profile and memories.
      </div>
    </div>
  );
};
