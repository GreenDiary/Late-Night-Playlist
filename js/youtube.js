let youtubeApiPromise = null;
function loadYouTubeApi() {
  if (window.YT?.Player) return Promise.resolve(window.YT);
  if (youtubeApiPromise) return youtubeApiPromise;
  youtubeApiPromise = new Promise((resolve, reject) => {
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => { previous?.(); resolve(window.YT); };
    const apiScript = document.createElement('script');
    apiScript.src = 'https://www.youtube.com/iframe_api';
    apiScript.async = true;
    apiScript.onerror = () => { youtubeApiPromise = null; reject(new Error('YouTube API failed to load')); };
    document.head.append(apiScript);
  });
  return youtubeApiPromise;
}

function requestYouTubePlayer() {
  if (youtubePlayer) return;
  loadYouTubeApi()
    .then(() => { if (!youtubePlayer) createYouTubePlayer(); })
    .catch(() => { playerHint.textContent = 'YouTube player unavailable'; });
}

function createYouTubePlayer() {
  if (!window.YT?.Player || !activePlaylist?.playlistId) return;
  const playerVars = {
    controls: HIDE_YOUTUBE_PLAYER ? 0 : 1,
    playsinline: 1,
    rel: 0,
    enablejsapi: 1,
    listType: 'playlist',
    list: activePlaylist.playlistId.trim()
  };
  if (HIDE_YOUTUBE_PLAYER) Object.assign(playerVars, { disablekb: 1, fs: 0, modestbranding: 1 });
  if (location.protocol === 'http:' || location.protocol === 'https:') {
    playerVars.origin = location.origin;
  }
  const playlistId = activePlaylist.playlistId.trim();
  const generation = ++youtubePlayerGeneration;
  youtubePlayer = new YT.Player('youtube-player', {
    width: HIDE_YOUTUBE_PLAYER ? '1' : '480',
    height: HIDE_YOUTUBE_PLAYER ? '1' : '270',
    playerVars,
    events: {
      onReady: (event) => onYouTubeReady(event, generation, playlistId),
      onStateChange: (event) => onYouTubeStateChange(event, generation),
      onError: (event) => onYouTubeError(event, generation)
    }
  });
}

function replaceYouTubePlayerForSelectedPlaylist() {
  if (!youtubeReady || !activePlaylist?.playlistId) return;
  youtubeReady = false;
  youtubePlayer?.destroy();
  youtubePlayer = null;
  const mount = document.createElement('div');
  mount.id = 'youtube-player';
  playerStage.replaceChildren(mount);
  updatePlayerControls();
  createYouTubePlayer();
}

function onYouTubeReady(event, generation, playlistId) {
  if (generation !== youtubePlayerGeneration) return;
  youtubeReady = true;
  if (activePlaylist?.playlistId?.trim() !== playlistId) {
    replaceYouTubePlayerForSelectedPlaylist();
    return;
  }
  youtubePlayer.setLoop(true);
  applyVolume();
  updatePlayerControls();
}

function onYouTubeStateChange(event, generation) {
  if (generation !== youtubePlayerGeneration) return;
  const playing = event.data === YT.PlayerState.PLAYING;
  setPlaying(playing);
  clearInterval(seekInterval);
  if (playing) seekInterval = setInterval(updateSeek, 500);
  updateSeek();
  if (event.data === YT.PlayerState.BUFFERING) playerHint.textContent = 'Loading';
  if (event.data === YT.PlayerState.CUED || event.data === YT.PlayerState.PAUSED) {
    const title = youtubePlayer.getVideoData()?.title;
    playerHint.textContent = title || activePlaylist?.title || '';
  }
  if (playing || event.data === YT.PlayerState.CUED || event.data === YT.PlayerState.PAUSED) syncTrackInfo(true);
}

function onYouTubeError(event, generation) {
  if (generation !== youtubePlayerGeneration) return;
  const errorMessages = {
    2: 'YouTube rejected this playlist request (error 2). Check the playlist link or ID.',
    5: 'This video could not play in the embedded player.',
    100: 'A video is unavailable or private. Try skipping ahead.',
    101: 'This video does not allow embedded playback. Try skipping ahead.',
    150: 'This video does not allow embedded playback. Try skipping ahead.',
    153: 'YouTube needs a website address. Open the site from localhost or its published link.'
  };
  playerHint.textContent = errorMessages[event?.data] || `YouTube playback error (${event?.data ?? 'unknown'}).`;
  setPlaying(false);
  resetSeek();
}

let lastTrackKey = '';
let coverVideoId = '';

function syncTrackInfo(force = false) {
  const data = youtubePlayer?.getVideoData?.() || {};
  if (!data.video_id) return;
  const key = `${data.video_id}|${data.title || ''}`;
  if (!force && key === lastTrackKey) return;
  lastTrackKey = key;
  playerHint.textContent = data.title || activePlaylist?.title || '';
  setCoverArt(data.video_id);
}

function setCoverArt(videoId) {
  if (!vinylArt || videoId === coverVideoId) return;
  coverVideoId = videoId;
  const url = youtubeThumb(videoId);
  const image = new Image();
  image.onload = () => {
    if (coverVideoId !== videoId) return;
    vinylArt.style.backgroundImage = `url("${url}")`;
    vinylArt.classList.add('has-cover');
  };
  image.src = url;
}

function resetTrackInfo() {
  lastTrackKey = '';
  coverVideoId = '';
  if (!vinylArt) return;
  vinylArt.style.backgroundImage = '';
  vinylArt.classList.remove('has-cover');
}
