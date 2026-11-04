function AudioWave() {
  return (
    <span className="audio-wave" aria-hidden="true">
      <span /><span /><span /><span /><span />
    </span>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 32 32" aria-hidden="true">
      <path d="M16 3.5a12.4 12.4 0 0 0-10.6 18.8l-1.1 6 6.1-1.6A12.4 12.4 0 1 0 16 3.5Z" />
      <path d="M11.2 9.7c-.4 0-.8.2-1.1.6-.4.5-1 1.3-1 2.6s1 3 1.2 3.3c.2.3 2 3.2 4.9 4.3 2.4 1 2.9.8 3.5.7.5-.1 1.8-.7 2.1-1.4.3-.7.3-1.3.2-1.4-.1-.1-.4-.2-.8-.4l-2.1-1c-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.3-.7.1-.3-.1-1.2-.5-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.4.3-.6.1-.2 0-.4 0-.6l-.9-2.2c-.2-.5-.4-.5-.7-.5h-.6Z" />
    </svg>
  );
}

function VolumeOnIcon() {
  return (
    <svg className="volume-on-icon" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="M16 9a4 4 0 0 1 0 6m3-9a8 8 0 0 1 0 12" />
    </svg>
  );
}

function VolumeOffIcon() {
  return (
    <svg className="volume-off-icon hidden" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9v6h4l5 4V5L8 9H4Z" />
      <path d="m17 9 5 6m0-6-5 6" />
    </svg>
  );
}

export default function Home() {
  return (
    <>
      <div className="site-backdrop" aria-hidden="true" />
      <main>
        <section className="hero" id="top" aria-labelledby="site-title">
          <div className="hero-shade" aria-hidden="true" />
          <header className="site-header">
            <div className="brand-stack">
              <a className="brand" href="#top" aria-label="Late Night Playlist home">
                <span className="brand-moon" aria-hidden="true">☾</span>
                <span>Late Night Playlist</span>
              </a>
              <div id="online-counter" className="online-counter hidden" role="status" aria-live="polite" aria-atomic="true">
                <span className="online-dot" aria-hidden="true" />
                <span id="online-count-value">—</span>
                <span>Online</span>
              </div>
            </div>
            <nav aria-label="Page navigation">
              <a className="donation-toggle" href="#about">About</a>
              <button id="donation-toggle" className="donation-toggle" type="button" aria-haspopup="dialog" aria-expanded="false" aria-controls="donation-dialog">Motivate me</button>
              <button id="share-whatsapp" className="share-whatsapp" type="button" aria-label="Share Late Night Playlist on WhatsApp" title="Share on WhatsApp">
                <WhatsAppIcon />
              </button>
            </nav>
          </header>

          <dialog id="donation-dialog" className="donation-dialog" aria-labelledby="donation-heading" aria-describedby="donation-instruction donation-message">
            <div className="donation-panel">
              <div className="donation-heading-row">
                <h2 id="donation-heading">Motivate me</h2>
                <button id="donation-close" className="donation-close" type="button" aria-label="Close donation window">×</button>
              </div>
              <img id="donation-qr" className="donation-qr" alt="UPI QR code for supporting Late Night Playlist" width="2560" height="2419" decoding="async" />
              <p id="donation-instruction" className="donation-instruction">Scan this QR with any UPI app</p>
              <p id="donation-message">Even your smallest contribution can motivate my urge to continue running this room, thank you in advance❤️</p>
              <div className="donation-actions">
                <a id="donation-coffee-link" className="donation-coffee" target="_blank" rel="noopener noreferrer">
                  <img data-src="/assets/coffee-cup.svg" alt="" aria-hidden="true" width="34" height="28" decoding="async" />
                  <span>Buy me a coffee</span>
                </a>
                <a id="donation-save-qr" className="donation-coffee donation-save-qr" download="late-night-playlist-qr.png" aria-label="Save QR image to your device">
                  <img data-src="/assets/download-file.svg" alt="" aria-hidden="true" width="28" height="28" decoding="async" />
                  <span>Save QR</span>
                </a>
              </div>
            </div>
          </dialog>

          <div className="hero-copy">
            <time id="live-time" className="live-time" aria-label="Local time">--:--</time>
            <p id="live-date" className="live-date">A quiet night</p>
            <h1 id="site-title" className="hero-kinetic" aria-label="Your room for late nights.">
              <span className="hero-kinetic__line" aria-hidden="true">Your room</span><br />
              <span className="hero-kinetic__line" aria-hidden="true">for <em>late nights.</em></span>
            </h1>
          </div>

          <div id="music-console" className="music-console" aria-label="Late night playlist player">
            <div className="player-column">
              <div id="youtube-stage" className="youtube-stage hidden">
                <div id="youtube-player" />
              </div>
              <div className="glass-player">
                <div className="vinyl-art" aria-hidden="true"><span>☾</span></div>
                <div className="music-choice">
                  <span className="playing-label">NOW PLAYING <AudioWave /></span>
                  <span id="player-hint" className="player-hint">Choose a playlist to begin</span>
                  <span id="active-playlist-name" className="active-playlist-name">Choose a playlist</span>
                </div>
                <div className="player-controls" role="group" aria-label="Music controls">
                  <div className="volume-control">
                    <button id="volume-button" className="control-button small-control volume-button" type="button" aria-label="Volume" aria-expanded="false" aria-controls="volume-panel" disabled>
                      <VolumeOnIcon />
                      <VolumeOffIcon />
                    </button>
                    <div id="volume-panel" className="volume-panel hidden">
                      <span className="volume-track" aria-hidden="true"><span className="volume-fill" /></span>
                      <span className="volume-readout" aria-hidden="true">
                        <svg className="volume-panel-icon" viewBox="0 0 24 24">
                          <path d="M4 9v6h4l5 4V5L8 9H4Z" />
                          <path d="M16 9a4 4 0 0 1 0 6" />
                        </svg>
                        <output id="volume-value" htmlFor="volume-slider">70</output>
                      </span>
                      <label className="sr-only" htmlFor="volume-slider">Playback volume</label>
                      <input id="volume-slider" type="range" min="0" max="100" defaultValue="70" disabled />
                    </div>
                  </div>
                  <button id="shuffle-button" className="control-button small-control" type="button" aria-label="Shuffle playlist" aria-pressed="false" disabled>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M16 3h5v5M4 20 21 3M21 16v5h-5M4 4l5 5m4 4 8 8" /></svg>
                  </button>
                  <button id="previous-button" className="control-button" type="button" aria-label="Previous track" disabled>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 5v14M19 6l-9 6 9 6z" /></svg>
                  </button>
                  <button id="play-button" className="control-button play-control" type="button" aria-label="Play" disabled>
                    <svg className="play-icon" viewBox="0 0 24 24" aria-hidden="true"><path d="m8 5 11 7-11 7z" /></svg>
                    <svg className="pause-icon hidden" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 5h4v14H7zM15 5h4v14h-4z" /></svg>
                  </button>
                  <button id="next-button" className="control-button" type="button" aria-label="Next track" disabled>
                    <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 5v14M5 6l9 6-9 6z" /></svg>
                  </button>
                  <button id="playlist-toggle" className="playlist-label" type="button" aria-expanded="false" aria-controls="playlist-list">PLAYLIST</button>
                </div>
                <div className="seek-row">
                  <time id="seek-current">0:00</time>
                  <label className="sr-only" htmlFor="seek-slider">Seek through the current track</label>
                  <input id="seek-slider" type="range" min="0" max="100" defaultValue="0" disabled />
                  <time id="seek-duration">0:00</time>
                </div>
              </div>
            </div>
            <aside id="playlist-list" className="playlist-list hidden" aria-label="Choose a playlist">
              <p>PLAYLISTS</p>
              <button className="playlist-option" type="button" data-playlist="hindi" aria-pressed="false"><span className="playlist-option-content"><span>Hindi</span><AudioWave /></span></button>
              <button className="playlist-option" type="button" data-playlist="bengali" aria-pressed="false"><span className="playlist-option-content"><span>Bengali</span><AudioWave /></span></button>
              <button className="playlist-option" type="button" data-playlist="punjabi" aria-pressed="false"><span className="playlist-option-content"><span>Punjabi</span><AudioWave /></span></button>
              <button className="playlist-option" type="button" data-playlist="lofi" aria-pressed="false"><span className="playlist-option-content"><span>Lo-fi &amp; instrumental</span><AudioWave /></span></button>
            </aside>
          </div>
        </section>

        <section id="about" className="about-section" aria-labelledby="about-heading">
          <h2 id="about-heading">About Late Night Playlist</h2>
          <div className="faq-list">
            <details open>
              <summary>What is Late Night Playlist?</summary>
              <p>A free browser-based music player for late-night listening, with Hindi, Bengali, Punjabi, and lo-fi/instrumental YouTube playlists. No sign-up or app download required.</p>
            </details>
            <details>
              <summary>Does it work on a phone?</summary>
              <p>Yes. The player is designed for mobile screens, with large play, skip, and seek controls.</p>
            </details>
            <details>
              <summary>Where does the music play from?</summary>
              <p>The songs play through YouTube&apos;s embedded player — nothing is hosted here, all rights remain with the artists and labels.</p>
            </details>
            <details>
              <summary>Is Late Night Playlist free to listen to?</summary>
              <p>Yes. Late Night Playlist remains free to use forever in your browser I promise, and requires no sign-up or app download.</p>
            </details>
            <details>
              <summary>CAN I support the project?</summary>
              <p>Yes, To continue running this website, YOU CAN support it by scanning the UPI QR code or buying me a coffee through the links in the Motivate me button.</p>
            </details>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-row">
            <a className="brand" href="#top"><span className="brand-moon" aria-hidden="true">☾</span><span>Late Night Playlist</span></a>
            <button id="contact-toggle" className="footer-contact" type="button" aria-expanded="false" aria-controls="contact-email">Contact</button>
          </div>
          <p id="contact-email" className="contact-email hidden" aria-live="polite" />
          <p className="footer-credit">Made with <span aria-label="love">❤️</span> for late-night listening</p>
          <p className="footer-disclaimer"><strong>Disclaimer:</strong> Audio plays through YouTube’s embedded player. Nothing is hosted on this site, and all rights stay with the labels, composers and performers. Song credits are put together from film soundtrack listings.</p>
          <p className="footer-tagline">Made for long listens, familiar songs and unhurried nights.</p>
          <a className="footer-url" href="https://latenightplaylist.web.app/">latenightplaylist.web.app</a>
        </footer>
      </main>
      <div id="toast" className="toast" role="status" aria-live="polite" />
    </>
  );
}
