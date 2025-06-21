import { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Howl } from 'howler';
import {
  FaRegSadTear,
  FaRegMeh,
  FaRegSmile,
  FaRegGrinStars,
} from 'react-icons/fa';

export default function App() {
  // ⏲️  Change this to a smaller number (e.g., 10) while testing.
  const initialTime = 300; // 5 minutes = 300 seconds

  const [started, setStarted] = useState(false);
  const [journal, setJournal] = useState('');
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [completed, setCompleted] = useState(false);
  const [rating, setRating] = useState(null);

  /* ---------------- TIMER & CELEBRATION ---------------- */
  useEffect(() => {
    if (started && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }

    if (timeLeft === 0 && started && !completed) {
      setCompleted(true);

      // 🎉 Confetti burst
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });

      // 🔔 Reward sound
      const sound = new Howl({
        src: [
          'https://assets.mixkit.co/sfx/preview/mixkit-achievement-bell-600.mp3',
        ],
      });
      sound.play();
    }
  }, [timeLeft, started, completed]);

  /* ---------------- HELPERS ---------------- */
  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const reset = () => {
    console.log('Rating submitted:', rating);
    setStarted(false);
    setCompleted(false);
    setJournal('');
    setRating(null);
    setTimeLeft(initialTime);
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-200 to-indigo-400 px-4 text-center">
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full">
        {/* --------- START PAGE --------- */}
        {!started && !completed && (
          <>
            <h1 className="text-3xl font-bold mb-4 text-indigo-700">
              ProcrasTrack
            </h1>
            <button
              onClick={() => setStarted(true)}
              className="bg-indigo-600 text-white px-6 py-3 rounded-xl text-lg hover:bg-indigo-700 transition"
            >
              Start Task
            </button>
          </>
        )}

        {/* --------- IN‑PROGRESS PAGE --------- */}
        {started && !completed && (
          <>
            <h2 className="text-2xl font-semibold mb-2 text-gray-800">
              What are you feeling?
            </h2>
            <textarea
              value={journal}
              onChange={(e) => setJournal(e.target.value)}
              placeholder="Type here..."
              className="w-full p-3 rounded-lg border mb-4 resize-none"
              rows={3}
            />
            <div className="text-5xl font-mono text-indigo-700">
              {formatTime(timeLeft)}
            </div>
          </>
        )}

        {/* --------- COMPLETED PAGE --------- */}
        {completed && (
          <>
            <h2 className="text-2xl font-bold text-green-600 mb-4">
              Well Done! 🎉
            </h2>
            <p className="text-gray-700 mb-4">
              You just beat procrastination!
            </p>

            {/* ⭐ Rating */}
            <div className="mb-4">
              <h3 className="text-left font-medium mb-2">
                How focused were you?
              </h3>
              <div className="flex justify-between text-3xl">
                <button
                  onClick={() => setRating(1)}
                  className={
                    rating === 1 ? 'text-yellow-500' : 'text-gray-400'
                  }
                >
                  <FaRegSadTear />
                </button>
                <button
                  onClick={() => setRating(2)}
                  className={
                    rating === 2 ? 'text-yellow-500' : 'text-gray-400'
                  }
                >
                  <FaRegMeh />
                </button>
                <button
                  onClick={() => setRating(3)}
                  className={
                    rating === 3 ? 'text-yellow-500' : 'text-gray-400'
                  }
                >
                  <FaRegSmile />
                </button>
                <button
                  onClick={() => setRating(4)}
                  className={
                    rating === 4 ? 'text-yellow-500' : 'text-gray-400'
                  }
                >
                  <FaRegGrinStars />
                </button>
              </div>
            </div>

            {/* 📸 Photo Upload */}
            <label className="block mb-2 font-medium text-left">
              Upload a photo proof:
            </label>
            <input
              type="file"
              accept="image/*"
              className="mb-4"
              onChange={(e) =>
                console.log('Photo selected:', e.target.files[0])
              }
            />

            {/* 🏅 Reward message */}
            <p className="text-yellow-600 font-semibold mb-6">
              🎁 You earned a reward!{' '}
              <span className="italic">(More reward logic coming soon)</span>
            </p>

            <button
              onClick={reset}
              className="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition"
            >
              Do Another Session
            </button>
          </>
        )}
      </div>
    </div>
  );
}
