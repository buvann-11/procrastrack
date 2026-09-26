import { useEffect, useRef, useState } from 'react';

const fmt = (sec) => {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

// Countdown based on wall-clock time, so it stays accurate even when the
// browser throttles timers in a background tab.
export default function FocusView({ task, minutes, journal, setJournal, onComplete, onQuit }) {
  const total = minutes * 60;
  const [remaining, setRemaining] = useState(total);
  const [paused, setPaused] = useState(false);
  const endRef = useRef(Date.now() + total * 1000);
  const doneRef = useRef(false);

  useEffect(() => {
    if (paused) return undefined;
    endRef.current = Date.now() + remaining * 1000;
    const id = setInterval(() => {
      const left = Math.max(0, Math.round((endRef.current - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0 && !doneRef.current) {
        doneRef.current = true;
        clearInterval(id);
        onComplete();
      }
    }, 250);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paused]);

  useEffect(() => {
    document.title = `${fmt(remaining)} · ${task}`;
    return () => {
      document.title = 'ProcrasTrack';
    };
  }, [remaining, task]);

  const progress = 1 - remaining / total;
  const r = 70;
  const circ = 2 * Math.PI * r;

  return (
    <div className="space-y-5">
      <p className="text-sm uppercase tracking-wide text-slate-400">Focusing on</p>
      <h2 className="text-xl font-semibold text-slate-800">{task}</h2>

      <div className="relative mx-auto h-44 w-44">
        <svg viewBox="0 0 160 160" className="h-full w-full -rotate-90">
          <circle cx="80" cy="80" r={r} fill="none" stroke="#e0e7ff" strokeWidth="10" />
          <circle
            cx="80"
            cy="80"
            r={r}
            fill="none"
            stroke="#4f46e5"
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circ}
            strokeDashoffset={circ * (1 - progress)}
            style={{ transition: 'stroke-dashoffset 0.3s linear' }}
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center font-mono text-4xl text-indigo-700">
          {fmt(remaining)}
        </div>
      </div>

      <label className="block text-left">
        <span className="font-medium text-slate-700">What are you feeling?</span>
        <textarea
          value={journal}
          onChange={(e) => setJournal(e.target.value)}
          placeholder="Bored? Anxious? Write it down – it helps."
          className="mt-2 w-full resize-none rounded-lg border border-slate-300 p-3 focus:border-indigo-500 focus:outline-none"
          rows={3}
        />
      </label>

      <div className="flex gap-3">
        <button
          onClick={() => setPaused((p) => !p)}
          className="flex-1 rounded-lg bg-indigo-100 py-2 font-medium text-indigo-700 hover:bg-indigo-200"
        >
          {paused ? 'Resume' : 'Pause'}
        </button>
        <button
          onClick={onQuit}
          className="flex-1 rounded-lg border border-slate-300 py-2 font-medium text-slate-600 hover:bg-slate-50"
        >
          Give up
        </button>
      </div>
    </div>
  );
}
