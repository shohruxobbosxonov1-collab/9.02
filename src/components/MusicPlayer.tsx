import React, { useState, useEffect, useRef } from 'react';
import { Volume2, VolumeX, Play, Pause, Music } from 'lucide-react';

export const MusicPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const timerRef = useRef<number | null>(null);

  // Gentle pentatonic/nostalgic chord frequencies (Hz)
  const chords = [
    [261.63, 329.63, 392.0, 493.88], // Cmaj7
    [220.0, 261.63, 329.63, 440.0],  // Am7
    [174.61, 220.0, 261.63, 329.63], // Fmaj7
    [196.0, 246.94, 293.66, 392.0],  // G
  ];

  const playTone = (freq: number, duration: number, delay: number) => {
    if (!audioCtxRef.current || !gainNodeRef.current) return;
    const ctx = audioCtxRef.current;
    const now = ctx.currentTime + delay;

    const osc = ctx.createOscillator();
    const noteGain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, now);

    // Warm soft bell/piano envelope
    noteGain.gain.setValueAtTime(0, now);
    noteGain.gain.linearRampToValueAtTime(0.12, now + 0.05);
    noteGain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(noteGain);
    noteGain.connect(gainNodeRef.current);

    osc.start(now);
    osc.stop(now + duration);
  };

  const startMusicLoop = () => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audioCtxRef.current = new AudioCtx();
      const gainNode = audioCtxRef.current.createGain();
      gainNode.gain.setValueAtTime(volume, audioCtxRef.current.currentTime);
      gainNode.connect(audioCtxRef.current.destination);
      gainNodeRef.current = gainNode;
    }

    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }

    let chordIndex = 0;
    const loopChord = () => {
      const currentChord = chords[chordIndex % chords.length];
      currentChord.forEach((freq, i) => {
        playTone(freq, 2.4, i * 0.28);
      });
      chordIndex++;
      timerRef.current = window.setTimeout(loopChord, 2200);
    };

    loopChord();
  };

  const stopMusicLoop = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const togglePlay = () => {
    if (isPlaying) {
      stopMusicLoop();
      setIsPlaying(false);
    } else {
      startMusicLoop();
      setIsPlaying(true);
    }
  };

  // Update volume
  useEffect(() => {
    if (gainNodeRef.current && audioCtxRef.current) {
      const targetVol = isMuted ? 0 : volume;
      gainNodeRef.current.gain.setValueAtTime(targetVol * 0.4, audioCtxRef.current.currentTime);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    return () => {
      stopMusicLoop();
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-40 select-none">
      <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-md text-white border border-slate-700/80 p-2 rounded-2xl shadow-xl transition-all">
        {/* Play/Pause Button */}
        <button
          onClick={togglePlay}
          className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white transition-colors active:scale-95 flex items-center justify-center"
          title={isPlaying ? 'Pause Background Music' : 'Play Class Nostalgia Melody'}
          aria-label={isPlaying ? 'Pause music' : 'Play music'}
        >
          {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
        </button>

        {/* Track Label */}
        <div
          onClick={() => setIsExpanded(!isExpanded)}
          className="cursor-pointer pr-2 hidden sm:block"
        >
          <div className="text-xs font-bold flex items-center gap-1.5">
            <Music className="w-3 h-3 text-blue-400" />
            <span>Classroom Melodies</span>
          </div>
          <div className="text-[10px] text-slate-400">
            {isPlaying ? 'Now playing soothing chords' : 'Click play for school ambient'}
          </div>
        </div>

        {/* Volume controls */}
        {isPlaying && (
          <div className="flex items-center gap-1.5 border-l border-slate-700 pl-2">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-1 text-slate-300 hover:text-white"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value));
                if (isMuted) setIsMuted(false);
              }}
              className="w-14 sm:w-20 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
              title="Volume"
            />
          </div>
        )}
      </div>
    </div>
  );
};
