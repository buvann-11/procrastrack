import { useState } from 'react';
import confetti from 'canvas-confetti';
import SetupView from './components/SetupView';
import FocusView from './components/FocusView';
import DoneView from './components/DoneView';
import Dashboard from './components/Dashboard';
import { clearSessions, loadSessions, saveSessions } from './lib/storage';
import { newlyUnlocked, pointsFor } from './lib/rewards';
import { playChime } from './lib/sound';

// Screens: setup -> focus -> done -> setup ...
export default function App() {
  const [tab, setTab] = useState('focus');
  const [screen, setScreen] = useState('setup');
  const [session, setSession] = useState(null); // { task, minutes }
  const [journal, setJournal] = useState('');
  const [sessions, setSessions] = useState(loadSessions);
  const [toast, setToast] = useState(null);

  const start = (cfg) => {
    setSession(cfg);
    setJournal('');
    setScreen('focus');
  };

  const complete = () => {
    setScreen('done');
    confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
    playChime();
  };

  const quit = () => {
    setScreen('setup');
    setSession(null);
  };

  const save = ({ rating, photo }) => {
    const entry = {
      id: crypto.randomUUID?.() ?? String(Date.now()),
      task: session.task,
      minutes: session.minutes,
      journal: journal.trim(),
      rating,
      photo,
      finishedAt: Date.now(),
    };
    entry.points = pointsFor(entry);
    const next = [entry, ...sessions];
    const unlocked = newlyUnlocked(sessions, next);
    const stored = saveSessions(next);
    setSessions(next);
    setToast(
      unlocked.length
        ? `Badge unlocked: ${unlocked.map((b) => `${b.icon} ${b.name}`).join(', ')}`
        : stored
          ? `Saved! +${entry.points} points`
          : 'Saved for this visit (browser storage is full or blocked).',
    );
    setTimeout(() => setToast(null), 3500);
    setSession(null);
    setScreen('setup');
  };

  const clear = () => {
    if (window.confirm('Delete all saved sessions? This cannot be undone.')) {
      clearSessions();
      setSessions([]);
    }
  };

  const focusing = screen !== 'setup';

  return (
    <div className="flex min-h-screen items-start justify-center bg-gradient-to-br from-blue-200 to-indigo-400 px-4 py-10 text-center sm:items-center">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl sm:p-8">
        <nav className="mb-6 grid grid-cols-2 rounded-lg bg-slate-100 p-1 text-sm font-medium">
          {[
            ['focus', 'Focus'],
            ['progress', 'Progress'],
          ].map(([id, label]) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              disabled={focusing && id === 'progress'}
              className={`rounded-md py-1.5 transition disabled:opacity-40 ${
                tab === id ? 'bg-white text-indigo-700 shadow' : 'text-slate-500'
              }`}
            >
              {label}
            </button>
          ))}
        </nav>

        {tab === 'progress' ? (
          <Dashboard sessions={sessions} onClear={clear} />
        ) : screen === 'setup' ? (
          <SetupView onStart={start} />
        ) : screen === 'focus' ? (
          <FocusView {...session} journal={journal} setJournal={setJournal} onComplete={complete} onQuit={quit} />
        ) : (
          <DoneView {...session} journal={journal} onSave={save} />
        )}
      </div>

      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-2 text-sm text-white shadow-lg">
          {toast}
        </div>
      )}
    </div>
  );
}
