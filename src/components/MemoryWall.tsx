import React, { useState } from 'react';
import { MessageSquare, Heart, Plus, Trash2, X, Send } from 'lucide-react';
import { MemoryNote } from '../types';
import { useClassData } from '../context/ClassDataContext';

export const MemoryWall: React.FC = () => {
  const { notes, addNote, deleteNote, likeNote, isAdmin } = useClassData();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [author, setAuthor] = useState('');
  const [message, setMessage] = useState('');
  const [color, setColor] = useState<MemoryNote['color']>('amber');
  const [errorMsg, setErrorMsg] = useState('');

  const colorStyles: Record<MemoryNote['color'], { bg: string; border: string; tape: string }> = {
    amber: { bg: 'bg-amber-100/90', border: 'border-amber-200', tape: 'bg-amber-300/60' },
    blue: { bg: 'bg-sky-100/90', border: 'border-sky-200', tape: 'bg-sky-300/60' },
    rose: { bg: 'bg-rose-100/90', border: 'border-rose-200', tape: 'bg-rose-300/60' },
    emerald: { bg: 'bg-emerald-100/90', border: 'border-emerald-200', tape: 'bg-emerald-300/60' },
    purple: { bg: 'bg-purple-100/90', border: 'border-purple-200', tape: 'bg-purple-300/60' },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!author.trim() || author.trim().length < 2) {
      setErrorMsg('Please enter your name (at least 2 characters).');
      return;
    }
    if (!message.trim() || message.trim().length < 5) {
      setErrorMsg('Please write a heartfelt message (at least 5 characters).');
      return;
    }
    if (message.length > 300) {
      setErrorMsg('Message cannot exceed 300 characters.');
      return;
    }

    addNote(author.trim(), message.trim(), color);
    setAuthor('');
    setMessage('');
    setIsFormOpen(false);
  };

  return (
    <section id="memory-wall" className="py-20 md:py-28 bg-[#FFF9F0] border-t border-amber-900/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-blue-700 mb-2">
              <span>Interactive Board</span>
              <span aria-hidden="true">·</span>
              <span>Classmates & Visitors</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[#172554] [text-wrap:balance]">
              The Memory Wall
            </h2>
            <p className="text-base text-slate-600 mt-2 max-w-xl">
              Leave a wish, thank a teacher, recall a hilarious moment, or send warm greetings to our 14 students.
            </p>
          </div>

          <button
            onClick={() => setIsFormOpen(true)}
            className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-sm transition-all active:scale-95 flex items-center gap-2 self-start md:self-auto text-xs sm:text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Leave a Memory Note</span>
          </button>
        </div>

        {/* Note Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {notes.map((note) => {
            const style = colorStyles[note.color] || colorStyles.amber;
            return (
              <div
                key={note.id}
                className={`relative p-6 rounded-2xl ${style.bg} border ${style.border} shadow-md hover:shadow-lg transition-transform hover:-translate-y-1 flex flex-col justify-between`}
              >
                {/* Visual "Washi Tape" element */}
                <div
                  className={`w-16 h-4 absolute -top-2 left-1/2 -translate-x-1/2 ${style.tape} rounded-sm shadow-xs rotate-[-2deg]`}
                />

                <div>
                  <p className="text-slate-800 text-sm font-serif italic leading-relaxed pt-2">
                    “{note.message}”
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-black/5 flex items-center justify-between text-xs text-slate-600">
                  <div>
                    <span className="font-bold text-slate-900 block">{note.author}</span>
                    <span className="text-[11px] text-slate-500">{note.date}</span>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => likeNote(note.id)}
                      className="flex items-center gap-1 text-slate-600 hover:text-rose-600 transition-colors p-1"
                      title="Send love"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-500/20 text-rose-500" />
                      <span className="font-mono text-xs">{note.likes}</span>
                    </button>

                    {isAdmin && (
                      <button
                        onClick={() => deleteNote(note.id)}
                        className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                        title="Delete note"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Note Submission Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
            <div
              className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-200"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-[#172554]">
                  Add Note to Memory Wall
                </h3>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="p-1.5 rounded-full text-slate-400 hover:text-slate-700"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Diyorbek or Classmate"
                    maxLength={40}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Message / Xotira
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Share a wish, joke, or favorite memory..."
                    maxLength={300}
                    rows={4}
                    required
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  <div className="text-right text-[11px] text-slate-400 mt-1">
                    {message.length} / 300
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-2">
                    Sticky Note Color
                  </label>
                  <div className="flex items-center gap-3">
                    {(['amber', 'blue', 'rose', 'emerald', 'purple'] as MemoryNote['color'][]).map(
                      (c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setColor(c)}
                          className={`w-7 h-7 rounded-full border-2 transition-transform ${
                            color === c ? 'scale-125 border-slate-900 shadow-md' : 'border-transparent'
                          } ${
                            c === 'amber'
                              ? 'bg-amber-300'
                              : c === 'blue'
                              ? 'bg-sky-300'
                              : c === 'rose'
                              ? 'bg-rose-300'
                              : c === 'emerald'
                              ? 'bg-emerald-300'
                              : 'bg-purple-300'
                          }`}
                        />
                      )
                    )}
                  </div>
                </div>

                <div className="pt-4 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white shadow-sm flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Pin Note</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
