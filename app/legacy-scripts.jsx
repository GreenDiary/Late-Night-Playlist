'use client';

import { useEffect } from 'react';

const classicScripts = [
  'config.js',
  'playlists.js',
  'state.js',
  'player-ui.js',
  'youtube.js',
  'share.js',
  'contact.js',
  'clock.js',
  'main.js',
  'hero-kinetic.js',
  'donation.js'
];

function loadScript(src, type) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    if (type) script.type = type;
    // Fetch classic scripts together while keeping their dependency order.
    else script.async = false;
    script.src = src;
    script.onload = resolve;
    script.onerror = () => reject(new Error('Could not load ' + src));
    document.body.append(script);
  });
}

export default function LegacyScripts() {
  useEffect(() => {
    if (window.__LATE_NIGHT_PLAYLIST_SCRIPTS_STARTED__) return;
    window.__LATE_NIGHT_PLAYLIST_SCRIPTS_STARTED__ = true;

    (async () => {
      try {
        await Promise.all([
          ...classicScripts.map((file) => loadScript('/js/' + file)),
          loadScript('/js/online-count.js', 'module')
        ]);
      } catch (error) {
        console.error('Late Night Playlist could not start all browser features.', error);
      }
    })();
  }, []);

  return null;
}
