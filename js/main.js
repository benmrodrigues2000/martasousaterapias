/* ============================================================
   Marta Sousa Terapias — main.js
   Menu mobile · WhatsApp · formulário de contacto ·
   marcação online (WhatsApp + email + localStorage) · área de clientes
   Bugfixes 2026: time validation, past-date guard, i18n service names,
   invalid-state clearing, SITE guard, fmtDate UTC, nav ESC/outside.
   ============================================================ */
(function () {
  "use strict";

  var isEN = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  // Guard for missing config.js
  if (typeof SITE === "undefined") {
    window.SITE = {
      phoneIntl: "351917005532",
      email: "martacla@gmail.com",
      clientCode: "MARTA2026",
      timeSlots: ["10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"],
      services: [
        { pt: "Sessão individual de Reiki", en: "Individual Reiki session" },
        { pt: "Reiki à distância", en: "Distance Reiki" },
        { pt: "Tarot dos Anjos", en: "Angel Tarot reading" },
        { pt: "Reiki + Tarot dos Anjos", en: "Reiki + Angel Tarot" }
      ]
    };
  }

  var T = {
    pt: {
      menu: "Abrir menu",
      closeMenu: "Fechar menu",
      required: "Por favor, preencha os campos obrigatórios assinalados.",
      emailInvalid: "Por favor, indique um email válido.",
      dateInvalid: "Por favor, escolha uma data a partir de hoje.",
      timeInvalid: "Por favor, escolha uma hora.",
      phoneInvalid: "Por favor, indique um telefone válido.",
      bookingTitle: "Pedido de marcação preparado ✓",
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
      caWrongCode: "Código não válido. O código é partilhado pela Marta aquando da marcação.",
      caBookings: "As suas marcações",
      caEmpty: "Ainda não tem pedidos de marcação guardados neste dispositivo.",
      caBookNow: "Marcar agora",
      caStatus: "Aguarda confirmação",
      caResend: "Reenviar no WhatsApp",
      caRemove: "Remover",
      caSentOn: "Enviado em"
    },
    en: {
      menu: "Open menu",
      closeMenu: "Close menu",
      required: "Please fill in the required fields marked below.",
      emailInvalid: "Please enter a valid email address.",
      dateInvalid: "Please choose a date from today onwards.",
      timeInvalid: "Please choose a time.",
      phoneInvalid: "Please enter a valid phone number.",
      bookingTitle: "Booking request ready ✓",
      bookingText: "To complete your booking, just send the message to Marta on WhatsApp — she will confirm availability and schedule your session.",
      openWa: "Open WhatsApp",
      sendEmail: "Send by email",
      savedNote: "Your request is saved in the Client Area on this device (check the message for the code).",
      waDefault: "Hi Marta! I found your website and would love to know more about your sessions.",
      buildTitle: "Hi Marta! I would like to request a booking.",
      labelName: "Name", labelPhone: "Phone", labelEmail: "Email",
      labelService: "Service", labelDate: "Date", labelTime: "Time",
      labelPref: "Preferred contact", labelMsg: "Message",
      contactSubject: "Website enquiry — {name}",
      caWrongCode: "Invalid code. The code is shared by Marta when booking.",
      caBookings: "Your bookings",
      caEmpty: "You don't have any booking requests saved on this device yet.",
      caBookNow: "Book now",
      caStatus: "Awaiting confirmation",
      caResend: "Resend on WhatsApp",
      caRemove: "Remove",
      caSentOn: "Sent on"
    }
  };

  var t = T[isEN ? "en" : "pt"];

  function el(id) { return document.getElementById(id); }
  function waUrl(text) {
    var phone = (typeof SITE !== "undefined" && SITE.phoneIntl) ? SITE.phoneIntl : "351917005532";
    return "https://wa.me/" + phone + "?text=" + encodeURIComponent(text);
  }
  function mailto(subject, body) {
    var email = (typeof SITE !== "undefined" && SITE.email) ? SITE.email : "martacla@gmail.com";
    return "mailto:" + email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  // Robust date formatter: parse YYYY-MM-DD manually to avoid timezone shift
  function fmtDate(iso) {
    if (!iso) return "";
    var parts = String(iso).split("-");
    if (parts.length === 3) {
      var y = parseInt(parts[0],10), m = parseInt(parts[1],10)-1, d = parseInt(parts[2],10);
      if (!isNaN(y) && !isNaN(m) && !isNaN(d)) {
        var dt = new Date(Date.UTC(y,m,d));
        if (!isNaN(dt)) {
          return dt.toLocaleDateString(isEN ? "en-GB" : "pt-PT", { timeZone: "UTC" });
        }
      }
    }
    var fallback = new Date(iso + "T00:00:00Z");
    return isNaN(fallback) ? iso : fallback.toLocaleDateString(isEN ? "en-GB" : "pt-PT", { timeZone: "UTC" });
  }
  function isPastDate(iso) {
    if (!iso) return true;
    var today = new Date();
    today.setHours(0,0,0,0);
    var parts = iso.split("-");
    if (parts.length !== 3) return true;
    var d = new Date(parseInt(parts[0],10), parseInt(parts[1],10)-1, parseInt(parts[2],10));
    d.setHours(0,0,0,0);
    return d < today;
  }
  function isValidEmail(s) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
  }
  function isValidPhone(s) {
    // Allow +, spaces, dashes, at least 9 digits
    var digits = String(s).replace(/\D/g,"");
    return digits.length >= 9 && digits.length <= 15;
  }
  function clearInvalidOnInput(ids) {
    ids.forEach(function(id){
      var f = el(id);
      if (!f) return;
      f.addEventListener("input", function(){ f.classList.remove("invalid"); });
      f.addEventListener("change", function(){ f.classList.remove("invalid"); });
    });
  }

  /* ---------- menu mobile ---------- */
  var toggle = el("navToggle");
  var nav = el("mainNav");
  if (toggle && nav) {
    function closeNav(){
      nav.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", t.menu);
    }
    function openNav(){
      nav.classList.add("open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", t.closeMenu);
    }
    toggle.addEventListener("click", function () {
      var isOpen = nav.classList.contains("open");
      if (isOpen) closeNav(); else openNav();
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", closeNav);
    });
    document.addEventListener("keydown", function(e){
      if (e.key === "Escape" && nav.classList.contains("open")) closeNav();
    });
    document.addEventListener("click", function(e){
      if (!nav.classList.contains("open")) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      closeNav();
    });
  }

  /* ---------- WhatsApp flutuante + valores do config ---------- */
  document.querySelectorAll("[data-wa-default]").forEach(function (a) {
    try { a.href = waUrl(t.waDefault); } catch(e){}
  });
  var yearEl = el("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Sync contact info from SITE config (single source of truth) - fixes hardcoded values bug
  try {
    if (typeof SITE !== "undefined") {
      // Phone
      document.querySelectorAll('a[href^="tel:"]').forEach(function(a){
        a.href = "tel:+" + SITE.phoneIntl;
      });
      // Email
      document.querySelectorAll('a[href^="mailto:"]').forEach(function(a){
        a.href = "mailto:" + SITE.email;
        // Only update text if it looks like an email
        if (a.textContent.indexOf("@") !== -1) a.textContent = SITE.email;
      });
      // Social - Instagram / Facebook from config
      if (SITE.instagram) {
        document.querySelectorAll('a[href*="instagram.com"]').forEach(function(a){
          a.href = SITE.instagram;
        });
      }
      if (SITE.facebook) {
        document.querySelectorAll('a[href*="facebook.com"]').forEach(function(a){
          a.href = SITE.facebook;
        });
      }
    }
  } catch(e) { /* silent */ }

  /* ---------- reveal on scroll ---------- */
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
    clearInvalidOnInput(["ctName","ctEmail","ctPhone","ctMsg","ctSubject"]);
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = el("contactError");
      var name = (el("ctName").value || "").trim();
      var email = (el("ctEmail").value || "").trim();
      var phone = (el("ctPhone").value || "").trim();
      var subject = el("ctSubject") ? el("ctSubject").value : "";
      var message = (el("ctMsg").value || "").trim();

      var hasError = false;
      function mark(id, invalid){
        var f = el(id);
        if (f) f.classList.toggle("invalid", !!invalid);
        if (invalid) hasError = true;
      }
      mark("ctName", !name);
      mark("ctEmail", !email);
      mark("ctMsg", !message);

      if (hasError) {
        if (err) { err.textContent = t.required; err.classList.add("show"); }
        return;
      }
      if (!isValidEmail(email)) {
        mark("ctEmail", true);
        if (err) { err.textContent = t.emailInvalid; err.classList.add("show"); }
        return;
      }
      if (phone && !isValidPhone(phone)) {
        mark("ctPhone", true);
        if (err) { err.textContent = t.phoneInvalid; err.classList.add("show"); }
        return;
      }

      var body =
        t.labelName + ": " + name + "\n" +
        t.labelEmail + ": " + email +
        (phone ? "\n" + t.labelPhone + ": " + phone : "") +
        (subject ? "\n" + t.subjectLabel + ": " + subject : "") + "\n\n" + message;

      var waBtn = el("contactWa");
      if (waBtn) waBtn.href = waUrl(body);
      if (err) err.classList.remove("show");
      // Use window.open for mailto to avoid hard navigation break in some browsers,
      // fallback to location.href
      try {
        window.location.href = mailto(t.contactSubject.replace("{name}", name), body);
      } catch(ex) {
        window.open(mailto(t.contactSubject.replace("{name}", name), body), "_blank");
      }
    });
  }

  /* ============================================================
     MARCAÇÃO / RESERVA ONLINE
     ============================================================ */
  var bookingForm = el("bookingForm");
  var STORE_KEY = "mst_bookings";

  function canUseStorage(){
    try {
      var k="__test__"; localStorage.setItem(k,k); localStorage.removeItem(k); return true;
    } catch(e){ return false; }
  }
  var SESSION_KEY = "__ca_session__";
  function caSessionActive() {
    try { return !!((typeof localStorage !== "undefined") && localStorage.getItem(SESSION_KEY)); } catch(e){ return false; }
  }
  function caSessionToken() {
    try { return (typeof localStorage !== "undefined") ? localStorage.getItem(SESSION_KEY + "_token") || "" : ""; } catch(e){ return ""; }
  }
  function caSetSession(tokenValue) {
    try { if (typeof localStorage !== "undefined") { localStorage.setItem(SESSION_KEY, "1"); if (tokenValue) localStorage.setItem(SESSION_KEY + "_token", tokenValue); } } catch(e){}
  }
  function generateBookingToken(existingList) {
    existingList = existingList || [];
    var existing = existingList.map(function(x){ return String(x.token || "").toUpperCase(); });
    for (var i = 0; i < 100; i++) {
      var code = "MS" + String(Math.floor(1000 + Math.random() * 9000));
      if (existing.indexOf(code) === -1) return code;
    }
    return "MS" + String(Math.floor(1000 + Math.random() * 9000));
  }

  function caClearSession() {
    try { if (typeof localStorage !== "undefined") { localStorage.removeItem(SESSION_KEY); localStorage.removeItem(SESSION_KEY + "_token"); } } catch(e){}
  }
  function loadBookings() {
    if (!canUseStorage()) return [];
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveBookings(list) {
    if (!canUseStorage()) return;
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function buildBookingMsg(b) {
    var lines = [t.buildTitle, ""];
    if (b.token) lines.push("• " + (isEN ? "Booking code: " : "Código da reserva: ") + b.token);
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

  if (bookingForm) {
    var dateInput = el("bkDate");
    if (dateInput) {
      var today = new Date();
      var pad = function (n) { return String(n).padStart(2, "0"); };
      dateInput.min = today.getFullYear() + "-" + pad(today.getMonth() + 1) + "-" + pad(today.getDate());
    }

    // Populate time slots from config if present and select is empty-ish
    var timeSelect = el("bkTime");
    if (timeSelect && typeof SITE !== "undefined" && SITE.timeSlots && SITE.timeSlots.length) {
      var currentVal = timeSelect.value;
      // Only repopulate if options are the default 8 or less
      if (timeSelect.options.length <= 9) {
        var placeholder = timeSelect.querySelector('option[disabled]');
        var phHTML = placeholder ? placeholder.outerHTML : '<option value="" disabled selected>'+ (isEN ? 'Choose…' : 'Escolha…') +'</option>';
        timeSelect.innerHTML = phHTML + SITE.timeSlots.map(function(ts){ return '<option>'+esc(ts)+'</option>'; }).join("");
        if (currentVal) timeSelect.value = currentVal;
      }
    }

    clearInvalidOnInput(["bkName","bkPhone","bkEmail","bkService","bkDate","bkTime","bkMsg"]);

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = el("bookingError");
      var ok = true;
      function check(id, hasValue) {
        var f = el(id);
        if (!f) return;
        f.classList.toggle("invalid", !hasValue);
        if (!hasValue) ok = false;
      }
      var name = (el("bkName").value || "").trim();
      var phone = (el("bkPhone").value || "").trim();
      var email = (el("bkEmail").value || "").trim();
      var serviceSel = el("bkService");
      var opt = serviceSel && serviceSel.selectedOptions ? serviceSel.selectedOptions[0] : null;
      // i18n aware service extraction
      var service = "";
      if (opt) {
        if (isEN) {
          service = opt.getAttribute("data-en") || opt.value || opt.textContent.trim();
        } else {
          service = opt.getAttribute("data-pt") || opt.value || opt.textContent.trim();
        }
      }
      var date = el("bkDate") ? el("bkDate").value : "";
      var time = el("bkTime") ? el("bkTime").value : "";
      var pref = (bookingForm.querySelector('input[name="pref"]:checked') || {}).value || "WhatsApp";
      var msg = (el("bkMsg").value || "").trim();

      check("bkName", !!name);
      check("bkPhone", !!phone && isValidPhone(phone));
      check("bkService", !!service);
      check("bkDate", !!date && !isPastDate(date));
      check("bkTime", !!time);

      if (email && !isValidEmail(email)) {
        check("bkEmail", false);
      } else {
        var ef = el("bkEmail"); if (ef) ef.classList.remove("invalid");
      }

      if (!ok) {
        if (err) {
          if (!date || isPastDate(date)) err.textContent = t.dateInvalid;
          else if (!time) err.textContent = t.timeInvalid;
          else if (phone && !isValidPhone(phone)) err.textContent = t.phoneInvalid;
          else if (email && !isValidEmail(email)) err.textContent = t.emailInvalid;
          else err.textContent = t.required;
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
      var mailSubject = (isEN ? "Booking request — " : "Pedido de marcação — ") + service + " · " + fmtDate(date) + " " + time;
      var mailHref = mailto(mailSubject, buildBookingMsg(booking));

      var list = loadBookings();
      list.unshift(booking);
      saveBookings(list);

      // Try to open WhatsApp, but don't rely on it (popup blockers)
      var win = window.open(waHref, "_blank");
      if (!win) {
        // popup blocked, user will use button in success panel
      }

      var success = el("bookingSuccess");
      var sTitle = el("bkSuccessTitle");
      var sText = el("bkSuccessText");
      var sSummary = el("bkSuccessSummary");
      var sWa = el("bkSuccessWa");
      var sMail = el("bkSuccessMail");
      if (sTitle) sTitle.textContent = t.bookingTitle;
      if (sText) sText.textContent = t.bookingText + " " + t.savedNote;
      if (sSummary) {
        var atWord = isEN ? " at " : " às ";
        sSummary.innerHTML =
          "<strong>" + esc(service) + "</strong> · " + esc(fmtDate(date)) + atWord + esc(time) +
          " · " + esc(name) + (booking.token ? (isEN ? " · Code " : " · Código ") + esc(booking.token) : "");
      }
      if (sWa) sWa.href = waHref;
      if (sMail) sMail.href = mailHref;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (err) err.classList.remove("show");
      bookingForm.reset();
      // Re-apply min date after reset
      if (dateInput) {
        var today2 = new Date();
        var pad2 = function (n) { return String(n).padStart(2, "0"); };
        dateInput.min = today2.getFullYear() + "-" + pad2(today2.getMonth() + 1) + "-" + pad2(today2.getDate());
      }
    });
  }

  /* ============================================================
     ÁREA DE CLIENTES
     ============================================================ */
  var caGate = el("caGate");
  var caPanel = el("caPanel");
  var caCode = el("caCode");
  var caError = el("caError");

  function renderBookings() {
    var wrap = el("caBookings");
    if (!wrap) return;
    var list = loadBookings();
    if (currentClientToken) {
      list = list.filter(function(b){ return (String(b.token || "").toUpperCase()) === currentClientToken.toUpperCase(); });
    }
    if (!list.length) {
      var bookLink = isEN ? "booking.html" : "marcacao.html";
      wrap.innerHTML =
        '<div class="empty-note">' + esc(t.caEmpty) +
        ' <a href="'+bookLink+'">' + esc(t.caBookNow) + "</a></div>";
      return;
    }
    var html = "";
    list.forEach(function (b) {
      var clientName = b.name ? esc(b.name) : "";
      var extra = (clientName ? '<div class="bi-client">' + clientName + '</div>' : "");
      html +=
        '<div class="booking-item">' +
          '<div class="bi-top">' +
            "<div>" +
              "<h4>" + esc(b.service) + "</h4>" +
              extra +
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
        var idToRemove = btn.getAttribute("data-remove");
        saveBookings(loadBookings().filter(function (x) { return String(x.id) !== idToRemove; }));
        renderBookings();
      });
    });
  }

  var currentClientToken = "";

  if (caGate && caPanel && caCode) {
    // Restore session if active
    if (caSessionActive()) {
      currentClientToken = caSessionToken();
      caGate.style.display = "none";
      caPanel.classList.add("show");
      renderBookings();
    }

    var caForm = caGate.querySelector("form");
    if (caForm) {
      caForm.addEventListener("submit", function (e) {
        e.preventDefault();
        var codeVal = (caCode.value || "").trim().toUpperCase();
        var all = loadBookings();
        var match = all.some(function(b){ return (String(b.token || "").toUpperCase()) === codeVal; });
        var isMaster = (codeVal === "MS2026");
        if (match || isMaster) {
          currentClientToken = isMaster ? "" : codeVal;
          caGate.style.display = "none";
          caPanel.classList.add("show");
          caSetSession(currentClientToken);
          if (caError) caError.classList.remove("show");
          renderBookings();
        } else {
          if (caError) { caError.textContent = t.caWrongCode; caError.classList.add("show"); }
          caCode.value = "";
          caCode.focus();
          caCode.classList.add("invalid");
          setTimeout(function(){ caCode.classList.remove("invalid"); }, 1200);
        }
      });
    }
    var logout = el("caLogout");
    if (logout) {
      logout.addEventListener("click", function () {
        caPanel.classList.remove("show");
        caGate.style.display = "";
        caCode.value = "";
        caClearSession();
        currentClientToken = "";
        if (caError) caError.classList.remove("show");
      });
    }
  }
})();
