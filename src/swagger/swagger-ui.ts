import { INestApplication } from '@nestjs/common';
import { SwaggerModule, OpenAPIObject } from '@nestjs/swagger';

/**
 * Premium dark-mode Swagger UI with a real sidebar (like Stripe / Redoc docs).
 * Sidebar lists every tag, highlights the active section on scroll, and has
 * a live search filter. Drop-in replacement for your existing
 * SwaggerModule.setup() call.
 */
export function setupSwagger(app: INestApplication, document: OpenAPIObject) {
  SwaggerModule.setup('api/docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      displayRequestDuration: true,
      syntaxHighlight: { theme: 'monokai' },
    },
    customSiteTitle: 'API Documentation',
    customfavIcon: 'https://nestjs.com/img/logo-small.svg',

    // ============================================================
    // CSS — theme tokens + method colors + sidebar layout
    // ============================================================
    customCss: `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

      :root {
        --bg-base: #0b0f19;
        --bg-elevated: #121826;
        --bg-elevated-2: #1a2332;
        --border-subtle: #242e42;
        --text-primary: #e6e9f0;
        --text-secondary: #9aa4b8;
        --text-muted: #6b7690;
        --accent: #5b8cff;
        --accent-soft: rgba(91, 140, 255, 0.12);
        --get: #22c55e; --post: #3b82f6; --put: #f59e0b; --patch: #a855f7; --delete: #ef4444;
        --radius: 10px;
        --sidebar-w: 272px;
        --font-sans: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        --font-mono: 'JetBrains Mono', 'Fira Code', Consolas, monospace;
      }

      body { background: var(--bg-base); font-family: var(--font-sans); margin: 0; }
      .swagger-ui { font-family: var(--font-sans); color: var(--text-primary); }
      .swagger-ui .topbar { display: none; }

      /* ---------- Sidebar ---------- */
      #custom-sidebar {
        position: fixed;
        top: 0; left: 0;
        width: var(--sidebar-w);
        height: 100vh;
        background: var(--bg-elevated);
        border-right: 1px solid var(--border-subtle);
        overflow-y: auto;
        z-index: 1000;
        display: flex;
        flex-direction: column;
      }
      #custom-sidebar .sidebar-header {
        display: flex; align-items: center; gap: 10px;
        padding: 20px; border-bottom: 1px solid var(--border-subtle);
        position: sticky; top: 0; background: var(--bg-elevated); z-index: 2;
      }
      #custom-sidebar .sidebar-logo { font-size: 20px; }
      #custom-sidebar .sidebar-title { font-weight: 700; color: var(--text-primary); font-size: 15px; letter-spacing: -0.01em; }
      #custom-sidebar .sidebar-search-wrap { padding: 14px 16px 8px; }
      #custom-sidebar .sidebar-search {
        width: 100%; box-sizing: border-box; padding: 8px 12px;
        background: var(--bg-elevated-2); border: 1px solid var(--border-subtle);
        border-radius: 7px; color: var(--text-primary); font-size: 13px; font-family: var(--font-sans);
        outline: none; transition: border-color .15s ease;
      }
      #custom-sidebar .sidebar-search:focus { border-color: var(--accent); }
      #custom-sidebar .sidebar-search::placeholder { color: var(--text-muted); }
      #custom-sidebar .sidebar-nav { padding: 8px 12px 24px; flex: 1; }
      #custom-sidebar .sidebar-item { margin-bottom: 2px; }
      #custom-sidebar .sidebar-link {
        display: flex; align-items: center; gap: 8px;
        padding: 8px 12px; border-radius: 6px;
        color: var(--text-secondary); font-size: 13px; font-weight: 500;
        text-decoration: none; cursor: pointer;
        border-left: 2px solid transparent;
        transition: background .15s ease, color .15s ease;
      }
      #custom-sidebar .sidebar-link:hover { background: var(--bg-elevated-2); color: var(--text-primary); }
      #custom-sidebar .sidebar-link.active {
        background: var(--accent-soft); color: var(--accent); font-weight: 600;
        border-left-color: var(--accent);
      }
      #custom-sidebar .sidebar-link .dot {
        width: 6px; height: 6px; border-radius: 50%; background: var(--text-muted); flex-shrink: 0;
      }
      #custom-sidebar .sidebar-link.active .dot { background: var(--accent); }
      #custom-sidebar .sidebar-footer {
        padding: 14px 20px; border-top: 1px solid var(--border-subtle);
        font-size: 11px; color: var(--text-muted);
      }
      #custom-sidebar::-webkit-scrollbar { width: 8px; }
      #custom-sidebar::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 4px; }

      body.has-custom-sidebar .swagger-ui .wrapper {
        margin-left: var(--sidebar-w);
        max-width: 1100px;
        padding: 0 40px;
        box-sizing: border-box;
      }

      @media (max-width: 900px) {
        #custom-sidebar { transform: translateX(-100%); transition: transform .2s ease; }
        #custom-sidebar.open { transform: translateX(0); }
        body.has-custom-sidebar .swagger-ui .wrapper { margin-left: 0; padding: 0 16px; }
        #sidebar-toggle { display: flex !important; }
      }
      #sidebar-toggle {
        display: none; position: fixed; top: 14px; left: 14px; z-index: 1001;
        width: 36px; height: 36px; align-items: center; justify-content: center;
        background: var(--bg-elevated-2); border: 1px solid var(--border-subtle);
        border-radius: 8px; color: var(--text-primary); cursor: pointer;
      }

      /* ---------- Info header ---------- */
      .swagger-ui .info { margin: 40px 0 30px; padding: 28px 32px; background: linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-elevated-2) 100%); border: 1px solid var(--border-subtle); border-radius: var(--radius); }
      .swagger-ui .info .title { color: var(--text-primary); font-weight: 700; letter-spacing: -0.02em; }
      .swagger-ui .info .title small { background: var(--accent); border-radius: 6px; }
      .swagger-ui .info .description, .swagger-ui .info p, .swagger-ui .info li { color: var(--text-secondary); }
      .swagger-ui .info a { color: var(--accent); }

      .swagger-ui .scheme-container { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius); box-shadow: none; padding: 16px 32px; }

      /* ---------- Tag sections (still present, sidebar just links to them) ---------- */
      .swagger-ui .opblock-tag { color: var(--text-primary); border-bottom: 1px solid var(--border-subtle); font-weight: 600; scroll-margin-top: 20px; }
      .swagger-ui .opblock-tag:hover { color: var(--accent); background: transparent; }
      .swagger-ui .opblock-tag small { color: var(--text-muted); }

      /* ---------- Operation blocks ---------- */
      .swagger-ui .opblock { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius); box-shadow: 0 1px 3px rgba(0,0,0,0.3); margin: 0 0 12px; }
      .swagger-ui .opblock .opblock-summary { border-color: var(--border-subtle); padding: 8px 16px; }
      .swagger-ui .opblock .opblock-summary-method { border-radius: 6px; font-weight: 700; min-width: 80px; text-align: center; box-shadow: none; }
      .swagger-ui .opblock .opblock-summary-path, .swagger-ui .opblock .opblock-summary-path__deprecated { color: var(--text-primary); font-family: var(--font-mono); font-weight: 500; }
      .swagger-ui .opblock .opblock-summary-description { color: var(--text-secondary); }

      .swagger-ui .opblock.opblock-get { border-color: rgba(34,197,94,.35); background: rgba(34,197,94,.04); }
      .swagger-ui .opblock.opblock-get .opblock-summary-method { background: var(--get); }
      .swagger-ui .opblock.opblock-get .opblock-summary { border-color: rgba(34,197,94,.35); }
      .swagger-ui .opblock.opblock-post { border-color: rgba(59,130,246,.35); background: rgba(59,130,246,.04); }
      .swagger-ui .opblock.opblock-post .opblock-summary-method { background: var(--post); }
      .swagger-ui .opblock.opblock-post .opblock-summary { border-color: rgba(59,130,246,.35); }
      .swagger-ui .opblock.opblock-put { border-color: rgba(245,158,11,.35); background: rgba(245,158,11,.04); }
      .swagger-ui .opblock.opblock-put .opblock-summary-method { background: var(--put); }
      .swagger-ui .opblock.opblock-put .opblock-summary { border-color: rgba(245,158,11,.35); }
      .swagger-ui .opblock.opblock-patch { border-color: rgba(168,85,247,.35); background: rgba(168,85,247,.04); }
      .swagger-ui .opblock.opblock-patch .opblock-summary-method { background: var(--patch); }
      .swagger-ui .opblock.opblock-patch .opblock-summary { border-color: rgba(168,85,247,.35); }
      .swagger-ui .opblock.opblock-delete { border-color: rgba(239,68,68,.35); background: rgba(239,68,68,.04); }
      .swagger-ui .opblock.opblock-delete .opblock-summary-method { background: var(--delete); }
      .swagger-ui .opblock.opblock-delete .opblock-summary { border-color: rgba(239,68,68,.35); }

      .swagger-ui .opblock-body { background: var(--bg-base); }
      .swagger-ui .opblock-description-wrapper, .swagger-ui .opblock-external-docs-wrapper, .swagger-ui .opblock-title_normal { color: var(--text-secondary); }
      .swagger-ui .opblock-section-header { background: var(--bg-elevated); box-shadow: none; border-bottom: 1px solid var(--border-subtle); }
      .swagger-ui .opblock-section-header h4 { color: var(--text-primary); }

      .swagger-ui table thead tr th, .swagger-ui table thead tr td { color: var(--text-muted); border-bottom: 1px solid var(--border-subtle); font-weight: 600; text-transform: uppercase; font-size: 12px; letter-spacing: .04em; }
      .swagger-ui .parameters-col_name { color: var(--text-primary); font-family: var(--font-mono); }
      .swagger-ui .parameter__name, .swagger-ui .parameter__type, .swagger-ui .parameter__deprecated, .swagger-ui .parameter__in { color: var(--text-secondary); }
      .swagger-ui .parameter__name.required::after { color: var(--delete); }
      .swagger-ui .opblock-body table tbody tr td { border-bottom: 1px solid var(--border-subtle); }

      .swagger-ui input[type=text], .swagger-ui input[type=password], .swagger-ui input[type=email], .swagger-ui textarea, .swagger-ui select { background: var(--bg-elevated-2); border: 1px solid var(--border-subtle); color: var(--text-primary); border-radius: 6px; }
      .swagger-ui input[type=text]:focus, .swagger-ui textarea:focus, .swagger-ui select:focus { border-color: var(--accent); outline: none; box-shadow: 0 0 0 3px var(--accent-soft); }

      .swagger-ui .highlight-code, .swagger-ui .microlight, .swagger-ui pre { background: #0d1117 !important; border: 1px solid var(--border-subtle); border-radius: 8px; color: #c9d1d9; }
      .swagger-ui .model-box { background: var(--bg-elevated); border-radius: 8px; }
      .swagger-ui .model { color: var(--text-secondary); }
      .swagger-ui .model-title { color: var(--text-primary); }
      .swagger-ui .prop-type { color: #e879f9; }
      .swagger-ui .prop-format { color: var(--text-muted); }

      .swagger-ui .response-col_status { color: var(--text-primary); font-weight: 600; }
      .swagger-ui .response-col_description { color: var(--text-secondary); }

      .swagger-ui .btn.execute { background: var(--accent); border-color: var(--accent); color: #fff; font-weight: 600; border-radius: 6px; box-shadow: 0 2px 8px rgba(91,140,255,.35); }
      .swagger-ui .btn.execute:hover { transform: translateY(-1px); box-shadow: 0 4px 12px rgba(91,140,255,.45); }
      .swagger-ui .btn { border-radius: 6px; border-color: var(--border-subtle); color: var(--text-primary); background: var(--bg-elevated-2); }
      .swagger-ui .btn.cancel { border-color: var(--delete); color: var(--delete); background: transparent; }
      .swagger-ui .btn.authorize { border-color: var(--accent); color: var(--accent); background: transparent; }
      .swagger-ui .btn.authorize svg { fill: var(--accent); }

      .swagger-ui .dialog-ux .modal-ux { background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius); }
      .swagger-ui .dialog-ux .modal-ux-header { border-bottom: 1px solid var(--border-subtle); }
      .swagger-ui .dialog-ux .modal-ux-header h3, .swagger-ui .dialog-ux .modal-ux-content h4, .swagger-ui .dialog-ux .modal-ux-content p, .swagger-ui .dialog-ux .modal-ux-content label { color: var(--text-primary); }

      .swagger-ui ::-webkit-scrollbar { width: 10px; height: 10px; }
      .swagger-ui ::-webkit-scrollbar-track { background: var(--bg-base); }
      .swagger-ui ::-webkit-scrollbar-thumb { background: var(--border-subtle); border-radius: 5px; }
    `,

    // ============================================================
    // JS — builds the sidebar once Swagger UI's React app has rendered
    // ============================================================
    customJsStr: `
      (function () {
        function init() {
          var tags = document.querySelectorAll('.swagger-ui .opblock-tag');
          if (!tags.length) { setTimeout(init, 250); return; }
          if (document.getElementById('custom-sidebar')) return;
          buildSidebar(tags);
        }

        function buildSidebar(tags) {
          var toggle = document.createElement('button');
          toggle.id = 'sidebar-toggle';
          toggle.innerHTML = '\\u2630';
          toggle.onclick = function () {
            document.getElementById('custom-sidebar').classList.toggle('open');
          };
          document.body.appendChild(toggle);

          var sidebar = document.createElement('div');
          sidebar.id = 'custom-sidebar';

          var header = document.createElement('div');
          header.className = 'sidebar-header';
          header.innerHTML = '<span class="sidebar-logo">\\ud83d\\udcd8</span><span class="sidebar-title">API Reference</span>';
          sidebar.appendChild(header);

          var searchWrap = document.createElement('div');
          searchWrap.className = 'sidebar-search-wrap';
          var search = document.createElement('input');
          search.className = 'sidebar-search';
          search.placeholder = 'Search endpoints...';
          searchWrap.appendChild(search);
          sidebar.appendChild(searchWrap);

          var nav = document.createElement('nav');
          nav.className = 'sidebar-nav';
          sidebar.appendChild(nav);

          var footer = document.createElement('div');
          footer.className = 'sidebar-footer';
          footer.textContent = tags.length + ' tags';
          sidebar.appendChild(footer);

          var entries = [];

          tags.forEach(function (tagEl) {
            var section = tagEl.closest('[id^="operations-tag-"]') || tagEl.parentElement;
            var nameEl = tagEl.querySelector('span') || tagEl;
            var name = (nameEl.textContent || '').trim().split('\\n')[0];
            if (!section || !name) return;
            if (!section.id) section.id = 'tag-' + name.replace(/\\s+/g, '-').toLowerCase();

            var item = document.createElement('div');
            item.className = 'sidebar-item';

            var link = document.createElement('a');
            link.className = 'sidebar-link';
            link.href = '#' + section.id;
            link.innerHTML = '<span class="dot"></span><span class="label"></span>';
            link.querySelector('.label').textContent = name;

            link.addEventListener('click', function (e) {
              e.preventDefault();
              if (!tagEl.classList.contains('is-open')) {
                tagEl.click();
              }
              setTimeout(function () {
                section.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }, 50);
              document.querySelectorAll('.sidebar-link').forEach(function (l) { l.classList.remove('active'); });
              link.classList.add('active');
              document.getElementById('custom-sidebar').classList.remove('open');
            });

            item.appendChild(link);
            nav.appendChild(item);
            entries.push({ link: link, section: section, name: name.toLowerCase() });
          });

          document.body.appendChild(sidebar);
          document.body.classList.add('has-custom-sidebar');

          search.addEventListener('input', function () {
            var q = search.value.toLowerCase();
            entries.forEach(function (en) {
              en.link.parentElement.style.display = en.name.indexOf(q) !== -1 ? '' : 'none';
            });
          });

          if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function (obs) {
              obs.forEach(function (o) {
                if (o.isIntersecting) {
                  entries.forEach(function (en) {
                    en.link.classList.toggle('active', en.section === o.target);
                  });
                }
              });
            }, { rootMargin: '-10% 0px -75% 0px' });
            entries.forEach(function (en) { observer.observe(en.section); });
          }

          if (entries[0]) entries[0].link.classList.add('active');
        }

        if (document.readyState === 'complete') {
          setTimeout(init, 300);
        } else {
          window.addEventListener('load', function () { setTimeout(init, 300); });
        }
      })();
    `,
  });
}