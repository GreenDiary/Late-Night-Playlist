const toast = document.querySelector('#toast');
let toastTimer = null;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 3600);
}

async function copyText(text) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  } catch {
  }
  const field = document.createElement('textarea');
  field.value = text;
  field.setAttribute('readonly', '');
  field.style.position = 'fixed';
  field.style.opacity = '0';
  document.body.append(field);
  field.select();
  let copied = false;
  try { copied = document.execCommand('copy'); } catch { copied = false; }
  field.remove();
  return copied;
}

shareButton.addEventListener('click', async () => {
  const localHost = ['localhost', '127.0.0.1', '::1'].includes(location.hostname);
  if (location.protocol === 'file:' || localHost) {
    showToast('Publish the site first to get a shareable link.');
    return;
  }

  const shareUrl = new URL(location.href);
  shareUrl.hash = '';
  shareUrl.search = '';
  const message = `Join me at Late Night Playlist: ${shareUrl.href}`;
  window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
  const copied = await copyText(shareUrl.href);
  showToast(copied ? 'Link copied. Choose a WhatsApp chat to share it.' : 'WhatsApp opened with your site link.');
});
