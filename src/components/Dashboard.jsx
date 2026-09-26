import { BADGES, currentStreak, earnedBadges, totals } from '../lib/rewards';

const EMOJI = { 1: '😢', 2: '😐', 3: '🙂', 4: '🤩' };

export default function Dashboard({ sessions, onClear }) {
  const t = totals(sessions);
  const streak = currentStreak(sessions);
  const earned = new Set(earnedBadges(sessions));

  return (
    <div className="space-y-5 text-left">
      <div className="grid grid-cols-4 gap-2 text-center">
        <Stat label="Sessions" value={t.count} />
        <Stat label="Minutes" value={t.minutes} />
        <Stat label="Points" value={t.points} />
        <Stat label="Streak" value={`${streak}🔥`} />
      </div>

      <div>
        <h3 className="mb-2 font-semibold text-slate-700">Badges</h3>
        <div className="grid grid-cols-3 gap-2">
          {BADGES.map((b) => (
            <div
              key={b.id}
              title={b.hint}
              className={`rounded-lg border p-2 text-center text-xs ${
                earned.has(b.id) ? 'border-yellow-300 bg-yellow-50' : 'border-slate-200 opacity-40 grayscale'
              }`}
            >
              <div className="text-2xl">{b.icon}</div>
              <div className="font-medium">{b.name}</div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h3 className="font-semibold text-slate-700">History</h3>
          {sessions.length > 0 && (
            <button onClick={onClear} className="text-xs text-slate-400 hover:text-red-600">
              Clear history
            </button>
          )}
        </div>
        {sessions.length === 0 ? (
          <p className="text-sm text-slate-400">No sessions yet. Your first one is 5 minutes away.</p>
        ) : (
          <ul className="max-h-72 space-y-2 overflow-y-auto pr-1">
            {sessions.map((s) => (
              <li key={s.id} className="flex gap-3 rounded-lg border border-slate-200 p-2">
                {s.photo && <img src={s.photo} alt="" className="h-12 w-12 rounded object-cover" />}
                <div className="min-w-0 flex-1">
                  <div className="flex justify-between gap-2">
                    <span className="truncate font-medium text-slate-800">{s.task}</span>
                    <span className="shrink-0 text-sm text-indigo-600">+{s.points}</span>
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(s.finishedAt).toLocaleString()} · {s.minutes} min · {EMOJI[s.rating]}
                  </div>
                  {s.journal && <p className="mt-1 truncate text-xs italic text-slate-500">“{s.journal}”</p>}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-lg bg-indigo-50 p-2">
      <div className="text-lg font-bold text-indigo-700">{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}
