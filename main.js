/* =========================================================
   VALLEDUPAR DE AMÉRICA — main.js
   Sin dependencias externas. Vanilla JS.
   ========================================================= */
(function () {
  "use strict";

  /* ---------------- Utilidades ---------------- */
  const $ = (sel, ctx) => (ctx || document).querySelector(sel);
  const $$ = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));
  const store = {
    get(k, fallback) {
      try { const v = localStorage.getItem(k); return v === null ? fallback : JSON.parse(v); }
      catch (e) { return fallback; }
    },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} },
    remove(k) { try { localStorage.removeItem(k); } catch (e) {} }
  };
  function haptic(ms) {
    if ("vibrate" in navigator) { try { navigator.vibrate(ms || 8); } catch (e) {} }
  }

  /* ---------------- Loading screen ---------------- */
  window.addEventListener("load", () => {
    const loader = $("#loader");
    if (loader) {
      setTimeout(() => loader.classList.add("is-hidden"), 350);
    }
    revealSkeletons();
  });
  // Seguridad: ocultar el loader igualmente si "load" tarda demasiado
  setTimeout(() => { const l = $("#loader"); if (l) l.classList.add("is-hidden"); }, 4000);

  function revealSkeletons() {
    $$("[data-skeleton]").forEach((el) => {
      setTimeout(() => { el.removeAttribute("data-skeleton"); }, 500 + Math.random() * 400);
    });
  }

  /* ---------------- Tema claro / oscuro ---------------- */
  const root = document.documentElement;
  function applyTheme(theme) {
    if (theme === "light" || theme === "dark") root.setAttribute("data-theme", theme);
    else root.removeAttribute("data-theme");
    $$("[data-theme-toggle]").forEach((btn) => {
      const isDark = theme === "dark" || (theme !== "light" && matchMedia("(prefers-color-scheme: dark)").matches);
      btn.setAttribute("aria-pressed", String(isDark));
      btn.setAttribute("aria-label", isDark ? t("theme.toLight") : t("theme.toDark"));
    });
  }
  let currentTheme = store.get("theme", "auto");
  applyTheme(currentTheme);
  function toggleTheme() {
    const isDark = currentTheme === "dark" || (currentTheme === "auto" && matchMedia("(prefers-color-scheme: dark)").matches);
    currentTheme = isDark ? "light" : "dark";
    store.set("theme", currentTheme);
    applyTheme(currentTheme);
    haptic(6);
    showToast(currentTheme === "dark" ? t("toast.darkOn") : t("toast.darkOff"));
  }
  $$("[data-theme-toggle]").forEach((btn) => btn.addEventListener("click", toggleTheme));

  /* ---------------- Idioma ---------------- */
  const dict = {
    es: {
      "theme.toLight": "Cambiar a modo claro",
      "theme.toDark": "Cambiar a modo oscuro",
      "toast.darkOn": "Modo oscuro activado",
      "toast.darkOff": "Modo claro activado",
      "toast.linkCopied": "Enlace copiado",
      "toast.emailCopied": "Correo copiado",
      "toast.draftSaved": "Borrador guardado",
      "toast.draftRestored": "Recuperamos tu borrador",
      "form.sending": "Enviando…",
      "form.success": "¡Gracias! Tu mensaje fue enviado. Te responderemos muy pronto.",
      "form.error": "No pudimos enviar tu mensaje. Intenta de nuevo o escríbenos por WhatsApp.",
      "form.required": "Este campo es obligatorio.",
      "form.emailInvalid": "Escribe un correo válido.",
      "form.tooShort": "Escribe al menos {n} caracteres.",
      "form.phoneInvalid": "Escribe un teléfono válido.",
      "cmdk.placeholder": "Escribe un comando o busca una sección…",
      "cmdk.empty": "Sin resultados."
    },
    en: {
      "theme.toLight": "Switch to light mode",
      "theme.toDark": "Switch to dark mode",
      "toast.darkOn": "Dark mode on",
      "toast.darkOff": "Light mode on",
      "toast.linkCopied": "Link copied",
      "toast.emailCopied": "Email copied",
      "toast.draftSaved": "Draft saved",
      "toast.draftRestored": "We restored your draft",
      "form.sending": "Sending…",
      "form.success": "Thanks! Your message was sent. We'll reply soon.",
      "form.error": "We couldn't send your message. Try again or message us on WhatsApp.",
      "form.required": "This field is required.",
      "form.emailInvalid": "Enter a valid email.",
      "form.tooShort": "Enter at least {n} characters.",
      "form.phoneInvalid": "Enter a valid phone number.",
      "cmdk.placeholder": "Type a command or search a section…",
      "cmdk.empty": "No results."
    }
  };
  let currentLang = store.get("lang", (navigator.language || "es").startsWith("en") ? "en" : "es");

  function t(key, vars) {
    let str = (dict[currentLang] && dict[currentLang][key]) || (dict.es[key]) || key;
    if (vars) Object.keys(vars).forEach((k) => { str = str.replace(`{${k}}`, vars[k]); });
    return str;
  }

  function applyLang(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    $$("[data-i18n]").forEach((el) => {
      const key = el.getAttribute("data-i18n");
      const value = el.getAttribute(`data-i18n-${lang}`);
      if (value !== null) el.innerHTML = value;
    });
    $$("[data-i18n-attr]").forEach((el) => {
      const attr = el.getAttribute("data-i18n-attr");
      const value = el.getAttribute(`data-i18n-attr-${lang}`);
      if (value !== null) el.setAttribute(attr, value);
    });
    $$(".lang-switch button").forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.lang === lang)));
    applyTheme(currentTheme); // refresca aria-label del botón de tema en el nuevo idioma
  }
  store.set("lang", currentLang);
  applyLang(currentLang);
  $$(".lang-switch button").forEach((btn) => {
    btn.addEventListener("click", () => {
      store.set("lang", btn.dataset.lang);
      applyLang(btn.dataset.lang);
      haptic(6);
    });
  });

  /* ---------------- Header: ocultar al bajar, mostrar al subir ---------------- */
  const header = $(".site-header");
  let lastY = window.scrollY;
  window.addEventListener("scroll", () => {
    const y = window.scrollY;
    if (header) {
      if (y > lastY && y > 140) header.classList.add("is-hidden");
      else header.classList.remove("is-hidden");
    }
    lastY = y;
    toggleBackToTop(y);
  }, { passive: true });

  /* ---------------- Menú móvil ---------------- */
  const navToggle = $(".nav-toggle");
  const drawer = $(".mobile-drawer");
  const backdrop = $(".drawer-backdrop");
  function openDrawer() {
    drawer && drawer.classList.add("is-open");
    backdrop && backdrop.classList.add("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  }
  function closeDrawer() {
    drawer && drawer.classList.remove("is-open");
    backdrop && backdrop.classList.remove("is-open");
    navToggle && navToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  }
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      haptic(6);
      navToggle.getAttribute("aria-expanded") === "true" ? closeDrawer() : openDrawer();
    });
  }
  backdrop && backdrop.addEventListener("click", closeDrawer);
  $$(".mobile-drawer a").forEach((a) => a.addEventListener("click", closeDrawer));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeDrawer(); });

  /* ---------------- Reveal on scroll ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  $$("[data-reveal]").forEach((el) => io.observe(el));

  /* ---------------- Botón volver arriba ---------------- */
  const toTopBtn = $(".to-top");
  function toggleBackToTop(y) {
    if (!toTopBtn) return;
    toTopBtn.classList.toggle("is-visible", y > 480);
  }
  toTopBtn && toTopBtn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    haptic(6);
  });

  /* ---------------- Microinteracción: ripple en botones ---------------- */
  $$(".btn").forEach((btn) => {
    btn.addEventListener("click", function (e) {
      const rect = btn.getBoundingClientRect();
      const ripple = document.createElement("span");
      ripple.className = "ripple";
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = (e.clientX - rect.left - size / 2) + "px";
      ripple.style.top = (e.clientY - rect.top - size / 2) + "px";
      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
      haptic(5);
    });
  });

  /* ---------------- Toast ---------------- */
  let toastTimer;
  function showToast(msg) {
    let toast = $(".toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.className = "toast";
      toast.setAttribute("role", "status");
      toast.setAttribute("aria-live", "polite");
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-visible"), 2600);
  }

  /* ---------------- Compartir contenido ---------------- */
  $$("[data-share]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const shareData = {
        title: document.title,
        text: btn.getAttribute("data-share-text") || document.title,
        url: window.location.href
      };
      haptic(8);
      if (navigator.share) {
        try { await navigator.share(shareData); } catch (e) {}
      } else {
        try {
          await navigator.clipboard.writeText(shareData.url);
          showToast(t("toast.linkCopied"));
        } catch (e) {}
      }
    });
  });

  /* ---------------- Copiar correo ---------------- */
  $$("[data-copy]").forEach((btn) => {
    btn.addEventListener("click", async () => {
      const value = btn.getAttribute("data-copy");
      try {
        await navigator.clipboard.writeText(value);
        showToast(t("toast.emailCopied"));
        haptic(6);
      } catch (e) {}
    });
  });

  /* ---------------- Testimonios (carrusel) ---------------- */
  const track = $(".testimonial-track");
  if (track) {
    const items = $$(".testimonial", track);
    const dotsWrap = $(".testimonial-dots");
    let active = 0;
    let timer;

    items.forEach((_, i) => {
      const dot = document.createElement("button");
      dot.setAttribute("aria-label", "Testimonio " + (i + 1));
      dot.addEventListener("click", () => { goTo(i); resetAutoplay(); });
      dotsWrap.appendChild(dot);
    });
    const dots = $$("button", dotsWrap);

    function goTo(i) {
      items[active].classList.remove("is-active");
      dots[active].removeAttribute("aria-current");
      active = (i + items.length) % items.length;
      items[active].classList.add("is-active");
      dots[active].setAttribute("aria-current", "true");
    }
    function resetAutoplay() {
      clearInterval(timer);
      timer = setInterval(() => goTo(active + 1), 5500);
    }
    goTo(0);
    resetAutoplay();
    track.addEventListener("mouseenter", () => clearInterval(timer));
    track.addEventListener("mouseleave", resetAutoplay);

    // swipe táctil
    let touchX = null;
    track.addEventListener("touchstart", (e) => { touchX = e.touches[0].clientX; }, { passive: true });
    track.addEventListener("touchend", (e) => {
      if (touchX === null) return;
      const delta = e.changedTouches[0].clientX - touchX;
      if (Math.abs(delta) > 40) { goTo(active + (delta < 0 ? 1 : -1)); resetAutoplay(); }
      touchX = null;
    });
  }

  /* ---------------- Formulario de contacto ---------------- */
  const form = $("#contact-form");
  if (form) {
    const DRAFT_KEY = "vda_contact_draft";
    const fields = $$("input, textarea, select", form).filter((f) => f.name);

    // Autosave / autorrestore
    const saved = store.get(DRAFT_KEY, null);
    if (saved) {
      fields.forEach((f) => { if (saved[f.name] !== undefined && f.type !== "checkbox") f.value = saved[f.name]; });
      if (Object.values(saved).some(Boolean)) showToast(t("toast.draftRestored"));
    }
    let saveTimer;
    form.addEventListener("input", () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(() => {
        const data = {};
        fields.forEach((f) => { data[f.name] = f.type === "checkbox" ? f.checked : f.value; });
        store.set(DRAFT_KEY, data);
      }, 600);
    });

    const validators = {
      nombre: (v) => v.trim().length >= 2 || t("form.tooShort", { n: 2 }),
      email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || t("form.emailInvalid"),
      telefono: (v) => v.trim() === "" || /^[0-9+()\s-]{6,}$/.test(v.trim()) || t("form.phoneInvalid"),
      mensaje: (v) => v.trim().length >= 10 || t("form.tooShort", { n: 10 })
    };

    function validateField(field) {
      const wrap = field.closest(".field");
      if (!wrap) return true;
      const required = field.hasAttribute("required");
      const value = field.value || "";
      let message = "";

      if (required && value.trim() === "") {
        message = t("form.required");
      } else if (validators[field.name] && value.trim() !== "") {
        const result = validators[field.name](value);
        if (result !== true) message = result;
      }

      wrap.classList.toggle("has-error", Boolean(message));
      wrap.classList.toggle("is-valid", !message && value.trim() !== "");
      const errEl = $(".error-msg", wrap);
      if (errEl) errEl.textContent = message;
      return !message;
    }

    fields.forEach((f) => {
      f.addEventListener("blur", () => validateField(f));
      f.addEventListener("input", () => { if (f.closest(".field").classList.contains("has-error")) validateField(f); });
    });

    const alertBox = $(".form-alert", form) || (() => {
      const el = document.createElement("div");
      el.className = "form-alert";
      el.setAttribute("role", "alert");
      form.prepend(el);
      return el;
    })();

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let allValid = true;
      fields.forEach((f) => { if (!validateField(f)) allValid = false; });

      alertBox.className = "form-alert";
      if (!allValid) {
        const firstError = $(".field.has-error input, .field.has-error textarea", form);
        firstError && firstError.focus();
        haptic([10, 40, 10]);
        return;
      }

      const submitBtn = $("button[type=submit]", form);
      const originalLabel = submitBtn.innerHTML;
      submitBtn.disabled = true;
      submitBtn.innerHTML = t("form.sending");

      const endpoint = form.getAttribute("action");
      const formData = new FormData(form);

      try {
        // Si el endpoint sigue siendo el de ejemplo, simulamos el envío
        // (reemplaza data-demo="true" en el <form> una vez conectes tu backend/Formspree).
        if (form.dataset.demo === "true") {
          await new Promise((res) => setTimeout(res, 900));
        } else {
          const res = await fetch(endpoint, {
            method: "POST",
            body: formData,
            headers: { Accept: "application/json" }
          });
          if (!res.ok) throw new Error("Respuesta no válida del servidor");
        }

        store.remove(DRAFT_KEY);
        form.reset();
        fields.forEach((f) => f.closest(".field") && f.closest(".field").classList.remove("is-valid", "has-error"));
        window.location.href = "gracias.html";
      } catch (err) {
        alertBox.textContent = t("form.error");
        alertBox.classList.add("error", "is-visible");
        haptic([10, 40, 10]);
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalLabel;
      }
    });
  }

  /* ---------------- Banner de cookies ---------------- */
  const COOKIE_KEY = "vda_cookie_consent";
  const cookieBanner = $(".cookie-banner");
  if (cookieBanner) {
    const consent = store.get(COOKIE_KEY, null);
    if (!consent) setTimeout(() => cookieBanner.classList.add("is-visible"), 900);

    function loadAnalytics() {
      // Marcador de posición: sustituye por tu proveedor (Plausible, GA4, etc.)
      // y añade su <script> aquí solo tras el consentimiento del usuario.
      window.__analyticsLoaded = true;
      // Ejemplo GA4 (descomenta y añade tu ID de medición):
      // const s = document.createElement("script");
      // s.src = "https://www.googletagmanager.com/gtag/js?id=G-XXXXXXX";
      // s.async = true;
      // document.head.appendChild(s);
    }

    $("[data-cookie-accept]", cookieBanner).addEventListener("click", () => {
      store.set(COOKIE_KEY, "accepted");
      cookieBanner.classList.remove("is-visible");
      loadAnalytics();
      haptic(6);
    });
    $("[data-cookie-decline]", cookieBanner).addEventListener("click", () => {
      store.set(COOKIE_KEY, "declined");
      cookieBanner.classList.remove("is-visible");
      haptic(6);
    });
    if (consent === "accepted") loadAnalytics();
  }

  /* ---------------- Command palette (Ctrl/Cmd+K) ---------------- */
  const cmdkOverlay = $(".cmdk-overlay");
  if (cmdkOverlay) {
    const input = $(".cmdk-input", cmdkOverlay);
    const list = $(".cmdk-list", cmdkOverlay);
    const commands = $$("[data-cmdk-item]").map((el) => ({
      label: el.getAttribute("data-cmdk-item"),
      hint: el.getAttribute("data-cmdk-hint") || "",
      run: () => { window.location.href = el.getAttribute("href") || "#"; }
    })).concat([
      { label: currentLang === "en" ? "Toggle theme" : "Cambiar tema", hint: "T", run: toggleTheme },
      { label: currentLang === "en" ? "Switch language" : "Cambiar idioma", hint: "L", run: () => applyLang(currentLang === "es" ? "en" : "es") },
      { label: currentLang === "en" ? "Copy contact email" : "Copiar correo de contacto", hint: "", run: () => { navigator.clipboard.writeText("hola@valledupardeamerica.com"); showToast(t("toast.emailCopied")); } }
    ]);

    let filtered = commands;
    let activeIndex = 0;

    function render() {
      list.innerHTML = "";
      if (!filtered.length) {
        list.innerHTML = `<li class="cmdk-empty">${t("cmdk.empty")}</li>`;
        return;
      }
      filtered.forEach((cmd, i) => {
        const li = document.createElement("li");
        li.textContent = cmd.label;
        li.dataset.active = String(i === activeIndex);
        if (cmd.hint) {
          const kbd = document.createElement("kbd");
          kbd.textContent = cmd.hint;
          li.appendChild(kbd);
        }
        li.addEventListener("click", () => { cmd.run(); closeCmdk(); });
        list.appendChild(li);
      });
    }

    function openCmdk() {
      cmdkOverlay.classList.add("is-open");
      input.value = "";
      filtered = commands;
      activeIndex = 0;
      render();
      setTimeout(() => input.focus(), 30);
    }
    function closeCmdk() { cmdkOverlay.classList.remove("is-open"); }

    input.addEventListener("input", () => {
      const q = input.value.toLowerCase();
      filtered = commands.filter((c) => c.label.toLowerCase().includes(q));
      activeIndex = 0;
      render();
    });

    document.addEventListener("keydown", (e) => {
      const isK = e.key.toLowerCase() === "k" && (e.metaKey || e.ctrlKey);
      if (isK) { e.preventDefault(); cmdkOverlay.classList.contains("is-open") ? closeCmdk() : openCmdk(); }
      if (!cmdkOverlay.classList.contains("is-open")) {
        // Atajos globales (solo si no se está escribiendo en un campo)
        const tag = (e.target.tagName || "").toLowerCase();
        if (tag === "input" || tag === "textarea") return;
        if (e.key.toLowerCase() === "t") toggleTheme();
        if (e.key.toLowerCase() === "l") applyLang(currentLang === "es" ? "en" : "es");
        return;
      }
      if (e.key === "Escape") closeCmdk();
      if (e.key === "ArrowDown") { e.preventDefault(); activeIndex = Math.min(activeIndex + 1, filtered.length - 1); render(); }
      if (e.key === "ArrowUp") { e.preventDefault(); activeIndex = Math.max(activeIndex - 1, 0); render(); }
      if (e.key === "Enter" && filtered[activeIndex]) { filtered[activeIndex].run(); closeCmdk(); }
    });

    cmdkOverlay.addEventListener("click", (e) => { if (e.target === cmdkOverlay) closeCmdk(); });
    $$("[data-cmdk-open]").forEach((btn) => btn.addEventListener("click", openCmdk));
  }

})();
