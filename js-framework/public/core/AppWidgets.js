// ================= Core AppWidgets system =================
class AppWidgets {
  static widgets = {};

  static register(name, widgetClass) {
    AppWidgets.widgets[name] = widgetClass;
  }

  static mountAll() {
    const els = document.querySelectorAll("v-rct");
    els.forEach((el) => {
      const cid = el.getAttribute("cid");
      const WidgetClass = AppWidgets.widgets[cid];
      if (!WidgetClass) return;

      const widgetInstance = new WidgetClass(el);
      widgetInstance.readAttributes();
      widgetInstance.render();
      widgetInstance.afterRender();
    });
  }
}

// ================= Base Component =================
class Component {
  constructor(el) {
    this.el = el;
    this.props = {};
  }
  readAttributes() {}
  render() {}
  afterRender() {}
}

class Countdown extends Component {
  readAttributes() {
    this.props.target = this.el.getAttribute("target") || "2026-02-14T00:00:00";
  }

  render() {
    this.el.innerHTML = `
      <div class="countdown-card">
        <div class="countdown-digits">Loading...</div>
      </div>
    `;

    const style = document.createElement("style");
    style.innerHTML = `
      .countdown-card {
        display: inline-block;
        padding: 20px 40px;
        border-radius: 15px;
        background: rgba(255,255,255,0.1);
        backdrop-filter: blur(8px);
        box-shadow: 0 8px 20px rgba(0,0,0,0.25);
        text-align: center;
        font-family: 'Poppins', sans-serif;
        color: #fff;
      }
      .countdown-digits {
        font-size: 2.5rem;
        font-weight: bold;
        background: linear-gradient(45deg, #4facfe, #00f2fe);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      .countdown-digits span {
        display: inline-block;
        min-width: 50px;
      }
      @media (max-width: 500px) {
        .countdown-card {
          padding: 15px 20px;
        }
        .countdown-digits {
          font-size: 1.8rem;
        }
      }
    `;
    document.head.appendChild(style);
  }

  afterRender() {
    const digitsEl = this.el.querySelector(".countdown-digits");
    const targetTime = new Date(this.props.target).getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const distance = targetTime - now;

      if (distance < 0) {
        clearInterval(this.timer);
        digitsEl.innerHTML = "Event Started!";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      digitsEl.innerHTML = `
        <span>${days}d</span> :
        <span>${hours}h</span> :
        <span>${minutes}m</span> :
        <span>${seconds}s</span>
      `;
    };

    updateTimer();
    this.timer = setInterval(updateTimer, 1000);
  }
}

AppWidgets.register("countdown", Countdown);

// ================= Clock Widget =================
class Clock extends Component {
  readAttributes() {
    this.props.style =
      this.el.getAttribute("style") || "";
    this.props.bgColor =
      this.el.getAttribute("bg-color") || "#1e1e1e"; // dark background
    this.props.textColor =
      this.el.getAttribute("text-color") || "#00ffcc"; // neon style
    this.props.fontSize =
      this.el.getAttribute("font-size") || "2rem";
    this.props.padding =
      this.el.getAttribute("padding") || "12px 20px";
    this.props.borderRadius =
      this.el.getAttribute("border-radius") || "12px";
  }

  render() {
    this.readAttributes();

    this.el.innerHTML = `
      <div class="clock-container" style="${this.props.style}">
        <span class="clock-time">--:--:--</span>
      </div>
    `;
    this.injectStyles();
  }

  afterRender() {
    const timeEl = this.el.querySelector(".clock-time");
    const updateTime = () => {
      const now = new Date();
      const timeStr = now.toLocaleTimeString();
      // Fade effect saat update
      timeEl.style.opacity = "0.2";
      setTimeout(() => {
        timeEl.innerHTML = timeStr;
        timeEl.style.opacity = "1";
      }, 100);
    };
    updateTime();
    this.timer = setInterval(updateTime, 1000);
  }

  injectStyles() {
    if (document.getElementById("clock-widget-styles")) return;

    const style = document.createElement("style");
    style.id = "clock-widget-styles";
    style.innerHTML = `
      .clock-container {
        display: inline-block;
        background: ${this.props.bgColor};
        color: ${this.props.textColor};
        font-family: 'Courier New', monospace;
        font-size: ${this.props.fontSize};
        padding: ${this.props.padding};
        border-radius: ${this.props.borderRadius};
        box-shadow: 0 6px 15px rgba(0,0,0,0.3);
        text-align: center;
        transition: all 0.3s ease;
      }
      .clock-time {
        display: inline-block;
        transition: opacity 0.2s ease;
      }
      @media (max-width:480px) {
        .clock-container {
          font-size: 1.5rem;
          padding: 10px 16px;
        }
      }
    `;
    document.head.appendChild(style);
  }
}

AppWidgets.register("clock", Clock);

// ================= Progress Bar Widget =================
class ProgressBar extends Component {
  readAttributes() {
    this.props.value = parseInt(this.el.getAttribute("value") || 0);
    this.props.max = parseInt(this.el.getAttribute("max") || 100);
    this.props.style = this.el.getAttribute("style") || "";
  }

  render() {
    const percent = Math.min((this.props.value / this.props.max) * 100, 100);
    this.el.innerHTML = `
      <div class="progress-container" style="width:100%;background:#eee;height:20px;border-radius:4px;${this.props.style}">
        <div class="progress-fill" style="width:${percent}%;background:green;height:100%;border-radius:4px;"></div>
      </div>
    `;
  }
}

AppWidgets.register("progress", ProgressBar);

// ================= Marquee Widget =================
class Marquee extends Component {
  readAttributes() {
    this.props.text = this.el.getAttribute("text") || "Hello World!";
    this.props.speed = parseInt(this.el.getAttribute("speed") || 2);
  }

  render() {
    this.el.innerHTML = `<div class="marquee-inner" style="white-space:nowrap;">${this.props.text}</div>`;
    this.el.style.overflow = "hidden";
    this.el.style.display = "block";
  }

  afterRender() {
    const inner = this.el.querySelector(".marquee-inner");
    let pos = this.el.offsetWidth;
    const move = () => {
      pos -= this.props.speed;
      if (pos < -inner.offsetWidth) pos = this.el.offsetWidth;
      inner.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(move);
    };
    move();
  }
}

AppWidgets.register("marquee", Marquee);

// ================= Modal Widget =================
class Modal extends Component {
  readAttributes() {
    const el = this.el;
    this.props.title = el.getAttribute("title") || "Hello World";
    this.props.content =
      el.getAttribute("content") ||
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
    this.props.buttonText = el.getAttribute("button-text") || "Open Modal";
    this.props.closeType = el.getAttribute("close-type") || "icon"; // icon / text
    this.props.buttonColor = el.getAttribute("button-color") || "red";
    this.props.buttonTextColor = el.getAttribute("button-text-color") || "#fff";
    this.props.titleColor = el.getAttribute("title-color") || "#111";
    this.props.contentColor = el.getAttribute("content-color") || "#111";
  }

  render() {
    this.readAttributes();

    const closeBtnHTML =
      this.props.closeType === "text"
        ? `<button class="close-modal btn-secondary">Close</button>`
        : `<button class="close-modal close-icon">&times;</button>`;

    this.el.innerHTML = `
      <button class="open-modal btn-primary">${this.props.buttonText}</button>
      <div class="modal-overlay">
        <div class="modal-box">
          <div class="modal-header">
            <h3>${this.props.title}</h3>
            ${this.props.closeType === "icon" ? closeBtnHTML : ""}
          </div>
          <div class="modal-body">
            <p>${this.props.content}</p>
          </div>
          <div class="modal-footer">
            ${this.props.closeType === "text" ? closeBtnHTML : ""}
          </div>
        </div>
      </div>
    `;

    this.injectStyles();
  }

  afterRender() {
    const modal = this.el.querySelector(".modal-overlay");
    const openBtn = this.el.querySelector(".open-modal");
    const closeBtns = this.el.querySelectorAll(".close-modal");

    openBtn.onclick = () => modal.classList.add("active");
    closeBtns.forEach((btn) => (btn.onclick = () => modal.classList.remove("active")));

    modal.onclick = (e) => {
      if (e.target === modal) modal.classList.remove("active");
    };
  }

  injectStyles() {
    if (document.getElementById("modal-widget-styles")) return;

    const style = document.createElement("style");
    style.id = "modal-widget-styles";
    style.innerHTML = `
      .btn-primary {
        background: ${this.props.buttonColor};
        color: ${this.props.buttonTextColor};
        border: none;
        padding: 10px 18px;
        border-radius: 8px;
        cursor: pointer;
        font-weight: 600;
        transition: .3s;
      }
      .btn-primary:hover { opacity: .85; }

      .btn-secondary {
        background: ${this.props.buttonColor};
        color: ${this.props.buttonTextColor};
        border: none;
        padding: 8px 16px;
        border-radius: 6px;
        cursor: pointer;
        font-weight: 500;
        transition: .3s;
      }
      .btn-secondary:hover { opacity: .85; }

      .close-icon {
        background: none;
        border: none;
        font-size: 22px;
        line-height: 1;
        cursor: pointer;
        color: red;
        transition: .2s;
      }
      .close-icon:hover { opacity: .8; }

      .modal-overlay {
        position: fixed;
        top: 0; left: 0; width: 100%; height: 100%;
        background: rgba(0,0,0,0.6);
        backdrop-filter: blur(4px);
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        pointer-events: none;
        transition: opacity 0.4s ease;
        z-index: 9999;
      }
      .modal-overlay.active { 
        opacity: 1;
        pointer-events: auto;
      }

      .modal-box {
        background: #fff;
        border-radius: 12px;
        max-width: 400px;
        width: 90%;
        padding: 20px;
        box-shadow: 0 8px 25px rgba(0,0,0,0.25);
        transform: translateY(-30px) scale(0.9) rotateX(-10deg);
        opacity: 0;
        transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.4s ease;
      }
      .modal-overlay.active .modal-box {
        transform: translateY(0) scale(1) rotateX(0deg);
        opacity: 1;
      }

      .modal-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #eee;
        padding-bottom: 10px;
        margin-bottom: 12px;
      }
      .modal-header h3 {
        margin: 0;
        font-size: 18px;
        color: ${this.props.titleColor};
      }

      .modal-body p {
        margin: 0 0 12px 0;
        line-height: 1.6;
        color: ${this.props.contentColor};
        font-size: 15px;
        word-break: break-word;
      }

      .modal-footer { text-align: right; }

      @media (max-width:480px) {
        .modal-box { width: 95%; padding: 16px; }
        .btn-primary { padding: 8px 14px; font-size: 14px; }
        .btn-secondary { padding: 6px 12px; font-size: 13px; }
      }
    `;
    document.head.appendChild(style);
  }

  setButtonText(newText) {
    const openBtn = this.el.querySelector(".open-modal");
    if (openBtn) openBtn.textContent = newText;
  }
}

AppWidgets.register("modal", Modal);

// ================= Accordion Widget =================
class Accordion extends Component {
  readAttributes() {
    this.props.title = this.el.getAttribute("title") || "Click to expand";
    this.props.content = this.el.getAttribute("content") || "Accordion content";
  }

  render() {
    this.el.innerHTML = `
      <div class="accordion-header" style="cursor:pointer;background:#eee;padding:5px;">${this.props.title}</div>
      <div class="accordion-body" style="display:none;padding:5px;border:1px solid #eee;">${this.props.content}</div>
    `;
  }

  afterRender() {
    const header = this.el.querySelector(".accordion-header");
    const body = this.el.querySelector(".accordion-body");
    header.onclick = () => {
      body.style.display = body.style.display === "none" ? "block" : "none";
    };
  }
}

AppWidgets.register("accordion", Accordion);

// ================= Digital Clock Widget =================
class DigitalClock extends Component {
  readAttributes() {
    this.props.style =
      this.el.getAttribute("style") ||
      "font-size:20px;color:black;font-family:monospace;";
  }

  render() {
    this.el.innerHTML = `<div class="digital-clock" style="${this.props.style}">--:--:--</div>`;
  }

  afterRender() {
    const clockEl = this.el.querySelector(".digital-clock");
    const update = () => {
      const now = new Date();
      clockEl.innerHTML = now.toLocaleTimeString();
    };
    update();
    this.timer = setInterval(update, 1000);
  }
}

AppWidgets.register("digital-clock", DigitalClock);

// ================= Quote Widget =================
class QuoteWidget extends Component {
  readAttributes() {
    this.props.quotes = (
      this.el.getAttribute("quotes") || "Quote 1|Quote 2|Quote 3"
    ).split("|");
    this.props.style =
      this.el.getAttribute("style") ||
      "font-size:16px;color:purple;font-style:italic;";
  }

  render() {
    this.el.innerHTML = `<div class="quote-widget" style="${this.props.style}">Loading...</div>`;
  }

  afterRender() {
    const quoteEl = this.el.querySelector(".quote-widget");
    const showRandom = () => {
      const idx = Math.floor(Math.random() * this.props.quotes.length);
      quoteEl.innerHTML = this.props.quotes[idx];
    };
    showRandom();
    this.timer = setInterval(showRandom, 5000);
  }
}

AppWidgets.register("quote", QuoteWidget);

// ================= New Widget: Countdown Progress =================
class CountdownProgress extends Component {
  readAttributes() {
    this.props.target = this.el.getAttribute("target") || "2026-02-14T00:00:00";
    this.props.style =
      this.el.getAttribute("style") ||
      "width:100%;height:20px;background:#eee;border-radius:4px;";
  }

  render() {
    this.el.innerHTML = `
      <div class="progress-bar-container" style="${this.props.style}">
        <div class="progress-bar-fill" style="width:0%;background:orange;height:100%;border-radius:4px;"></div>
      </div>
    `;
  }

  afterRender() {
    const fill = this.el.querySelector(".progress-bar-fill");
    const startTime = new Date().getTime();
    const targetTime = new Date(this.props.target).getTime();
    const total = targetTime - startTime;

    const update = () => {
      const now = new Date().getTime();
      const percent = Math.min(
        100,
        Math.max(0, ((total - (targetTime - now)) / total) * 100),
      );
      fill.style.width = percent + "%";
      if (percent < 100) requestAnimationFrame(update);
      else fill.style.background = "green";
    };

    update();
  }
}

AppWidgets.register("countdown-progress", CountdownProgress);

// ================= Emoji Rain Widget =================
class EmojiRain extends Component {
  readAttributes() {
    this.props.emojis = (this.el.getAttribute("emojis") || "💖✨🎉🍀").split(
      "",
    );
    this.props.count = parseInt(this.el.getAttribute("count") || 20);
    this.props.style =
      this.el.getAttribute("style") ||
      "position:relative;width:100%;height:150px;overflow:hidden;";
  }

  render() {
    this.el.style.cssText += this.props.style;
    this.el.innerHTML = "";
    for (let i = 0; i < this.props.count; i++) {
      const span = document.createElement("span");
      span.textContent =
        this.props.emojis[Math.floor(Math.random() * this.props.emojis.length)];
      span.style.position = "absolute";
      span.style.left = Math.random() * 100 + "%";
      span.style.top = -Math.random() * 50 + "%";
      span.style.fontSize = 20 + Math.random() * 20 + "px";
      this.el.appendChild(span);
    }
  }

  afterRender() {
    const spans = this.el.querySelectorAll("span");
    const animate = () => {
      spans.forEach((span) => {
        let top = parseFloat(span.style.top);
        top += 2 + Math.random() * 2;
        if (top > this.el.offsetHeight) top = -20;
        span.style.top = top + "px";
      });
      requestAnimationFrame(animate);
    };
    animate();
  }
}

AppWidgets.register("emoji-rain", EmojiRain);

// ================= Random Color Box Widget =================
class ColorBox extends Component {
  readAttributes() {
    this.props.style =
      this.el.getAttribute("style") || "width:100px;height:100px;";
    this.props.interval = parseInt(this.el.getAttribute("interval") || 500);
  }

  render() {
    this.el.style.cssText += this.props.style;
  }

  afterRender() {
    const changeColor = () => {
      this.el.style.backgroundColor = `hsl(${Math.random() * 360}, 70%, 60%)`;
    };
    changeColor();
    setInterval(changeColor, this.props.interval);
  }
}

AppWidgets.register("color-box", ColorBox);

// ================= Simple Notification Widget =================
class NotificationWidget extends Component {
  readAttributes() {
    this.props.text = this.el.getAttribute("text") || "Hello!";
    this.props.duration = parseInt(this.el.getAttribute("duration") || 3000);
  }

  render() {
    this.el.innerHTML = `<div class="notification" style="padding:10px;background:#fffa90;border:1px solid #ccc;border-radius:5px;">${this.props.text}</div>`;
  }

  afterRender() {
    setTimeout(() => (this.el.innerHTML = ""), this.props.duration);
  }
}

AppWidgets.register("notification", NotificationWidget);

// ================= Weather Widget (dummy) =================
class WeatherWidget extends Component {
  readAttributes() {
    this.props.city = this.el.getAttribute("city") || "Jakarta";
    this.props.style =
      this.el.getAttribute("style") || "font-size:16px;color:blue;";
  }

  render() {
    this.el.innerHTML = `<div style="${this.props.style}">Loading weather for ${this.props.city}...</div>`;
  }

  afterRender() {
    const weather = { temp: 30, condition: "Sunny" }; // dummy
    this.el.innerHTML = `<div style="${this.props.style}">${this.props.city}: ${weather.temp}°C, ${weather.condition}</div>`;
  }
}
AppWidgets.register("weather", WeatherWidget);

// ================= News Ticker =================
class NewsTicker extends Component {
  readAttributes() {
    this.props.ticker = (
      this.el.getAttribute("ticker") ||
      "Breaking News 1|Breaking News 2|Breaking News 3"
    ).split("|");
    this.props.speed = parseInt(this.el.getAttribute("speed") || 2);
    this.props.style =
      this.el.getAttribute("style") || "font-size:16px;color:black;";
  }

  render() {
    this.el.style.overflow = "hidden";
    this.el.innerHTML = `<div class="ticker-inner" style="white-space:nowrap;display:inline-block;">${this.props.ticker.join(" --- ")}</div>`;
  }

  afterRender() {
    const inner = this.el.querySelector(".ticker-inner");
    let pos = this.el.offsetWidth;
    const move = () => {
      pos -= this.props.speed;
      if (pos < -inner.offsetWidth) pos = this.el.offsetWidth;
      inner.style.transform = `translateX(${pos}px)`;
      requestAnimationFrame(move);
    };
    move();
  }
}
AppWidgets.register("news-ticker", NewsTicker);

// ============================================================
// Professional Todo Widget
// Fixed Attribute Handling • Smooth Animation • Clean UI
// ============================================================

class TodoWidget extends Component {
  // ----------------------------------------------------------
  // Read Attributes (IMPORTANT)
  // ----------------------------------------------------------
  readAttributes() {
    this.props = this.props || {};
    this.props.style = this.el.getAttribute("style") || "";
    this.props.key = this.el.getAttribute("storage-key") || "todo-list";
  }

  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  render() {
    // 🔥 WAJIB dipanggil agar storage-key kebaca
    this.readAttributes();

    this.el.innerHTML = `
      <div class="todo-root" style="${this.props.style}">
        <div class="todo-card">
          <div class="todo-header">
            <input class="todo-input" placeholder="Add a new task..." />
            <button class="todo-add">+</button>
          </div>
          <ul class="todo-list"></ul>
        </div>
      </div>

      <div class="todo-toast"></div>
    `;

    this.injectStyles();
  }

  // ----------------------------------------------------------
  // After Render
  // ----------------------------------------------------------
  afterRender() {
    this.cacheElements();
    this.loadData();
    this.bindEvents();
    this.renderList();
  }

  // ----------------------------------------------------------
  // Cache DOM (LOCAL SCOPE)
  // ----------------------------------------------------------
  cacheElements() {
    this.input = this.el.querySelector(".todo-input");
    this.addBtn = this.el.querySelector(".todo-add");
    this.list = this.el.querySelector(".todo-list");
    this.toast = this.el.querySelector(".todo-toast");
  }

  // ----------------------------------------------------------
  // Data
  // ----------------------------------------------------------
  loadData() {
    this.items = JSON.parse(localStorage.getItem(this.props.key) || "[]");
  }

  saveData() {
    localStorage.setItem(this.props.key, JSON.stringify(this.items));
  }

  // ----------------------------------------------------------
  // Render List
  // ----------------------------------------------------------
  renderList() {
    this.list.innerHTML = "";

    this.items.forEach((item, index) => {
      const li = document.createElement("li");
      li.className = `todo-item ${item.done ? "done" : ""}`;
      li.innerHTML = `
        <div class="todo-left">
          <span class="todo-check"></span>
          <span class="todo-text">${item.text}</span>
        </div>
        <div class="todo-actions">
          <button class="todo-edit">✎</button>
          <button class="todo-delete">✕</button>
        </div>
      `;

      // Smooth entry animation
      requestAnimationFrame(() => li.classList.add("show"));

      // Toggle done
      li.querySelector(".todo-left").onclick = () => {
        item.done = !item.done;
        this.saveData();
        li.classList.toggle("done");
      };

      // Delete
      li.querySelector(".todo-delete").onclick = () => {
        li.classList.add("removing");
        setTimeout(() => {
          this.items.splice(index, 1);
          this.saveData();
          this.renderList();
          this.showToast("Task deleted", "#ff3b30");
        }, 220);
      };

      // Edit
      li.querySelector(".todo-edit").onclick = () => {
        const newText = prompt("Edit task", item.text);
        if (newText && newText.trim()) {
          item.text = newText.trim();
          this.saveData();
          this.renderList();
          this.showToast("Task updated", "#ff9500");
        }
      };

      this.list.appendChild(li);
    });
  }

  // ----------------------------------------------------------
  // Add Item
  // ----------------------------------------------------------
  addItem() {
    const value = this.input.value.trim();
    if (!value) return;

    this.items.push({
      text: value,
      done: false,
    });

    this.input.value = "";
    this.saveData();
    this.renderList();
    this.showToast("Task added", "#34c759");
  }

  // ----------------------------------------------------------
  // Toast Notification
  // ----------------------------------------------------------
  showToast(message, color) {
    this.toast.textContent = message;
    this.toast.style.background = color;
    this.toast.classList.add("show");

    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => {
      this.toast.classList.remove("show");
    }, 1800);
  }

  // ----------------------------------------------------------
  // Events
  // ----------------------------------------------------------
  bindEvents() {
    this.addBtn.onclick = () => this.addItem();
    this.input.onkeydown = (e) => {
      if (e.key === "Enter") this.addItem();
    };
  }

  // ----------------------------------------------------------
  // Styles
  // ----------------------------------------------------------
  injectStyles() {
    if (document.getElementById("todo-pro-style")) return;

    const style = document.createElement("style");
    style.id = "todo-pro-style";
    style.innerHTML = `
      .todo-root {
        font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
      }

      .todo-card {
        width: 360px;
        background: #fff;
        padding: 18px;
        border-radius: 16px;
        box-shadow: 0 20px 40px rgba(0,0,0,0.12);
      }

      .todo-header {
        display: flex;
        gap: 10px;
        margin-bottom: 14px;
      }

      .todo-input {
        flex: 1;
        padding: 12px 16px;
        border-radius: 999px;
        border: 1px solid #ddd;
        font-size: 14px;
        transition: border .2s, box-shadow .2s;
      }

      .todo-input:focus {
        outline: none;
        border-color: #0a84ff;
        box-shadow: 0 0 0 4px rgba(10,132,255,.15);
      }

      .todo-add {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        border: none;
        font-size: 22px;
        color: white;
        background: #0a84ff;
        cursor: pointer;
        transition: transform .15s ease;
      }

      .todo-add:hover {
        transform: scale(1.08);
      }

      .todo-list {
        list-style: none;
        padding: 0;
        margin: 0;
        max-height: 300px;
        overflow-y: auto;
      }

      .todo-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 12px 14px;
        border-radius: 12px;
        background: #f5f5f7;
        margin-bottom: 8px;
        opacity: 0;
        transform: translateY(6px) scale(.98);
        transition: all .25s ease;
      }

      .todo-item.show {
        opacity: 1;
        transform: none;
      }

      .todo-item.removing {
        opacity: 0;
        transform: scale(.9);
      }

      .todo-item.done .todo-text {
        text-decoration: line-through;
        opacity: .5;
      }

      .todo-left {
        display: flex;
        align-items: center;
        gap: 10px;
        cursor: pointer;
      }

      .todo-check {
        width: 18px;
        height: 18px;
        border-radius: 50%;
        border: 2px solid #ccc;
      }

      .todo-item.done .todo-check {
        background: #0a84ff;
        border-color: #0a84ff;
      }

      .todo-actions button {
        background: none;
        border: none;
        font-size: 16px;
        cursor: pointer;
        opacity: .6;
      }

      .todo-actions button:hover {
        opacity: 1;
      }

      .todo-toast {
        position: fixed;
        bottom: 24px;
        right: 24px;
        padding: 12px 18px;
        color: white;
        border-radius: 12px;
        opacity: 0;
        transform: translateY(10px);
        transition: all .25s ease;
        z-index: 9999;
      }

      .todo-toast.show {
        opacity: 1;
        transform: none;
      }
    `;
    document.head.appendChild(style);
  }
}

// ------------------------------------------------------------
// Register Widget
// ------------------------------------------------------------
AppWidgets.register("todo", TodoWidget);

// ================= Network Status =================
class NetworkStatus extends Component {
  readAttributes() {
    this.props.style =
      this.el.getAttribute("style") || "font-size:16px;color:green;";
  }
  render() {
    this.el.innerHTML = `<div class="network-status" style="${this.props.style}">Online</div>`;
  }
  afterRender() {
    const ns = this.el.querySelector(".network-status");
    const updateStatus = () => {
      ns.textContent = navigator.onLine ? "Online" : "Offline";
      ns.style.color = navigator.onLine ? "green" : "red";
    };
    window.addEventListener("online", updateStatus);
    window.addEventListener("offline", updateStatus);
    updateStatus();
  }
}
AppWidgets.register("network-status", NetworkStatus);

// ============================================================
// Professional iOS-Style Battery Status Component
// Charging = Bolt Only + Speed Boost Animation
// ============================================================

class BatteryStatus extends Component {
  // ----------------------------------------------------------
  // Render
  // ----------------------------------------------------------
  render() {
    this.el.innerHTML = `
      <div class="battery-root">
        <div class="battery-shell">
          <div class="battery-body">
            <div class="battery-fill"></div>
            <div class="battery-gloss"></div>

            <div class="battery-percent">--%</div>

            <div class="battery-charging-box">
              <span class="battery-bolt">⚡</span>
            </div>
          </div>
          <div class="battery-cap"></div>
        </div>
      </div>
    `;

    this.injectStyles();
  }

  afterRender() {
    this.cacheElements();
    this.initBatteryAPI();
  }

  // ----------------------------------------------------------
  // Cache DOM
  // ----------------------------------------------------------
  cacheElements() {
    this.$fill = this.el.querySelector(".battery-fill");
    this.$percent = this.el.querySelector(".battery-percent");
    this.$box = this.el.querySelector(".battery-charging-box");
  }

  // ----------------------------------------------------------
  // Battery API
  // ----------------------------------------------------------
  initBatteryAPI() {
    if (!navigator.getBattery) {
      this.setFallback();
      return;
    }

    navigator.getBattery().then((battery) => {
      this.battery = battery;
      this.updateUI();

      battery.addEventListener("levelchange", () => this.updateUI());
      battery.addEventListener("chargingchange", () => this.updateUI());
    });
  }

  // ----------------------------------------------------------
  // Update UI
  // ----------------------------------------------------------
  updateUI() {
    const percent = Math.round(this.battery.level * 100);

    this.$fill.style.width = percent + "%";
    this.$percent.textContent = percent + "%";

    this.applyColor(percent);
    this.applyChargingState(this.battery.charging);
  }

  // ----------------------------------------------------------
  // Color Rules (User Defined)
  // ----------------------------------------------------------
  applyColor(percent) {
    let color;

    if (percent <= 20) {
      color = "var(--battery-red)";
    } else if (percent <= 50) {
      color = "var(--battery-yellow)";
    } else if (percent <= 89) {
      color = "var(--battery-white)";
    } else {
      color = "var(--battery-blue)";
    }

    this.$fill.style.background = color;
  }

  // ----------------------------------------------------------
  // Charging State Logic
  // ----------------------------------------------------------
  applyChargingState(isCharging) {
    if (isCharging) {
      this.$percent.style.opacity = "0";
      this.$box.classList.add("active");
      this.$fill.classList.add("boost");
    } else {
      this.$percent.style.opacity = "1";
      this.$box.classList.remove("active");
      this.$fill.classList.remove("boost");
    }
  }

  // ----------------------------------------------------------
  // Fallback
  // ----------------------------------------------------------
  setFallback() {
    this.$percent.textContent = "N/A";
    this.$fill.style.width = "100%";
    this.$fill.style.background = "#666";
  }

  // ----------------------------------------------------------
  // Styles
  // ----------------------------------------------------------
  injectStyles() {
    if (document.getElementById("battery-pro-style")) return;

    const style = document.createElement("style");
    style.id = "battery-pro-style";
    style.innerHTML = `
      :root {
        --battery-red:    #FF453A;
        --battery-yellow:#FFD60A;
        --battery-white: #FFFFFF;
        --battery-blue:  #0A84FF;
      }

      .battery-root {
        font-family: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
        user-select: none;
      }

      .battery-shell {
        display: flex;
        align-items: center;
      }

      .battery-body {
        position: relative;
        width: 32px;
        height: 14px;
        border-radius: 7px;
        background: rgba(255,255,255,0.28);
        box-shadow:
          inset 0 0 0 0.5px rgba(255,255,255,0.45),
          inset 0 -1px 2px rgba(0,0,0,0.35);
        overflow: hidden;
      }

      .battery-fill {
        height: 100%;
        width: 0%;
        border-radius: 7px;
        transition:
          width 0.35s cubic-bezier(.4,0,.2,1),
          background 0.3s ease;
      }

      /* SPEED BOOST EFFECT */
      .battery-fill.boost {
        animation: energyFlow 0.9s linear infinite;
      }

      .battery-gloss {
        position: absolute;
        inset: 0;
        background: linear-gradient(
          to bottom,
          rgba(255,255,255,0.35),
          rgba(255,255,255,0.05)
        );
        pointer-events: none;
      }

      .battery-percent {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 9px;
        font-weight: 600;
        color: #000;
        z-index: 2;
        transition: opacity 0.2s ease;
      }

      /* CHARGING BOX */
      .battery-charging-box {
        position: absolute;
        inset: 2px;
        background: rgba(0,0,0,0.55);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0;
        transform: scale(0.85);
        transition: opacity 0.2s ease, transform 0.2s ease;
        z-index: 3;
      }

      .battery-charging-box.active {
        opacity: 1;
        transform: scale(1);
      }

      .battery-bolt {
        color: #fff;
        font-size: 10px;
        animation: boltBoost 0.8s infinite;
      }

      .battery-cap {
        width: 2px;
        height: 7px;
        margin-left: 2px;
        background: rgba(255,255,255,0.6);
        border-radius: 1px;
      }

      /* ANIMATIONS */
      @keyframes energyFlow {
        0%   { filter: brightness(1); }
        50%  { filter: brightness(1.4); }
        100% { filter: brightness(1); }
      }

      @keyframes boltBoost {
        0%   { transform: scale(0.9); opacity: .6; }
        50%  { transform: scale(1.15); opacity: 1; }
        100% { transform: scale(0.9); opacity: .6; }
      }
    `;

    document.head.appendChild(style);
  }
}

// ------------------------------------------------------------
// Register Widget
// ------------------------------------------------------------
AppWidgets.register("battery-status", BatteryStatus);

// ================= Clipboard Copy =================
class ClipboardCopy extends Component {
  readAttributes() {
    this.props.text = this.el.getAttribute("text") || "Copy Me!";
    this.props.style =
      this.el.getAttribute("style") ||
      "padding:5px 10px;background:#4CAF50;color:white;cursor:pointer;";
  }
  render() {
    this.el.innerHTML = `<div class="clipboard" style="${this.props.style}">${this.props.text}</div>`;
  }
  afterRender() {
    const copyEl = this.el.querySelector(".clipboard");
    copyEl.onclick = () => {
      navigator.clipboard
        .writeText(this.props.text)
        .then(() => alert("Copied: " + this.props.text));
    };
  }
}
AppWidgets.register("clipboard-copy", ClipboardCopy);

// ================= Dark Mode Toggle =================
class DarkModeToggle extends Component {
  readAttributes() {
    const rawStyle = this.el.getAttribute("style") || "";
    this.props.style = rawStyle.replace(/background\s*:\s*[^;]+;?/gi, "");
  }

  render() {
    this.el.innerHTML = `
      <label class="dark-toggle-switch" style="${this.props.style}">
        <input type="checkbox" />
        <span class="slider round"></span>
        <span class="toggle-label">Dark Mode</span>
      </label>
    `;

    // CSS for toggle
    if (!document.getElementById("dark-mode-toggle-style")) {
      const style = document.createElement("style");
      style.id = "dark-mode-toggle-style";
      style.innerHTML = `
        .dark-toggle-switch {
          display: inline-flex;
          align-items: center;
          cursor: pointer;
          user-select: none;
          font-family: sans-serif;
          gap: 8px;
        }
        .dark-toggle-switch input { display:none; }
        .slider {
          position: relative;
          width: 40px;
          height: 20px;
          background-color: #ccc;
          border-radius: 34px;
          transition: 0.4s;
        }
        .slider:before {
          content: "";
          position: absolute;
          height: 16px;
          width: 16px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          border-radius: 50%;
          transition: 0.4s;
        }
        input:checked + .slider {
          background-color: #2196F3;
        }
        input:checked + .slider:before {
          transform: translateX(20px);
        }
        .toggle-label {
          font-size: 14px;
        }
        body.dark-mode {
          background-color: #121212;
          color: #f0f0f0;
          transition: background-color 0.3s, color 0.3s;
        }
      `;
      document.head.appendChild(style);
    }
  }

  afterRender() {
    const checkbox = this.el.querySelector("input");

    const isDark = localStorage.getItem("dark-mode") === "true";
    if (isDark) document.body.classList.add("dark-mode");
    checkbox.checked = isDark;

    // Toggle dark mode
    checkbox.addEventListener("change", () => {
      document.body.classList.toggle("dark-mode");
      localStorage.setItem(
        "dark-mode",
        document.body.classList.contains("dark-mode"),
      );
    });
  }
}

AppWidgets.register("dark-mode-toggle", DarkModeToggle);

class SidebarDrawer extends Component {
  readAttributes() {
    this.props = this.props || {};
    this.props.position = this.el.getAttribute("position") || "left";
    this.props.width = this.el.getAttribute("width") || "300px";
    this.props.theme = this.el.getAttribute("theme") || "flat"; // flat | liquid-glass | matte | glossy | pixel | futuristic | 3d
    this.props.escClose = this.el.getAttribute("esc-close") !== "false";
    this.props.style = this.el.getAttribute("style") || "";
  }

  render() {
    this.readAttributes();

    const innerContent = this.el.innerHTML;

    this.el.innerHTML = `
      <div class="sidebar-overlay"></div>
      <div class="sidebar-drawer theme-${this.props.theme}">
        <button class="sidebar-close">&times;</button>
        <div class="sidebar-content">${innerContent}</div>
      </div>
      <button class="sidebar-toggle">
        <span class="hamburger-line line1"></span>
        <span class="hamburger-line line2"></span>
        <span class="hamburger-line line3"></span>
      </button>
    `;

    this.injectStyles();
  }

  afterRender() {
    const drawer = this.el.querySelector(".sidebar-drawer");
    const overlay = this.el.querySelector(".sidebar-overlay");
    const toggle = this.el.querySelector(".sidebar-toggle");
    const closeBtn = this.el.querySelector(".sidebar-close");

    const openDrawer = () => {
      drawer.classList.add("active");
      overlay.classList.add("active");
      toggle.classList.add("active");
      document.body.classList.add("sidebar-open");
    };

    const closeDrawer = () => {
      drawer.classList.remove("active");
      overlay.classList.remove("active");
      toggle.classList.remove("active");
      document.body.classList.remove("sidebar-open");
    };

    toggle.addEventListener("click", openDrawer);
    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    if (this.props.escClose) {
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") closeDrawer();
      });
    }
  }

  injectStyles() {
    if (document.getElementById("sidebar-drawer-style")) return;

    const style = document.createElement("style");
    style.id = "sidebar-drawer-style";
    style.innerHTML = `
      /* Overlay */
      .sidebar-overlay {
        position: fixed; top: 0; left: 0;
        width: 100%; height: 100%;
        background: rgba(0,0,0,0.4);
        opacity: 0; visibility: hidden;
        transition: opacity 0.3s ease;
        z-index: 998;
        backdrop-filter: blur(2px);
      }
      .sidebar-overlay.active { opacity: 1; visibility: visible; }

      /* Drawer */
      .sidebar-drawer {
        position: fixed; top: 0; 
        left: -${this.props.width};
        width: ${this.props.width}; height: 100%;
        display: flex; flex-direction: column;
        transition: all 0.4s cubic-bezier(0.68,-0.55,0.265,1.55);
        z-index: 999;
        overflow: hidden;
        border-right: 1px solid rgba(255,255,255,0.1);
      }
      .sidebar-drawer.active { left: 0; }

      .sidebar-close {
        align-self: flex-end;
        font-size: 28px;
        margin: 12px;
        border: none; background: transparent;
        cursor: pointer;
        transition: transform 0.2s ease, color 0.3s ease;
      }
      .sidebar-close:hover { transform: rotate(90deg); color: #ff5555; }

      .sidebar-content {
        flex: 1;
        overflow-y: auto;
        padding: 20px;
      }

      /* Hamburger toggle */
      .sidebar-toggle {
        position: fixed;
        top: 16px; left: 16px;
        width: 40px; height: 36px;
        z-index: 1000;
        background: transparent;
        border: none;
        cursor: pointer;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        padding: 4px;
        transition: transform 0.3s ease;
      }
      .sidebar-toggle.active { transform: rotate(90deg); }
      .hamburger-line {
        width: 100%; height: 4px;
        background: #2196F3;
        border-radius: 2px;
        transition: all 0.3s ease;
      }
      .sidebar-toggle.active .line1 { transform: rotate(45deg) translate(5px,5px); }
      .sidebar-toggle.active .line2 { opacity: 0; }
      .sidebar-toggle.active .line3 { transform: rotate(-45deg) translate(5px,-5px); }

      /* Themes */
      .sidebar-drawer.theme-flat { background: #fff; color: #222; box-shadow: 2px 0 10px rgba(0,0,0,0.15); }
      .sidebar-drawer.theme-liquid-glass {
        background: rgba(255,255,255,0.15);
        color: #fff;
        backdrop-filter: blur(12px);
        box-shadow: 2px 0 20px rgba(0,0,0,0.3);
      }
      .sidebar-drawer.theme-matte { background: #2c3e50; color: #ecf0f1; }
      .sidebar-drawer.theme-glossy {
        background: linear-gradient(145deg,#6a11cb,#2575fc);
        color: #fff;
      }
      .sidebar-drawer.theme-pixel {
        background: #000; color: #0f0;
        font-family: 'Press Start 2P', cursive;
        border: 3px solid #0f0;
      }
      .sidebar-drawer.theme-futuristic {
        background: #0f0f0f; color: #0ff;
        border-left: 2px solid #0ff;
        box-shadow: 0 0 20px #0ff;
        font-family: 'Orbitron', sans-serif;
      }
      .sidebar-drawer.theme-3d {
        background: #1a1a1a; color: #fff;
        box-shadow: 4px 0 20px rgba(0,0,0,0.5);
        border-left: 4px solid #2196F3;
        transform: perspective(800px) rotateY(-5deg);
      }

      body.sidebar-open { overflow: hidden; }
    `;
    document.head.appendChild(style);
  }
}

AppWidgets.register("sidebar-drawer", SidebarDrawer);

class SearchBoxPro extends Component {
  readAttributes() {
    this.props = this.props || {};
    this.props.placeholder = this.el.getAttribute("placeholder") || "Search...";
    this.props.width = this.el.getAttribute("width") || "320px";
    this.props.theme = this.el.getAttribute("theme") || "light"; // light | dark | liquid-glass
  }

  render() {
    this.readAttributes();

    this.el.innerHTML = `
      <div class="search-box theme-${this.props.theme}">
        <input type="text" class="search-input" placeholder="${this.props.placeholder}" />
        <button class="search-btn" aria-label="Search">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </button>
      </div>
      <ul class="search-results"></ul>
    `;

    this.injectStyles();
  }

  afterRender() {
    const input = this.el.querySelector(".search-input");
    const button = this.el.querySelector(".search-btn");
    const results = this.el.querySelector(".search-results");

    // contoh data; bisa diganti fetch API
    const data = [
      "Apple",
      "Banana",
      "Orange",
      "Mango",
      "Grapes",
      "Pineapple",
      "Strawberry",
      "Watermelon",
      "Blueberry",
      "Raspberry",
      "Blackberry",
      "Papaya",
      "Kiwi",
      "Peach",
    ];

    const renderResults = (query) => {
      results.innerHTML = "";
      if (!query) return;

      const filtered = data.filter((item) =>
        item.toLowerCase().includes(query.toLowerCase()),
      );
      filtered.forEach((item) => {
        const li = document.createElement("li");
        li.innerHTML = item.replace(
          new RegExp(query, "gi"),
          (match) => `<span class="highlight">${match}</span>`,
        );
        li.addEventListener("click", () => {
          input.value = item;
          results.innerHTML = "";
        });
        results.appendChild(li);
      });
    };

    input.addEventListener("input", (e) => renderResults(e.target.value));
    button.addEventListener("click", () => renderResults(input.value));

    document.addEventListener("click", (e) => {
      if (!this.el.contains(e.target)) results.innerHTML = "";
    });

    // keyboard navigation (up/down + enter)
    let selectedIndex = -1;
    input.addEventListener("keydown", (e) => {
      const items = results.querySelectorAll("li");
      if (!items.length) return;
      if (e.key === "ArrowDown") {
        selectedIndex = (selectedIndex + 1) % items.length;
        items.forEach((li, i) =>
          li.classList.toggle("selected", i === selectedIndex),
        );
      } else if (e.key === "ArrowUp") {
        selectedIndex = (selectedIndex - 1 + items.length) % items.length;
        items.forEach((li, i) =>
          li.classList.toggle("selected", i === selectedIndex),
        );
      } else if (e.key === "Enter") {
        if (selectedIndex >= 0) {
          input.value = items[selectedIndex].textContent;
          results.innerHTML = "";
          selectedIndex = -1;
        }
      }
    });
  }

  injectStyles() {
    if (document.getElementById("search-box-pro-style")) return;

    const style = document.createElement("style");
    style.id = "search-box-pro-style";
    style.innerHTML = `
      /* BASE */
      .search-box {
        position: relative;
        display: flex;
        align-items: center;
        width: ${this.props.width};
        border-radius: 12px;
        overflow: hidden;
        font-family: 'Segoe UI', Roboto, Helvetica, sans-serif;
        transition: all 0.3s ease;
      }
      .search-box input {
        flex: 1;
        padding: 12px 16px;
        border: none;
        outline: none;
        font-size: 16px;
        background: transparent;
        color: inherit;
        transition: all 0.3s ease;
      }
      .search-box input::placeholder {
        color: rgba(0,0,0,0.5);
        transition: color 0.3s ease;
      }
      .search-box button {
        border: none;
        padding: 12px 16px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: all 0.3s ease;
        background: transparent;
        color: inherit;
      }
      .search-box button:hover {
        background: rgba(0,0,0,0.05);
      }
      .search-box svg {
        stroke: currentColor;
      }
      .search-results {
        position: absolute;
        top: calc(100% + 4px);
        left: 0;
        right: 0;
        max-height: 240px;
        overflow-y: auto;
        list-style: none;
        margin: 0;
        padding: 0;
        border-radius: 12px;
        box-shadow: 0 10px 20px rgba(0,0,0,0.15);
        z-index: 999;
        opacity: 0;
        visibility: hidden;
        transform: translateY(-10px);
        transition: all 0.25s ease;
      }
      .search-box input:focus + button + .search-results,
      .search-results li.selected {
        opacity: 1;
        visibility: visible;
        transform: translateY(0);
      }
      .search-results li {
        padding: 10px 16px;
        cursor: pointer;
        transition: all 0.2s ease;
      }
      .search-results li:hover, .search-results li.selected {
        background: rgba(0,0,0,0.05);
      }
      .search-results li .highlight {
        background: #FFD54F;
        border-radius: 4px;
        padding: 0 2px;
        color: inherit;
      }

      /* LIGHT THEME */
      .search-box.theme-light {
        background: #fff;
        border: 1px solid #ddd;
        color: #222;
      }
      .search-box.theme-light button:hover {
        background: rgba(0,0,0,0.05);
      }
      .search-box.theme-light .search-results {
        background: #fff;
        color: #222;
        border: 1px solid #ddd;
      }

      /* DARK THEME */
      .search-box.theme-dark {
        background: #1E1E1E;
        border: 1px solid #444;
        color: #eee;
      }
      .search-box.theme-dark input::placeholder { color: rgba(255,255,255,0.5); }
      .search-box.theme-dark button:hover {
        background: rgba(255,255,255,0.05);
      }
      .search-box.theme-dark .search-results {
        background: #2A2A2A;
        color: #eee;
        border: 1px solid #444;
      }

      /* LIQUID-GLASS THEME */
      .search-box.theme-liquid-glass {
        background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(12px);
        color: #fff;
      }
      .search-box.theme-liquid-glass input::placeholder { color: rgba(255,255,255,0.7); }
      .search-box.theme-liquid-glass button:hover {
        background: rgba(255,255,255,0.2);
      }
      .search-box.theme-liquid-glass .search-results {
        background: rgba(255,255,255,0.15);
        border: 1px solid rgba(255,255,255,0.3);
        backdrop-filter: blur(12px);
        color: #fff;
      }
      .search-box.theme-liquid-glass .search-results li:hover,
      .search-box.theme-liquid-glass .search-results li.selected {
        background: rgba(255,255,255,0.2);
      }
    `;
    document.head.appendChild(style);
  }
}

// Register widget
AppWidgets.register("search-box", SearchBoxPro);

// ======================================================
// Google Map (NO API KEY) + RAW Vericitto DSL
// ======================================================

class SimpleMapWidget extends Component {
  readAttributes() {
    this.props = this.props || {};
    this.props.lat = this.el.getAttribute("lat") || -6.2;
    this.props.lng = this.el.getAttribute("lng") || 106.8;
    this.props.zoom = this.el.getAttribute("zoom") || 15;
    this.props.height = this.el.getAttribute("height") || "400px";
  }

  render() {
    this.readAttributes();

    const src = `
      https://maps.google.com/maps?q=${this.props.lat},${this.props.lng}
      &z=${this.props.zoom}
      &output=embed
    `;

    this.el.innerHTML = `
      <iframe
        width="100%"
        height="${this.props.height}"
        frameborder="0"
        style="border:0;border-radius:12px;"
        src="${src}"
        allowfullscreen>
      </iframe>
    `;
  }
}

AppWidgets.register("map", SimpleMapWidget);

// ================= RAW Vericitto DSL =================
class VericittoDSL {
  static parse() {
    const bodyText = document.body.innerHTML;

    const dslRegex =
      /Vericitto\s+import\s+Cito\s+from\s+AppWidgets\s*\{([\s\S]*?)\}/;
    const match = bodyText.match(dslRegex);
    if (!match) return;

    const blockContent = match[1];

    const useRegex = /use\s*:\s*(\w+)\s*\{([\s\S]*?)\}/g;
    let useMatch;

    while ((useMatch = useRegex.exec(blockContent)) !== null) {
      const widgetName = useMatch[1];
      const configBlock = useMatch[2];

      const WidgetClass = AppWidgets.widgets[widgetName];
      if (!WidgetClass) continue;

      const container = document.createElement("div");

      configBlock.split(",").forEach((line) => {
        const parts = line.split(":");
        if (parts.length === 2) {
          let key = parts[0].trim().toLowerCase();
          let value = parts[1].trim().replace(/^["']|["']$/g, "");
          container.setAttribute(key, value);
        }
      });

      document.body.appendChild(container);

      const instance = new WidgetClass(container);
      instance.readAttributes();
      instance.render();
    }

    // remove DSL text from page
    document.body.innerHTML = document.body.innerHTML.replace(dslRegex, "");
  }
}

// ================= INIT =================
document.addEventListener("DOMContentLoaded", () => {
  VericittoDSL.parse();
  AppWidgets.mountAll();
});

// ==========================================
// Vericitto Syntax Highlight (VS Code Style)
// ==========================================

class VericittoHighlight {
  static apply() {
    const bodyHTML = document.body.innerHTML;

    const dslRegex =
      /(Vericitto\s+import\s+Cito\s+from\s+AppWidgets\s*\{[\s\S]*?\})/;

    const match = bodyHTML.match(dslRegex);
    if (!match) return;

    let code = match[1];

    // Escape HTML biar aman
    code = code.replace(/</g, "&lt;").replace(/>/g, "&gt;");

    // Highlight rules
    code = code
      .replace(/\b(import|from)\b/g, '<span class="v-keyword">$1</span>')
      .replace(
        /\b(Vericitto|Cito|AppWidgets)\b/g,
        '<span class="v-namespace">$1</span>',
      );

    const styledBlock = `
      <pre class="vericitto-code">${code}</pre>
    `;

    document.body.innerHTML = document.body.innerHTML.replace(
      dslRegex,
      styledBlock,
    );

    this.injectStyles();
  }

  static injectStyles() {
    if (document.getElementById("vericitto-highlight-style")) return;

    const style = document.createElement("style");
    style.id = "vericitto-highlight-style";
    style.innerHTML = `
      .vericitto-code {
        background: #1e1e1e;
        color: #d4d4d4;
        padding: 16px;
        border-radius: 10px;
        font-family: Consolas, monospace;
        font-size: 14px;
        white-space: pre-wrap;
      }

      .v-keyword {
        color: #569CD6; /* Biru VS Code */
      }

      .v-namespace {
        color: #4EC9B0; /* Hijau VS Code */
      }
    `;
    document.head.appendChild(style);
  }
}

// Jalankan setelah DOM siap
document.addEventListener("DOMContentLoaded", () => {
  VericittoHighlight.apply();
});

class AdminDashboardCito extends Component {
  readAttributes() {
    // ambil isi Cito config dari <v-rct>
    const citoText = this.el.textContent.trim();
    try {
      this.props = citoText ? JSON.parse(citoText) : {};
    } catch (e) {
      console.warn("Cito config invalid JSON, fallback to defaults");
      this.props = {};
    }

    // defaults
    this.props.layoutStyle = this.props.layoutStyle || 1;
    this.props.chartType = this.props.chartType || "line";
    this.props.chartColors = this.props.chartColors || [
      "#0a84ff",
      "#34c759",
      "#ff9500",
    ];
    this.props.chartLabels = this.props.chartLabels || [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
    ];
    this.props.chartData = this.props.chartData || [12, 19, 3, 5, 2, 3];
  }

  render() {
    this.el.innerHTML = `
      <div class="dashboard-navbar">
        <div class="navbar-left"><h2>Admin Dashboard</h2></div>
        <div class="navbar-right"><i class="fas fa-bell"></i> <span>👤 Admin</span></div>
      </div>

      <div class="dashboard-body layout-${this.props.layoutStyle}">
        <div class="dashboard-sidebar">
          <ul>
            <li><i class="fas fa-home"></i> Home</li>
            <li><i class="fas fa-chart-line"></i> Stats</li>
            <li><i class="fas fa-file-alt"></i> Reports</li>
            <li><i class="fas fa-cog"></i> Settings</li>
          </ul>
        </div>

        <div class="dashboard-content">
          <div class="dashboard-cards">
            <div class="card"><div class="card-icon"><i class="fas fa-users"></i></div><div class="card-info"><h3>Users</h3><p>1,234</p></div></div>
            <div class="card"><div class="card-icon"><i class="fas fa-shopping-cart"></i></div><div class="card-info"><h3>Orders</h3><p>567</p></div></div>
            <div class="card"><div class="card-icon"><i class="fas fa-dollar-sign"></i></div><div class="card-info"><h3>Revenue</h3><p>$12,345</p></div></div>
          </div>

          <div class="dashboard-chart">
            <canvas id="chartDummy" width="400" height="150"></canvas>
          </div>
        </div>
      </div>
    `;

    this.injectFontAwesome();
    this.applyReactStyle();
  }

  applyReactStyle() {
    const navbar = this.el.querySelector(".dashboard-navbar");
    Object.assign(navbar.style, {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 24px",
      background: "linear-gradient(90deg,#0a84ff,#00d4ff)",
      color: "white",
      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
    });

    const sidebar = this.el.querySelector(".dashboard-sidebar");
    Object.assign(sidebar.style, {
      width: "220px",
      background: "#1f2937",
      color: "white",
      padding: "20px",
    });

    sidebar.querySelectorAll("li").forEach((li) => {
      Object.assign(li.style, {
        padding: "12px 0",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        cursor: "pointer",
        transition: "0.2s",
      });
      li.onmouseenter = () => (li.style.color = "#0a84ff");
      li.onmouseleave = () => (li.style.color = "white");
    });

    const content = this.el.querySelector(".dashboard-content");
    Object.assign(content.style, {
      flex: 1,
      padding: "24px",
      overflowY: "auto",
      background: "#f0f4f8",
    });

    const cards = this.el.querySelectorAll(".dashboard-cards .card");
    cards.forEach((card) => {
      Object.assign(card.style, {
        flex: "1",
        background: "#fff",
        padding: "24px",
        borderRadius: "12px",
        boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        display: "flex",
        alignItems: "center",
        gap: "16px",
        transition: "transform 0.2s, boxShadow 0.2s",
      });
      card.onmouseenter = () => {
        card.style.transform = "translateY(-4px)";
        card.style.boxShadow = "0 12px 24px rgba(0,0,0,0.12)";
      };
      card.onmouseleave = () => {
        card.style.transform = "translateY(0)";
        card.style.boxShadow = "0 8px 20px rgba(0,0,0,0.08)";
      };
    });

    const chartBox = this.el.querySelector(".dashboard-chart");
    Object.assign(chartBox.style, {
      background: "#fff",
      padding: "20px",
      borderRadius: "12px",
      boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
      marginTop: "24px",
    });
  }

  afterRender() {
    const ctx = this.el.querySelector("#chartDummy").getContext("2d");
    new Chart(ctx, {
      type: this.props.chartType,
      data: {
        labels: this.props.chartLabels,
        datasets: [
          {
            label: "Sales",
            data: this.props.chartData,
            backgroundColor: this.props.chartColors.map((c) => c + "33"),
            borderColor: this.props.chartColors,
            borderWidth: 2,
            tension: 0.4,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: true } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  injectFontAwesome() {
    if (!document.getElementById("fa-pro")) {
      const link = document.createElement("link");
      link.id = "fa-pro";
      link.rel = "stylesheet";
      link.href =
        "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css";
      document.head.appendChild(link);
    }
  }
}

// Register
AppWidgets.register("admin-dashboard", AdminDashboardCito);

// ==========================================
// NAVBAR 
// ==========================================
class Navbar extends Component {
  readAttributes() {
    this.props = this.props || {};
    this.props.brand = this.el.getAttribute("brand") || "UltraApp";
    this.props.theme = this.el.getAttribute("theme") || "midnight";
    this.props.type = this.el.getAttribute("type") || "rounded";
    this.props.sticky = this.el.getAttribute("sticky") !== "false";
    this.props.search = this.el.getAttribute("search") === "true";
    this.props.notifications = parseInt(
      this.el.getAttribute("notifications") || 0,
    );
    this.props.textColor = this.el.getAttribute("text-color") || "#ffffff";
    this.props.menu = (
      this.el.getAttribute("menu") ||
      "Home:/,Products:/products,Docs:/docs,Contact:/contact"
    )
      .split(",")
      .map((item) => {
        const parts = item.split(":");
        return { label: parts[0].trim(), link: parts[1] || "#" };
      });
  }

  render() {
    this.readAttributes();

    const bellIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <path d="M15 17h5l-1.4-1.4A2 2 0 0118 14V11a6 6 0 10-12 0v3a2 2 0 01-.6 1.6L4 17h5"/>
        <path d="M9 17a3 3 0 006 0"/>
      </svg>`;

    const userIcon = `
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
        <circle cx="12" cy="7" r="4"/>
        <path d="M5.5 21a6.5 6.5 0 0113 0"/>
      </svg>`;

    const menuHTML = this.props.menu
      .map((item) => `<li><a href="${item.link}">${item.label}</a></li>`)
      .join("");

    const searchHTML = this.props.search
      ? `
      <div class="ultra-search">
        <div class="search-wrapper">
          <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/>
            <line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" placeholder="Search..." />
        </div>
      </div>`
      : "";

    this.el.innerHTML = `
      <nav class="ultra-navbar theme-${this.props.theme} type-${this.props.type}">
        <div class="ultra-container">
          <div class="ultra-left">
            <div class="ultra-brand">${this.props.brand}</div>
            <ul class="ultra-menu">${menuHTML}</ul>
          </div>
          <div class="ultra-right">
            ${searchHTML}
            <div class="ultra-icon notif-wrapper">
              ${bellIcon}
              ${this.props.notifications > 0 ? `<span class="badge">${this.props.notifications}</span>` : ""}
              <div class="notif-dropdown">
                <p>No new notifications</p>
              </div>
            </div>
            <div class="ultra-profile">
              <div class="icon">${userIcon}</div>
              <div class="profile-dropdown">
                <a href="#">Profile</a>
                <a href="#">Dashboard</a>
                <a href="#">Settings</a>
                <a href="#">Logout</a>
              </div>
            </div>
            <button class="ultra-toggle">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>`;

    this.injectStyles();
  }

  afterRender() {
    const toggle = this.el.querySelector(".ultra-toggle");
    const menu = this.el.querySelector(".ultra-menu");
    const profile = this.el.querySelector(".ultra-profile");
    const notif = this.el.querySelector(".notif-wrapper");

    toggle.onclick = () => {
      menu.classList.toggle("active");
      toggle.classList.toggle("open");
    };

    profile.onclick = (e) => {
      e.stopPropagation();
      profile.classList.toggle("open");
    };

    notif.onclick = (e) => {
      e.stopPropagation();
      notif.classList.toggle("open");
    };

    document.addEventListener("click", () => {
      profile.classList.remove("open");
      notif.classList.remove("open");
    });

    if (this.props.sticky) {
      this.el.querySelector(".ultra-navbar").classList.add("sticky");
    }
  }

  injectStyles() {
    if (document.getElementById("navbar-full")) return;
    const style = document.createElement("style");
    style.id = "navbar-full";

    style.innerHTML = `
      .ultra-navbar { width:100%; color:${this.props.textColor}; backdrop-filter: blur(12px); transition: .3s ease; }
      .ultra-navbar.sticky { position: sticky; top:0; z-index:1000; }
      .ultra-container { display:flex; justify-content:space-between; align-items:center; padding:16px 32px; position:relative; }
      .ultra-left { display:flex; align-items:center; gap:40px; }
      .ultra-brand { font-size:20px; font-weight:700; }
      .ultra-menu { display:flex; gap:28px; list-style:none; margin:0; padding:0; transition:.3s ease; }
      .ultra-menu a { text-decoration:none; color:inherit; font-weight:500; }
      .ultra-right { display:flex; align-items:center; gap:18px; }

      .search-wrapper { position:relative; display:flex; align-items:center; background: rgba(255,255,255,0.08); border-radius:30px; padding:6px 14px 6px 38px; transition:.3s ease; overflow:hidden; }
      .search-wrapper input { background:transparent; border:none; outline:none; color:${this.props.textColor}; font-size:14px; width:160px; transition:.3s ease; }
      .search-wrapper:focus-within { box-shadow:0 0 0 2px rgba(255,255,255,0.2); background: rgba(255,255,255,0.15); }
      .search-icon { position:absolute; left:14px; width:16px; height:16px; opacity:.7; transition:.3s; }

      .ultra-icon, .ultra-profile .icon { width:38px; height:38px; display:flex; align-items:center; justify-content:center; border-radius:12px; background: rgba(255,255,255,0.08); cursor:pointer; position:relative; transition:.3s; }
      svg { width:20px;height:20px; }
      .badge { position:absolute; top:-4px; right:-4px; background:#ff3b3b; color:white; font-size:10px; padding:2px 6px; border-radius:20px; font-weight:600; animation:badgePulse 1.5s infinite; }

      @keyframes badgePulse { 0% { transform:scale(1);} 50% { transform:scale(1.3);} 100% { transform:scale(1);} }

      .profile-dropdown, .notif-dropdown { position:absolute; right:0; top:120%; background: rgba(20,20,20,0.95); padding:10px; border-radius:12px; display:none; flex-direction:column; min-width:180px; transition:.3s ease; opacity:0; }
      .profile-dropdown a, .notif-dropdown a { padding:8px; text-decoration:none; color:white; transition:.2s ease; }
      .ultra-profile.open .profile-dropdown, .notif-wrapper.open .notif-dropdown { display:flex; opacity:1; transform:translateY(0); }

      .notif-dropdown p { margin:0; padding:8px; color:#ccc; font-size:13px; }

      .ultra-toggle { display:none; }
      @media (max-width:900px) {
        .ultra-menu { display:none; position:absolute; top:100%; right:0; flex-direction:column; background:rgba(0,0,0,0.95); padding:20px; border-radius:12px; }
        .ultra-menu.active { display:flex; }
        .ultra-toggle { display:flex; flex-direction:column; gap:4px; background:none; border:none; cursor:pointer; }
        .ultra-toggle span { width:22px; height:2px; background:${this.props.textColor}; transition:.3s; }
        .ultra-toggle.open span:nth-child(1) { transform:rotate(45deg) translateY(6px);}
        .ultra-toggle.open span:nth-child(2) { opacity:0;}
        .ultra-toggle.open span:nth-child(3) { transform:rotate(-45deg) translateY(-6px);}
        .search-wrapper input { width:110px; }
      }

      .theme-midnight { background: linear-gradient(90deg,#0f2027,#203a43,#2c5364); }
      .type-rounded { border-radius:16px; margin:12px; }
      .type-flat { border-radius:0; }
    `;
    document.head.appendChild(style);
  }
}

AppWidgets.register("navbar", Navbar);

// ================= Mount semua widget setelah DOM siap =================
document.addEventListener("DOMContentLoaded", () => AppWidgets.mountAll());
