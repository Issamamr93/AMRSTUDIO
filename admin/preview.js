// =============================================
// DECAP CMS — APERÇU EN TEMPS RÉEL
// =============================================
var h = React.createElement;

var HeroPreview = function(props) {
  var entry = props.entry;
  var getAsset = props.getAsset;
  var data = entry.get('data');

  var name       = data.get('photographer_name') || 'Votre Nom';
  var kicker     = data.get('hero_kicker')       || 'Photographe';
  var title      = data.get('hero_title')        || 'AMR Studio';
  var subtitle   = data.get('hero_subtitle')     || '';
  var coverField = data.get('cover_image');
  var cover      = coverField ? getAsset(coverField).toString() : '';

  var overviewTitle = data.get('overview_title') || 'Ce que j\'ai capturé';
  var overviewText  = data.get('overview_text')  || '';

  var footerTagline = data.get('footer_tagline') || 'Photographe.';
  var footerText    = data.get('footer_text')    || '';
  var email         = data.get('email')          || '';
  var instagram     = data.get('instagram_url')  || '';

  var galleries = ['chamonix', 'suisse', 'indonesie', 'malaisie', 'ldc'];

  return h('div', { style: { fontFamily: "'Georgia', serif", background: '#111', color: '#fff', minHeight: '100vh' } },

    // ── HERO ──
    h('section', { style: { display: 'flex', gap: '32px', alignItems: 'center', padding: '48px 40px', borderBottom: '1px solid #2a2a2a' } },
      cover && h('img', { src: cover, style: { width: '180px', height: '230px', objectFit: 'cover', flexShrink: 0 } }),
      h('div', {},
        h('p', { style: { color: '#c9a96e', fontSize: '11px', letterSpacing: '3px', margin: '0 0 4px' } }, name.toUpperCase()),
        h('p', { style: { color: '#c9a96e', fontSize: '10px', letterSpacing: '2px', margin: '0 0 14px' } }, kicker.toUpperCase()),
        h('h1', { style: { fontSize: '28px', letterSpacing: '5px', fontWeight: 'normal', margin: '0 0 16px', color: '#fff' } }, title.toUpperCase()),
        h('p', { style: { color: '#bbb', fontSize: '13px', lineHeight: '1.8', margin: '0 0 20px', maxWidth: '380px' } }, subtitle),
        h('button', { style: { background: 'transparent', border: '1px solid #c9a96e', color: '#c9a96e', padding: '8px 20px', fontSize: '10px', letterSpacing: '2px', cursor: 'default' } }, 'VOIR LES PHOTOS')
      )
    ),

    // ── APERÇU ──
    h('section', { style: { padding: '40px', borderBottom: '1px solid #2a2a2a' } },
      h('h2', { style: { fontSize: '18px', fontWeight: 'normal', letterSpacing: '3px', color: '#c9a96e', marginBottom: '10px' } }, overviewTitle),
      h('p', { style: { color: '#aaa', fontSize: '13px', lineHeight: '1.7', maxWidth: '500px' } }, overviewText)
    ),

    // ── GALERIES ──
    h('section', { style: { padding: '40px', borderBottom: '1px solid #2a2a2a' } },
      h('h2', { style: { fontSize: '12px', letterSpacing: '3px', color: '#555', marginBottom: '20px' } }, 'GALERIES'),
      h('div', { style: { display: 'flex', flexWrap: 'wrap', gap: '12px' } },
        galleries.map(function(key) {
          var gTitle   = data.get('gallery_' + key + '_title')   || key;
          var gTagline = data.get('gallery_' + key + '_tagline') || '';
          var gDesc    = data.get('gallery_' + key + '_desc')    || '';
          return h('div', { key: key, style: { background: '#1a1a1a', border: '1px solid #2a2a2a', padding: '14px', width: '160px' } },
            h('p', { style: { color: '#c9a96e', fontSize: '12px', letterSpacing: '2px', margin: '0 0 4px' } }, gTitle.toUpperCase()),
            h('p', { style: { color: '#777', fontSize: '11px', margin: '0 0 8px' } }, gTagline),
            h('p', { style: { color: '#555', fontSize: '11px', lineHeight: '1.5', margin: 0 } }, gDesc)
          );
        })
      )
    ),

    // ── FOOTER ──
    h('footer', { style: { padding: '40px', display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '24px' } },
      h('div', {},
        h('p', { style: { color: '#c9a96e', fontSize: '16px', margin: '0 0 4px' } }, name),
        h('p', { style: { color: '#888', fontSize: '12px', margin: '0 0 10px' } }, footerTagline),
        h('p', { style: { color: '#666', fontSize: '12px', lineHeight: '1.6', maxWidth: '300px' } }, footerText)
      ),
      h('div', { style: { display: 'flex', flexDirection: 'column', gap: '8px' } },
        h('a', { style: { color: '#aaa', fontSize: '12px', textDecoration: 'none' } }, email),
        h('a', { style: { color: '#aaa', fontSize: '12px', textDecoration: 'none' } }, 'Instagram'),
        h('a', { style: { color: '#aaa', fontSize: '12px', textDecoration: 'none' } }, 'LinkedIn')
      )
    )
  );
};

CMS.registerPreviewTemplate('general', HeroPreview);

CMS.registerPreviewStyle('/styles.css');
