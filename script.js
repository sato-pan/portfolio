// Lock screen (client-side only — not real security, just a soft gate)
(function(){
  const SITE_PASSWORD = 'tosaken1012';
  const STORAGE_KEY = 'satoken-portfolio-unlocked';
  const lockScreen = document.getElementById('lockScreen');
  const lockForm = document.getElementById('lockForm');
  const lockInput = document.getElementById('lockInput');
  const lockError = document.getElementById('lockError');

  function unlock() {
    document.documentElement.classList.remove('locked');
    lockScreen.classList.add('unlocked');
  }

  if (localStorage.getItem(STORAGE_KEY) === '1') {
    unlock();
  } else {
    document.documentElement.classList.add('locked');
  }

  lockForm.addEventListener('submit', (e) => {
    e.preventDefault();
    if (lockInput.value === SITE_PASSWORD) {
      localStorage.setItem(STORAGE_KEY, '1');
      unlock();
    } else {
      lockError.classList.add('show');
      lockInput.value = '';
      lockInput.focus();
    }
  });
})();

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

document.querySelectorAll('.work-channel-link').forEach(link => {
  link.addEventListener('click', (e) => e.stopPropagation());
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

// Photo lightbox
const lightbox = document.getElementById('photoLightbox');
const lightboxImg = document.getElementById('lightboxImg');
const lightboxClose = document.getElementById('lightboxClose');
const lightboxPrev = document.getElementById('lightboxPrev');
const lightboxNext = document.getElementById('lightboxNext');
const galleryPhotos = Array.from(document.querySelectorAll('#photoGallery .photo-item img'));
let lightboxIndex = 0;

function showLightboxPhoto(index) {
  lightboxIndex = (index + galleryPhotos.length) % galleryPhotos.length;
  const img = galleryPhotos[lightboxIndex];
  lightboxImg.src = img.src;
  lightboxImg.alt = img.alt;
}

function openLightbox(index) {
  showLightboxPhoto(index);
  lightbox.classList.add('active');
}

function closeLightbox() {
  lightbox.classList.remove('active');
  lightboxImg.src = '';
}

galleryPhotos.forEach((img, index) => {
  img.closest('.photo-item').addEventListener('click', () => openLightbox(index));
});

lightboxClose.addEventListener('click', closeLightbox);
lightboxPrev.addEventListener('click', () => showLightboxPhoto(lightboxIndex - 1));
lightboxNext.addEventListener('click', () => showLightboxPhoto(lightboxIndex + 1));
lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) closeLightbox();
});
document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('active')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowLeft') showLightboxPhoto(lightboxIndex - 1);
  if (e.key === 'ArrowRight') showLightboxPhoto(lightboxIndex + 1);
});
