/* ============================================================
   Marta Sousa Terapias — main.js
   Menu mobile · WhatsApp · formulário de contacto ·
   marcação online (WhatsApp + email + localStorage) ·
   área de clientes.

   Todos os valores vêm de js/config.js (SITE).
   ============================================================ */
(function () {
  "use strict";

  /* Rede de segurança caso config.js falhe (espelha js/config.js) */
  if (typeof SITE === "undefined") {
    window.SITE = {
      phoneIntl: "351917005532",
      email: "martacla@gmail.com",
      clientCode: "MS2026",
      showPrices: false,
      services: [
        { pt: "Sessão individual de Reiki", en: "Individual Reiki session", minutes: 60, price: 50 },
        { pt: "Reiki à distância",          en: "Distance Reiki",           minutes: 45, price: 35 },
        { pt: "Tarot dos Anjos",            en: "Angel Tarot reading",      minutes: 50, price: 35 },
        { pt: "Reiki + Tarot dos Anjos",    en: "Reiki + Angel Tarot",      minutes: 90, price: 70 }
      ],
      timeSlots: ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
    };
  }

  /* `const SITE` is a global lexical binding, not a window property.
     Read it directly when config.js loaded, while retaining the fallback
     above for pages where the config request fails. */
  var cfg = (typeof SITE !== "undefined") ? SITE : window.SITE;
  var isEN = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;
  var MASTER_CODE = String(cfg.clientCode || "").toUpperCase();

  /* ---------- textos (pt/en) ---------- */
  var T = {
    pt: {
      menu: "Abrir menu",
      closeMenu: "Fechar menu",
      required: "Por favor, preencha os campos obrigatórios assinalados.",
      emailInvalid: "Por favor, indique um email válido.",
      dateInvalid: "Por favor, escolha uma data a partir de hoje.",
      timeInvalid: "Por favor, escolha uma hora.",
      phoneInvalid: "Por favor, indique um telefone válido.",
      bookingTitle: "Pedido de marcação preparado",
      bookingText: "Para concluir a marcação, é só enviar a mensagem ao WhatsApp da Marta — ela confirma a disponibilidade e fecha a sua sessão.",
      openWa: "Abrir WhatsApp",
      sendEmail: "Enviar por email",
      savedNote: "O pedido ficou guardado na Área de Clientes deste dispositivo (veja o código na mensagem).",
      waDefault: "Olá Marta! Vi o seu site e gostaria de saber mais sobre as sessões.",
      buildTitle: "Olá Marta! Gostaria de solicitar uma marcação.",
      labelName: "Nome", labelPhone: "Telefone", labelEmail: "Email",
      labelService: "Serviço", labelDate: "Data", labelTime: "Hora",
      labelPref: "Contacto preferido", labelMsg: "Mensagem",
      subjectLabel: "Assunto",
      contactSubject: "Contacto pelo site — {name}",
      bookingCodeLabel: "Código da reserva",
      mailSubjectPrefix: "Pedido de marcação — ",
      caWrongCode: "Código não válido. O código é partilhado pela Marta aquando da marcação.",
      caEmpty: "Ainda não tem pedidos de marcação guardados neste dispositivo.",
      caBookNow: "Marcar agora",
      caStatus: "Aguarda confirmação",
      caResend: "Reenviar no WhatsApp",
      caRemove: "Remover"
    },
    en: {
      menu: "Open menu",
      closeMenu: "Close menu",
      required: "Please fill in the required fields marked below.",
      emailInvalid: "Please enter a valid email address.",
      dateInvalid: "Please choose a date from today onwards.",
      timeInvalid: "Please choose a time.",
      phoneInvalid: "Please enter a valid phone number.",
      bookingTitle: "Booking request ready",
      bookingText: "To complete your booking, just send the message to Marta on WhatsApp — she will confirm availability and schedule your session.",
      openWa: "Open WhatsApp",
      sendEmail: "Send by email",
      savedNote: "Your request is saved in the Client Area on this device (check the message for the code).",
      waDefault: "Hi Marta! I found your website and would love to know more about your sessions.",
      buildTitle: "Hi Marta! I would like to request a booking.",
      labelName: "Name", labelPhone: "Phone", labelEmail: "Email",
      labelService: "Service", labelDate: "Date", labelTime: "Time",
      labelPref: "Preferred contact", labelMsg: "Message",
      subjectLabel: "Subject",
      contactSubject: "Website enquiry — {name}",
      bookingCodeLabel: "Booking code",
      mailSubjectPrefix: "Booking request — ",
      caWrongCode: "Invalid code. The code is shared by Marta when booking.",
      caEmpty: "You don't have any booking requests saved on this device yet.",
      caBookNow: "Book now",
      caStatus: "Awaiting confirmation",
      caResend: "Resend on WhatsApp",
      caRemove: "Remove"
    }
  };
  var t = T[isEN ? "en" : "pt"];

  /* ---------- helpers ---------- */
  function el(id) { return document.getElementById(id); }

  function esc(s) {
    return String(s || "").replace(/[&<>"]/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
    });
  }

  function waUrl(text) {
    return "https://wa.me/" + cfg.phoneIntl + "?text=" + encodeURIComponent(text);
  }

  function mailto(subject, body) {
    return "mailto:" + cfg.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }

  /* Formata YYYY-MM-DD sem salto de fuso horário */
  function fmtDate(iso) {
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return iso || "";
    var y = +parts[0], m = +parts[1] - 1, d = +parts[2];
    var dt = new Date(Date.UTC(y, m, d));
    if (isNaN(dt)) return iso;
    return dt.toLocaleDateString(isEN ? "en-GB" : "pt-PT", { timeZone: "UTC" });
  }

  function isPastDate(iso) {
    var parts = String(iso || "").split("-");
    if (parts.length !== 3) return true;
    var d = new Date(+parts[0], +parts[1] - 1, +parts[2]);
    var today = new Date();
    today.setHours(0, 0, 0, 0);
    d.setHours(0, 0, 0, 0);
    return d < today;
  }

  function todayISO() {
    var d = new Date();
    function pad(n) { return String(n).padStart(2, "0"); }
    return d.getFullYear() + "-" + pad(d.getMonth() + 1) + "-" + pad(d.getDate());
  }

  function isValidEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }

  /* Aceita +, espaços e traços; entre 9 e 15 dígitos */
  function isValidPhone(s) {
    var digits = String(s).replace(/\D/g, "");
    return digits.length >= 9 && digits.length <= 15;
  }

  function clearInvalidOnInput(ids) {
    ids.forEach(function (id) {
      var f = el(id);
      if (!f) return;
      f.addEventListener("input", function () { f.classList.remove("invalid"); });
      f.addEventListener("change", function () { f.classList.remove("invalid"); });
    });
  }

  /* ---------- menu mobile ---------- */
  var toggle = el("navToggle");
  var nav = el("mainNav");
  if (toggle && nav) {
    function closeNav() {
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", t.menu);
    }
    function openNav() {
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", t.closeMenu);
    }
    toggle.addEventListener("click", function () {
      if (nav.classList.contains("open")) { closeNav(); } else { openNav(); }
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
    });
    document.addEventListener("click", function (e) {
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ---------- valores partilhados a partir do config ---------- */
  document.querySelectorAll("[data-wa-default]").forEach(function (a) {
    a.href = waUrl(t.waDefault);
  });

  var yearEl = el("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  document.querySelectorAll("[data-client-code]").forEach(function (node) {
    if (cfg.clientCode) node.textContent = cfg.clientCode;
  });

  /* Mantém os links de contacto em sincronia com o config */
  document.querySelectorAll('a[href^="tel:"]').forEach(function (a) {
    a.href = "tel:+" + cfg.phoneIntl;
  });
  document.querySelectorAll('a[href^="mailto:"]').forEach(function (a) {
    a.href = "mailto:" + cfg.email;
    if (a.textContent.indexOf("@") !== -1) a.textContent = cfg.email;
  });
  if (cfg.instagram) {
    document.querySelectorAll('a[href*="instagram.com"]').forEach(function (a) { a.href = cfg.instagram; });
  }
  if (cfg.facebook) {
    document.querySelectorAll('a[href*="facebook.com"]').forEach(function (a) { a.href = cfg.facebook; });
  }

  /* ---------- cabeçalho ao rolar ---------- */
  /* O CSS deixa o cabeçalho transparente no topo da página e sólido
     assim que a página se desloca. */
  var scrolled = false;
  function onScroll() {
    var isDown = (window.scrollY || document.documentElement.scrollTop || 0) > 12;
    if (isDown === scrolled) return;
    scrolled = isDown;
    document.documentElement.classList.toggle("is-scrolled", isDown);
  }
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- reveal on scroll ---------- */
  /* Progressive enhancement: without this class the CSS leaves content
     visible, so a failed/disabled script cannot blank the page. */
  document.documentElement.classList.add("reveal-ready");
  var reveals = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && reveals.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { io.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add("in"); });
  }

  /* ============================================================
     FORMULÁRIO DE CONTACTO
     ============================================================ */
  var contactForm = el("contactForm");
  if (contactForm) {
    clearInvalidOnInput(["ctName", "ctEmail", "ctPhone", "ctMsg"]);

    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = el("contactError");
      var name = (el("ctName").value || "").trim();
      var email = (el("ctEmail").value || "").trim();
      var phone = (el("ctPhone").value || "").trim();
      var subject = el("ctSubject") ? el("ctSubject").value : "";
      var message = (el("ctMsg").value || "").trim();

      function mark(id, invalid) {
        var f = el(id);
        if (f) f.classList.toggle("invalid", !!invalid);
      }

      var missing = !name || !email || !message;
      mark("ctName", !name);
      mark("ctEmail", missing ? !email : !isValidEmail(email));
      mark("ctMsg", !message);
      mark("ctPhone", phone !== "" && !isValidPhone(phone));

      if (err) {
        if (missing) {
          var firstInvalid = contactForm.querySelector(".invalid");
          if (firstInvalid) firstInvalid.focus();
          err.textContent = t.required;
          err.classList.add("show");
          return;
        }
        if (!isValidEmail(email)) {
          mark("ctEmail", true);
          el("ctEmail").focus();
          err.textContent = t.emailInvalid;
          err.classList.add("show");
          return;
        }
        if (phone && !isValidPhone(phone)) {
          mark("ctPhone", true);
          el("ctPhone").focus();
          err.textContent = t.phoneInvalid;
          err.classList.add("show");
          return;
        }
        err.classList.remove("show");
      }

      var body =
        t.labelName + ": " + name + "\n" +
        t.labelEmail + ": " + email +
        (phone ? "\n" + t.labelPhone + ": " + phone : "") +
        (subject ? "\n" + t.subjectLabel + ": " + subject : "") + "\n\n" + message;

      var waBtn = el("contactWa");
      if (waBtn) waBtn.href = waUrl(body);

      window.location.href = mailto(t.contactSubject.replace("{name}", name), body);
    });
  }

  /* ============================================================
     MARCAÇÃO / RESERVA ONLINE
     ============================================================ */
  var STORE_KEY = "mst_bookings";
  var SESSION_KEY = "mst_client_session";

  function canUseStorage() {
    try {
      localStorage.setItem("__test__", "__test__");
      localStorage.removeItem("__test__");
      return true;
    } catch (e) { return false; }
  }
  function loadBookings() {
    if (!canUseStorage()) return [];
    try {
      var list = JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
      return Array.isArray(list) ? list : [];
    } catch (e) { return []; }
  }
  function saveBookings(list) {
    if (!canUseStorage()) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) { /* sem storage */ }
  }

  function caSessionActive() {
    try { return !!localStorage.getItem(SESSION_KEY); } catch (e) { return false; }
  }
  function caSessionToken() {
    try { return localStorage.getItem(SESSION_KEY + "_token") || ""; } catch (e) { return ""; }
  }
  function caSetSession(tokenValue) {
    try {
      localStorage.setItem(SESSION_KEY, "1");
      if (tokenValue) localStorage.setItem(SESSION_KEY + "_token", tokenValue);
    } catch (e) { /* sem storage */ }
  }
  function caClearSession() {
    try {
      localStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(SESSION_KEY + "_token");
    } catch (e) { /* sem storage */ }
  }

  function generateBookingToken(existingList) {
    var existing = existingList.map(function (x) { return String(x.token || "").toUpperCase(); });
    for (var i = 0; i < 100; i++) {
      var code = "MS" + String(Math.floor(1000 + Math.random() * 9000));
      if (existing.indexOf(code) === -1) return code;
    }
    return "MS" + String(Date.now() % 10000);
  }

  function buildBookingMsg(b) {
    var lines = [t.buildTitle, ""];
    if (b.token) lines.push("• " + t.bookingCodeLabel + ": " + b.token);
    lines.push("• " + t.labelName + ": " + b.name);
    lines.push("• " + t.labelPhone + ": " + b.phone);
    if (b.email) lines.push("• " + t.labelEmail + ": " + b.email);
    lines.push("• " + t.labelService + ": " + b.service);
    lines.push("• " + t.labelDate + ": " + fmtDate(b.date));
    lines.push("• " + t.labelTime + ": " + b.time);
    lines.push("• " + t.labelPref + ": " + b.pref);
    if (b.msg) lines.push("• " + t.labelMsg + ": " + b.msg);
    return lines.join("\n");
  }

  var bookingForm = el("bookingForm");
  if (bookingForm) {
    var dateInput = el("bkDate");
    if (dateInput) dateInput.min = todayISO();

    /* Dropdown de serviços a partir do config (fonte única) */
    var serviceSelect = el("bkService");
    if (serviceSelect && cfg.services && cfg.services.length) {
      var ph = serviceSelect.querySelector('option[value=""]');
      var phHTML = ph ? ph.outerHTML : "";
      serviceSelect.innerHTML = phHTML + cfg.services.map(function (s) {
        var name = isEN ? s.en : s.pt;
        var label = name + " · " + s.minutes + " min";
        /* Preço só entra no rótulo se os preços estiverem ativos
           (SITE.showPrices em js/config.js). */
        if (cfg.showPrices && s.price != null) {
          label += " · " + (isEN ? "€" + s.price : s.price + " €");
        }
        return '<option value="' + esc(name) + '">' + esc(label) + "</option>";
      }).join("");
    }

    /* Horas do formulário a partir do config */
    var timeSelect = el("bkTime");
    if (timeSelect && cfg.timeSlots && cfg.timeSlots.length) {
      var currentVal = timeSelect.value;
      var placeholder = timeSelect.querySelector("option[disabled]");
      var phText = placeholder ? placeholder.textContent : (isEN ? "Choose…" : "Escolha…");
      timeSelect.innerHTML =
        '<option value="" disabled selected>' + esc(phText) + "</option>" +
        cfg.timeSlots.map(function (ts) { return "<option>" + esc(ts) + "</option>"; }).join("");
      if (currentVal) timeSelect.value = currentVal;
    }

    clearInvalidOnInput(["bkName", "bkPhone", "bkEmail", "bkService", "bkDate", "bkTime"]);

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = el("bookingError");

      var name = (el("bkName").value || "").trim();
      var phone = (el("bkPhone").value || "").trim();
      var email = (el("bkEmail").value || "").trim();
      var opt = serviceSelect && serviceSelect.selectedOptions[0] || null;
      var service = opt ? opt.value : "";
      var date = dateInput ? dateInput.value : "";
      var time = timeSelect ? timeSelect.value : "";
      var prefRadio = bookingForm.querySelector('input[name="pref"]:checked');
      var pref = prefRadio ? prefRadio.value : "WhatsApp";
      var msg = (el("bkMsg").value || "").trim();

      var ok = true;
      function check(id, hasValue) {
        var f = el(id);
        if (!f) return;
        f.classList.toggle("invalid", !hasValue);
        if (!hasValue) ok = false;
      }
      check("bkName", name !== "");
      check("bkPhone", phone !== "" && isValidPhone(phone));
      check("bkEmail", email === "" || isValidEmail(email));
      check("bkService", service !== "");
      check("bkDate", date !== "" && !isPastDate(date));
      check("bkTime", time !== "");

      if (!ok) {
        var firstInvalid = bookingForm.querySelector(".invalid");
        if (firstInvalid) firstInvalid.focus();
        if (err) {
          err.textContent =
            (!date || isPastDate(date)) ? t.dateInvalid :
            !time ? t.timeInvalid :
            phone && !isValidPhone(phone) ? t.phoneInvalid :
            email && !isValidEmail(email) ? t.emailInvalid :
            t.required;
          err.classList.add("show");
        }
        return;
      }

      var booking = {
        id: Date.now(),
        name: name, phone: phone, email: email,
        service: service, date: date, time: time, pref: pref, msg: msg,
        token: generateBookingToken(loadBookings()),
        created: new Date().toISOString()
      };

      var waHref = waUrl(buildBookingMsg(booking));
      var mailHref = mailto(
        t.mailSubjectPrefix + service + " · " + fmtDate(date) + " " + time,
        buildBookingMsg(booking)
      );

      var list = loadBookings();
      list.unshift(booking);
      saveBookings(list);

      /* Tenta abrir o WhatsApp (o botão do painel é o plano B) */
      window.open(waHref, "_blank");

      var success = el("bookingSuccess");
      if (success) {
        el("bkSuccessTitle").textContent = t.bookingTitle;
        el("bkSuccessText").textContent = t.bookingText + " " + t.savedNote;
        el("bkSuccessSummary").innerHTML =
          "<strong>" + esc(service) + "</strong> · " +
          esc(fmtDate(date)) + (isEN ? " at " : " às ") + esc(time) +
          " · " + esc(name) +
          (booking.token ? (isEN ? " · Code " : " · Código ") + esc(booking.token) : "");
        el("bkSuccessWa").href = waHref;
        el("bkSuccessMail").href = mailHref;
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }

      if (err) err.classList.remove("show");
      bookingForm.reset();
      if (dateInput) dateInput.min = todayISO();
    });
  }

  /* ============================================================
     ÁREA DE CLIENTES
     ============================================================ */
  var caGate = el("caGate");
  var caPanel = el("caPanel");
  var caCode = el("caCode");
  var caError = el("caError");
  var currentClientToken = "";

  function showCaGate() {
    if (caGate) caGate.style.display = "";
    if (caPanel) caPanel.classList.remove("show");
    if (caError) caError.classList.remove("show");
    currentClientToken = "";
  }
  function showCaPanel() {
    if (caGate) caGate.style.display = "none";
    if (caPanel) caPanel.classList.add("show");
  }

  function renderBookings() {
    var wrap = el("caBookings");
    if (!wrap) return;

    var list = loadBookings();
    if (currentClientToken) {
      list = list.filter(function (b) {
        return String(b.token || "").toUpperCase() === currentClientToken.toUpperCase();
      });
    }

    if (!list.length) {
      var bookLink = isEN ? "booking.html" : "marcacao.html";
      wrap.innerHTML =
        '<div class="empty-note">' + esc(t.caEmpty) +
        ' <a href="' + bookLink + '">' + esc(t.caBookNow) + "</a></div>";
      return;
    }

    var html = "";
    list.forEach(function (b) {
      var extra = b.name ? '<div class="bi-client">' + esc(b.name) + "</div>" : "";
      html +=
        '<div class="booking-item">' +
          '<div class="bi-top">' +
            "<div>" +
              "<h4>" + esc(b.service) + "</h4>" + extra +
              '<div class="bi-when">' + esc(fmtDate(b.date)) + " · " + esc(b.time) + "</div>" +
            "</div>" +
            '<span class="chip">' + esc(t.caStatus) + "</span>" +
          "</div>" +
          '<div class="bi-actions">' +
            '<a class="btn-mini" href="' + esc(waUrl(buildBookingMsg(b))) + '" target="_blank" rel="noopener">' + esc(t.caResend) + "</a>" +
            '<button class="btn-mini danger" data-remove="' + esc(String(b.id)) + '" type="button">' + esc(t.caRemove) + "</button>" +
          "</div>" +
        "</div>";
    });
    wrap.innerHTML = html;

    wrap.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        var id = btn.getAttribute("data-remove");
        saveBookings(loadBookings().filter(function (x) { return String(x.id) !== id; }));
        renderBookings();
      });
    });
  }

  if (caGate && caPanel && caCode) {
    /* Sessão anterior neste dispositivo */
    if (caSessionActive()) {
      currentClientToken = caSessionToken();
      showCaPanel();
      renderBookings();
    }

    var caForm = caGate.querySelector("form");
    if (caForm) {
      caForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var codeVal = (caCode.value || "").trim().toUpperCase();
        var isBookingToken = loadBookings().some(function (b) {
          return String(b.token || "").toUpperCase() === codeVal;
        });
        var isMaster = codeVal !== "" && codeVal === MASTER_CODE;

        if (isBookingToken || isMaster) {
          /* O código mestre vê todos os pedidos; um token vê o seu */
          currentClientToken = isMaster ? "" : codeVal;
          showCaPanel();
          caSetSession(currentClientToken);
          if (caError) caError.classList.remove("show");
          renderBookings();
        } else {
          if (caError) {
            caError.textContent = t.caWrongCode;
            caError.classList.add("show");
          }
          caCode.value = "";
          caCode.focus();
          caCode.classList.add("invalid");
          setTimeout(function () { caCode.classList.remove("invalid"); }, 1200);
        }
      });
    }

    var logout = el("caLogout");
    if (logout) {
      logout.addEventListener("click", function () {
        caClearSession();
        showCaGate();
        caCode.value = "";
        caCode.focus();
      });
    }
  }
})();
