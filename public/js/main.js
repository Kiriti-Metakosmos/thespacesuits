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

// Database filters
const filterBtns = document.querySelectorAll('.filter-btn');
const cards = document.querySelectorAll('.db-card');
let activeNation = 'all';
let activeCategory = 'all';

function applyFilters() {
  let shown = 0;
  cards.forEach(card => {
    const nation = card.dataset.nation;
    const category = card.dataset.category;
    const nationMatch = activeNation === 'all' || nation === activeNation;
    const categoryMatch = activeCategory === 'all' || category === activeCategory;
    if (nationMatch && categoryMatch) {
      card.style.display = '';
      shown++;
    } else {
      card.style.display = 'none';
    }
  });
  const counter = document.querySelector('.ss');
  if (counter) counter.textContent = shown + ' suits displayed · filter by nation or category';
}

filterBtns.forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.preventDefault();
    const nation = btn.dataset.filterNation;
    const category = btn.dataset.filterCategory;
    if (nation !== undefined) {
      activeNation = nation;
      document.querySelectorAll('[data-filter-nation]').forEach(b => b.classList.remove('active'));
    }
    if (category !== undefined) {
      activeCategory = category;
      document.querySelectorAll('[data-filter-category]').forEach(b => b.classList.remove('active'));
    }
    btn.classList.add('active');
    applyFilters();
  });
});
