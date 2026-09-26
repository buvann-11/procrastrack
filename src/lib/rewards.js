// Reward logic: points per session, daily streaks and unlockable badges.

export function pointsFor({ minutes, rating, photo, journal }) {
  let pts = minutes * 2; // 2 points per focused minute
  if (rating) pts += rating * 5; // honest self-rating bonus
  if (photo) pts += 10; // proof bonus
  if (journal && journal.trim().length >= 20) pts += 5; // reflection bonus
  return pts;
}

const dayKey = (ts) => {
  const d = new Date(ts);
  return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
};

// Consecutive days (ending today or yesterday) with at least one session.
export function currentStreak(sessions, now = Date.now()) {
  const days = new Set(sessions.map((s) => dayKey(s.finishedAt)));
  const oneDay = 24 * 60 * 60 * 1000;
  let cursor = now;
  if (!days.has(dayKey(cursor))) cursor -= oneDay; // streak survives until end of today
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak += 1;
    cursor -= oneDay;
  }
  return streak;
}

export function totals(sessions) {
  return sessions.reduce(
    (acc, s) => ({
      count: acc.count + 1,
      minutes: acc.minutes + s.minutes,
      points: acc.points + s.points,
    }),
    { count: 0, minutes: 0, points: 0 },
  );
}

export const BADGES = [
  { id: 'first', icon: '🌱', name: 'First Step', test: (t) => t.count >= 1, hint: 'Finish 1 session' },
  { id: 'five', icon: '🔥', name: 'On a Roll', test: (t) => t.count >= 5, hint: 'Finish 5 sessions' },
  { id: 'hour', icon: '⏳', name: 'Hour of Power', test: (t) => t.minutes >= 60, hint: 'Focus for 60 minutes total' },
  { id: 'streak3', icon: '📅', name: 'Three-Day Streak', test: (t, st) => st >= 3, hint: 'Focus 3 days in a row' },
  { id: 'proof', icon: '📸', name: 'Show Your Work', test: (t, st, s) => s.some((x) => x.photo), hint: 'Upload a photo proof' },
  { id: 'century', icon: '🏆', name: 'Centurion', test: (t) => t.points >= 100, hint: 'Earn 100 points' },
];

export function earnedBadges(sessions) {
  const t = totals(sessions);
  const st = currentStreak(sessions);
  return BADGES.filter((b) => b.test(t, st, sessions)).map((b) => b.id);
}

// Badges unlocked by the newest session (for the celebration screen).
export function newlyUnlocked(before, after) {
  const prev = new Set(earnedBadges(before));
  return BADGES.filter((b) => earnedBadges(after).includes(b.id) && !prev.has(b.id));
}
