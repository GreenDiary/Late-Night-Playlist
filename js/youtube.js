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
  youtubePlaylistReady = false;
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
  youtubePlaylistReady = false;
  if (activePlaylist?.playlistId?.trim() !== playlistId) {
    replaceYouTubePlayerForSelectedPlaylist();
    return;
  }
  youtubePlayer.setLoop(true);
  applyVolume();
  updatePlayerControls();
  youtubePlayer.cuePlaylist({ listType: 'playlist', list: playlistId, index: 0 });
}

function onYouTubeStateChange(event, generation) {
  if (generation !== youtubePlayerGeneration) return;
  const playing = event.data === YT.PlayerState.PLAYING;
  if (playing || event.data === YT.PlayerState.CUED) {
    youtubePlaylistReady = true;
    updatePlayerControls();
  }
  setPlaying(playing);
  clearInterval(seekInterval);
  if (playing) seekInterval = setInterval(updateSeek, 500);
  updateSeek();
  if (event.data === YT.PlayerState.BUFFERING) {
    const hasTrackInfo = syncTrackInfo();
    if (!hasTrackInfo && !lastTrackKey) playerHint.textContent = 'Loading';
  }
  if (playing || event.data === YT.PlayerState.CUED || event.data === YT.PlayerState.PAUSED) syncTrackInfo();
}

function onYouTubeError(event, generation) {
  if (generation !== youtubePlayerGeneration) return;
  const playlist = youtubePlayer?.getPlaylist?.() || [];
  if (youtubeReady && playlist.length) {
    youtubePlaylistReady = true;
    updatePlayerControls();
  }
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
let coverRequestId = 0;

function syncTrackInfo() {
  const data = youtubePlayer?.getVideoData?.() || {};
  if (!data.video_id || !data.title) return false;
  const key = `${data.video_id}|${data.title}`;
  if (key !== lastTrackKey) {
    lastTrackKey = key;
    setCoverArt(data.video_id);
  }
  playerHint.textContent = data.title;
  return true;
}

function setCoverArt(videoId) {
  if (!vinylArt || videoId === coverVideoId) return;
  coverVideoId = videoId;
  const requestId = ++coverRequestId;
  restoreDefaultCoverArt();
  const urls = youtubeThumbs(videoId);
  let urlIndex = 0;
  const loadNextThumbnail = () => {
    if (coverRequestId !== requestId || coverVideoId !== videoId) return;
    const url = urls[urlIndex++];
    if (!url) {
      restoreDefaultCoverArt();
      return;
    }
    const image = new Image();
    image.onload = () => {
      if (coverRequestId !== requestId || coverVideoId !== videoId) return;
      // YouTube may return its small missing-size placeholder as a valid image.
      if (image.naturalWidth <= 120 && image.naturalHeight <= 90) {
        loadNextThumbnail();
        return;
      }
      vinylArt.style.backgroundImage = `url("${url}")`;
      vinylArt.classList.add('has-cover');
    };
    image.onerror = loadNextThumbnail;
    image.src = url;
  };
  loadNextThumbnail();
}

function restoreDefaultCoverArt() {
  if (!vinylArt) return;
  vinylArt.style.backgroundImage = '';
  vinylArt.classList.remove('has-cover');
}

function resetTrackInfo() {
  lastTrackKey = '';
  coverVideoId = '';
  coverRequestId += 1;
  restoreDefaultCoverArt();
}
