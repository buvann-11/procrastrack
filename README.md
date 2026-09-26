# ProcrasTrack ⏱️

**A tiny focus timer that rewards you for just starting.**

🔗 **Live demo:** https://buvann-11.github.io/procrastrack/

Procrastination is rarely about the task – it's about starting. ProcrasTrack asks you to commit to only a few minutes, lets you write down how you feel while you work, and celebrates you when you finish.

## Features

- **Commit to a task** – name what you're avoiding and pick 5 / 15 / 25 / 45 minutes or a custom length.
- **Accurate focus timer** – progress ring, pause/resume, and the countdown in the browser tab title. Uses wall-clock time, so it stays correct in background tabs.
- **Feelings journal** – note what you're feeling while you work.
- **Celebration** – confetti and a chime when time is up.
- **Self-rating & photo proof** – rate your focus and optionally attach a photo of your work (downscaled automatically).
- **Rewards** – points for every session, daily streaks, and six unlockable badges.
- **Progress dashboard** – sessions, total minutes, points, streak and full history.
- **Private by design** – everything is stored in your browser's `localStorage`; nothing leaves your device.

### How points work

| Action | Points |
| --- | --- |
| Each focused minute | 2 |
| Focus rating (1–4) | 5 × rating |
| Photo proof | 10 |
| Journal entry of 20+ characters | 5 |

## Tech stack

React 19 · Vite 6 · Tailwind CSS 4 · canvas-confetti · react-icons · Web Audio API · GitHub Actions + GitHub Pages

## Getting started

```bash
git clone https://github.com/buvann-11/procrastrack.git
cd procrastrack
npm install
npm run dev        # http://localhost:5173/procrastrack/
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

## Project structure

```
src/
├── App.jsx                 # Screen flow: setup → focus → done, plus tabs
├── components/
│   ├── SetupView.jsx       # Task name + duration picker
│   ├── FocusView.jsx       # Timer ring, journal, pause / give up
│   ├── DoneView.jsx        # Rating, photo proof, points
│   └── Dashboard.jsx       # Stats, badges, history
└── lib/
    ├── rewards.js          # Points, streaks, badges
    ├── storage.js          # Safe localStorage + image downscaling
    └── sound.js            # Web Audio chime
```

## Deployment

Every push to `main` runs `.github/workflows/deploy.yml`, which lints, builds and publishes `dist/` to GitHub Pages. If you fork this repo, change `base` in `vite.config.js` to your repository name.

## Roadmap

- Export / import history as JSON
- Weekly focus chart
- Optional browser notifications when a session ends

## License

MIT © buvann-11
