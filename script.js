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

  gsap.set(track, { x: -64 });

  const tween = gsap.to(track, {
    x: () => -(setWidth + 64),
    duration: 35,
    ease: 'none',
    repeat: -1,
    modifiers: {
      x: gsap.utils.unitize(x => {
        const val = parseFloat(x);
        if (val <= -(setWidth + 64)) return -64;
        return val;
      })
    }
  });

  track.parentElement.addEventListener('mouseenter', () => tween.pause());
  track.parentElement.addEventListener('mouseleave', () => tween.play());
})();

// ─── Testimonial strip with working progress bar ────────
(function() {
  const track = document.getElementById('testimonialTrack');
  if (!track) return;

  const CARD_DURATION = 4000; // ms per card auto-advance
  const cards = Array.from(track.querySelectorAll('.t-card:not(.t-clone)'));
  const totalCards = cards.length;

  // Build progress bar dots in .t-progress
  const progressEl = document.getElementById('tProgress');
  if (!progressEl) return;

  // Create dot + fill elements
  progressEl.innerHTML = '';
  cards.forEach((_, i) => {
    const dot = document.createElement('div');
    dot.className = 't-prog-dot' + (i === 0 ? ' active' : '');
    const fill = document.createElement('div');
    fill.className = 't-prog-fill';
    dot.appendChild(fill);
    dot.addEventListener('click', () => goToCard(i));
    progressEl.appendChild(dot);
  });

  let currentIndex = 0;
  let animFrame;
  let startTime = null;
  let paused = false;

  function goToCard(index) {
    currentIndex = index;
    startTime = null;
    updateDots();
    scrollToCard(index);
    cancelAnimationFrame(animFrame);
    if (!paused) tick();
  }

  function updateDots() {
    progressEl.querySelectorAll('.t-prog-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentIndex);
      const fill = dot.querySelector('.t-prog-fill');
      fill.style.transition = 'none';
      fill.style.width = i < currentIndex ? '100%' : '0%';
    });
  }

  function scrollToCard(index) {
    // Calculate x offset for the card
    let x = 64; // left padding offset
    for (let i = 0; i < index; i++) {
      x += cards[i].offsetWidth + 16;
    }
    gsap.to(track, { x: -x, duration: 0.5, ease: 'power2.inOut' });
  }

  function tick(timestamp) {
    if (!startTime) startTime = timestamp || performance.now();
    const elapsed = (timestamp || performance.now()) - startTime;
    const progress = Math.min(elapsed / CARD_DURATION, 1);

    // Animate current fill
    const currentDot = progressEl.querySelectorAll('.t-prog-dot')[currentIndex];
    if (currentDot) {
      const fill = currentDot.querySelector('.t-prog-fill');
      fill.style.transition = 'none';
      fill.style.width = (progress * 100) + '%';
    }

    if (progress >= 1) {
      // Mark current as complete
      if (currentDot) {
        currentDot.querySelector('.t-prog-fill').style.width = '100%';
      }
      currentIndex = (currentIndex + 1) % totalCards;
      startTime = null;
      updateDots();
      scrollToCard(currentIndex);
    }

    animFrame = requestAnimationFrame(tick);
  }

  // Start
  updateDots();
  scrollToCard(0);
  animFrame = requestAnimationFrame(tick);

  // Pause on hover
  track.parentElement.addEventListener('mouseenter', () => { paused = true; cancelAnimationFrame(animFrame); });
  track.parentElement.addEventListener('mouseleave', () => {
    paused = false;
    startTime = null;
    animFrame = requestAnimationFrame(tick);
  });
})();