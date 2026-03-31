// =============================================
// DECAP CMS — APERÇU EN TEMPS RÉEL
// On utilise le React exposé par Decap CMS (pas de CDN séparé)
// =============================================

CMS.registerPreviewStyle('/styles.css');

// React est exposé par netlify-cms sur window.React
var React = window.React;
if (!React) { React = { createElement: function() { return null; } }; }
var h = React.createElement;

// Convertit un chemin relatif en chemin absolu (fix iframe /admin/)
function absPath(p) {
  if (!p) return '';
  if (p.startsWith('http') || p.startsWith('/') || p.startsWith('blob')) return p;
  return '/' + p;
}

// ── Aperçu des paramètres généraux ──────────────────────────
var GeneralPreview = function(props) {
  try {
    var entry = props.entry;
    var data  = entry.get('data');

    var name       = data.get('photographer_name') || 'Votre Nom';
    var kicker     = data.get('hero_kicker')       || 'Photographe';
    var title      = data.get('hero_title')        || 'AMR Studio';
    var subtitle   = data.get('hero_subtitle')     || '';
    var coverField = data.get('cover_image') || '';
    var cover      = absPath(coverField);

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
  } catch(e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aperçu non disponible.');
  }
};

// ── Aperçu des galeries ──────────────────────────────────────
var GalleriesPreview = function(props) {
  try {
    var entry = props.entry;
    var data  = entry.get('data');
    var galleries = data.get('galleries');

    if (!galleries || !galleries.size) {
      return h('div', { style: { padding: '40px', color: '#888' } }, 'Aucune galerie définie.');
    }

    return h('div', { 'data-theme': 'light' },
      h('div', { style: { padding: '20px' } },

        // ── Cartes galeries ──
        h('p', { style: { fontSize: '11px', letterSpacing: '3px', color: '#888', marginBottom: '16px' } }, 'GALERIES'),
        h('section', { className: 'themes', style: { display: 'grid' } },
          galleries.map(function(g, i) {
            var cover   = absPath(g.get('cover') || '');
            var gTitle  = g.get('title')   || '—';
            var gTagline = g.get('tagline') || '';
            var photos  = g.get('photos');
            var count   = photos ? photos.size : 0;
            return h('article', { key: i, className: 'theme-card' },
              cover && h('img', { src: cover, alt: gTitle, loading: 'lazy' }),
              h('div', { className: 'theme-overlay' },
                h('span', { className: 'theme-title' }, gTitle),
                h('span', { className: 'theme-tagline' }, gTagline),
                h('span', { className: 'theme-count' }, count + ' photos')
              )
            );
          }).toArray()
        ),

        // ── Photos de chaque galerie ──
        galleries.map(function(g, i) {
          var gTitle  = g.get('title') || '—';
          var photos  = g.get('photos');
          if (!photos || !photos.size) return null;

          return h('div', { key: 'section-' + i, style: { marginTop: '40px' } },
            h('p', { style: { fontSize: '11px', letterSpacing: '3px', color: '#888', marginBottom: '12px' } },
              gTitle.toUpperCase() + ' — ' + photos.size + ' PHOTOS'
            ),
            h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' } },
              photos.map(function(photo, j) {
                var src     = absPath(photo.get('src') || '');
                var caption = photo.get('caption') || '';
                return h('figure', { key: j, style: { margin: 0, overflow: 'hidden' } },
                  src && h('img', {
                    src: src, alt: caption, loading: 'lazy',
                    style: { width: '100%', height: '110px', objectFit: 'cover', display: 'block' }
                  })
                );
              }).toArray()
            )
          );
        }).toArray()
      )
    );
  } catch(e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aperçu non disponible.');
  }
};

CMS.registerPreviewTemplate('general',        GeneralPreview);
CMS.registerPreviewTemplate('galleries_data', GalleriesPreview);
