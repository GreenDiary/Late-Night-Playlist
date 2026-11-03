# Late Night Playlist

A responsive, browser-based music player for late-night listening. It uses the YouTube IFrame Player API and includes Hindi, Bengali, Punjabi, and lo-fi/instrumental playlists.

## Features

- Play, pause, previous, next, shuffle, volume, and seek controls.
- Keyboard playback shortcut with Space, plus standard keyboard access to controls.
- Vinyl artwork that uses the current song's YouTube thumbnail when available and the built-in CSS vinyl when no usable thumbnail is available.
- Audio-wave animation while music is playing, including beside the selected playlist category.
- Responsive nighttime layout, live clock, About section, and WhatsApp sharing.
- Optional contact, donation, and online-count integrations. These use ignored local configuration files and are hidden until configured.

## Run locally

Serve `index.html` with a local web server, such as the VS Code Live Server extension. The player needs an internet connection to load the YouTube IFrame Player API and playlist videos.

## Optional local configuration

The public copy contains no API key, contact address, payment QR, Firebase project identifier, deployment configuration, or site-verification token. To enable an optional integration, create its matching `.local.js` file from the corresponding `.example.js` template, enter your own values, and keep the local file untracked. `.gitignore` excludes these local files and the donation QR asset.

- `js/contact-address.example.js` — public contact email used by the Contact control.
- `js/donation-config.example.js` — donation link and optional local QR image path.
- `js/online-count-config.example.js` — Firebase web-app settings for the optional online counter.

Do not paste private keys, passwords, or service-account credentials into this static site. The online counter is disabled unless its local configuration is present and complete.

## Project structure

- `index.html` — page content and script/style loading.
- `assets/` — room background, favicon, interface icons, and fonts.
- `css/` — page, player, motion, donation, and responsive styles.
- `js/config.js`, `js/playlists.js` — player settings and playlist IDs.
- `js/state.js`, `js/player-ui.js`, `js/youtube.js` — playback state, controls, and YouTube integration.
- `js/share.js`, `js/clock.js`, `js/hero-kinetic.js` — sharing, clock, and hero motion.
- `js/contact.js`, `js/donation.js`, `js/online-count.js` — optional integrations, disabled until locally configured.

The playlist IDs in `js/playlists.js` point to public YouTube playlists. Playlist availability and playback are controlled by YouTube and the playlist owners.
