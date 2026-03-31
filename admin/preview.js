// =============================================
// DECAP CMS — APERÇU EN TEMPS RÉEL
// =============================================

CMS.registerPreviewStyle('/styles.css');

var React = window.React;
if (!React) { React = { createElement: function() { return null; } }; }
var h = React.createElement;

function absPath(p) {
  if (!p) return '';
  if (p.startsWith('http') || p.startsWith('/') || p.startsWith('blob')) return p;
  return '/' + p;
}

function safeJSON(obj) {
  return JSON.stringify(obj).replace(/<\//g, '<\\/');
}

// Pré-chargement des galeries au démarrage (pas de hooks nécessaire)
var cachedGalleriesJSON = safeJSON({ galleries: [] });
fetch('/_data/galleries.json')
  .then(function(r) { return r.json(); })
  .then(function(d) {
    var processed = {
      galleries: (d.galleries || []).map(function(g) {
        return Object.assign({}, g, {
          cover:          absPath(g.cover          || ''),
          overview_image: absPath(g.overview_image || ''),
          photos: (g.photos || []).map(function(p) {
            return Object.assign({}, p, { src: absPath(p.src || '') });
          })
        });
      })
    };
    cachedGalleriesJSON = safeJSON(processed);
  })
  .catch(function() {});

function galToJS(galleries) {
  if (!galleries) return [];
  return galleries.toJS().map(function(g) {
    return {
      key:            g.key           || '',
      title:          g.title         || '',
      tagline:        g.tagline       || '',
      description:    g.description   || '',
      cover:          absPath(g.cover          || ''),
      overview_image: absPath(g.overview_image || ''),
      photos: (g.photos || []).map(function(p) {
        return { src: absPath(p.src || ''), caption: p.caption || '' };
      })
    };
  });
}

// HTML complet du site avec données injectées
function buildSiteHTML(galJSON, setJSON) {
  return (
    '<!DOCTYPE html>' +
    '<html lang="fr" data-theme="light"><head>' +
    '<meta charset="UTF-8">' +
    '<meta name="viewport" content="width=1280">' +
    '<link rel="stylesheet" href="/styles.css">' +
    '</head><body>' +

    '<div id="scroll-progress" class="scroll-progress" aria-hidden="true"></div>' +

    '<header class="top-nav" id="top-nav">' +
      '<div class="top-nav-inner">' +
        '<div class="top-nav-brand">Issam Amer \u2014 AMR Studio</div>' +
        '<nav class="top-nav-links" id="top-nav-links">' +
          '<button class="link-button top-nav-link" data-target="hero" type="button">Accueil</button>' +
          '<button class="link-button top-nav-link" data-target="overview" type="button">Aper\u00E7u</button>' +
          '<button class="link-button top-nav-link" data-target="themes" type="button">Th\u00E8mes</button>' +
          '<button class="link-button top-nav-link" data-target="contact" type="button">Me contacter</button>' +
        '</nav>' +
        '<button class="dark-toggle" id="dark-toggle" type="button"></button>' +
        '<button class="nav-hamburger" id="nav-hamburger" type="button"><span></span><span></span><span></span></button>' +
      '</div>' +
    '</header>' +

    '<section class="hero" id="hero">' +
      '<div class="hero-inner">' +
        '<div class="hero-media"><img src="/couverture.jpg" alt="" class="hero-image"></div>' +
        '<div class="hero-content">' +
          '<div class="hero-name">Issam Amer</div>' +
          '<p class="hero-kicker">Photographe</p>' +
          '<h1 class="hero-title">AMR Studio</h1>' +
          '<p class="hero-subtitle">Jeune photographe fran\u00E7ais.</p>' +
          '<button class="hero-button" type="button">Voir les photos</button>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<main id="main-content" class="main">' +
      '<section class="home-overview" id="overview">' +
        '<div class="home-overview-text">' +
          '<h2>Ce que j\u2019ai captur\u00E9</h2>' +
          '<p>Des voyages, de la street, des moments du quotidien.</p>' +
        '</div>' +
        '<div class="home-overview-grid" id="overview-grid"></div>' +
      '</section>' +
      '<section class="themes" id="themes"></section>' +
      '<section id="gallery-view" class="gallery-view hidden">' +
        '<div class="gallery-header">' +
          '<button id="back-to-themes" class="link-button" type="button">\u2190 Retour</button>' +
          '<div class="gallery-header-right"><h2 id="gallery-title"></h2><p id="gallery-subtitle" class="gallery-subtitle"></p></div>' +
        '</div>' +
        '<div id="gallery-grid" class="gallery-grid"></div>' +
      '</section>' +
      '<footer class="footer" id="contact">' +
        '<div class="footer-top">' +
          '<div class="footer-identity">' +
            '<p class="footer-name">Issam Amer</p>' +
            '<p class="footer-tagline">Photographe.</p>' +
            '<p class="footer-text">Jeune photographe fran\u00E7ais.</p>' +
          '</div>' +
          '<nav class="footer-links">' +
            '<a href="#">issamer932@gmail.com</a>' +
            '<a href="#">Instagram</a>' +
            '<a href="#">LinkedIn</a>' +
          '</nav>' +
        '</div>' +
        '<div class="footer-bottom"><span class="footer-copy">\u00A9 ' + new Date().getFullYear() + ' Issam Amer.</span></div>' +
      '</footer>' +
    '</main>' +

    '<div id="explore-cursor" class="explore-cursor" aria-hidden="true">Explorer</div>' +
    '<div id="lightbox" class="lightbox" hidden>' +
      '<div class="lightbox-backdrop" id="lightbox-backdrop"></div>' +
      '<button class="lightbox-close" id="lightbox-close" type="button">\u2715</button>' +
      '<button class="lightbox-prev" id="lightbox-prev" type="button">\u2039</button>' +
      '<button class="lightbox-next" id="lightbox-next" type="button">\u203A</button>' +
      '<div class="lightbox-img-wrap"><img id="lightbox-img" src="" alt=""></div>' +
      '<div class="lightbox-counter" id="lightbox-counter"></div>' +
      '<div class="lightbox-caption" id="lightbox-caption"></div>' +
    '</div>' +

    '<script>(function(){' +
      'var g=' + galJSON + ';' +
      'var s=' + setJSON + ';' +
      'var o=window.fetch;' +
      'window.fetch=function(u,opts){' +
        'if(typeof u==="string"&&u.indexOf("galleries.json")!==-1)' +
          'return Promise.resolve({ok:true,json:function(){return Promise.resolve(g);}});' +
        'if(typeof u==="string"&&u.indexOf("settings.json")!==-1)' +
          'return Promise.resolve({ok:true,json:function(){return Promise.resolve(s);}});' +
        'return o?o.call(this,u,opts):Promise.reject(new Error("no fetch"));' +
      '};' +
    '})();<\/script>' +
    '<script src="/script.js"><\/script>' +
    '</body></html>'
  );
}

// ── Galeries : données CMS temps réel ────────────────────────
var GalleriesPreview = function(props) {
  try {
    var galleries = props.entry.get('data').get('galleries');
    var galArr    = galToJS(galleries);
    var html      = buildSiteHTML(safeJSON({ galleries: galArr }), safeJSON({}));
    return h('iframe', { srcDoc: html, style: { width: '100%', height: '100vh', border: 'none', display: 'block' } });
  } catch(e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aper\u00E7u non disponible.');
  }
};

// ── Paramètres généraux : settings temps réel + galeries pré-chargées ──
var GeneralPreview = function(props) {
  try {
    var data     = props.entry.get('data');
    var raw      = data.toJS ? data.toJS() : {};

    // Rendre les chemins absolus pour que l'iframe srcdoc les résolve
    var settings = Object.assign({}, raw, {
      cover_image: absPath(raw.cover_image || '')
    });

    // Galeries depuis le cache pré-chargé (pas de hooks/fetch dans le composant)
    var html = buildSiteHTML(cachedGalleriesJSON, safeJSON(settings));
    return h('iframe', { srcDoc: html, style: { width: '100%', height: '100vh', border: 'none', display: 'block' } });
  } catch(e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aper\u00E7u non disponible.');
  }
};

CMS.registerPreviewTemplate('general',        GeneralPreview);
CMS.registerPreviewTemplate('galleries_data', GalleriesPreview);
