// =============================================
// DECAP CMS — APERÇU EN TEMPS RÉEL
// React est chargé via CDN dans admin/index.html
// =============================================

var h = React.createElement;

// ── Aperçu des paramètres généraux ──────────────────────────
var GeneralPreview = function(props) {
  var entry = props.entry;
  var getAsset = props.getAsset;
  var data = entry.get('data');

  var name       = data.get('photographer_name') || 'Votre Nom';
  var kicker     = data.get('hero_kicker')       || 'Photographe';
  var title      = data.get('hero_title')        || 'AMR Studio';
  var subtitle   = data.get('hero_subtitle')     || '';
  var coverField = data.get('cover_image')       || '';
  var coverAsset = coverField ? getAsset(coverField) : null;
  var cover      = coverAsset ? coverAsset.toString() : '';

  var overviewTitle = data.get('overview_title') || '';
  var overviewText  = data.get('overview_text')  || '';
  var footerTagline = data.get('footer_tagline') || '';
  var footerText    = data.get('footer_text')    || '';
  var email         = data.get('email')          || '';

  return h('div', { 'data-theme': 'light' },

    // ── Nav ──
    h('header', { className: 'top-nav scrolled', style: { position: 'relative' } },
      h('div', { className: 'top-nav-inner' },
        h('div', { className: 'top-nav-brand' }, name + ' — ' + title)
      )
    ),

    // ── Hero ──
    h('section', { className: 'hero' },
      h('div', { className: 'hero-inner' },
        cover
          ? h('div', { className: 'hero-media' },
              h('img', { src: cover, className: 'hero-image', alt: name })
            )
          : null,
        h('div', { className: 'hero-content' },
          h('div', { className: 'hero-name' }, name),
          h('p',   { className: 'hero-kicker' }, kicker),
          h('h1',  { className: 'hero-title' }, title),
          h('p',   { className: 'hero-subtitle' }, subtitle),
          h('button', { className: 'hero-button', type: 'button' }, 'Voir les photos')
        )
      )
    ),

    // ── Section Aperçu ──
    h('section', { className: 'home-overview', style: { padding: '60px 40px' } },
      h('div', { className: 'home-overview-text' },
        h('h2', {}, overviewTitle),
        h('p',  {}, overviewText)
      )
    ),

    // ── Footer ──
    h('footer', { className: 'footer' },
      h('div', { className: 'footer-top' },
        h('div', { className: 'footer-identity' },
          h('p', { className: 'footer-name' }, name),
          h('p', { className: 'footer-tagline' }, footerTagline),
          h('p', { className: 'footer-text' }, footerText)
        ),
        h('nav', { className: 'footer-links' },
          h('a', { href: '#' }, email),
          h('a', { href: '#' }, 'Instagram'),
          h('a', { href: '#' }, 'LinkedIn')
        )
      )
    )
  );
};

// ── Aperçu des galeries ──────────────────────────────────────
var GalleriesPreview = function(props) {
  var entry = props.entry;
  var getAsset = props.getAsset;
  var data = entry.get('data');
  var galleries = data.get('galleries');

  if (!galleries || !galleries.size) {
    return h('div', { style: { padding: '40px', color: '#888' } }, 'Aucune galerie définie.');
  }

  return h('div', { 'data-theme': 'light' },
    h('div', { style: { padding: '30px 20px' } },
      h('h2', { style: { fontSize: '12px', letterSpacing: '3px', color: '#888', marginBottom: '24px' } }, 'GALERIES'),
      h('section', { className: 'themes', style: { display: 'grid' } },
        galleries.map(function(g, i) {
          var coverField = g.get('cover') || '';
          var coverAsset = coverField ? getAsset(coverField) : null;
          var cover      = coverAsset ? coverAsset.toString() : '';
          var gTitle     = g.get('title')   || '—';
          var gTagline   = g.get('tagline') || '';
          var photos     = g.get('photos');
          var count      = photos ? photos.size : 0;

          return h('article', { key: i, className: 'theme-card' },
            cover && h('img', { src: cover, alt: gTitle, loading: 'lazy' }),
            h('div', { className: 'theme-overlay' },
              h('span', { className: 'theme-title' }, gTitle),
              h('span', { className: 'theme-tagline' }, gTagline),
              h('span', { className: 'theme-count' }, count + ' photos')
            )
          );
        }).toArray()
      )
    )
  );
};

CMS.registerPreviewStyle('/styles.css');
CMS.registerPreviewTemplate('general',        GeneralPreview);
CMS.registerPreviewTemplate('galleries_data', GalleriesPreview);
