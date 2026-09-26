// Small, fail-safe wrapper around localStorage.
// Private windows or blocked storage just fall back to in-memory state.

const KEY = 'procrastrack.sessions.v1';
const MAX_SESSIONS = 200;

export function loadSessions() {
  try {
    const raw = localStorage.getItem(KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveSessions(sessions) {
  const trimmed = sessions.slice(0, MAX_SESSIONS);
  try {
    localStorage.setItem(KEY, JSON.stringify(trimmed));
    return true;
  } catch {
    // Most likely the quota was hit by photos: retry without them.
    try {
      const light = trimmed.map((s) => ({ ...s, photo: null }));
      localStorage.setItem(KEY, JSON.stringify(light));
    } catch {
      /* storage unavailable – keep data in memory only */
    }
    return false;
  }
}

export function clearSessions() {
  try {
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

// Downscale an uploaded image so it fits comfortably in localStorage.
export function fileToThumbnail(file, maxSide = 320) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file.'));
      return;
    }
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read that file.'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('That image could not be opened.'));
      img.onload = () => {
        const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.src = reader.result;
    };
    reader.readAsDataURL(file);
  });
}
