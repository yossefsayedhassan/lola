/* ═══════════════════════════════════════════════════
   OUR LOVE STORY — script.js
   All animations, interactions, music & effects
═══════════════════════════════════════════════════ */

/* ── WAIT FOR DOM ───────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {

  /* ══════════════════════════════════════════════
     1. PRELOADER
  ══════════════════════════════════════════════ */
  const preloader = document.getElementById('preloader');
  setTimeout(() => {
    if (preloader) {
      preloader.classList.add('fade-out');
      setTimeout(() => preloader.remove(), 900);
    }
  }, 2400);


  /* ══════════════════════════════════════════════
     2. CUSTOM CURSOR + TRAIL
  ══════════════════════════════════════════════ */
  const dot   = document.getElementById('cursor-dot');
  const ring  = document.getElementById('cursor-ring');
  let mx = window.innerWidth / 2, my = window.innerHeight / 2;
  let rx = mx, ry = my;

  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left  = mx + 'px';
    dot.style.top   = my + 'px';
    spawnTrail(mx, my);
  });

  // Ring lags behind smoothly
  (function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  })();

  // Cursor state on interactive elements
  document.querySelectorAll('a, button, .gallery-card, .timeline-card, .nav-dot, .next-section').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('cursor-link'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-link'));
  });

  // Trail hearts — SVG heart shape
  const trailContainer = document.getElementById('cursor-trail-container');
  let lastTrail = 0;

  // Heart SVG path (standard heart shape)
  const HEART_PATH = 'M10 17C10 17 1 11 1 5.5C1 2.5 3.5 1 6 1C8 1 9.5 2 10 3C10.5 2 12 1 14 1C16.5 1 19 2.5 19 5.5C19 11 10 17 10 17Z';

  function spawnTrail(x, y) {
    const now = Date.now();
    if (now - lastTrail < 60) return;
    lastTrail = now;

    const size     = 10 + Math.random() * 14;          // 10–24 px
    const hue      = 330 + Math.random() * 40;          // pink–rose range
    const color    = `hsl(${hue}, 85%, 62%)`;
    const rot      = (Math.random() - 0.5) * 30 + 'deg'; // slight tilt
    const dur      = (0.7 + Math.random() * 0.5) + 's';

    const t = document.createElement('div');
    t.className = 'cursor-trail';
    t.style.left = x + 'px';
    t.style.top  = y + 'px';
    t.style.setProperty('--trail-size',  size + 'px');
    t.style.setProperty('--trail-color', color);
    t.style.setProperty('--trail-rot',   rot);
    t.style.setProperty('--trail-dur',   dur);

    // Inline SVG heart
    t.innerHTML = `<svg viewBox="0 0 20 18" xmlns="http://www.w3.org/2000/svg">
      <path d="${HEART_PATH}"/>
    </svg>`;

    trailContainer.appendChild(t);
    setTimeout(() => t.remove(), parseFloat(dur) * 1000 + 100);
  }


  /* ══════════════════════════════════════════════
     3. THEME TOGGLE
  ══════════════════════════════════════════════ */
  const themeBtn  = document.getElementById('theme-toggle');
  const themeIcon = document.getElementById('theme-icon');

  themeBtn.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    themeIcon.textContent = isLight ? '☀' : '🌙';
  });


  /* ══════════════════════════════════════════════
     4. STAR CANVAS (Intro Background)
  ══════════════════════════════════════════════ */
  const starsCanvas = document.getElementById('stars-canvas');
  const sCtx = starsCanvas.getContext('2d');
  let stars = [];
  let starsRAF = null;

  function initStars() {
    starsCanvas.width  = window.innerWidth;
    starsCanvas.height = window.innerHeight;
    stars = Array.from({ length: 180 }, () => ({
      x: Math.random() * starsCanvas.width,
      y: Math.random() * starsCanvas.height,
      r: Math.random() * 1.5 + 0.2,
      speed: Math.random() * 0.3 + 0.05,
      alpha: Math.random(),
      da: (Math.random() * 0.01 + 0.003) * (Math.random() > 0.5 ? 1 : -1),
    }));
  }

  function drawStars() {
    sCtx.clearRect(0, 0, starsCanvas.width, starsCanvas.height);
    stars.forEach(s => {
      s.alpha += s.da;
      if (s.alpha > 1 || s.alpha < 0) s.da *= -1;
      s.y -= s.speed;
      if (s.y < 0) { s.y = starsCanvas.height; s.x = Math.random() * starsCanvas.width; }

      sCtx.beginPath();
      sCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      sCtx.fillStyle = `rgba(255, 200, 210, ${Math.max(0, Math.min(1, s.alpha))})`;
      sCtx.fill();
    });
    starsRAF = requestAnimationFrame(drawStars);
  }

  initStars();
  drawStars();
  window.addEventListener('resize', initStars);

  function stopStars() {
    if (starsRAF) { cancelAnimationFrame(starsRAF); starsRAF = null; }
  }


  /* ══════════════════════════════════════════════
      5. ENTER BUTTON → REVEAL STORY
  ══════════════════════════════════════════════ */
  const enterBtn = document.getElementById('enter-btn');
  const storyEl  = document.getElementById('story');
  const introEl  = document.getElementById('intro');

  enterBtn.addEventListener('click', () => {
    stopStars();
    introEl.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
    introEl.style.opacity    = '0';
    introEl.style.transform  = 'scale(1.04)';

    setTimeout(() => {
      introEl.style.display = 'none';
      storyEl.classList.remove('hidden');
      const nav = document.getElementById('section-nav');
      if (nav) nav.classList.remove('hidden');
      window.scrollTo({ top: 0, behavior: 'instant' });
      initStory();
    }, 1200);

    // Try auto-play music after user interaction
    tryPlayMusic();
  });


  /* ══════════════════════════════════════════════
     6. MUSIC SYSTEM (Web Audio API — no file needed)
  ══════════════════════════════════════════════ */
  let audioCtx = null;
  let masterGain = null;
  let isPlaying = false;
  let musicNodes = [];

  const playIcon  = document.getElementById('play-icon');
  const pauseIcon = document.getElementById('pause-icon');
  const volSlider = document.getElementById('volume-slider');
  const musicBtn  = document.getElementById('music-toggle');

  /* Gentle piano-ish ambient using Web Audio oscillators */
  function createMusicSystem() {
    if (audioCtx) return;
    audioCtx  = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = audioCtx.createGain();
    masterGain.gain.setValueAtTime(parseFloat(volSlider.value), audioCtx.currentTime);
    masterGain.connect(audioCtx.destination);
  }

  // A romantic chord progression: Am - F - C - G (loop)
  const chords = [
    [220.00, 261.63, 329.63], // Am  (A3-C4-E4)
    [174.61, 220.00, 261.63], // F   (F3-A3-C4)
    [130.81, 164.81, 196.00], // C   (C3-E3-G3)
    [196.00, 246.94, 293.66], // G   (G3-B3-D4)
  ];

  let chordIndex = 0;
  let chordInterval = null;

  function playChord(freqs) {
    if (!audioCtx || !isPlaying) return;

    // Resume context if suspended (browser autoplay policy)
    if (audioCtx.state === 'suspended') audioCtx.resume();

    freqs.forEach(freq => {
      const osc  = audioCtx.createOscillator();
      const gain = audioCtx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

      gain.gain.setValueAtTime(0, audioCtx.currentTime);
      gain.gain.linearRampToValueAtTime(0.08, audioCtx.currentTime + 0.25);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 3.0);

      osc.connect(gain);
      gain.connect(masterGain);

      osc.start(audioCtx.currentTime);
      osc.stop(audioCtx.currentTime + 3.5);
    });
  }

  function startMusic() {
    createMusicSystem();
    isPlaying = true;
    playChord(chords[chordIndex]);
    chordInterval = setInterval(() => {
      chordIndex = (chordIndex + 1) % chords.length;
      playChord(chords[chordIndex]);
    }, 3000);
    playIcon.style.display  = 'none';
    pauseIcon.style.display = 'block';
  }

  function stopMusic() {
    isPlaying = false;
    clearInterval(chordInterval);
    playIcon.style.display  = 'block';
    pauseIcon.style.display = 'none';
  }

  function tryPlayMusic() {
    if (!isPlaying) startMusic();
  }

  musicBtn.addEventListener('click', () => {
    if (isPlaying) { stopMusic(); } else { startMusic(); }
  });

  volSlider.addEventListener('input', () => {
    if (masterGain) masterGain.gain.setValueAtTime(parseFloat(volSlider.value), audioCtx.currentTime);
  });


  /* ══════════════════════════════════════════════
     7. PARALLAX SCROLLING
  ══════════════════════════════════════════════ */
  function updateParallax() {
    document.querySelectorAll('.parallax-bg').forEach(el => {
      const section = el.closest('section');
      const rect    = section.getBoundingClientRect();
      if (rect.bottom < 0 || rect.top > window.innerHeight) return;
      const speed  = parseFloat(el.dataset.speed || 0.3);
      const offset = (rect.top * speed);
      el.style.transform = `translateY(${offset}px)`;
    });
  }

  window.addEventListener('scroll', updateParallax, { passive: true });


  /* ══════════════════════════════════════════════
     8. SCROLL-TRIGGERED ANIMATIONS (IntersectionObserver)
  ══════════════════════════════════════════════ */
  function initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.animate-slide-up, .animate-fade, .animate-pop').forEach(el => {
      observer.observe(el);
    });
  }


  /* ══════════════════════════════════════════════
     9. LOVE COUNTER
  ══════════════════════════════════════════════ */
  // ⚡ Change this to your actual start date!
  const START_DATE = new Date('2026-02-10T00:00:00');

  function updateCounter() {
    const now  = new Date();
    const diff = now - START_DATE;

    const totalSecs = Math.floor(diff / 1000);
    const secs  = totalSecs % 60;
    const mins  = Math.floor(totalSecs / 60) % 60;
    const hrs   = Math.floor(totalSecs / 3600) % 24;
    const days  = Math.floor(totalSecs / 86400);

    const pad = (n, w) => String(n).padStart(w, '0');
    document.getElementById('days').textContent    = pad(days, 3);
    document.getElementById('hours').textContent   = pad(hrs, 2);
    document.getElementById('minutes').textContent = pad(mins, 2);
    document.getElementById('seconds').textContent = pad(secs, 2);
  }

  setInterval(updateCounter, 1000);
  updateCounter();


  /* ══════════════════════════════════════════════
     10. 3D TILT EFFECT ON GALLERY CARDS
  ══════════════════════════════════════════════ */
  function initTilt() {
    document.querySelectorAll('.tilt-card').forEach(card => {
      card.addEventListener('mousemove', e => {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width  / 2;
        const cy     = rect.top  + rect.height / 2;
        const dx     = (e.clientX - cx) / (rect.width  / 2);
        const dy     = (e.clientY - cy) / (rect.height / 2);
        const rotX   = -dy * 10;
        const rotY   =  dx * 10;
        card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.03)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)';
        card.style.transition = 'transform 0.5s ease';
      });

      card.addEventListener('mouseenter', () => {
        card.style.transition = 'transform 0.1s ease';
      });
    });
  }


  /* ══════════════════════════════════════════════
      11. GALLERY LIGHTBOX
  ══════════════════════════════════════════════ */
  const lightbox    = document.getElementById('lightbox');
  const lbImg       = document.getElementById('lightbox-img');
  const lbCaption   = document.getElementById('lightbox-caption');
  const lbClose     = document.getElementById('lightbox-close');
  const lbPrev      = document.getElementById('lightbox-prev');
  const lbNext      = document.getElementById('lightbox-next');

  const galleryData = [
    { url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=1200&q=90', caption: '✨ أول ابتسامة' },
    { url: 'https://images.unsplash.com/photo-1502863661924-2ce4d7e4b6f8?w=1200&q=90', caption: '🌅 وقت ذهبي' },
    { url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=1200&q=90', caption: '🗺️ مغامرتنا' },
    { url: 'https://images.unsplash.com/photo-1523975575015-c5e9f5f4c3ed?w=1200&q=90', caption: '🌙 نجوم الليل' },
    { url: 'https://images.unsplash.com/photo-1543269865-4430f94492b9?w=1200&q=90', caption: '🤝 إيد في إيد' },
    { url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=1200&q=90', caption: '💕 بداية الأبد' },
  ];

  let currentLightboxIdx = 0;

  function openLightbox(idx) {
    currentLightboxIdx = idx;
    const d = galleryData[idx];
    lbImg.style.backgroundImage = `url('${d.url}')`;
    lbCaption.textContent = d.caption;
    lightbox.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
  }

  function navigateLightbox(dir) {
    let idx = currentLightboxIdx + dir;
    if (idx < 0) idx = galleryData.length - 1;
    if (idx >= galleryData.length) idx = 0;
    openLightbox(idx);
  }

  document.querySelectorAll('.gallery-card').forEach(card => {
    card.addEventListener('click', () => {
      const idx = parseInt(card.dataset.lightbox) - 1;
      openLightbox(idx);
    });
  });

  lbClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
  });

  if (lbPrev) lbPrev.addEventListener('click', () => navigateLightbox(-1));
  if (lbNext) lbNext.addEventListener('click', () => navigateLightbox(1));

  function closeLightbox() {
    lightbox.classList.add('hidden');
    document.body.style.overflow = '';
  }


  /* ══════════════════════════════════════════════
      12. SECTION NAV DOTS — SCROLL TRACKING + CLICK
  ══════════════════════════════════════════════ */
  function initNavDots() {
    const nav     = document.getElementById('section-nav');
    const dots    = nav.querySelectorAll('.nav-dot');
    const targets = Array.from(dots).map(d => document.getElementById(d.dataset.target));

    function updateActiveDot() {
      let activeIdx = 0;
      const scrollY = window.scrollY + window.innerHeight * 0.4;
      targets.forEach((t, i) => {
        if (t && t.offsetTop <= scrollY) activeIdx = i;
      });
      dots.forEach((d, i) => d.classList.toggle('active', i === activeIdx));
    }

    window.addEventListener('scroll', updateActiveDot, { passive: true });
    updateActiveDot();

    dots.forEach(d => {
      d.addEventListener('click', () => {
        const target = document.getElementById(d.dataset.target);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ══════════════════════════════════════════════
      13. NEXT SECTION PROMPTS
  ══════════════════════════════════════════════ */
  function initNextSection() {
    document.querySelectorAll('.next-section').forEach(btn => {
      btn.addEventListener('click', () => {
        const section = btn.closest('.story-section');
        let next = section.nextElementSibling;
        while (next && !next.classList.contains('story-section')) {
          next = next.nextElementSibling;
        }
        if (next) next.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  }

  /* ══════════════════════════════════════════════
      14. TIMELINE ANIMATIONS
  ══════════════════════════════════════════════ */
  function initTimeline() {
    const items = document.querySelectorAll('.timeline-item');
    const obs   = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), 100);
        }
      });
    }, { threshold: 0.25 });

    items.forEach(item => obs.observe(item));
  }


  /* ══════════════════════════════════════════════
      15. TYPING EFFECT (Love Letter) + PAPER REVEAL
  ══════════════════════════════════════════════ */
  const letterText = `يا آلاء، في الشغل كنا بنتعامل زي أي ناس عادية — بس كان في حاجة في ضحكتك بتوقفني كل مرة. مش قادر أفسرها، بس كنت دايمًا بدور عليكي بعيني من غير ما أقصد.

يوم ١٠ فبراير، قبل عيد ميلادك بيوم واحد بس، قلت في نفسي مش هقدر أسكت أكتر من كده. قلتلك إني بحبك — وكانت أجمل لحظة خفت منها وفي نفس الوقت حسيت بأمان أوي.

بعدين يوم ١١ — يوم ميلادك يا عسولة — الدنيا كلها احتفلت بيكي، وأنا احتفلت أكتر من أي حد.

ولما جه يوم ١٤ فبراير وقلتيلي بتحبيني، واللهي يا آلاء، حسيت إن القاهرة بكل دوشتها سكتت ثانية وسمعت بس صوتك.

أنا بحبك أوي يا حبيبة قلبي. دايمًا افتكريني، أنا معاكي دايمًا.`;

  let typingDone = false;
  let typingActive = false;

  function initTyping() {
    const section  = document.getElementById('letter-section');
    const target   = document.getElementById('letter-typed');
    const cursor   = document.getElementById('typing-cursor');
    const sign     = document.querySelector('.letter-sign');
    const paper    = document.getElementById('letter-paper');

    if (sign) sign.style.opacity = '0';

    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !typingDone && !typingActive) {
          typingActive = true;
          obs.disconnect();
          // Trigger paper reveal first
          if (paper) {
            paper.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            setTimeout(() => paper.classList.add('revealed'), 100);
          }
          // Start typing after paper reveals
          setTimeout(() => typeText(letterText, target, cursor, sign), 600);
        }
      });
    }, { threshold: 0.3 });

    obs.observe(section);
  }

  function typeText(text, el, cursor, sign) {
    let i = 0;
    const speed = 28; // ms per character

    (function next() {
      if (i < text.length) {
        el.textContent += text[i];
        i++;
        setTimeout(next, speed + (Math.random() * 20));
      } else {
        typingDone = true;
        cursor.style.opacity = '0';
        // Show sign after typing
        if (sign) {
          sign.style.transition = 'opacity 1s ease';
          sign.style.opacity = '1';
        }
      }
    })();
  }


  /* ══════════════════════════════════════════════
      16. SURPRISE BUTTON
  ══════════════════════════════════════════════ */
  const surpriseBtn = document.getElementById('surprise-btn');
  const surpriseMsg = document.getElementById('surprise-message');
  const heartsContainer = document.getElementById('hearts-container');

  surpriseBtn.addEventListener('click', () => {
    // Reveal message
    surpriseMsg.classList.remove('hidden');
    surpriseBtn.style.transform = 'scale(0.95)';
    setTimeout(() => surpriseBtn.style.transform = '', 200);

    // Glow overlay
    const glow = document.createElement('div');
    glow.className = 'glow-overlay active';
    document.body.appendChild(glow);
    setTimeout(() => glow.remove(), 2200);

    // Hearts explosion
    const bx = surpriseBtn.getBoundingClientRect();
    const cx = bx.left + bx.width / 2;
    const cy = bx.top  + bx.height / 2;

    for (let i = 0; i < 30; i++) {
      spawnBurstHeart(cx, cy);
    }

    // Sound pulse
    if (audioCtx && isPlaying) {
      const freq = [523.25, 659.25, 783.99]; // C5-E5-G5 major chord
      freq.forEach(f => {
        const o = audioCtx.createOscillator();
        const g = audioCtx.createGain();
        o.type = 'sine';
        o.frequency.setValueAtTime(f, audioCtx.currentTime);
        g.gain.setValueAtTime(0, audioCtx.currentTime);
        g.gain.linearRampToValueAtTime(0.12, audioCtx.currentTime + 0.1);
        g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.5);
        o.connect(g); g.connect(masterGain);
        o.start(); o.stop(audioCtx.currentTime + 1.6);
      });
    }
  });

  function spawnBurstHeart(cx, cy) {
    const h = document.createElement('div');
    h.className = 'burst-heart';
    h.textContent = ['❤️','💕','💖','💗','💓','🌸'][Math.floor(Math.random() * 6)];

    const angle = Math.random() * Math.PI * 2;
    const dist  = 80 + Math.random() * 160;
    const tx    = Math.cos(angle) * dist + 'px';
    const ty    = Math.sin(angle) * dist + 'px';
    const scale = 0.6 + Math.random() * 1.2;
    const rot   = (Math.random() - 0.5) * 360 + 'deg';

    h.style.left = cx + 'px';
    h.style.top  = cy + 'px';
    h.style.setProperty('--tx', tx);
    h.style.setProperty('--ty', ty);
    h.style.setProperty('--scale', scale);
    h.style.setProperty('--rot', rot);
    h.style.position = 'fixed';
    h.style.zIndex   = 4000;
    h.style.pointerEvents = 'none';
    h.style.fontSize = (14 + Math.random() * 18) + 'px';
    h.style.animationDelay = (Math.random() * 0.3) + 's';

    document.body.appendChild(h);
    setTimeout(() => h.remove(), 2000);
  }


  /* ══════════════════════════════════════════════
      17. FINALE CANVAS — Floating Hearts + Fireworks
  ══════════════════════════════════════════════ */
  function initFinale() {
    const finale  = document.getElementById('finale');
    const fCanvas = document.getElementById('finale-canvas');
    const fCtx    = fCanvas.getContext('2d');
    const floatContainer = document.getElementById('floating-hearts-container');

    // Resize finale canvas
    function resizeFinale() {
      fCanvas.width  = finale.offsetWidth;
      fCanvas.height = finale.offsetHeight;
    }
    resizeFinale();
    window.addEventListener('resize', resizeFinale);

    // Animate finale headline lines on scroll
    const lines    = document.querySelectorAll('.finale-line');
    const overline = document.querySelector('.finale-overline');
    const sub      = document.querySelector('.finale-sub');

    const finaleObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          finaleObs.disconnect();
          animateFinale(lines, overline, sub, floatContainer, fCtx, fCanvas);
        }
      });
    }, { threshold: 0.3 });

    finaleObs.observe(finale);

    // Restart button
    const restartBtn = document.getElementById('restart-btn');
    if (restartBtn) {
      restartBtn.addEventListener('click', () => {
        storyEl.classList.add('hidden');
        introEl.style.display    = '';
        introEl.style.opacity    = '0';
        introEl.style.transform  = 'scale(1.04)';
        window.scrollTo({ top: 0, behavior: 'instant' });
        setTimeout(() => {
          introEl.style.transition = 'opacity 1s ease, transform 1s ease';
          introEl.style.opacity    = '1';
          introEl.style.transform  = 'scale(1)';
        }, 50);
      });
    }
  }

  function animateFinale(lines, overline, sub, floatContainer, ctx, canvas) {
    // Overline
    overline.style.transition = 'opacity 1s ease';
    overline.style.opacity = '1';

    // Lines staggered
    lines.forEach((line, i) => {
      setTimeout(() => {
        line.style.transition = 'opacity 0.9s ease, transform 0.9s ease';
        line.style.opacity = '1';
        line.style.transform = 'translateY(0)';
      }, 600 + i * 400);
    });

    // Sub
    setTimeout(() => {
      sub.style.transition = 'opacity 1s ease';
      sub.style.opacity = '1';
    }, 600 + lines.length * 400 + 400);

    // Start floating hearts
    setTimeout(() => {
      startFloatingHearts(floatContainer);
      startFireworks(ctx, canvas);
    }, 1800);
  }

  function startFloatingHearts(container) {
    const emojis = ['❤️','💕','💖','💗','💓','🌸','✨','💫'];
    let count = 0;
    const interval = setInterval(() => {
      if (count++ > 80) { clearInterval(interval); return; }
      const h = document.createElement('div');
      h.className = 'floating-heart';
      h.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      const size = 1 + Math.random() * 2;
      const duration = 4 + Math.random() * 5;
      const drift = (Math.random() - 0.5) * 100;
      h.style.setProperty('--size', size + 'rem');
      h.style.setProperty('--duration', duration + 's');
      h.style.setProperty('--drift', drift + 'px');
      h.style.setProperty('--x', (10 + Math.random() * 80) + '%');
      h.style.animationDelay = (Math.random() * 3) + 's';
      container.appendChild(h);
      setTimeout(() => h.remove(), (duration + 3) * 1000);
    }, 300);
  }

  // Simple canvas fireworks
  let fireworkParticles = [];
  let fireworksRAF = null;

  function startFireworks(ctx, canvas) {
    spawnFirework(ctx, canvas);
    const iv = setInterval(() => spawnFirework(ctx, canvas), 1200);
    setTimeout(() => clearInterval(iv), 10000);
    animateFireworks(ctx, canvas);
  }

  function stopFireworks() {
    if (fireworksRAF) { cancelAnimationFrame(fireworksRAF); fireworksRAF = null; }
  }

  function spawnFirework(ctx, canvas) {
    const x = canvas.width  * (0.2 + Math.random() * 0.6);
    const y = canvas.height * (0.1 + Math.random() * 0.5);
    const hue = Math.random() * 360;
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const speed = 2 + Math.random() * 4;
      fireworkParticles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: `hsl(${hue},80%,65%)`,
        r: 2 + Math.random() * 2,
      });
    }
  }

  function animateFireworks(ctx, canvas) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    fireworkParticles = fireworkParticles.filter(p => p.alpha > 0.01);
    fireworkParticles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.06; // gravity
      p.alpha *= 0.97;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = p.color.replace('hsl', 'hsla').replace(')', `, ${p.alpha})`);
      ctx.fill();
    });
    if (fireworkParticles.length > 0) {
      fireworksRAF = requestAnimationFrame(() => animateFireworks(ctx, canvas));
    }
  }


  /* ══════════════════════════════════════════════
      18. GSAP SCROLL-TRIGGER (if available)
  ══════════════════════════════════════════════ */
  function initGSAP() {
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') return;

    gsap.registerPlugin(ScrollTrigger);

    // Animate counter section numbers
    ScrollTrigger.create({
      trigger: '#counter-section',
      start: 'top 70%',
      onEnter: () => {
        gsap.from('.counter-block', {
          y: 40, opacity: 0, stagger: 0.15, duration: 0.9, ease: 'power3.out',
        });
      },
      once: true,
    });

    // Gallery grid stagger
    ScrollTrigger.create({
      trigger: '#gallery-section',
      start: 'top 70%',
      onEnter: () => {
        gsap.from('.gallery-card', {
          scale: 0.85, opacity: 0, stagger: 0.1, duration: 0.7, ease: 'back.out(1.4)',
        });
      },
      once: true,
    });

    // Reasons cards
    ScrollTrigger.create({
      trigger: '#reasons-section',
      start: 'top 70%',
      onEnter: () => {
        gsap.from('.reason-card', {
          y: 30, opacity: 0, stagger: 0.08, duration: 0.6, ease: 'power2.out',
        });
      },
      once: true,
    });

    // Finale lines (backup for non-GSAP path)
    ScrollTrigger.create({
      trigger: '#finale',
      start: 'top 70%',
      once: true,
    });
  }


  /* ══════════════════════════════════════════════
      19. INIT STORY (called after enter btn)
  ══════════════════════════════════════════════ */
  function initStory() {
    initScrollAnimations();
    initTilt();
    initTimeline();
    initTyping();
    initFinale();
    initNavDots();
    initNextSection();

    // Small delay for GSAP to load
    setTimeout(initGSAP, 100);

    // Start parallax
    updateParallax();
  }

  /* Pre-init the counter so it works even before "Enter" */
  updateCounter();

}); // END DOMContentLoaded