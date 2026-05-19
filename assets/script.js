/* ============================================
   Starプラス — Common JavaScript
   ============================================ */

(() => {
  // ─── スクロール時のフェードアップアニメーション ───
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-scale');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  // ─── ハンバーガーメニュー ───
  const hamburger = document.querySelector('.hamburger');
  const sidebar   = document.querySelector('.sidebar');
  const overlay   = document.querySelector('.mb-overlay');
  if (hamburger && sidebar && overlay) {
    const closeMenu = () => {
      hamburger.classList.remove('open');
      sidebar.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    };
    hamburger.addEventListener('click', () => {
      const isOpen = sidebar.classList.toggle('open');
      hamburger.classList.toggle('open', isOpen);
      overlay.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });
    overlay.addEventListener('click', closeMenu);
    sidebar.querySelectorAll('.sidebar-nav a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ─── Q&A アコーディオン ───
  document.querySelectorAll('.qa-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.qa-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.qa-item.open').forEach(el => el.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── FAQ カテゴリタブ ───
  const qaTabs = document.querySelectorAll('.qa-tab');
  if (qaTabs.length) {
    qaTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        const cat = tab.dataset.cat;
        qaTabs.forEach(t => t.classList.toggle('active', t === tab));
        document.querySelectorAll('.qa-item').forEach(item => {
          item.style.display = (cat === 'all' || item.dataset.cat === cat) ? '' : 'none';
        });
        document.querySelectorAll('.qa-category-title').forEach(h => {
          h.style.display = (cat === 'all' || h.dataset.cat === cat) ? '' : 'none';
        });
      });
    });
  }

  // ─── アンカーリンクのスムーススクロール ───
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    const href = a.getAttribute('href');
    if (href === '#' || href === '#!') return;
    a.addEventListener('click', e => {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = window.innerWidth <= 880 ? 64 : 0;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ─── URLパラメータからプランを自動入力 ───
  // 対応キー: simple / standard / full / spot / partial / full-renewal
  const params = new URLSearchParams(window.location.search);
  const planParam = params.get('plan');
  if (planParam) {
    const planSelect = document.querySelector('select[name="plan"]');
    if (planSelect) {
      // value 属性で直接マッチを試みる
      const optByValue = planSelect.querySelector('option[value="' + planParam + '"]');
      if (optByValue) {
        planSelect.value = planParam;
      } else {
        // 表示テキストからのフォールバックマッピング
        const planMap = {
          'simple':       'シンプルLP（55,000円〜）',
          'standard':     'スタンダード（88,000円〜）',
          'full':         'フルサポート（132,000円〜）',
          'spot':         'スポット修正（22,000円〜）',
          'partial':      '部分リニューアル（44,000円〜）',
          'full-renewal': 'フルリニューアル（77,000円〜）'
        };
        const text = planMap[planParam];
        if (text) {
          [...planSelect.options].forEach(o => {
            if (o.textContent.trim() === text || o.value === text) planSelect.value = o.value;
          });
        }
      }
    }
  }

  // ─── 同意チェックで送信ボタン制御 ───
  const consent = document.querySelector('#privacy-consent');
  const submitBtn = document.querySelector('.contact-form .submit-btn');
  if (consent && submitBtn) {
    const updateBtn = () => {
      submitBtn.disabled = !consent.checked;
      submitBtn.setAttribute('aria-disabled', String(!consent.checked));
    };
    updateBtn();
    consent.addEventListener('change', updateBtn);
  }

  // ─── サンプル制作事例カルーセル ───
  const carousel = document.querySelector('[data-carousel]');
  if (carousel) {
    const track = carousel.querySelector('.carousel-track');
    const slides = [...carousel.querySelectorAll('.carousel-slide')];
    const prevBtn = carousel.querySelector('[data-carousel-prev]');
    const nextBtn = carousel.querySelector('[data-carousel-next]');
    const dotsWrap = carousel.querySelector('.carousel-dots');

    let index = 0;
    let perView = 1;
    let autoTimer = null;

    const calcPerView = () => {
      const w = window.innerWidth;
      perView = w >= 1100 ? 3 : (w >= 768 ? 2 : 1);
    };

    const maxIndex = () => Math.max(0, slides.length - perView);

    const goTo = (i) => {
      calcPerView();
      index = Math.max(0, Math.min(i, maxIndex()));
      const slideWidth = 100 / perView;
      track.style.transform = `translateX(-${index * slideWidth}%)`;
      // ドット更新
      if (dotsWrap) {
        [...dotsWrap.querySelectorAll('.carousel-dot')].forEach((d, di) => {
          d.classList.toggle('active', di === index);
        });
      }
    };

    const buildDots = () => {
      if (!dotsWrap) return;
      dotsWrap.innerHTML = '';
      const pageCount = maxIndex() + 1;
      for (let i = 0; i < pageCount; i++) {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'carousel-dot' + (i === index ? ' active' : '');
        b.setAttribute('aria-label', `スライド ${i + 1}`);
        b.addEventListener('click', () => { goTo(i); resetAuto(); });
        dotsWrap.appendChild(b);
      }
    };

    const next = () => goTo(index >= maxIndex() ? 0 : index + 1);
    const prev = () => goTo(index <= 0 ? maxIndex() : index - 1);

    const resetAuto = () => {
      if (autoTimer) clearInterval(autoTimer);
      autoTimer = setInterval(next, 5000);
    };

    if (prevBtn) prevBtn.addEventListener('click', () => { prev(); resetAuto(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { next(); resetAuto(); });

    // タッチスワイプ
    let startX = 0, isDown = false, deltaX = 0;
    track.addEventListener('touchstart', (e) => {
      isDown = true; startX = e.touches[0].clientX; deltaX = 0;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      if (!isDown) return;
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    track.addEventListener('touchend', () => {
      if (!isDown) return;
      if (deltaX > 50) prev();
      else if (deltaX < -50) next();
      isDown = false;
      resetAuto();
    });

    // 自動再生はマウスホバーで停止
    carousel.addEventListener('mouseenter', () => { if (autoTimer) clearInterval(autoTimer); });
    carousel.addEventListener('mouseleave', resetAuto);

    // リサイズ対応
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        const prevPv = perView;
        calcPerView();
        if (prevPv !== perView) buildDots();
        goTo(Math.min(index, maxIndex()));
      }, 150);
    });

    calcPerView();
    buildDots();
    goTo(0);
    resetAuto();
  }

  // ─── CTAクリック計測（GA4 等が入っていれば連携） ───
  // data-cta="..." 属性を持つ要素のクリックを dataLayer / gtag に送る
  document.querySelectorAll('[data-cta]').forEach(el => {
    el.addEventListener('click', () => {
      const label = el.getAttribute('data-cta');
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'cta_click', cta_label: label });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'cta_click', { cta_label: label });
      }
      // コンソールへの開発時ヒント（本番では削除して構いません）
      // console.log('[CTA]', label);
    });
  });

  // ─── お問い合わせフォーム送信時、計測フック ───
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', () => {
      if (window.dataLayer) {
        window.dataLayer.push({ event: 'form_submit', form_name: 'contact' });
      }
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'form_submit', { form_name: 'contact' });
      }
    });
  }

  // ─── サンプルマーキー：手動横スクロール対応 ───
  document.querySelectorAll('[data-marquee]').forEach(marquee => {
    const track = marquee.querySelector('.marquee-track');
    if (!track) return;

    let isDragging = false;
    let startX = 0;
    let startTranslate = 0;
    let currentTranslate = 0;
    let dragMoved = false;
    let resumeTimer = null;

    // 現在のtransform値を取得
    const getCurrentTranslate = () => {
      const cs = window.getComputedStyle(track);
      const matrix = cs.transform || cs.webkitTransform;
      if (matrix === 'none' || !matrix) return 0;
      try {
        const m = new DOMMatrixReadOnly(matrix);
        return m.m41;
      } catch (e) { return 0; }
    };

    const pauseAnim = () => {
      currentTranslate = getCurrentTranslate();
      track.style.animation = 'none';
      track.style.transform = `translateX(${currentTranslate}px)`;
      marquee.classList.add('is-paused');
    };

    const resumeAnim = () => {
      // 現在位置から自然に流すため、CSSアニメーションに戻す
      track.style.transform = '';
      track.style.animation = '';
      marquee.classList.remove('is-paused');
    };

    const scheduleResume = (delay = 2500) => {
      if (resumeTimer) clearTimeout(resumeTimer);
      resumeTimer = setTimeout(resumeAnim, delay);
    };

    // 無限ループ用：トラックの幅の半分を超えたら反対側にラップ
    const wrapTranslate = () => {
      const halfWidth = track.scrollWidth / 2;
      if (currentTranslate <= -halfWidth) currentTranslate += halfWidth;
      else if (currentTranslate > 0) currentTranslate -= halfWidth;
    };

    // pointer events for touch + mouse
    const onPointerDown = (e) => {
      // 拡大ライトボックスのクリックを優先（カードを直接タップ）：
      // ただしドラッグ中はクリックを抑止
      isDragging = true;
      dragMoved = false;
      pauseAnim();
      if (resumeTimer) clearTimeout(resumeTimer);
      startX = (e.touches ? e.touches[0].clientX : e.clientX);
      startTranslate = currentTranslate;
      marquee.classList.add('is-dragging');
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const x = (e.touches ? e.touches[0].clientX : e.clientX);
      const dx = x - startX;
      if (Math.abs(dx) > 5) dragMoved = true;
      currentTranslate = startTranslate + dx;
      wrapTranslate();
      track.style.transform = `translateX(${currentTranslate}px)`;
    };
    const onPointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      marquee.classList.remove('is-dragging');
      scheduleResume();
    };

    // クリックをドラッグ後は抑止（ライトボックスが暴発しないように）
    marquee.addEventListener('click', (e) => {
      if (dragMoved) {
        e.stopPropagation();
        e.preventDefault();
        dragMoved = false;
      }
    }, true);

    // mouse
    marquee.addEventListener('mousedown', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);

    // touch
    marquee.addEventListener('touchstart', onPointerDown, { passive: true });
    marquee.addEventListener('touchmove', onPointerMove, { passive: true });
    marquee.addEventListener('touchend', onPointerUp);
    marquee.addEventListener('touchcancel', onPointerUp);

    // ホバーでは一時停止、離れたら再開（CSS側でも対応済みだがJS側でも揃える）
    marquee.addEventListener('mouseenter', () => {
      if (!isDragging) { pauseAnim(); }
    });
    marquee.addEventListener('mouseleave', () => {
      if (!isDragging) { scheduleResume(300); }
    });
  });

  // ─── ライトボックス（サンプル画像の拡大表示） ───
  const lightbox = document.getElementById('lightbox');
  if (lightbox) {
    const lbImg     = lightbox.querySelector('.lightbox-img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose   = lightbox.querySelector('.lightbox-close');
    const lbPrev    = lightbox.querySelector('.lightbox-prev');
    const lbNext    = lightbox.querySelector('.lightbox-next');

    // ユニーク画像リスト（複製分は除外）
    const seenSrc = new Set();
    const items = [];
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      const src = el.getAttribute('data-src');
      if (!seenSrc.has(src)) {
        seenSrc.add(src);
        items.push({
          src,
          caption: el.getAttribute('data-caption') || '',
        });
      }
    });

    let current = 0;
    const open = (index) => {
      current = index;
      const item = items[current];
      if (!item) return;
      lbImg.src = item.src;
      lbImg.alt = item.caption;
      lbCaption.textContent = item.caption;
      lightbox.classList.add('is-open');
      lightbox.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };
    const close = () => {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };
    const next = () => { current = (current + 1) % items.length; open(current); };
    const prev = () => { current = (current - 1 + items.length) % items.length; open(current); };

    // クリックでオープン（複製も同じsrcで開ける）
    document.querySelectorAll('[data-lightbox]').forEach(el => {
      el.addEventListener('click', () => {
        const src = el.getAttribute('data-src');
        const idx = items.findIndex(it => it.src === src);
        if (idx >= 0) open(idx);
      });
    });

    lbClose.addEventListener('click', close);
    lbNext.addEventListener('click', next);
    lbPrev.addEventListener('click', prev);
    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) close();
    });
    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('is-open')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });

    // タッチでスワイプ送り
    let touchX = 0;
    lightbox.addEventListener('touchstart', (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    lightbox.addEventListener('touchend',   (e) => {
      const dx = e.changedTouches[0].clientX - touchX;
      if (Math.abs(dx) > 50) (dx < 0 ? next() : prev());
    });
  }
})();
