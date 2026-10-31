const PLAYLISTS = window.LATE_NIGHT_PLAYLISTS;

function updatePlayerControls() {
  const enabled = Boolean(activePlaylist?.playlistId && youtubeReady);
  [playButton, volumeButton, shuffleButton, previousButton, nextButton].forEach((button) => {
    button.disabled = !enabled;
  });
  volumeSlider.disabled = !enabled;
  playlistButtons.forEach((button) => {
    const selected = button.dataset.playlist === activePlaylist?.id;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  seekSlider.disabled = !(enabled && trackDuration > 0);
}

function setPlaylistMenuOpen(open) {
  playlistList.classList.toggle('hidden', !open);
  musicConsole.classList.toggle('has-playlist-menu', open);
  playlistToggle.setAttribute('aria-expanded', String(open));
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
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && playlistToggle.getAttribute('aria-expanded') === 'true') {
    setPlaylistMenuOpen(false);
    playlistToggle.focus();
  }
  if (event.key === 'Escape' && volumeButton.getAttribute('aria-expanded') === 'true') {
    setVolumePanelOpen(false);
    volumeButton.focus();
  }
});

function choosePlaylist(id) {
  resetTrackInfo();
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
  seekSlider.disabled = !(activePlaylist?.playlistId && trackDuration > 0);
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
  playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
}
playButton.addEventListener('click', () => {
  if (!youtubeReady || !activePlaylist?.playlistId) return;
  if (youtubePlayer.getPlayerState() === YT.PlayerState.PLAYING) youtubePlayer.pauseVideo();
  else youtubePlayer.playVideo();
});
previousButton.addEventListener('click', () => youtubePlayer?.previousVideo());
nextButton.addEventListener('click', () => youtubePlayer?.nextVideo());
shuffleButton.addEventListener('click', () => {
  if (!youtubeReady) return;
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
  if (youtubeReady && trackDuration > 0) youtubePlayer.seekTo(Number(seekSlider.value), true);
  isSeeking = false;
  updateSeek();
});
