(() => {
  const trigger = document.querySelector('#donation-toggle');
  const dialog = document.querySelector('#donation-dialog');
  const closeButton = document.querySelector('#donation-close');

  if (!trigger || !dialog || !closeButton || typeof dialog.showModal !== 'function') return;

  async function setupDonation() {
    let donationConfig = {};
    try {
      donationConfig = await import('./donation-config.local.js');
    } catch {
    }

    const donationUrl = String(donationConfig.donationUrl || '').trim();
    const donationQrPath = String(donationConfig.donationQrPath || '').trim();
    const coffeeLink = dialog.querySelector('#donation-coffee-link');
    const qrImage = dialog.querySelector('#donation-qr');
    const qrInstruction = dialog.querySelector('#donation-instruction');
    const saveQrLink = dialog.querySelector('#donation-save-qr');

    if (donationUrl && coffeeLink) coffeeLink.href = donationUrl;
    else coffeeLink?.classList.add('hidden');

    if (donationQrPath && qrImage && saveQrLink) {
      qrImage.dataset.src = donationQrPath;
      saveQrLink.dataset.href = donationQrPath;
    } else {
      qrImage?.classList.add('hidden');
      qrInstruction?.classList.add('hidden');
      saveQrLink?.classList.add('hidden');
    }

    if (!donationUrl && !donationQrPath) {
      trigger.classList.add('hidden');
      return;
    }

    function loadDonationAssets() {
      dialog.querySelectorAll('img[data-src]').forEach((image) => {
        if (!image.hasAttribute('src')) image.src = image.dataset.src;
      });

      if (saveQrLink && donationQrPath && !saveQrLink.hasAttribute('href')) {
        saveQrLink.href = saveQrLink.dataset.href;
      }
    }

    trigger.addEventListener('click', () => {
      if (dialog.open) {
        dialog.close();
        return;
      }

      loadDonationAssets();
      dialog.showModal();
      trigger.setAttribute('aria-expanded', 'true');
    });

    closeButton.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      if (event.target === dialog) dialog.close();
    });
    dialog.addEventListener('close', () => trigger.setAttribute('aria-expanded', 'false'));
  }

  setupDonation();
})();
