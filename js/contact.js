(() => {
  const contactToggle = document.querySelector('#contact-toggle');
  const contactDetails = document.querySelector('#contact-email');
  if (!contactToggle || !contactDetails) return;

  async function setupContact() {
    let contactEmail = '';
    try {
      ({ contactEmail } = await import('./contact-address.local.js'));
    } catch {
    }

    contactEmail = String(contactEmail || '').trim();
    if (!contactEmail) {
      contactToggle.classList.add('hidden');
      return;
    }

    const contactLink = document.createElement('a');
    contactLink.href = 'mailto:' + contactEmail;
    contactLink.textContent = contactEmail;
    contactDetails.replaceChildren(contactLink);

    contactToggle.addEventListener('click', () => {
      const expanded = contactToggle.getAttribute('aria-expanded') !== 'true';
      contactToggle.setAttribute('aria-expanded', String(expanded));
      contactDetails.classList.toggle('hidden', !expanded);
    });
  }

  setupContact();
})();
