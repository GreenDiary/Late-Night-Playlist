# Late Night Playlist

A responsive browser-based music player for late-night listening. The project uses the Next.js App Router and exports static HTML, CSS, and JavaScript for Firebase Hosting. It does not require a Next.js server at runtime.

## Features

- Hindi, Bengali, Punjabi, and lo-fi/instrumental YouTube playlists.
- Play, pause, previous, next, shuffle, volume, and seek controls.
- Responsive nighttime layout, animated hero, and local clock.
- About and FAQ content, WhatsApp sharing, and an optional contact section.
- Optional donation links and QR image.
- Optional Firebase Realtime Database online count.

## Run locally

Install Node.js 20.9 or later, then from the project folder run npm install and npm run dev.

The predev step copies project assets, stylesheets, browser scripts, robots.txt, and sitemap.xml into the generated public folder. The source versions remain in assets, css, and js.

## Build and host

Run npm run build. Next.js creates the static production site in out.

To publish this copy to a Firebase project you control, sign in with the Firebase CLI, select your project with firebase use --add, then run firebase deploy --only hosting.

This public source copy has no .firebaserc file or project-specific Hosting target. The generated .firebaserc is ignored by Git. Hosting serves the static out folder; no Next.js server is required.

The optional Realtime Database rules in firebase.database.rules.json allow public reads of the /presence count and restrict writes to the matching anonymous user. Review that data-access choice for your own project before deploying database rules. Hosting-only deployment does not publish those rules.

## Optional local configuration

The repository intentionally omits personal contact details, donation destinations, the donation QR image, Firebase project settings, and Google Search Console verification files.

To configure an optional feature locally, copy its example file to the matching .local.js file and add your own value:

- js/contact-address.example.js → js/contact-address.local.js
- js/donation-config.example.js → js/donation-config.local.js
- js/online-count-config.example.js → js/online-count-config.local.js

Place a donation QR image at assets/donation-qr.png if you want that option. The .local.js files, QR image, Firebase project alias, and google*.html verification files are ignored by Git. The build script will include a root-level Google verification file in the static output if you add one locally.

The contact, donation, and online-count controls stay hidden until configured. Firebase Web App settings are client-side settings and will be visible in the built browser files when you enable the counter. Never add service-account keys, private keys, passwords, or admin credentials to this website or repository.

## Project structure

- app/page.jsx — page structure and player interface.
- app/layout.jsx — metadata, structured data, and page styles.
- app/legacy-scripts.jsx — loads the browser-side player and optional integrations.
- assets/, css/, js/ — canonical images, styles, and browser logic.
- scripts/sync-public-assets.mjs — creates the public assets used by Next.js.
- next.config.mjs — configures static export.
- firebase.json — generic Firebase Hosting and database-rules mapping.
- robots.txt, sitemap.xml — crawler access and the public site sitemap.

Generated folders such as public, .next, and out, along with node_modules, are not part of the GitHub source copy.

The player uses YouTube's embedded player; playback availability is controlled by YouTube and playlist owners.
