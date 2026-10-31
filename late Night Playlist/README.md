# Late Night Playlist

A calm, anime-inspired night room for listening to curated music. The site is free to use, works on desktop and mobile, and does not require an account or app.

**Live site:** [latenightplaylist.web.app](https://latenightplaylist.web.app)

## Features

- Hindi, Bengali, Punjabi, and Lo-fi & instrumental playlists, played through YouTube.
- Player controls for play/pause, previous/next, shuffle, volume, and seeking.
- Night-room artwork, live clock, responsive layout, WhatsApp sharing, and contact link.
- Approximate live online count powered by Firebase Realtime Database.

## Project files

| File or folder | Purpose |
| --- | --- |
| `index.html` | Page structure and scripts/styles loaded by the browser |
| `assets/` | Room background image and crescent-moon favicon |
| `css/` | Page, player, About section, motion, and responsive styles |
| `js/main.js` | Starts the page features |
| `js/config.js` | Player display settings and thumbnail helper |
| `js/playlists.js` | Playlist names and YouTube playlist IDs |
| `js/player-ui.js`, `js/state.js`, `js/youtube.js` | Player interface, playback state, and YouTube integration |
| `js/clock.js`, `js/share.js`, `js/contact.js` | Clock, WhatsApp sharing, and contact button |
| `js/contact-address.js` | Editable contact email address |
| `js/online-count.js`, `js/online-count-config.js` | Firebase-powered online count and its web-app settings |
| `firebase.json`, `.firebaserc` | Firebase Hosting sites, redirects, and project aliases |
| `firebase.database.rules.json` | Realtime Database rules for the online count |
| `.gitignore` | Keeps local cache and machine-specific files out of Git |

## Run and publish

Preview the site through a local web server, such as VS Code Live Server. To publish Hosting changes, open a terminal in this project folder and run `firebase deploy --only hosting`. The site uses YouTube embeds; playlist availability and playback conditions are controlled by YouTube and playlist owners.

**Contact:** [techie.lnp@gmail.com](mailto:techie.lnp@gmail.com)
