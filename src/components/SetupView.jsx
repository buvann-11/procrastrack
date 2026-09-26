import { useState } from 'react';

const PRESETS = [5, 15, 25, 45];

export default function SetupView({ onStart }) {
  const [task, setTask] = useState('');
  const [minutes, setMinutes] = useState(5);
  const [custom, setCustom] = useState('');

  const effective = custom ? Number(custom) : minutes;
  const valid = task.trim().length > 0 && effective >= 1 && effective <= 180;

  const submit = (e) => {
    e.preventDefault();
    if (valid) onStart({ task: task.trim(), minutes: effective });
  };

  return (
    <form onSubmit={submit} className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-indigo-700">ProcrasTrack</h1>
        <p className="mt-1 text-slate-500">
          Just start. Commit to a few minutes and beat procrastination.
        </p>
      </div>

      <label className="block text-left">
        <span className="font-medium text-slate-700">What are you avoiding?</span>
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          placeholder="e.g. Read chapter 4 of CLRS"
          maxLength={80}
          className="mt-2 w-full rounded-lg border border-slate-300 p-3 focus:border-indigo-500 focus:outline-none"
          autoFocus
        />
      </label>

      <div className="text-left">
        <span className="font-medium text-slate-700">For how long?</span>
        <div className="mt-2 grid grid-cols-4 gap-2">
          {PRESETS.map((m) => (
            <button
              type="button"
              key={m}
              onClick={() => {
                setMinutes(m);
                setCustom('');
              }}
              className={`rounded-lg border py-2 font-medium transition ${
                !custom && minutes === m
                  ? 'border-indigo-600 bg-indigo-600 text-white'
                  : 'border-slate-300 text-slate-700 hover:border-indigo-400'
              }`}
            >
              {m} min
            </button>
          ))}
        </div>
        <input
          type="number"
          min={1}
          max={180}
          value={custom}
          onChange={(e) => setCustom(e.target.value)}
          placeholder="Custom minutes (1–180)"
          className="mt-2 w-full rounded-lg border border-slate-300 p-2 text-sm focus:border-indigo-500 focus:outline-none"
        />
      </div>

      <button
        type="submit"
        disabled={!valid}
        className="w-full rounded-xl bg-indigo-600 px-6 py-3 text-lg font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Start Task
      </button>
    </form>
  );
}
