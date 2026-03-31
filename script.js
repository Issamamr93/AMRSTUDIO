// =============================================
// CHARGEMENT DES PARAMÈTRES DEPUIS _data/settings.json
// =============================================
async function applySettings() {
  try {
    const res = await fetch('_data/settings.json');
    if (!res.ok) return;
    const s = await res.json();

    // ── HERO ──
    if (s.photographer_name) {
      document.querySelectorAll('.hero-name, .footer-name').forEach(el => el.textContent = s.photographer_name);
      const brand = document.querySelector('.top-nav-brand');
      if (brand) brand.textContent = s.photographer_name + ' — ' + (s.hero_title || 'AMR Studio');
      document.title = s.photographer_name + ' — ' + (s.hero_title || 'AMR Studio');
    }
    if (s.hero_kicker) {
      const el = document.querySelector('.hero-kicker');
      if (el) el.textContent = s.hero_kicker;
    }
    if (s.hero_title) {
      const el = document.querySelector('.hero-title');
      if (el) el.textContent = s.hero_title;
    }
    if (s.hero_subtitle) {
      const el = document.querySelector('.hero-subtitle');
      if (el) el.textContent = s.hero_subtitle;
    }
    if (s.cover_image) {
      const el = document.querySelector('.hero-image');
      if (el) el.src = s.cover_image;
    }

    // ── SECTION APERÇU ──
    if (s.overview_title) {
      const el = document.querySelector('.home-overview-text h2');
      if (el) el.textContent = s.overview_title;
    }
    if (s.overview_text) {
      const el = document.querySelector('.home-overview-text p');
      if (el) el.textContent = s.overview_text;
    }

    // ── FOOTER ──
    if (s.footer_tagline) {
      const el = document.querySelector('.footer-tagline');
      if (el) el.textContent = s.footer_tagline;
    }
    if (s.footer_text) {
      const el = document.querySelector('.footer-text');
      if (el) el.textContent = s.footer_text;
    }
    if (s.email) {
      const el = document.querySelector('a[href^="mailto:"]');
      if (el) { el.href = 'mailto:' + s.email; el.textContent = s.email; }
    }
    if (s.instagram_url) {
      const el = document.querySelector('a[href*="instagram"]');
      if (el) el.href = s.instagram_url;
    }
    if (s.linkedin_url) {
      const el = document.querySelector('a[href*="linkedin"]');
      if (el) el.href = s.linkedin_url;
    }

    // ── SEO ──
    if (s.meta_description) {
      const el = document.querySelector('meta[name="description"]');
      if (el) el.setAttribute('content', s.meta_description);
    }

  } catch (e) {
    // Silently ignore — le site affiche les valeurs HTML par défaut
  }
}

// =============================================
// DONNÉES DES GALERIES (chargées depuis _data/galleries.json)
// =============================================
let galleriesData = [];

function renderThemeCards() {
  const container = document.getElementById('themes');
  if (!container) return;
  container.innerHTML = '';
  galleriesData.forEach(g => {
    const count = g.photos ? g.photos.length : 0;
    const article = document.createElement('article');
    article.className = 'theme-card';
    article.dataset.theme = g.key;
    article.dataset.title = g.title;
    article.dataset.count = count;
    article.tabIndex = 0;
    article.setAttribute('role', 'button');
    article.setAttribute('aria-label', `Ouvrir la galerie ${g.title} — ${count} photos`);
    article.innerHTML = `
      <img src="${g.cover}" alt="${g.title}" loading="lazy" />
      <div class="theme-overlay">
        <span class="theme-title">${g.title}</span>
        <span class="theme-tagline">${g.tagline || ''}</span>
        <span class="theme-count">${count} photos</span>
      </div>
    `;
    container.appendChild(article);
  });
}

function renderOverviewThumbs() {
  const grid = document.getElementById('overview-grid');
  if (!grid) return;
  grid.innerHTML = '';
  galleriesData.forEach(g => {
    const btn = document.createElement('button');
    btn.className = 'home-overview-thumb';
    btn.dataset.theme = g.key;
    btn.dataset.title = g.title;
    btn.type = 'button';
    btn.setAttribute('aria-label', `Ouvrir la galerie ${g.title}`);
    const imgSrc = g.overview_image || g.cover;
    btn.innerHTML = `<img src="${imgSrc}" alt="Aperçu ${g.title}" loading="lazy" />`;
    grid.appendChild(btn);
  });
}

async function loadAndRenderGalleries() {
  try {
    const res = await fetch('_data/galleries.json');
    if (!res.ok) return;
    const json = await res.json();
    galleriesData = json.galleries || [];
    renderThemeCards();
    renderOverviewThumbs();
  } catch (e) {
    // Silently ignore
  }
}

// =============================================
// ÉTAT DU LIGHTBOX
// =============================================
let lightboxImages = [];
let lightboxIndex = 0;
let currentGalleryTheme = '';

document.addEventListener('DOMContentLoaded', () => {

  applySettings();
  loadAndRenderGalleries();

  // =============================================
  // DARK MODE
  // =============================================
  const htmlEl = document.documentElement;
  const darkToggle = document.getElementById('dark-toggle');
  const savedTheme = localStorage.getItem('theme') || 'light';
  htmlEl.setAttribute('data-theme', savedTheme);

  if (darkToggle) {
    darkToggle.addEventListener('click', () => {
      const current = htmlEl.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      htmlEl.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }

  // =============================================
  // BACK TO TOP
  // =============================================
  const backToTopBtn = document.getElementById('back-to-top');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      backToTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // --- Références DOM ---
  const navEl         = document.getElementById('top-nav');
  const navLinks      = document.querySelectorAll('.top-nav-link');
  const hamburger     = document.getElementById('nav-hamburger');
  const mobileMenu    = document.getElementById('top-nav-links');

  const scrollBar     = document.getElementById('scroll-progress');

  const openButton    = document.getElementById('open-collection');

  const galleryView   = document.getElementById('gallery-view');
  const galleryTitle  = document.getElementById('gallery-title');
  const galleryGrid   = document.getElementById('gallery-grid');
  const backBtn       = document.getElementById('back-to-themes');

  const contactToggle  = document.getElementById('contact-toggle');
  const contactWrapper = document.getElementById('contact-form-wrapper');
  const contactForm    = document.querySelector('.contact-form');
  const formSuccess    = document.getElementById('form-success');

  const exploreCursor  = document.getElementById('explore-cursor');

  const lightbox       = document.getElementById('lightbox');
  const lightboxImg    = document.getElementById('lightbox-img');
  const lightboxBackdrop = document.getElementById('lightbox-backdrop');
  const lightboxClose  = document.getElementById('lightbox-close');
  const lightboxPrevBtn = document.getElementById('lightbox-prev');
  const lightboxNextBtn = document.getElementById('lightbox-next');
  const lightboxCounter = document.getElementById('lightbox-counter');

  const footerYear     = document.getElementById('footer-year');

  // =============================================
  // ANNÉE COURANTE DANS LE FOOTER
  // =============================================
  if (footerYear) {
    footerYear.textContent = new Date().getFullYear();
  }

  // =============================================
  // BARRE DE PROGRESSION
  // =============================================
  function updateScrollProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    scrollBar.style.width = pct + '%';
  }

  window.addEventListener('scroll', updateScrollProgress, { passive: true });

  // =============================================
  // NAV — EFFET GLASS AU SCROLL
  // =============================================
  function updateNavScroll() {
    navEl.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', updateNavScroll, { passive: true });
  updateNavScroll();

  // =============================================
  // PARALLAX HERO
  // =============================================
  const heroMedia = document.querySelector('.hero-media');
  if (heroMedia) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroMedia.style.transform = `translateY(${y * 0.12}px)`;
      }
    }, { passive: true });
  }

  // =============================================
  // NAVIGATION ACTIVE (IntersectionObserver)
  // =============================================
  const navSectionIds = ['hero', 'overview', 'themes', 'contact'];
  const navSectionMap = {};

  navLinks.forEach((link) => {
    const t = link.dataset.target;
    if (t) navSectionMap[t] = link;
  });

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        const id = entry.target.id;
        const link = navSectionMap[id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach((l) => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-40% 0px -50% 0px', threshold: 0 }
  );

  navSectionIds.forEach((id) => {
    const el = document.getElementById(id);
    if (el) sectionObserver.observe(el);
  });

  // =============================================
  // HAMBURGER MENU MOBILE
  // =============================================
  if (hamburger) {
    hamburger.addEventListener('click', () => {
      const isOpen = navEl.classList.toggle('menu-open');
      hamburger.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
  }

  // Fermer le menu mobile au clic sur un lien
  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      navEl.classList.remove('menu-open');
      hamburger && hamburger.setAttribute('aria-expanded', 'false');
    });
  });

  // =============================================
  // NAVIGATION — SCROLL
  // =============================================
  if (openButton) {
    openButton.addEventListener('click', () => {
      const target = document.querySelector('.home-overview');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  navLinks.forEach((link) => {
    link.addEventListener('click', () => {
      const targetId = link.dataset.target;
      if (!targetId) return;
      // Si la galerie est ouverte et on clique "Thèmes", revenir à la grille
      if (targetId === 'themes' && !galleryView.classList.contains('hidden')) {
        hideGallery();
        return;
      }
      const target = document.getElementById(targetId);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  // =============================================
  // OBSERVER SCROLL DES ÉLÉMENTS DE GALERIE
  // =============================================
  const itemObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          itemObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  // =============================================
  // THÈMES — DÉLÉGATION D'ÉVÉNEMENTS
  // =============================================
  const themesEl = document.getElementById('themes');
  if (themesEl) {
    themesEl.addEventListener('click', (e) => {
      const card = e.target.closest('.theme-card');
      if (card) showGallery(card.dataset.theme, card.dataset.title || '');
    });
    themesEl.addEventListener('keydown', (e) => {
      const card = e.target.closest('.theme-card');
      if (card && (e.key === 'Enter' || e.key === ' ')) {
        e.preventDefault();
        showGallery(card.dataset.theme, card.dataset.title || '');
      }
    });
    themesEl.addEventListener('mouseover', (e) => {
      if (e.target.closest('.theme-card')) {
        document.body.style.cursor = 'none';
        exploreCursor.style.opacity = '1';
      }
    });
    themesEl.addEventListener('mouseout', (e) => {
      const card = e.target.closest('.theme-card');
      if (card && !card.contains(e.relatedTarget)) {
        document.body.style.cursor = '';
        exploreCursor.style.opacity = '0';
      }
    });
    themesEl.addEventListener('mousemove', (e) => {
      if (e.target.closest('.theme-card')) {
        exploreCursor.style.transform = `translate(${e.clientX - 37}px, ${e.clientY - 37}px)`;
      }
    });
  }

  // =============================================
  // APERÇU — DÉLÉGATION D'ÉVÉNEMENTS
  // =============================================
  const overviewGridEl = document.getElementById('overview-grid');
  if (overviewGridEl) {
    overviewGridEl.addEventListener('click', (e) => {
      const thumb = e.target.closest('.home-overview-thumb');
      if (thumb) showGallery(thumb.dataset.theme, thumb.dataset.title || '');
    });
  }

  // =============================================
  // RETOUR AUX THÈMES
  // =============================================
  if (backBtn) {
    backBtn.addEventListener('click', hideGallery);
  }

  function hideGallery() {
    galleryView.classList.add('hidden');
    setTimeout(() => {
      galleryView.style.display = 'none';
      const themesSection = document.getElementById('themes');
      themesSection.style.display = 'grid';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          themesSection.classList.remove('hidden');
          themesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }, 300);
  }

  // =============================================
  // AFFICHER UNE GALERIE
  // =============================================
  function showGallery(themeKey, title) {
    const gallery = galleriesData.find(g => g.key === themeKey);
    const images = gallery ? (gallery.photos || []) : [];
    const themesSection = document.getElementById('themes');
    currentGalleryTheme = themeKey;

    themesSection.classList.add('hidden');

    setTimeout(() => {
      themesSection.style.display = 'none';

      galleryTitle.textContent = title;
      const gallerySubtitle = document.getElementById('gallery-subtitle');
      if (gallerySubtitle) {
        gallerySubtitle.textContent = gallery ? (gallery.description || '') : '';
      }
      galleryGrid.innerHTML = '';

      // 2 colonnes pour Chamonix (4 photos) et Indonésie (7 photos)
      galleryGrid.classList.remove('bw-gallery');
      galleryGrid.classList.toggle('two-col', themeKey === 'chamonix');

      // Stocker les images valides pour le lightbox
      const validImages = [];

      images.forEach((photo, idx) => {
        const src = photo.src;
        const item = document.createElement('figure');
        item.className = 'gallery-item';
        item.setAttribute('role', 'button');
        item.setAttribute('tabindex', '0');
        item.setAttribute('aria-label', `Agrandir la photo ${idx + 1}`);

        const img = document.createElement('img');
        img.src = src;
        img.alt = title + ' — photo ' + (idx + 1);
        img.loading = 'lazy';

        img.addEventListener('error', () => {
          if (item.parentNode) item.parentNode.removeChild(item);
        });

        img.addEventListener('load', () => {
          validImages.push({ src, el: item });
        });

        // Ouvrir le lightbox au clic
        item.addEventListener('click', () => {
          const allItems = Array.from(galleryGrid.querySelectorAll('.gallery-item'));
          const clickedIndex = allItems.indexOf(item);
          const currentImages = images.slice();
          openLightbox(currentImages, clickedIndex >= 0 ? clickedIndex : idx);
        });

        item.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            item.click();
          }
        });

        item.appendChild(img);

        if (photo.caption) {
          const figcap = document.createElement('figcaption');
          figcap.textContent = photo.caption;
          item.appendChild(figcap);
        }

        galleryGrid.appendChild(item);
        itemObserver.observe(item);
      });

      galleryView.style.display = 'block';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          galleryView.classList.remove('hidden');
          galleryView.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
      });
    }, 300);
  }

  // =============================================
  // CONTACT — TOGGLE FORMULAIRE
  // =============================================
  if (contactToggle) {
    contactToggle.addEventListener('click', () => {
      const isHidden = contactWrapper.classList.contains('hidden');
      contactWrapper.classList.toggle('hidden');
      contactToggle.setAttribute('aria-expanded', isHidden ? 'true' : 'false');
      if (isHidden) {
        setTimeout(() => {
          const firstInput = contactWrapper.querySelector('input, textarea');
          if (firstInput) firstInput.focus();
        }, 350);
      }
    });
  }

  // =============================================
  // CONTACT — SOUMISSION DU FORMULAIRE (envoi réel)
  // =============================================
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Validation
      let valid = true;
      contactForm.querySelectorAll('[required]').forEach((field) => {
        field.classList.remove('error');
        if (!field.value.trim()) {
          field.classList.add('error');
          valid = false;
        }
      });

      if (!valid) {
        const firstError = contactForm.querySelector('.error');
        if (firstError) firstError.focus();
        return;
      }

      const submitBtn = contactForm.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'Envoi en cours…';
      submitBtn.disabled = true;

      try {
        const data = {
          name:    contactForm.querySelector('#name').value.trim(),
          email:   contactForm.querySelector('#email').value.trim(),
          message: contactForm.querySelector('#message').value.trim(),
        };

        const res = await fetch('https://formsubmit.co/ajax/issamer932@gmail.com', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body:    JSON.stringify(data),
        });

        if (res.ok) {
          contactForm.reset();
          formSuccess.textContent = '✓ Message envoyé — je te répondrai rapidement.';
          formSuccess.classList.add('visible');
          setTimeout(() => {
            formSuccess.classList.remove('visible');
            setTimeout(() => { formSuccess.textContent = ''; }, 400);
          }, 5000);
        } else {
          formSuccess.textContent = '✗ Erreur d\'envoi. Écris-moi directement à issamer932@gmail.com';
          formSuccess.classList.add('visible');
        }
      } catch {
        formSuccess.textContent = '✗ Pas de connexion. Écris-moi à issamer932@gmail.com';
        formSuccess.classList.add('visible');
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });

    // Retirer l'état d'erreur à la saisie
    contactForm.querySelectorAll('input, textarea').forEach((field) => {
      field.addEventListener('input', () => field.classList.remove('error'));
    });
  }

  // =============================================
  // LIGHTBOX
  // =============================================
  function openLightbox(images, index) {
    lightboxImages = images;
    lightboxIndex = index;
    lightbox.hidden = false;
    lightbox.classList.remove('bw');
    document.body.style.overflow = 'hidden';
    updateLightboxImage();
    lightboxClose.focus();
  }

  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = '';
    lightboxImages = [];
  }

  function lightboxPrev() {
    lightboxIndex = (lightboxIndex - 1 + lightboxImages.length) % lightboxImages.length;
    updateLightboxImage();
  }

  function lightboxNext() {
    lightboxIndex = (lightboxIndex + 1) % lightboxImages.length;
    updateLightboxImage();
  }

  function updateLightboxImage() {
    lightboxImg.style.opacity = '0';
    const photo = lightboxImages[lightboxIndex];
    const src = photo.src || photo;
    const caption = photo.caption || '';
    const total = lightboxImages.length;

    setTimeout(() => {
      lightboxImg.src = src;
      lightboxImg.onload = () => { lightboxImg.style.opacity = '1'; };
      // Si l'image est déjà dans le cache, forcer l'opacité
      if (lightboxImg.complete) lightboxImg.style.opacity = '1';
      lightboxCounter.textContent = `${lightboxIndex + 1} / ${total}`;

      const captionEl = document.getElementById('lightbox-caption');
      if (captionEl) {
        captionEl.textContent = caption;
        captionEl.style.opacity = caption ? '1' : '0';
      }
    }, 150);
  }

  if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);
  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxPrevBtn) lightboxPrevBtn.addEventListener('click', lightboxPrev);
  if (lightboxNextBtn) lightboxNextBtn.addEventListener('click', lightboxNext);

  // Clavier dans le lightbox
  document.addEventListener('keydown', (e) => {
    if (lightbox.hidden) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') lightboxPrev();
    if (e.key === 'ArrowRight') lightboxNext();
  });

  // Swipe tactile sur mobile
  let touchStartX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    const delta = e.changedTouches[0].clientX - touchStartX;
    if (Math.abs(delta) > 40) {
      delta < 0 ? lightboxNext() : lightboxPrev();
    }
  }, { passive: true });

});
