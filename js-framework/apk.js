/*************************************************
 * CORE
 *************************************************/


class Component {
  constructor(selectorOrEl, props = {}) {
    if (typeof selectorOrEl === 'string') {
      this.el = document.querySelector(selectorOrEl);
    } else {
      this.el = selectorOrEl; // langsung element
    }
    this.props = props || {};
  }

  mount() {
    if (!this.el) return;
    this.readAttributes();
    this.render();
    this.afterRender();
  }

  readAttributes() {}
  render() {}
  afterRender() {}
}

/*************************************************
 * WIDGET REGISTRY
 *************************************************/
/*************************************************
 * WIDGET REGISTRY (Hanya <v-rct>)
 *************************************************/
const AppWidgets = {
  widgets: {},
  register(name, widget) {
    this.widgets[name] = widget;
  },
autoMount() {
  document.querySelectorAll('v-rct').forEach(el => {
    if (el._mounted) return;

    const vid = el.getAttribute('vid') || el.getAttribute('conditional-id') || el.id;
    if (!vid) return;

    let Widget = null;
    let props = {};

    // Tentukan widget berdasarkan vid
    if (vid.includes('graph')) {
      Widget = this.widgets['diagram-graph'];
      if (vid.includes('line')) props.mode = 'line';
      else if (vid.includes('waves')) props.mode = 'waves';
      else props.mode = 'chart';
    } else {
      // cek apakah vid itu memang nama widget terdaftar (footer, navbar, dsb)
      Widget = this.widgets[vid];
    }

    if (!Widget) return;

    const instance = new Widget(el, props);
    instance.mount();
    el._mounted = true;          
    el.__vMountedBy = Widget.name;
  });
},

  // ======= Tambahkan ini =======
  render(el, widgetName, props = {}) {
    const Widget = this.widgets[widgetName];
    if (!Widget) return;

    const instance = new Widget(el, props);
    instance.mount();
    el._mounted = true;
    el.__vMountedBy = Widget.name;
  }
};

/*************************************************
 * DIAGRAM GRAPH (HTML ATTRIBUTE BASED)
 *************************************************/
class DiagramGraph extends Component {

  constructor(selectorOrEl, props = {}) {
    super(selectorOrEl, props);
    this.mode = props.mode || 'chart';
  }

  readAttributes() {
    this.props.color =
      this.el.getAttribute('data-color') || 'rgba(0,123,255,1)';

    this.props.inlineColor =
      this.el.getAttribute('inline-color') || 'rgba(0,123,255,0.3)';

    const valueAttr = this.el.getAttribute('data-value');
    this.props.values = valueAttr
      ? JSON.parse(valueAttr)
      : [10, 20, 15, 30, 25];

    this.props.type = this.el.getAttribute('data-type') || this.el.getAttribute('data-type') || 'month';
    this.props.label = this.el.getAttribute('label') || 'Jumlah';

    const labelsAttr = this.el.getAttribute('labels');
    this.props.customLabels = labelsAttr ? JSON.parse(labelsAttr) : null;
  }

  getLabels() {
    const len = this.props.values.length;

    if (this.props.type === 'month') {
      return ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'].slice(0, len);
    }
    if (this.props.type === 'day') {
      return Array.from({ length: len }, (_, i) => `Day ${i + 1}`);
    }
    if (this.props.type === 'year') {
      const startYear = new Date().getFullYear() - len + 1;
      return Array.from({ length: len }, (_, i) => `${startYear + i}`);
    }
    if (this.props.type === 'custom' && this.props.customLabels) {
      return this.props.customLabels;
    }
    return Array.from({ length: len }, (_, i) => `Item ${i + 1}`);
  }

  getChartConfig() {
    const labels = this.getLabels();
    const data = this.props.values;

    if (this.mode === 'line') {
      return {
        type: 'line',
        data: { labels, datasets: [{ label: this.props.label, data, borderColor: this.props.color, fill: false }] }
      };
    }
    if (this.mode === 'waves') {
      return {
        type: 'line',
        data: { labels, datasets: [{ label: this.props.label, data, borderColor: this.props.inlineColor, backgroundColor: this.props.color, tension: 0.5, fill: true }] }
      };
    }
    return {
      type: 'bar',
      data: { labels, datasets: [{ label: this.props.label, data, backgroundColor: this.props.color }] }
    };
  }

  render() {
  this.el.innerHTML = `
    <h3 style="text-align:center;">${this.mode.toUpperCase()} GRAPH</h3>
    <div style="height:300px">
      <canvas></canvas>
    </div>

    <!-- summary labels -->
    <div class="graph-summary" style="
      margin-top:8px;
      display:flex;
      justify-content:center; /* CENTER */
      gap:8px;
      flex-wrap:wrap;
    ">
      <div class="summary-box avg" style="
        padding:2px 6px;
        border-radius:4px;
        border:1px solid ${this.props.color};
        font-size:0.75rem;
        font-weight:500;
        color:${this.props.color};
      ">-</div>
      <div class="summary-box min" style="
        padding:2px 6px;
        border-radius:4px;
        border:1px solid #F87171;
        font-size:0.75rem;
        font-weight:500;
        color:#F87171;
      ">-</div>
      <div class="summary-box max" style="
        padding:2px 6px;
        border-radius:4px;
        border:1px solid #22C55E;
        font-size:0.75rem;
        font-weight:500;
        color:#22C55E;
      ">-</div>
    </div>
  `;
}

afterRender() {
  const canvas = this.el.querySelector('canvas');
  const config = this.getChartConfig();
  this.chart = new Chart(canvas, { ...config, options: { responsive: true, maintainAspectRatio: false } });

  // Hitung summary
  const values = this.props.values;
  const avg = (values.reduce((a,b)=>a+b,0)/values.length).toFixed(2);
  const min = Math.min(...values);
  const max = Math.max(...values);

  const summary = this.el.querySelector('.graph-summary');
  if (summary) {
    summary.querySelector('.avg').textContent = `AVG: ${avg}`;
    summary.querySelector('.min').textContent = `LOW: ${min}`;
    summary.querySelector('.max').textContent = `HIGH: ${max}`;
  }
}

}

AppWidgets.register('diagram-graph', DiagramGraph);


AppWidgets.register('diagram-graph', DiagramGraph);

/*************************************************
 * NAVBAR COMPONENT
 *************************************************/
class Navbar extends Component {
  constructor(selectorOrEl, props = {}) {
    super(selectorOrEl, props);

    // Paksa element harus <v-rct>
    if (this.el.tagName.toLowerCase() !== 'v-rct') {
      console.warn('Navbar component hanya bisa dipasang di <v-rct>');
      this.el = null; // stop mount
    }
  }

  readAttributes() {
    if (!this.el) return;

    this.props.brand = this.el.getAttribute('brand') || 'MyApp';
    this.props.color = this.el.getAttribute('data-color') || '#3B82F6';
    const menuAttr = this.el.getAttribute('menu');
    try {
      this.props.menu = menuAttr ? JSON.parse(menuAttr) : [
        { label: 'Home', link: '#' },
        { label: 'About', link: '#' },
        { label: 'Services', link: '#' },
        { label: 'Contact', link: '#' }
      ];
    } catch {
      this.props.menu = [];
    }
  }

  render() {
    if (!this.el) return;

    const { brand, menu, color } = this.props;

    this.el.innerHTML = `
      <nav class="vericitto-nav" style="
        display:flex; 
        justify-content:space-between; 
        align-items:center; 
        padding:10px 20px; 
        background:${color}; 
        color:white; 
        font-family:Arial, sans-serif; 
        border-radius:8px;
      ">
        <div class="brand" style="font-size:1.5rem; font-weight:bold;">${brand}</div>
        <ul class="menu" style="
          display:flex; 
          list-style:none; 
          gap:20px; 
          margin:0; 
          padding:0;
        ">
          ${menu.map(item => `<li style="position:relative; cursor:pointer;">
            <a href="${item.link}" style="
              color:white; 
              text-decoration:none; 
              padding:5px 10px; 
              display:block; 
              transition:0.3s;
            ">${item.label}</a>
          </li>`).join('')}
        </ul>
        <div class="hamburger" style="display:none; flex-direction:column; cursor:pointer; gap:5px;">
          <span style="width:25px; height:3px; background:white; border-radius:3px;"></span>
          <span style="width:25px; height:3px; background:white; border-radius:3px;"></span>
          <span style="width:25px; height:3px; background:white; border-radius:3px;"></span>
        </div>
      </nav>
    `;

    const nav = this.el.querySelector('.vericitto-nav');
    const hamburger = nav.querySelector('.hamburger');
    const menuUL = nav.querySelector('.menu');

    const updateMenu = () => {
      if (window.innerWidth < 768) {
        hamburger.style.display = 'flex';
        menuUL.style.display = 'none';
        menuUL.style.flexDirection = 'column';
        menuUL.style.position = 'absolute';
        menuUL.style.top = '60px';
        menuUL.style.right = '20px';
        menuUL.style.background = color;
        menuUL.style.borderRadius = '8px';
        menuUL.style.padding = '10px 0';
      } else {
        hamburger.style.display = 'none';
        menuUL.style.display = 'flex';
        menuUL.style.position = 'static';
        menuUL.style.flexDirection = 'row';
        menuUL.style.background = 'transparent';
        menuUL.style.padding = '0';
      }
    };

    updateMenu();
    window.addEventListener('resize', updateMenu);

    hamburger.addEventListener('click', () => {
      menuUL.style.display = menuUL.style.display === 'flex' ? 'none' : 'flex';
    });

    menuUL.querySelectorAll('a').forEach(a => {
      a.addEventListener('mouseenter', () => {
        a.style.background = 'rgba(255,255,255,0.2)';
        a.style.borderRadius = '5px';
      });
      a.addEventListener('mouseleave', () => {
        a.style.background = 'transparent';
      });
    });
  }
}

AppWidgets.register('navbar', Navbar);

/*************************************************
 * FOOTER COMPONENT
 *************************************************/
class Footer extends Component {
  readAttributes() {
    if (!this.el) return;

    this.props.text = this.el.getAttribute('text') || '© 2026 MyApp. All rights reserved.';
    this.props.linksAttr = this.el.getAttribute('links');
    try {
      this.props.links = this.props.linksAttr ? JSON.parse(this.props.linksAttr) : [
        { label: 'Home', href: '#' },
        { label: 'About', href: '#' },
        { label: 'Contact', href: '#' }
      ];
    } catch {
      this.props.links = [];
    }

    this.props.color = this.el.getAttribute('color') || '#1E293B'; // background
    this.props.textColor = this.el.getAttribute('text-color') || '#ffffff'; // teks
  }

  render() {
    if (!this.el) return;

    const { text, links, color, textColor } = this.props;

    this.el.innerHTML = `
  <footer style="
    width:1080px;      /* full width */
    max-width:100%;   /* override max-width card */
    display:flex;
    flex-direction:column;
    align-items:center;
    justify-content:center;
    padding:20px 12px;
    background:${color};
    color:${textColor};
    font-family: Arial, sans-serif;
    border-radius:8px;
    gap:8px;
  ">
    <div class="footer-links" style="
      display:flex;
      gap:16px;
      flex-wrap:wrap;
      justify-content:center;
    ">
      ${links.map(link => `<a href="${link.href}" style="
        color:${textColor};
        text-decoration:none;
        font-weight:500;
        transition:0.3s;
      ">${link.label}</a>`).join('')}
    </div>
    <div class="footer-text" style="
      font-size:0.85rem;
      opacity:0.8;
    ">${text}</div>
  </footer>
`;


    // hover effect untuk link
    this.el.querySelectorAll('.footer-links a').forEach(a => {
      a.addEventListener('mouseenter', () => a.style.opacity = '0.6');
      a.addEventListener('mouseleave', () => a.style.opacity = '1');
    });
  }
}

AppWidgets.register('footer', Footer);

/*************************************************
 * LANDING PAGE (COMPOSITE COMPONENT)
 *************************************************/
class LandingPage extends Component {

  readAttributes() {
    this.props.title = this.el.getAttribute('title') || 'Bangun Website Lebih Cepat';
    this.props.subtitle = this.el.getAttribute('subtitle') || 'Satu tag HTML untuk landing page profesional.';
    this.props.cta = this.el.getAttribute('cta') || 'Get Started';
    this.props.bg = this.el.getAttribute('bg') || 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)';
  }

  render() {
    this.el.style.width = '100%';
    this.el.style.minHeight = '100vh';
    this.el.style.display = 'block';

    this.el.innerHTML = `
      <section class="v-landing-root" style="
        min-height:100vh;
        background:${this.props.bg};
        color:white;
        font-family:Arial, sans-serif;
      ">

        <!-- NAVBAR -->
        <v-rct 
          vid="navbar"
          brand="Vericitto"
          data-color="transparent"
          menu='[
            {"label":"Home","link":"#"},
            {"label":"Features","link":"#features"},
            {"label":"Pricing","link":"#pricing"},
            {"label":"Contact","link":"#contact"}
          ]'
        ></v-rct>

        <!-- HERO -->
        <section class="hero" style="
          min-height:80vh;
          display:flex;
          flex-direction:column;
          justify-content:center;
          align-items:center;
          text-align:center;
          padding:40px 20px;
        ">
          <h1 style="font-size:3rem; max-width:800px;">
            ${this.props.title}
          </h1>
          <p style="
            font-size:1.2rem;
            opacity:0.85;
            max-width:600px;
            margin-top:16px;
          ">
            ${this.props.subtitle}
          </p>

          <button style="
            margin-top:32px;
            padding:14px 36px;
            border:none;
            border-radius:30px;
            font-size:1rem;
            cursor:pointer;
            background:#00e0ff;
            color:#000;
            font-weight:bold;
          ">
            ${this.props.cta}
          </button>
        </section>

        <!-- FEATURES -->
        <section id="features" style="
          background:#ffffff;
          color:#111;
          padding:80px 20px;
        ">
          <div style="
            max-width:1080px;
            margin:auto;
            display:grid;
            grid-template-columns:repeat(auto-fit,minmax(240px,1fr));
            gap:24px;
          ">
            ${this.renderFeature('⚡ Cepat', 'Tanpa setup ribet')}
            ${this.renderFeature('🧩 Modular', 'Component based')}
            ${this.renderFeature('🎨 Custom', 'HTML attribute driven')}
          </div>
        </section>

        <!-- FOOTER -->
        <section style="padding:40px 20px; background:#020617;">
          <v-rct 
            vid="footer"
            text="© 2026 Vericitto JS Framework"
            color="#020617"
          ></v-rct>
        </section>

      </section>
    `;

  }

  renderFeature(title, desc) {
    return `
      <div style="
        background:#f8fafc;
        border-radius:12px;
        padding:24px;
        text-align:center;
        box-shadow:0 10px 25px rgba(0,0,0,0.08);
      ">
        <h3>${title}</h3>
        <p style="opacity:0.8">${desc}</p>
      </div>
    `;
  }
}

AppWidgets.register('landing', LandingPage);

/**************************************************
 * V-RCT VERICITTO – PROFESSIONAL LANDING PAGE
 **************************************************/
class VRctVericitto extends Component {

  readAttributes() {
    this.props.title =
      this.el.getAttribute('title') || 'Vericitto JS';
    this.props.subtitle =
      this.el.getAttribute('subtitle') ||
      'Write less, build more, launch instantly.';
    // CTA langsung menuju GitHub
    this.props.cta =
      this.el.getAttribute('cta') || 'https://github.com/HuTao161';
    this.props.ctaText =
      this.el.getAttribute('cta-text') || 'Get Started Cito'; // Menambahkan fallback untuk ctaText
    this.props.bg =
      this.el.getAttribute('bg') ||
      `radial-gradient(circle at 30% 20%, rgba(255,255,255,.06), transparent 45%),
       linear-gradient(135deg,
         #022c22 0%,
         #064e3b 30%,
         #047857 55%,
         #0d9488 75%,
         #164e63 100%
       )`;
  }

  render() {
    this.el.style.display = 'block';

    this.el.innerHTML = `
<style>
* { box-sizing:border-box; margin:0; padding:0; }
a { text-decoration:none; }

/* ROOT */
.v-root { font-family:system-ui,-apple-system,Segoe UI,Roboto; color:#0f172a; }

/* NAVBAR */
.v-nav { position:fixed; top:0; left:0; width:100%; background:#141E23; box-shadow:0 6px 30px rgba(0,0,0,.08); z-index:1000; }
.v-nav-inner { max-width:1200px; margin:auto; padding:16px 20px; display:flex; align-items:center; justify-content:space-between; }
.v-brand { font-weight:800; font-size:1.2rem; }
.v-menu { display:flex; gap:28px; }
.v-menu a { color:white; font-weight:600; }
.v-hamburger { display:none; flex-direction:column; gap:5px; cursor:pointer; }
.v-hamburger span { width:26px; height:3px; background:white; }

/* HERO */
.v-hero { min-height:100vh; padding:120px 20px 80px; background:${this.props.bg}; color:white; display:flex; align-items:center; justify-content:center; }
.v-hero-inner { max-width:720px; text-align:center; }
.v-hero h1 { font-size:clamp(2.2rem,6vw,3.4rem); line-height:1.15; }
.v-hero p { margin-top:18px; font-size:1.1rem; color:#c7d2fe; }
.v-hero button {
  margin-top:36px;
  padding:14px 40px;
  border-radius:999px;
  border:none;
  font-size: 1rem;
  font-weight:700;
  background:white;
  color:#020617;
  cursor:pointer;
  transition: transform 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);
}
.v-hero button:hover { transform:scale(1.1); }

/* CTA RIPPLE – HOVER ONLY */
.v-cta {
  position: relative;
  overflow: visible;
  isolation: isolate;
}

.v-cta span {
  position: relative;
  z-index: 3;
}

/* ripple rings (default: DIAM) */
.v-cta::before,
.v-cta::after {
  content: "";
  position: absolute;
  left: 50%;
  top: 50%;
  width: 160%;
  height: 200%;
  border-radius: 999px;
  transform: translate(-50%, -50%) scale(0.4);
  border: 2px solid rgba(255,255,255,0.45);
  opacity: 0;
  z-index: 1;
  pointer-events: none;
}

/* AKTIF SAAT HOVER */
.v-cta:hover::before {
  animation: rippleRing 2s ease-out infinite;
}

.v-cta:hover::after {
  animation: rippleRing 2s ease-out infinite;
  animation-delay: 1s;
}

@keyframes rippleRing {
  0% {
    transform: translate(-50%, -50%) scale(0.4);
    opacity: 0.6;
  }
  70% {
    opacity: 0.25;
  }
  100% {
    transform: translate(-50%, -50%) scale(1.6);
    opacity: 0;
  }
}
/* ===== MOBILE TUNING ===== */
@media (max-width: 640px) {
  .v-cta::before,
  .v-cta::after {
    width: 80%;
    height: 95%;
    border-width: 1.5px;
  }

  .v-cta:hover::before {
    animation-duration: 1.6s;
  }

  .v-cta:hover::after {
    animation-duration: 1.6s;
    animation-delay: 0.8s;
  }
}


@keyframes clickRipple {
  to {
    transform: scale(15);
    opacity: 0;
  }
}


/* FEATURES / BENEFITS */
.v-features { padding:40px 20px; background:#f4f6f8; }
.v-grid { max-width:1200px; margin:auto; display:grid; grid-template-columns:repeat(auto-fit,minmax(280px,1fr)); gap:32px; }
.v-card {
  background:white;
  padding:32px 24px;
  border-radius:20px;
  box-shadow:0 16px 32px rgba(0,0,0,0.08);
  display:flex;
  flex-direction:column;
  gap:16px;
  opacity:0;
  transform:translateY(30px);
  transition:opacity 0.6s ease, transform 0.6s ease, box-shadow 0.4s ease;
  cursor:pointer;
}
.v-card.visible {
  opacity:1;
  transform:translateY(0);
}
.v-card:hover { transform:translateY(-6px); box-shadow:0 24px 48px rgba(0,0,0,0.12); }

.icon-wrapper { display:flex; justify-content:center; margin-bottom:16px; }
.icon-circle { display:flex; align-items:center; justify-content:center; border-radius:9999px; }

/* FOOTER */
.v-footer { background:#020617; color:#94a3b8; padding:20px 20px; text-align:center; }

/* RESPONSIVE */
@media (max-width:768px) {
  .v-menu { position:absolute; top:64px; right:20px; background:#141E23; flex-direction:column; padding:18px 22px; border-radius:14px; box-shadow:0 12px 40px rgba(0,0,0,.18); display:none; }
  .v-menu.show { display:flex; }
  .v-hamburger { display:flex; }
}
</style>

<div class="v-root">
  <!-- NAV -->
  <nav class="v-nav">
    <div class="v-nav-inner">
      <div class="v-brand">
        <img src="assets/vericitto-logo.jpeg" alt="Vericitto Logo" style="height:40px; width:auto;">
      </div>
      <div class="v-menu">
        <a href="#features">Features</a>
        <a href="#">Docs</a>
        <a href="https://github.com/HuTao161" target="_blank">GitHub</a>
      </div>
      <div class="v-hamburger"><span></span><span></span><span></span></div>
    </div>
  </nav>

  <!-- HERO -->
  <section class="v-hero">
    <div class="v-hero-inner animate">
      <h1>
        <span style="color:white;">Vericitto</span>
        <span style="color:#FACC15;">J</span><span style="color:#FACC15;">S</span>
      </h1>
      <p>${this.props.subtitle}</p>
      <a href="${this.props.cta}" target="_blank">
        <button class="v-cta">
          <span>${this.props.ctaText || 'Get Started Cito'}</span>
        </button>
      </a>
    </div>
  </section>

  <!-- FEATURES -->
  <section id="features" class="v-features">
    <div class="v-grid">
      ${this.card('Fast', 'Zero config, instant UI, launch pages instantly with minimal setup', 'fas fa-bolt', '#FBBF24', '#FEF3C7')}
      ${this.card('Modular', 'Component driven architecture for reusable and scalable UI components', 'fas fa-puzzle-piece', '#34D399', '#D1FAE5')}
      ${this.card('Clean', 'HTML attribute-based design, keeping your code minimal and maintainable', 'fas fa-paint-brush', '#A78BFA', '#F5F3FF')}
    </div>
  </section>

  <!-- FOOTER -->
  <footer class="v-footer">
  © 2026 Vericitto JS Framework
</footer>
</div>
`;

const cta = this.el.querySelector('.v-cta');

cta.addEventListener('click', e => {
  const ripple = document.createElement('span');
  ripple.style.position = 'absolute';
  ripple.style.borderRadius = '50%';
  ripple.style.background = 'rgba(255,255,255,.6)';
  ripple.style.transform = 'scale(0)';
  ripple.style.animation = 'clickRipple 600ms ease-out';
  ripple.style.left = `${e.offsetX}px`;
  ripple.style.top = `${e.offsetY}px`;
  ripple.style.width = ripple.style.height = '20px';

  cta.appendChild(ripple);
  ripple.addEventListener('animationend', () => ripple.remove());
});


    // ANIMATION OBSERVER
    const animItems = this.el.querySelectorAll('.animate, .v-card');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if(entry.isIntersecting){
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, i * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );
    animItems.forEach(el => observer.observe(el));

    // hamburger logic
    const burger = this.el.querySelector('.v-hamburger');
    const menu = this.el.querySelector('.v-menu');
    burger.onclick = () => menu.classList.toggle('show');
  }

  card(title, desc, icon = 'fas fa-star', color = '#10B981', bgColor = '#D1FAE5') {
    return `
      <div class="v-card animate">
        <div class="icon-wrapper">
          <div class="icon-circle" style="background:${bgColor}; padding:16px;">
            <i class="${icon}" style="color:${color}; font-size:1.5rem;"></i>
          </div>
        </div>
        <h3 style="border-top:4px solid ${color}; padding-top:12px; font-size:1.2rem; font-weight:700; color:#141E23; text-align:center;">
          ${title}
        </h3>
        <p style="margin-top:8px; opacity:.75; text-align:center; color:#475569;">
          ${desc}
        </p>
      </div>
    `;
  }
}

AppWidgets.register('v-rct-vericitto', VRctVericitto);

document.querySelectorAll('v-rct').forEach(el => {
  AppWidgets.render(el, 'v-rct-vericitto');
});

/*************************************************
 * AUTO BOOTSTRAP
 *************************************************/
document.addEventListener('DOMContentLoaded', () => {
  AppWidgets.register('v-rct-vericitto', VRctVericitto);
  AppWidgets.autoMount();
});
