const HIDE_YOUTUBE_PLAYER = true;

function youtubeThumbs(videoId) {
  const sizes = ['hq720', 'maxresdefault', 'sddefault', 'hqdefault', 'mqdefault'];
  return sizes.map((size) => `https://i.ytimg.com/vi/${videoId}/${size}.jpg`);
}
