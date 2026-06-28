// Mobile menu toggle
const burger = document.querySelector('.nav-burger');
const mobileMenu = document.getElementById('mobileMenu');

if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', isOpen);
    mobileMenu.setAttribute('aria-hidden', !isOpen);
  });
  // Close on link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', false);
    });
  });
}

// Active nav link
const currentPath = window.location.pathname;
document.querySelectorAll('.nav-links a').forEach(link => {
  if (link.getAttribute('href') === currentPath ||
      (currentPath.startsWith('/suits/') && link.getAttribute('href') === '/database')) {
    link.style.color = 'var(--paper)';
    link.style.borderBottom = '1px solid var(--cyan)';
    link.style.paddingBottom = '2px';
  }
});

// Copy link button feedback
document.querySelectorAll('.share-copy').forEach(btn => {
  btn.addEventListener('click', () => {
    const original = btn.innerHTML;
    btn.innerHTML = btn.innerHTML.replace(/Copy Link/, 'Copied!');
    btn.style.borderColor = 'var(--green)';
    btn.style.color = 'var(--green)';
    setTimeout(() => {
      btn.innerHTML = original;
      btn.style.borderColor = '';
      btn.style.color = '';
    }, 2000);
  });
});
