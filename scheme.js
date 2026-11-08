// Light / dark / system switch. The choice is a `scheme` cookie on the whole octarift.com
// domain, shared with tools.octarift.com (web-tools: src/shared/color-scheme.ts).
// Loaded in <head> without defer so the saved choice applies before first paint.
(function () {
  var root = document.documentElement;
  function read() {
    var m = document.cookie.match(/(?:^|; )scheme=(light|dark)/);
    return m ? m[1] : 'auto';
  }
  function apply(s) {
    if (s === 'auto') delete root.dataset.scheme;
    else root.dataset.scheme = s;
  }
  function save(s) {
    var host = location.hostname;
    var domain = host === 'octarift.com' || /\.octarift\.com$/.test(host) ? '; domain=octarift.com' : '';
    var base = 'scheme=' + s + '; path=/; SameSite=Lax' + domain;
    document.cookie = base + (s === 'auto' ? '; max-age=0' : '; max-age=31536000');
    apply(s);
  }
  try { apply(read()); } catch (e) {}

  var ICONS = {
    auto: '<circle cx="12" cy="12" r="8"/><path d="M12 4a8 8 0 0 1 0 16z" fill="currentColor"/>',
    light: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
    dark: '<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>'
  };
  var LABELS = { auto: 'System', light: 'Light', dark: 'Dark' };

  document.addEventListener('DOMContentLoaded', function () {
    var header = document.querySelector('header.site');
    if (!header) return;
    var group = document.createElement('div');
    group.className = 'scheme-switch';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Appearance');
    var current = read();
    ['auto', 'light', 'dark'].forEach(function (s) {
      var b = document.createElement('button');
      b.type = 'button';
      b.title = LABELS[s];
      b.setAttribute('aria-label', LABELS[s]);
      b.setAttribute('aria-pressed', String(s === current));
      b.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" ' +
        'stroke-width="2" stroke-linecap="round" aria-hidden="true">' + ICONS[s] + '</svg>';
      b.addEventListener('click', function () {
        save(s);
        group.querySelectorAll('button').forEach(function (o) {
          o.setAttribute('aria-pressed', String(o === b));
        });
      });
      group.appendChild(b);
    });
    header.appendChild(group);
  });
})();
