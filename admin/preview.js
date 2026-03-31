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

// ── Cadre PC Windows 11 ──────────────────────────────────────
function WindowsPC(props) {
  var now = new Date();
  var hh  = now.getHours();
  var mm  = now.getMinutes();
  var time = (hh < 10 ? '0' + hh : hh) + ':' + (mm < 10 ? '0' + mm : mm);

  return h('div', { style: { background: '#1a1a2e', minHeight: '100vh', padding: '20px 10px 32px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column', alignItems: 'center' } },

    // Écran / Moniteur
    h('div', { style: { width: '100%', maxWidth: '920px', border: '2px solid #3a3a4a', borderRadius: '6px 6px 0 0', overflow: 'hidden', boxShadow: '0 16px 48px rgba(0,0,0,0.8)', flexShrink: 0 } },

      // Barre de titre Windows
      h('div', { style: { background: '#202020', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0 0 10px', userSelect: 'none', borderBottom: '1px solid #333' } },
        h('div', { style: { display: 'flex', alignItems: 'center', gap: '7px', fontSize: '12px', color: '#ccc' } },
          h('span', { style: { fontSize: '12px' } }, '🌐'),
          h('span', {}, 'AMR Studio — Aperçu')
        ),
        h('div', { style: { display: 'flex', height: '100%' } },
          h('div', { style: { width: '45px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '13px', cursor: 'default' } }, '─'),
          h('div', { style: { width: '45px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '11px', cursor: 'default' } }, '□'),
          h('div', { style: { width: '45px', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '13px', cursor: 'default', borderRadius: '0 4px 0 0' } }, '✕')
        )
      ),

      // Barre d'adresse
      h('div', { style: { background: '#2a2a2a', height: '34px', display: 'flex', alignItems: 'center', gap: '8px', padding: '0 10px', borderBottom: '1px solid #333' } },
        h('span', { style: { color: '#666', fontSize: '16px', cursor: 'default' } }, '←'),
        h('span', { style: { color: '#666', fontSize: '16px', cursor: 'default' } }, '→'),
        h('span', { style: { color: '#666', fontSize: '14px', cursor: 'default' } }, '↻'),
        h('div', { style: { flex: 1, background: '#383838', border: '1px solid #4a4a4a', borderRadius: '14px', height: '22px', display: 'flex', alignItems: 'center', padding: '0 10px', gap: '6px', fontSize: '11px', color: '#bbb' } },
          h('span', { style: { width: '7px', height: '7px', borderRadius: '50%', background: '#4caf50', display: 'inline-block', flexShrink: 0 } }),
          'amrstudio.netlify.app'
        )
      ),

      // Contenu du site
      h('div', { style: { height: '560px', overflowY: 'auto', overflowX: 'hidden', background: '#f7f5f1' } },
        props.children
      )
    ),

    // Pied du moniteur
    h('div', { style: { width: '100%', maxWidth: '920px', background: '#181818', height: '12px', borderRadius: '0 0 4px 4px', border: '2px solid #3a3a4a', borderTop: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.6)' } }),
    h('div', { style: { width: '80px', height: '24px', background: '#181818', borderRadius: '0 0 8px 8px', border: '2px solid #3a3a4a', borderTop: 'none', marginTop: '-2px', boxShadow: '0 4px 8px rgba(0,0,0,0.5)' } }),
    h('div', { style: { width: '160px', height: '6px', background: '#141414', borderRadius: '0 0 6px 6px', marginTop: '-1px', border: '1px solid #333' } }),

    // Barre des tâches Windows
    h('div', { style: { marginTop: '16px', width: '100%', maxWidth: '920px', background: 'rgba(20,20,30,0.95)', backdropFilter: 'blur(10px)', border: '1px solid #3a3a4a', borderRadius: '10px', height: '40px', display: 'flex', alignItems: 'center', padding: '0 14px', gap: '10px' } },
      h('span', { style: { fontSize: '14px' } }, '⊞'),
      h('span', { style: { fontSize: '12px' } }, '🔍'),
      h('span', { style: { fontSize: '12px' } }, '🌐'),
      h('div', { style: { flex: 1 } }),
      h('span', { style: { fontSize: '10px', color: '#888', letterSpacing: '0.05em' } }, time),
      h('span', { style: { fontSize: '10px', color: '#666', marginLeft: '6px' } }, '🔔')
    ),

    h('p', { style: { marginTop: '10px', fontSize: '10px', color: '#444', letterSpacing: '0.15em', textTransform: 'uppercase' } }, 'Aperçu en temps réel')
  );
}

// ── Aperçu Paramètres généraux ───────────────────────────────
var GeneralPreview = function(props) {
  try {
    var entry = props.entry;
    var data  = entry.get('data');

    var name     = data.get('photographer_name') || 'Votre Nom';
    var kicker   = data.get('hero_kicker')       || 'Photographe';
    var title    = data.get('hero_title')        || 'AMR Studio';
    var subtitle = data.get('hero_subtitle')     || '';
    var cover    = absPath(data.get('cover_image') || '');

    var ovTitle  = data.get('overview_title') || '';
    var ovText   = data.get('overview_text')  || '';

    var ftTagline = data.get('footer_tagline') || '';
    var ftText    = data.get('footer_text')    || '';
    var email     = data.get('email')          || '';

    return h(WindowsPC, {},
      h('div', { 'data-theme': 'light' },

        // Nav
        h('header', { className: 'top-nav scrolled', style: { position: 'relative', zIndex: 1 } },
          h('div', { className: 'top-nav-inner' },
            h('div', { className: 'top-nav-brand' }, name + ' — ' + title)
          )
        ),

        // Hero
        h('section', { className: 'hero', style: { minHeight: 'auto', padding: '32px 7vw 28px' } },
          h('div', { className: 'hero-inner' },
            cover
              ? h('div', { className: 'hero-media' },
                  h('img', { src: cover, className: 'hero-image', alt: name, style: { maxHeight: '240px', objectFit: 'cover' } })
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

        // Section Aperçu
        h('section', { className: 'home-overview', style: { padding: '20px 24px 0' } },
          h('div', { className: 'home-overview-text' },
            h('h2', {}, ovTitle),
            h('p',  {}, ovText)
          )
        ),

        // Footer
        h('footer', { className: 'footer', style: { marginTop: '28px' } },
          h('div', { className: 'footer-top' },
            h('div', { className: 'footer-identity' },
              h('p', { className: 'footer-name' }, name),
              h('p', { className: 'footer-tagline' }, ftTagline),
              h('p', { className: 'footer-text' }, ftText)
            ),
            h('nav', { className: 'footer-links' },
              h('a', { href: '#' }, email),
              h('a', { href: '#' }, 'Instagram'),
              h('a', { href: '#' }, 'LinkedIn')
            )
          )
        )
      )
    );
  } catch (e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aperçu non disponible.');
  }
};

// ── Aperçu Galeries ──────────────────────────────────────────
var GalleriesPreview = function(props) {
  try {
    var entry     = props.entry;
    var data      = entry.get('data');
    var galleries = data.get('galleries');

    if (!galleries || !galleries.size) {
      return h(WindowsPC, {},
        h('div', { style: { padding: '40px', color: '#888', textAlign: 'center' } }, 'Aucune galerie définie.')
      );
    }

    return h(WindowsPC, {},
      h('div', { 'data-theme': 'light' },

        // Nav
        h('header', { className: 'top-nav scrolled', style: { position: 'relative', zIndex: 1 } },
          h('div', { className: 'top-nav-inner' },
            h('div', { className: 'top-nav-brand' }, 'Issam Amer — AMR Studio')
          )
        ),

        // Thumbnails aperçu
        h('section', { className: 'home-overview', style: { padding: '20px 24px 0' } },
          h('div', { className: 'home-overview-text' },
            h('h2', {}, 'Ce que j\'ai capturé'),
            h('p',  {}, 'Clique sur une image pour voir la galerie.')
          ),
          h('div', { className: 'home-overview-grid' },
            galleries.map(function(g, i) {
              var src    = absPath(g.get('overview_image') || g.get('cover') || '');
              var gTitle = g.get('title') || '';
              return h('button', { key: 'thumb-' + i, className: 'home-overview-thumb', type: 'button' },
                src ? h('img', { src: src, alt: 'Aperçu ' + gTitle, loading: 'lazy' }) : null
              );
            }).toArray()
          )
        ),

        // Label galeries
        h('p', { style: { fontSize: '10px', letterSpacing: '3px', color: '#aaa', margin: '24px 24px 10px', textTransform: 'uppercase' } }, 'Galeries'),

        // Cartes galeries
        h('section', { className: 'themes', style: { margin: '0 auto 24px', padding: '0 24px' } },
          galleries.map(function(g, i) {
            var cover   = absPath(g.get('cover') || '');
            var gTitle  = g.get('title')   || '—';
            var tagline = g.get('tagline') || '';
            var photos  = g.get('photos');
            var count   = photos ? photos.size : 0;
            return h('article', { key: 'card-' + i, className: 'theme-card' },
              cover ? h('img', { src: cover, alt: gTitle, loading: 'lazy' }) : null,
              // opacity forcée à 1 car pas de hover dans l'aperçu
              h('div', { className: 'theme-overlay', style: { opacity: 1 } },
                h('span', { className: 'theme-title' }, gTitle),
                h('span', { className: 'theme-tagline' }, tagline),
                h('span', { className: 'theme-count' }, count + ' photos')
              )
            );
          }).toArray()
        ),

        // Photos par galerie
        galleries.map(function(g, i) {
          var gTitle = g.get('title') || '—';
          var photos = g.get('photos');
          if (!photos || !photos.size) return null;

          return h('div', { key: 'photos-' + i, style: { padding: '0 24px', marginBottom: '28px' } },
            h('p', { style: { fontSize: '10px', letterSpacing: '3px', color: '#aaa', marginBottom: '8px', textTransform: 'uppercase' } },
              gTitle + ' — ' + photos.size + ' photos'
            ),
            h('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '5px' } },
              photos.map(function(photo, j) {
                var src     = absPath(photo.get('src') || '');
                var caption = photo.get('caption') || '';
                return h('figure', { key: 'photo-' + j, style: { margin: 0, overflow: 'hidden' } },
                  src ? h('img', { src: src, alt: caption, loading: 'lazy', style: { width: '100%', height: '90px', objectFit: 'cover', display: 'block', filter: 'grayscale(100%)' } }) : null
                );
              }).toArray()
            )
          );
        }).toArray()
      )
    );
  } catch (e) {
    return h('div', { style: { padding: '20px', color: '#888' } }, 'Aperçu non disponible.');
  }
};

CMS.registerPreviewTemplate('general',        GeneralPreview);
CMS.registerPreviewTemplate('galleries_data', GalleriesPreview);
