import { useState } from 'react';
import { FaRegSadTear, FaRegMeh, FaRegSmile, FaRegGrinStars } from 'react-icons/fa';
import { fileToThumbnail } from '../lib/storage';
import { pointsFor } from '../lib/rewards';

const RATINGS = [
  { value: 1, Icon: FaRegSadTear, label: 'Distracted' },
  { value: 2, Icon: FaRegMeh, label: 'So-so' },
  { value: 3, Icon: FaRegSmile, label: 'Focused' },
  { value: 4, Icon: FaRegGrinStars, label: 'In the zone' },
];

export default function DoneView({ task, minutes, journal, onSave }) {
  const [rating, setRating] = useState(null);
  const [photo, setPhoto] = useState(null);
  const [photoError, setPhotoError] = useState('');

  const preview = pointsFor({ minutes, rating, photo, journal });

  const pickPhoto = async (e) => {
    setPhotoError('');
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setPhoto(await fileToThumbnail(file));
    } catch (err) {
      setPhotoError(err.message);
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-2xl font-bold text-green-600">Well done! 🎉</h2>
        <p className="mt-1 text-slate-600">
          You spent {minutes} min on <span className="font-medium">{task}</span>.
        </p>
      </div>

      <div className="text-left">
        <h3 className="mb-2 font-medium text-slate-700">How focused were you?</h3>
        <div className="grid grid-cols-4 gap-2">
          {RATINGS.map(({ value, label, ...r }) => {
            const RatingIcon = r.Icon;
            return (
            <button
              key={value}
              onClick={() => setRating(value)}
              aria-pressed={rating === value}
              className={`flex flex-col items-center rounded-lg border p-2 transition ${
                rating === value
                  ? 'border-yellow-400 bg-yellow-50 text-yellow-500'
                  : 'border-slate-200 text-slate-400 hover:text-slate-600'
              }`}
            >
              <RatingIcon className="text-3xl" />
              <span className="mt-1 text-xs">{label}</span>
            </button>
            );
          })}
        </div>
      </div>

      <div className="text-left">
        <label className="mb-2 block font-medium text-slate-700" htmlFor="proof">
          Upload a photo proof <span className="text-sm text-slate-400">(optional, +10 pts)</span>
        </label>
        <input id="proof" type="file" accept="image/*" onChange={pickPhoto} className="text-sm" />
        {photoError && <p className="mt-1 text-sm text-red-600">{photoError}</p>}
        {photo && (
          <img src={photo} alt="Your proof" className="mt-3 max-h-40 rounded-lg border object-cover" />
        )}
      </div>

      <p className="rounded-lg bg-yellow-50 p-3 font-semibold text-yellow-700">
        🎁 You earned <span className="text-xl">{preview}</span> points!
      </p>

      <button
        onClick={() => onSave({ rating, photo })}
        disabled={!rating}
        className="w-full rounded-xl bg-indigo-600 py-3 font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-40"
      >
        {rating ? 'Save & Do Another Session' : 'Pick a rating to save'}
      </button>
    </div>
  );
}
