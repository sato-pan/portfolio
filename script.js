// Header scroll state
const header = document.getElementById('siteHeader');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('open');
  mainNav.classList.toggle('open');
});
mainNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navToggle.classList.remove('open');
    mainNav.classList.remove('open');
  });
});

// Scroll reveal (with immediate-visibility + no-JS-stall safety net)
function isInViewport(el) {
  const rect = el.getBoundingClientRect();
  return rect.top < window.innerHeight && rect.bottom > 0;
}

const revealEls = document.querySelectorAll('.reveal');
let io = null;
if ('IntersectionObserver' in window) {
  io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
}
revealEls.forEach(el => {
  if (isInViewport(el)) {
    el.classList.add('in-view');
  } else if (io) {
    io.observe(el);
  } else {
    el.classList.add('in-view');
  }
});
// Safety net: guarantee nothing stays invisible if the observer never fires
setTimeout(() => {
  revealEls.forEach(el => el.classList.add('in-view'));
}, 4000);

// Stat counters
const statEls = document.querySelectorAll('.stat-num');
let statIo = null;
if ('IntersectionObserver' in window) {
  statIo = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCount(entry.target);
        statIo.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
}
statEls.forEach(el => {
  if (isInViewport(el)) {
    animateCount(el);
  } else if (statIo) {
    statIo.observe(el);
  } else {
    animateCount(el);
  }
});
// Safety net for counters too
setTimeout(() => {
  statEls.forEach(el => {
    if (el.textContent === '0') animateCount(el);
  });
}, 4000);

function animateCount(el) {
  const target = parseInt(el.dataset.count, 10);
  const duration = 1200;
  const start = performance.now();
  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target);
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

// Accordion
document.querySelectorAll('.acc-head').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.closest('.acc-item');
    const wasOpen = item.classList.contains('open');
    document.querySelectorAll('.acc-item.open').forEach(i => i.classList.remove('open'));
    if (!wasOpen) item.classList.add('open');
  });
});

// Video modal
const modal = document.getElementById('videoModal');
const modalVideo = document.getElementById('modalVideo');
const modalClose = document.getElementById('modalClose');

document.querySelectorAll('.work-card').forEach(card => {
  card.addEventListener('click', () => {
    const videoId = card.dataset.video;
    modalVideo.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen></iframe>`;
    modal.classList.add('active');
  });
});

function closeModal() {
  modal.classList.remove('active');
  modalVideo.innerHTML = '';
}
modalClose.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});
