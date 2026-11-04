const PLAYLISTS = window.LATE_NIGHT_PLAYLISTS;
let playlistMenuCloseTimer = null;

function updatePlayerControls() {
  const playerReady = Boolean(activePlaylist?.playlistId && youtubeReady);
  const playlistReady = playerReady && youtubePlaylistReady;
  [playButton, shuffleButton, previousButton, nextButton].forEach((button) => {
    button.disabled = !playlistReady;
  });
  volumeButton.disabled = !playerReady;
  volumeSlider.disabled = !playerReady;
  playlistButtons.forEach((button) => {
    const selected = button.dataset.playlist === activePlaylist?.id;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  seekSlider.disabled = !(playlistReady && trackDuration > 0);
}

function setPlaylistMenuOpen(open) {
  if (playlistMenuCloseTimer !== null) {
    clearTimeout(playlistMenuCloseTimer);
    playlistMenuCloseTimer = null;
  }
  playlistList.classList.remove('is-closing');
  playlistList.classList.toggle('hidden', !open);
  musicConsole.classList.toggle('has-playlist-menu', open);
  playlistToggle.setAttribute('aria-expanded', String(open));
}

function closePlaylistMenuWithBounce() {
  if (playlistList.classList.contains('hidden')) {
    setPlaylistMenuOpen(false);
    return;
  }
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    setPlaylistMenuOpen(false);
    return;
  }
  if (playlistMenuCloseTimer !== null) clearTimeout(playlistMenuCloseTimer);
  playlistToggle.setAttribute('aria-expanded', 'false');
  playlistList.classList.add('is-closing');
  playlistMenuCloseTimer = window.setTimeout(() => {
    playlistList.classList.add('hidden');
    playlistList.classList.remove('is-closing');
    musicConsole.classList.remove('has-playlist-menu');
    playlistMenuCloseTimer = null;
  }, 250);
}

function setVolumePanelOpen(open) {
  volumePanel.classList.toggle('hidden', !open);
  volumeButton.setAttribute('aria-expanded', String(open));
}

function syncVolumeControl() {
  const muted = isMuted || volumeLevel === 0;
  volumeOnIcon.classList.toggle('hidden', muted);
  volumeOffIcon.classList.toggle('hidden', !muted);
  volumeButton.setAttribute('aria-label', muted ? 'Volume muted' : `Volume ${volumeLevel}%`);
  volumeButton.setAttribute('aria-pressed', String(muted));
  volumeSlider.value = String(volumeLevel);
  volumePanel.style.setProperty('--volume-progress', `${volumeLevel}%`);
  volumeValue.value = String(volumeLevel);
  volumeValue.textContent = String(volumeLevel);
}

function applyVolume() {
  if (!youtubeReady || !youtubePlayer) return;
  if (isMuted || volumeLevel === 0) {
    youtubePlayer.mute();
  } else {
    youtubePlayer.unMute();
    youtubePlayer.setVolume(volumeLevel);
  }
}

function changeVolume(value) {
  volumeLevel = Math.max(0, Math.min(100, Math.round(Number(value))));
  isMuted = volumeLevel === 0;
  syncVolumeControl();
  applyVolume();
}

volumeButton.addEventListener('click', () => {
  setVolumePanelOpen(volumeButton.getAttribute('aria-expanded') !== 'true');
});
volumeSlider.addEventListener('input', () => changeVolume(volumeSlider.value));

playlistToggle.addEventListener('click', () => {
  setPlaylistMenuOpen(playlistToggle.getAttribute('aria-expanded') !== 'true');
});
document.addEventListener('click', (event) => {
  if (!musicConsole.contains(event.target)) setPlaylistMenuOpen(false);
  if (!volumeControl.contains(event.target)) setVolumePanelOpen(false);
});
document.addEventListener('focusout', (event) => {
  if (event.target instanceof Element) {
    event.target.closest('.player-controls button')?.classList.remove('space-shortcut-source');
  }
});
document.addEventListener('pointerdown', (event) => {
  if (event.target instanceof Element) {
    event.target.closest('.player-controls button')?.classList.remove('space-shortcut-source');
  }
});
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && playlistToggle.getAttribute('aria-expanded') === 'true') {
    setPlaylistMenuOpen(false);
    playlistToggle.focus();
  }
  if (event.key === 'Escape' && volumeButton.getAttribute('aria-expanded') === 'true') {
    setVolumePanelOpen(false);
    volumeButton.focus();
  }
  const isSpace = event.code === 'Space' || event.key === ' ';
  const hasModifier = event.altKey || event.ctrlKey || event.metaKey || event.shiftKey;
  const targetIsElement = event.target instanceof Element;
  const playerControlButton = targetIsElement ? event.target.closest('.player-controls button') : null;
  const targetIsControl = targetIsElement
    && event.target.closest('button, a[href], input, textarea, select, summary, [contenteditable]:not([contenteditable="false"]), [role="button"], [role="slider"]');
  const playbackShortcutTarget = !targetIsControl || playerControlButton;
  if (!isSpace) playerControlButton?.classList.remove('space-shortcut-source');
  if (isSpace && !event.repeat && !event.defaultPrevented && !hasModifier && playbackShortcutTarget) {
    event.preventDefault();
    playerControlButton?.classList.add('space-shortcut-source');
    togglePlayback();
  }
});

function choosePlaylist(id) {
  resetTrackInfo();
  youtubePlaylistReady = false;
  activePlaylist = PLAYLISTS.find((playlist) => playlist.id === id) || null;
  document.querySelector('.hero').classList.toggle('has-active-player', Boolean(activePlaylist?.playlistId) && !HIDE_YOUTUBE_PLAYER);
  shuffleOn = false;
  shuffleButton.setAttribute('aria-pressed', 'false');
  updatePlayerControls();
  setPlaying(false);

  if (!activePlaylist) {
    playerStage.classList.add('hidden');
    activePlaylistName.textContent = 'Choose a playlist';
    playerHint.textContent = 'Add playlist IDs in js/playlists.js';
    resetSeek();
    return;
  }

  activePlaylistName.textContent = activePlaylist.title;

  if (!activePlaylist.playlistId.trim()) {
    youtubePlayer?.pauseVideo();
    playerStage.classList.add('hidden');
    playerHint.textContent = 'Playlist ID not set';
    resetSeek();
    return;
  }

  playerStage.classList.remove('hidden');
  playerHint.textContent = 'Loading playlist';
  resetSeek();
  updatePlayerControls();
  if (youtubeReady) replaceYouTubePlayerForSelectedPlaylist();
  else requestYouTubePlayer();
}

playlistButtons.forEach((button) => button.addEventListener('click', () => {
  const samePlaylistIsPlaying = button.dataset.playlist === activePlaylist?.id
    && youtubeReady
    && youtubePlaylistReady
    && youtubePlayer?.getPlayerState?.() === YT.PlayerState.PLAYING;
  if (samePlaylistIsPlaying) {
    closePlaylistMenuWithBounce();
    return;
  }
  choosePlaylist(button.dataset.playlist);
  setPlaylistMenuOpen(false);
}));
function formatMediaTime(seconds) {
  const whole = Math.max(0, Math.floor(seconds || 0));
  const minutes = Math.floor(whole / 60);
  const remainder = whole % 60;
  if (minutes >= 60) return `${Math.floor(minutes / 60)}:${String(minutes % 60).padStart(2, '0')}:${String(remainder).padStart(2, '0')}`;
  return `${minutes}:${String(remainder).padStart(2, '0')}`;
}

function updateSeek() {
  if (!youtubeReady || !youtubePlayer || isSeeking) return;
  syncTrackInfo();
  trackDuration = youtubePlayer.getDuration() || 0;
  const current = youtubePlayer.getCurrentTime() || 0;
  seekSlider.max = String(Math.max(1, Math.floor(trackDuration)));
  seekSlider.value = String(Math.min(Math.floor(current), Math.floor(trackDuration)));
  seekCurrent.textContent = formatMediaTime(current);
  seekDuration.textContent = formatMediaTime(trackDuration);
  seekSlider.style.setProperty('--seek-progress', trackDuration ? `${(current / trackDuration) * 100}%` : '0%');
  seekSlider.disabled = !(activePlaylist?.playlistId && youtubeReady && youtubePlaylistReady && trackDuration > 0);
}

function resetSeek() {
  clearInterval(seekInterval);
  seekInterval = null;
  trackDuration = 0;
  isSeeking = false;
  seekSlider.value = '0';
  seekSlider.max = '100';
  seekSlider.disabled = true;
  seekSlider.style.setProperty('--seek-progress', '0%');
  seekCurrent.textContent = '0:00';
  seekDuration.textContent = '0:00';
}

function setPlaying(playing) {
  playIcon.classList.toggle('hidden', playing);
  pauseIcon.classList.toggle('hidden', !playing);
  playButton.classList.toggle('is-playing', playing);
  glassPlayer.classList.toggle('is-playing', playing);
  playlistButtons.forEach((button) => {
    button.classList.toggle('is-playing', playing && button.dataset.playlist === activePlaylist?.id);
  });
  playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
function togglePlayback() {
  if (!youtubeReady || !youtubePlaylistReady || !activePlaylist?.playlistId) return;
  if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) youtubePlayer.pauseVideo();
  else youtubePlayer.playVideo();
}
playButton.addEventListener('click', togglePlayback);
previousButton.addEventListener('click', () => {
  if (youtubeReady && youtubePlaylistReady) youtubePlayer?.previousVideo();
});
function playNextDistinctVideo() {
  if (!youtubeReady || !youtubePlaylistReady || !youtubePlayer) return;
  const playlist = youtubePlayer.getPlaylist?.() || [];
  const videoDataId = youtubePlayer.getVideoData?.()?.video_id;
  let currentIndex = youtubePlayer.getPlaylistIndex?.() ?? -1;
  if (!Array.isArray(playlist) || playlist.length < 2) return;
  if (!Number.isInteger(currentIndex) || currentIndex < 0 || currentIndex >= playlist.length) {
    currentIndex = playlist.indexOf(videoDataId);
  }
  if (currentIndex < 0) return;
  const currentVideoId = playlist[currentIndex] || videoDataId;

  for (let offset = 1; offset < playlist.length; offset += 1) {
    const nextIndex = (currentIndex + offset) % playlist.length;
    if (playlist[nextIndex] && playlist[nextIndex] !== currentVideoId) {
      youtubePlayer.playVideoAt(nextIndex);
      return;
    }
  }
}
nextButton.addEventListener('click', playNextDistinctVideo);
shuffleButton.addEventListener('click', () => {
  if (!youtubeReady || !youtubePlaylistReady) return;
  shuffleOn = !shuffleOn;
  youtubePlayer.setShuffle(shuffleOn);
  shuffleButton.setAttribute('aria-pressed', String(shuffleOn));
});
seekSlider.addEventListener('input', () => {
  isSeeking = true;
  seekCurrent.textContent = formatMediaTime(Number(seekSlider.value));
  const progress = trackDuration ? (Number(seekSlider.value) / trackDuration) * 100 : 0;
  seekSlider.style.setProperty('--seek-progress', `${progress}%`);
});
seekSlider.addEventListener('change', () => {
  if (youtubeReady && youtubePlaylistReady && trackDuration > 0) youtubePlayer.seekTo(Number(seekSlider.value), true);
  isSeeking = false;
  updateSeek();
});
