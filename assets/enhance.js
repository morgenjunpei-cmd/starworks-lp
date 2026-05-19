/* ============================================================
   ENHANCE LAYER — 5 MAJOR PRO FEATURES
   1. Lenis smooth scroll
   2. SplitText hero reveal
   3. Magnetic CTA buttons
   4. Constellation star effect
   5. Advanced scroll animations
   ============================================================ */

(function () {
  'use strict';

  /* ========== 0. Lenis Smooth Scroll（全体をぬるっと） ========== */
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smoothWheel: true,
    smoothTouch: false,
    touchMultiplier: 2,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  /* ========== 1. IntersectionObserver Scroll Reveal ========== */
  const revealEls = document.querySelectorAll('.reveal, .reveal-scale, .reveal-left');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  /* ========== 2. SplitText Hero Headline（文字ごとリビール） ========== */
  const heroHeadline = document.querySelector('.hero-title h1');
  if (heroHeadline && window.SplitText) {
    // グローバルなdelay を0 に戻す（SplitTextの後で個別にスタガーさせる）
    const split = new SplitText(heroHeadline, {
      type: 'chars',
      charsClass: 'char-reveal',
    });

    gsap.to(split.chars, {
      duration: 0.8,
      y: 0,
      opacity: 1,
      stagger: 0.04,
      ease: 'expo.out',
      delay: 0.3,
    });

    // 初期状態をセット
    gsap.set(split.chars, { y: 40, opacity: 0 });
  }

  /* ========== 3. Custom Cursor（マウス追従ドット） ========== */
  if (window.matchMedia('(pointer:fine)').matches) {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    let x = 0,
      y = 0,
      tx = 0,
      ty = 0;
    const speed = 0.15; // lerp速度

    document.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
    });

    function animateCursor() {
      tx += (x - tx) * speed;
      ty += (y - ty) * speed;
      cursor.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // CTAやリンクにホバーでカーソル拡大
    const clickables = document.querySelectorAll('a, button, [role="button"]');
    clickables.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
  }

  /* ========== 4. Constellation Star Effect（星座エフェクト） ========== */
  const hero = document.querySelector('.hero');
  if (hero) {
    // Canvas setup
    const canvas = document.createElement('canvas');
    canvas.className = 'constellation-canvas';
    canvas.style.cssText = `
      position: absolute;
      top: 0; left: 0;
      width: 100%; height: 100%;
      z-index: 0;
      pointer-events: none;
      opacity: 0.4;
    `;
    hero.style.position = 'relative';
    hero.insertBefore(canvas, hero.firstChild);

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;

    function resizeCanvas() {
      const rect = hero.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Star particles
    const particles = [];
    const particleCount = 30;

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 1.5 + 0.5;
        this.opacity = Math.random() * 0.5 + 0.3;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }

      draw() {
        ctx.fillStyle = `rgba(31, 179, 168, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    hero.addEventListener('mousemove', (e) => {
      const rect = hero.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    function drawLines() {
      particles.forEach((p1, i) => {
        particles.forEach((p2, j) => {
          if (i < j) {
            const dx = p1.x - p2.x;
            const dy = p1.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
              const opacity = (1 - dist / 150) * 0.3;
              ctx.strokeStyle = `rgba(31, 179, 168, ${opacity})`;
              ctx.lineWidth = 0.5;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        });

        // Connect to mouse
        const dx = p1.x - mouseX;
        const dy = p1.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < 120) {
          const opacity = (1 - dist / 120) * 0.5;
          ctx.strokeStyle = `rgba(31, 179, 168, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(mouseX, mouseY);
          ctx.stroke();
        }
      });
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.update();
        p.draw();
      });

      drawLines();
      requestAnimationFrame(animate);
    }
    animate();
  }

  /* ========== 5. Card Spotlight Tracking ========== */
  const cards = document.querySelectorAll('.trouble-card, .why-card, .funnel-card, .approach-card, .preview-card');
  cards.forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      card.style.setProperty('--mx', `${x}%`);
      card.style.setProperty('--my', `${y}%`);
    });

    card.addEventListener('mouseleave', () => {
      card.style.setProperty('--mx', '50%');
      card.style.setProperty('--my', '50%');
    });
  });

  /* ========== 6. Magnetic CTA Button ========== */
  const heroBtn = document.querySelector('.hero-cta, .btn-teal');
  const floatingCta = document.querySelector('.floating-cta');

  function addMagneticEffect(btn) {
    if (!btn) return;

    const magneticStrength = 0.3;

    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      gsap.to(btn, {
        x: x * magneticStrength,
        y: y * magneticStrength,
        duration: 0.3,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    });

    btn.addEventListener('mouseleave', () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: 'elastic.out(1, 0.5)',
        overwrite: 'auto',
      });
    });
  }

  addMagneticEffect(heroBtn);
  addMagneticEffect(floatingCta);

  /* ========== 7. Floating CTA ========== */
  const fc = document.querySelector('.floating-cta');
  if (!fc) {
    const newFc = document.createElement('a');
    newFc.href = 'contact.html';
    newFc.className = 'floating-cta';
    newFc.setAttribute('data-cta', 'floating');
    newFc.innerHTML = '無料相談 <span class="fc-arrow">→</span>';
    document.body.appendChild(newFc);
  }

  const onScroll = () => {
    const y = window.scrollY || document.documentElement.scrollTop;
    const h = window.innerHeight;
    const footer = document.querySelector('.footer');
    const showFrom = h * 0.8;
    const hideAt = footer ? footer.getBoundingClientRect().top + window.scrollY - h * 0.9 : Infinity;

    const fcEl = document.querySelector('.floating-cta');
    if (fcEl) {
      if (y > showFrom && y < hideAt) {
        fcEl.classList.add('visible');
      } else {
        fcEl.classList.remove('visible');
      }
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ========== 8. Card Background Numbers ========== */
  document.querySelectorAll('.trouble-card').forEach((card) => {
    const t = card.querySelector('.tnum');
    if (!t) return;
    const m = t.textContent.match(/\d+/);
    if (m) card.setAttribute('data-bgnum', m[0]);
  });

  document.querySelectorAll('.funnel-card').forEach((card) => {
    const f = card.querySelector('.fn-num');
    if (!f) return;
    const m = f.textContent.match(/\d+/);
    if (m) card.setAttribute('data-step', m[0]);
  });

  /* ========== 9. Hero Orbs Parallax ========== */
  const hero2 = document.querySelector('.hero');
  const orbs = document.querySelectorAll('.hero-orb');
  if (hero2 && orbs.length && window.matchMedia('(pointer:fine)').matches) {
    hero2.addEventListener('mousemove', (e) => {
      const r = hero2.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      orbs.forEach((orb, i) => {
        const mult = (i + 1) * 12;
        orb.style.transform = `translate(${x * mult}px, ${y * mult}px)`;
      });
    });
  }

  /* ========== 10. Number Counter Animation ========== */
  const priceEls = document.querySelectorAll('.pv-price');
  const animateNumber = (el, target) => {
    const dur = 1400;
    const start = performance.now();
    const prefix = '¥';
    const suffix = el.querySelector('span') ? el.querySelector('span').outerHTML : '';
    const step = (now) => {
      const p = Math.min(1, (now - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      const v = Math.floor(target * eased);
      el.innerHTML = prefix + v.toLocaleString() + suffix;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if ('IntersectionObserver' in window) {
    const priceIO = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const txt = e.target.textContent;
            const m = txt.match(/[\d,]+/);
            if (m) {
              const n = parseInt(m[0].replace(/,/g, ''), 10);
              if (!isNaN(n) && n > 0) animateNumber(e.target, n);
            }
            priceIO.unobserve(e.target);
          }
        });
      },
      { threshold: 0.6 }
    );
    priceEls.forEach((el) => priceIO.observe(el));
  }

  /* ========== 11. Hero Typewriter（オプション） ========== */
  const ht = document.querySelector('.hero-title .ht-line');
  if (ht && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const txt = ht.textContent;
    ht.textContent = '';
    ht.style.borderRight = '2px solid rgba(255,255,255,.5)';
    let i = 0;
    const speed = 90;
    setTimeout(function tick() {
      if (i < txt.length) {
        ht.textContent += txt[i++];
        setTimeout(tick, speed);
      } else {
        setTimeout(() => {
          ht.style.borderRight = 'none';
        }, 600);
      }
    }, 300);
  }
})();
