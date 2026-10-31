const contactToggle = document.querySelector('#contact-toggle');
const contactDetails = document.querySelector('#contact-email');
const contactLink = document.createElement('a');

contactLink.href = `mailto:${window.LATE_NIGHT_CONTACT_EMAIL}`;
contactLink.textContent = window.LATE_NIGHT_CONTACT_EMAIL;
contactDetails.replaceChildren(contactLink);

contactToggle.addEventListener('click', () => {
  const expanded = contactToggle.getAttribute('aria-expanded') !== 'true';
  contactToggle.setAttribute('aria-expanded', String(expanded));
  contactDetails.classList.toggle('hidden', !expanded);
});
