import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { BADGES, currentStreak, earnedBadges, newlyUnlocked, pointsFor, totals } from '../rewards.js';

const DAY = 24 * 60 * 60 * 1000;
const NOW = new Date('2026-09-26T12:00:00').getTime();
const session = (overrides = {}) => ({ minutes: 5, rating: 3, photo: null, journal: '', points: 25, finishedAt: NOW, ...overrides });

describe('pointsFor', () => {
  it('gives 2 points per minute plus a rating bonus', () => {
    assert.equal(pointsFor({ minutes: 5, rating: 3 }), 25);
  });

  it('adds bonuses for photo proof and a real journal entry', () => {
    assert.equal(pointsFor({ minutes: 5, rating: 4, photo: 'data:', journal: 'I felt anxious but started anyway' }), 45);
  });

  it('ignores very short journal entries', () => {
    assert.equal(pointsFor({ minutes: 1, rating: 1, journal: 'meh' }), 7);
  });
});

describe('currentStreak', () => {
  it('is 0 with no sessions', () => {
    assert.equal(currentStreak([], NOW), 0);
  });

  it('counts consecutive days ending today', () => {
    const s = [session(), session({ finishedAt: NOW - DAY }), session({ finishedAt: NOW - 2 * DAY })];
    assert.equal(currentStreak(s, NOW), 3);
  });

  it('keeps a streak alive until the end of today', () => {
    const s = [session({ finishedAt: NOW - DAY }), session({ finishedAt: NOW - 2 * DAY })];
    assert.equal(currentStreak(s, NOW), 2);
  });

  it('breaks on a missed day', () => {
    const s = [session(), session({ finishedAt: NOW - 2 * DAY })];
    assert.equal(currentStreak(s, NOW), 1);
  });
});

describe('totals and badges', () => {
  it('sums sessions, minutes and points', () => {
    assert.deepEqual(totals([session(), session({ minutes: 10, points: 30 })]), { count: 2, minutes: 15, points: 55 });
  });

  it('unlocks the first badge after one session', () => {
    assert.ok(earnedBadges([session()]).includes('first'));
  });

  it('reports only newly unlocked badges', () => {
    const before = [session()];
    const after = [session({ photo: 'data:' }), ...before];
    assert.deepEqual(newlyUnlocked(before, after).map((b) => b.id), ['proof']);
  });

  it('defines unique badge ids', () => {
    const ids = BADGES.map((b) => b.id);
    assert.equal(new Set(ids).size, ids.length);
  });
});
