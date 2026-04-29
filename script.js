// ─── Service toggle with image swap ─────────────────────
function setService(el) {
  el.parentElement.querySelectorAll('.svc-item').forEach(i => i.classList.remove('active'));
  el.classList.add('active');

  const imgKey = el.dataset.img;
  if (imgKey) {
    const featPhoto = document.getElementById('featPhoto');
    if (featPhoto) {
      featPhoto.querySelectorAll('img').forEach(img => {
        if (img.dataset.key === imgKey) {
          img.classList.remove('hidden');
          img.classList.add('visible');
        } else {
          img.classList.remove('visible');
          img.classList.add('hidden');
        }
      });
    }
  }
}

// ─── Scroll reveal ───────────────────────────────────────
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting){ e.target.classList.add('visible'); observer.unobserve(e.target); }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// ─── GSAP Animations ────────────────────────────────────
gsap.registerPlugin(ScrollTrigger);

// Partner strip infinite scroll
(function() {
  const track = document.getElementById('partnerTrack');
  if (!track) return;

  const tiles = track.querySelectorAll('.partner-tile:not(.partner-clone)');
  let setWidth = 0;
  tiles.forEach(t => {
    setWidth += t.offsetWidth + 12;
  });

  gsap.set(track, { x: -80 });

  const tween = gsap.to(track, {
    x: () => -(setWidth + 80),
    duration: 35,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => {
        const val = parseFloat(x);
        if (val <= -(setWidth + 80)) return -80;
        return val;
      })
    }
  });

  track.parentElement.addEventListener('mouseenter', () => tween.pause());
  track.parentElement.addEventListener('mouseleave', () => tween.play());
})();

// Testimonial strip infinite scroll
(function() {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;

  const cards = track.querySelectorAll('.t-card:not(.t-clone)');
  let setWidth = 0;
  cards.forEach(c => {
    setWidth += c.offsetWidth + 16;
  });

  gsap.set(track, { x: -80 });

  const tween = gsap.to(track, {
    x: () => -(setWidth + 80),
    duration: 30,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => {
        const val = parseFloat(x);
        if (val <= -(setWidth + 80)) return -80;
        return val;
      })
    }
  });

  track.parentElement.addEventListener('mouseenter', () => tween.pause());
  track.parentElement.addEventListener('mouseleave', () => tween.play());
})();