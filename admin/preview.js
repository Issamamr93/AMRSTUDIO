// =============================================
// DECAP CMS — APERÇU EN TEMPS RÉEL
// Rendu identique au site via srcdoc iframe + fetch override
// =============================================

CMS.registerPreviewStyle('/styles.css');

var React = window.React;
if (!React) { React = { createElement: function() { return null; } }; }
var h = React.createElement;

// Convertit un chemin relatif en chemin absolu
function absPath(p) {
  if (!p) return '';
  if (p.startsWith('http') || p.startsWith('/') || p.startsWith('blob')) return p;
  return '/' + p;
}

// JSON sécurisé pour inclusion dans un <script> inline (évite la fermeture du tag)
function safeJSON(obj) {
  return JSON.stringify(obj).replace(/<\//g, '<\\/');
}

// Convertit les données Immutable.js des galeries en JS pur avec chemins absolus
function galToJS(galleries) {
  if (!galleries) return [];
  return galleries.toJS().map(function(g) {
    return {
      key:           g.key           || '',
      title:         g.title         || '',
      tagline:       g.tagline       || '',
      description:   g.description   || '',
      cover:         absPath(g.cover         || ''),
      overview_image: absPath(g.overview_image || ''),
      photos: (g.photos || []).map(function(p) {
        return { src: absPath(p.src || ''), caption: p.caption || '' };
      })
    };
  });
}

// Construit le HTML complet du site (identique à index.html)
function buildSiteHTML(galJSON, setJSON) {
  return (
    '<!DOCTYPE html>' +
    '<html lang="fr" data-theme="light">' +
    '<head>' +
      '<meta charset="UTF-8">' +
      '<meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<link rel="stylesheet" href="/styles.css">' +
    '</head>' +
    '<body>' +
    '<div id="scroll-progress" class="scroll-progress" aria-hidden="true"></div>' +

    '<header class="top-nav" id="top-nav">' +
      '<div class="top-nav-inner">' +
        '<div class="top-nav-brand">Issam Amer \u2014 AMR Studio</div>' +
        '<nav class="top-nav-links" id="top-nav-links" role="navigation" aria-label="Navigation principale">' +
          '<button class="link-button top-nav-link" data-target="hero" type="button">Accueil</button>' +
          '<button class="link-button top-nav-link" data-target="overview" type="button">Aper\u00E7u</button>' +
          '<button class="link-button top-nav-link" data-target="themes" type="button">Th\u00E8mes</button>' +
          '<button class="link-button top-nav-link" data-target="contact" type="button">Me contacter</button>' +
        '</nav>' +
        '<button class="dark-toggle" id="dark-toggle" type="button" aria-label="Basculer le th\u00E8me sombre" title="Mode sombre"></button>' +
        '<button class="nav-hamburger" id="nav-hamburger" aria-label="Ouvrir le menu" aria-expanded="false" type="button">' +
          '<span></span><span></span><span></span>' +
        '</button>' +
      '</div>' +
    '</header>' +

    '<section class="hero" id="hero">' +
      '<div class="hero-inner">' +
        '<div class="hero-media">' +
          '<img src="/couverture.jpg" alt="Photographie de couverture \u2014 Issam Amer" class="hero-image">' +
        '</div>' +
        '<div class="hero-content">' +
          '<div class="hero-name">Issam Amer</div>' +
          '<p class="hero-kicker">Photographe</p>' +
          '<h1 class="hero-title">AMR Studio</h1>' +
          '<p class="hero-subtitle">Jeune photographe fran\u00E7ais. Je photographie ce qui m\u2019entoure \u2014 mes voyages, la rue, les gens, les instants. Pas de sp\u00E9cialit\u00E9, juste un \u0153il et un appareil.</p>' +
          '<button id="open-collection" class="hero-button" type="button">Voir les photos</button>' +
        '</div>' +
      '</div>' +
    '</section>' +

    '<main id="main-content" class="main">' +

      '<section class="home-overview" id="overview">' +
        '<div class="home-overview-text">' +
          '<h2>Ce que j\u2019ai captur\u00E9</h2>' +
          '<p>Des voyages, de la street, des moments du quotidien. Certaines photos viennent de loin, d\u2019autres d\u2019\u00E0 c\u00F4t\u00E9. Clique sur une image pour voir la galerie.</p>' +
        '</div>' +
        '<div class="home-overview-grid" id="overview-grid"></div>' +
      '</section>' +

      '<section class="themes" id="themes"></section>' +

      '<section id="gallery-view" class="gallery-view hidden">' +
        '<div class="gallery-header">' +
          '<button id="back-to-themes" class="link-button" type="button">\u2190 Retour aux th\u00E8mes</button>' +
          '<div class="gallery-header-right">' +
            '<h2 id="gallery-title"></h2>' +
            '<p id="gallery-subtitle" class="gallery-subtitle"></p>' +
          '</div>' +
        '</div>' +
        '<div id="gallery-grid" class="gallery-grid"></div>' +
      '</section>' +

      '<footer class="footer" id="contact">' +
        '<div class="footer-top">' +
          '<div class="footer-identity">' +
            '<p class="footer-name">Issam Amer</p>' +
            '<p class="footer-tagline">Photographe.</p>' +
            '<p class="footer-text">Jeune photographe fran\u00E7ais, je shoote ce qui me pla\u00EEt \u2014 en voyage comme en bas de chez moi. Street, portraits, paysages. Toujours partant pour un projet.</p>' +
          '</div>' +
          '<nav class="footer-links" aria-label="Liens de contact">' +
            '<a href="#">issamer932@gmail.com</a>' +
            '<a href="#">Instagram</a>' +
            '<a href="#">LinkedIn</a>' +
            '<button class="link-button" type="button">Me contacter</button>' +
          '</nav>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<span class="footer-copy">\u00A9 ' + new Date().getFullYear() + ' Issam Amer. Tous droits r\u00E9serv\u00E9s.</span>' +
        '</div>' +
      '</footer>' +

    '</main>' +

    '<button class="back-to-top" id="back-to-top" type="button" aria-label="Retour en haut">' +
      '<svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>' +
    '</button>' +

    '<div id="explore-cursor" class="explore-cursor" aria-hidden="true">Explorer</div>' +

    '<div id="lightbox" class="lightbox" role="dialog" aria-modal="true" aria-label="Image agrandie" hidden>' +
      '<div class="lightbox-backdrop" id="lightbox-backdrop"></div>' +
      '<button class="lightbox-close" id="lightbox-close" type="button" aria-label="Fermer">\u2715</button>' +
      '<button class="lightbox-prev" id="lightbox-prev" type="button" aria-label="Image pr\u00E9c\u00E9dente">\u2039</button>' +
      '<button class="lightbox-next" id="lightbox-next" type="button" aria-label="Image suivante">\u203A</button>' +
      '<div class="lightbox-img-wrap"><img id="lightbox-img" src="" alt=""></div>' +
      '<div class="lightbox-counter" id="lightbox-counter" aria-live="polite"></div>' +
      '<div class="lightbox-caption" id="lightbox-caption" aria-live="polite"></div>' +
    '</div>' +

    // Injection des données + override de fetch (doit s'exécuter avant script.js)
    '<script>(function(){' +
      'var g=' + galJSON + ';' +
      'var s=' + setJSON + ';' +
      'var o=window.fetch;' +
      'window.fetch=function(u,opts){' +
        'if(typeof u==="string"&&u.indexOf("galleries.json")!==-1)' +
          'return Promise.resolve({ok:true,json:function(){return Promise.resolve(g);}});' +
        'if(typeof u==="string"&&u.indexOf("settings.json")!==-1)' +
          'return Promise.resolve({ok:true,json:function(){return Promise.resolve(s);}});' +
        'return o?o.call(this,u,opts):Promise.reject(new Error("fetch indisponible"));' +
      '};' +
    '})();<\/script>' +
    '<script src="/script.js"><\/script>' +
    '</body></html>'
  );
}

// ── Aperçu Galeries ─────────────────────────────────────────
// Rendu complet et interactif avec lightbox et thumbnails
var GalleriesPreview = function(props) {
  try {
    var entry    = props.entry;
    var data     = entry.get('data');
    var galleries = data.get('galleries');
    var galArr   = galToJS(galleries);
    var html     = buildSiteHTML(safeJSON({ galleries: galArr }), safeJSON({}));

    return h('iframe', {
      srcDoc: html,
      style: { width: '100%', height: '100vh', border: 'none', display: 'block' }
    });
  } catch (e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aper\u00E7u non disponible.');
  }
};

// ── Aperçu Paramètres généraux ───────────────────────────────
// Charge les vraies galeries depuis le serveur pour afficher les thumbnails
var GeneralPreview = function(props) {
  try {
    var useState   = React.useState;
    var useEffect  = React.useEffect;

    var galState   = useState(null);
    var realGal    = galState[0];
    var setRealGal = galState[1];

    useEffect(function() {
      fetch('/_data/galleries.json')
        .then(function(r) { return r.json(); })
        .then(setRealGal)
        .catch(function() {});
    }, []);

    var entry    = props.entry;
    var data     = entry.get('data');
    var settings = data.toJS ? data.toJS() : {};

    // Préparer les chemins absolus pour les galeries réelles
    var galData = { galleries: [] };
    if (realGal && realGal.galleries) {
      galData.galleries = realGal.galleries.map(function(g) {
        return Object.assign({}, g, {
          cover:          absPath(g.cover          || ''),
          overview_image: absPath(g.overview_image || ''),
          photos: (g.photos || []).map(function(p) {
            return Object.assign({}, p, { src: absPath(p.src || '') });
          })
        });
      });
    }

    var html = buildSiteHTML(safeJSON(galData), safeJSON(settings));

    return h('iframe', {
      srcDoc: html,
      style: { width: '100%', height: '100vh', border: 'none', display: 'block' }
    });
  } catch (e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aper\u00E7u non disponible.');
  }
};

CMS.registerPreviewTemplate('general',        GeneralPreview);
CMS.registerPreviewTemplate('galleries_data', GalleriesPreview);
