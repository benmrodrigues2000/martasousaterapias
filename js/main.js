/* ============================================================
   Marta Sousa Terapias — main.js
   Menu mobile · WhatsApp · formulário de contacto ·
   marcação online (WhatsApp + email + localStorage) · área de clientes
   ============================================================ */
(function () {
  "use strict";

  var isEN = (document.documentElement.lang || "").toLowerCase().indexOf("en") === 0;

  var T = {
    pt: {
      menu: "Abrir menu",
      closeMenu: "Fechar menu",
      required: "Por favor, preencha os campos obrigatórios assinalados.",
      emailInvalid: "Por favor, indique um email válido.",
      bookingTitle: "Pedido de marcação preparado ✓",
      bookingText: "Para concluir a marcação, é só enviar a mensagem ao WhatsApp da Marta — ela confirma a disponibilidade e fecha a sua sessão.",
      openWa: "Abrir WhatsApp",
      sendEmail: "Enviar por email",
      savedNote: "O pedido ficou guardado na Área de Clientes deste dispositivo.",
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
      bookingTitle: "Booking request ready ✓",
      bookingText: "To complete your booking, just send the message to Marta on WhatsApp — she will confirm availability and schedule your session.",
      openWa: "Open WhatsApp",
      sendEmail: "Send by email",
      savedNote: "Your request is saved in the Client Area on this device.",
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
    return "https://wa.me/" + SITE.phoneIntl + "?text=" + encodeURIComponent(text);
  }
  function mailto(subject, body) {
    return "mailto:" + SITE.email +
      "?subject=" + encodeURIComponent(subject) +
      "&body=" + encodeURIComponent(body);
  }
  function esc(s) {
    return String(s || "").replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function fmtDate(iso) {
    if (!iso) return "";
    var d = new Date(iso + "T00:00:00");
    return isNaN(d) ? iso : d.toLocaleDateString(isEN ? "en-GB" : "pt-PT");
  }

  /* ---------- menu mobile ---------- */
  var toggle = el("navToggle");
  var nav = el("mainNav");
  if (toggle && nav) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? t.closeMenu : t.menu);
    });
    nav.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ---------- WhatsApp flutuante + valores do config ---------- */
  document.querySelectorAll("[data-wa-default]").forEach(function (a) {
    a.href = waUrl(t.waDefault);
  });
  var yearEl = el("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

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
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = el("contactError");
      var name = (el("ctName").value || "").trim();
      var email = (el("ctEmail").value || "").trim();
      var phone = (el("ctPhone").value || "").trim();
      var subject = el("ctSubject") ? el("ctSubject").value : "";
      var message = (el("ctMsg").value || "").trim();

      if (!name || !email || !message) {
        [ "ctName", "ctEmail", "ctMsg" ].forEach(function (id) {
          var f = el(id);
          if (f) f.classList.toggle("invalid", !(f.value || "").trim());
        });
        if (err) { err.textContent = t.required; err.classList.add("show"); }
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        el("ctEmail").classList.add("invalid");
        if (err) { err.textContent = t.emailInvalid; err.classList.add("show"); }
        return;
      }

      var body =
        t.labelName + ": " + name + "\n" +
        t.labelEmail + ": " + email +
        (phone ? "\n" + t.labelPhone + ": " + phone : "") +
        (subject ? "\n" + t.subjectLabel + ": " + subject : "") + "\n\n" + message;

      var waBtn = el("contactWa");
      if (waBtn) waBtn.href = waUrl(body);
      window.location.href = mailto(t.contactSubject.replace("{name}", name), body);
      if (err) err.classList.remove("show");
    });
  }

  /* ============================================================
     MARCAÇÃO / RESERVA ONLINE
     ============================================================ */
  var bookingForm = el("bookingForm");
  var STORE_KEY = "mst_bookings";

  function loadBookings() {
    try { return JSON.parse(localStorage.getItem(STORE_KEY) || "[]"); }
    catch (e) { return []; }
  }
  function saveBookings(list) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(list)); } catch (e) {}
  }
  function buildBookingMsg(b) {
    var lines = [t.buildTitle, ""];
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

    bookingForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var err = el("bookingError");
      var ok = true;
      var check = function (id, hasValue) {
        var f = el(id);
        f.classList.toggle("invalid", !hasValue);
        if (!hasValue) ok = false;
      };
      var name = (el("bkName").value || "").trim();
      var phone = (el("bkPhone").value || "").trim();
      var email = (el("bkEmail").value || "").trim();
      var serviceSel = el("bkService");
      var service = serviceSel.selectedOptions[0]
        ? serviceSel.selectedOptions[0].getAttribute("data-pt") || serviceSel.value : "";
      var date = el("bkDate").value;
      var time = el("bkTime").value;
      var pref = (bookingForm.querySelector('input[name="pref"]:checked') || {}).value || "WhatsApp";
      var msg = (el("bkMsg").value || "").trim();

      check("bkName", !!name);
      check("bkPhone", !!phone);
      check("bkService", !!service);
      check("bkDate", !!date);
      if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { check("bkEmail", false); }
      if (!ok) { if (err) { err.textContent = t.required; err.classList.add("show"); } return; }

      var booking = {
        id: Date.now(),
        name: name, phone: phone, email: email,
        service: service, date: date, time: time, pref: pref, msg: msg,
        created: new Date().toISOString()
      };

      var waHref = waUrl(buildBookingMsg(booking));
      var mailHref = mailto("Pedido de marcação — " + service + " · " + fmtDate(date) + " " + time, buildBookingMsg(booking));

      var list = loadBookings();
      list.unshift(booking);
      saveBookings(list);

      window.open(waHref, "_blank");

      var success = el("bookingSuccess");
      var sTitle = el("bkSuccessTitle");
      var sText = el("bkSuccessText");
      var sSummary = el("bkSuccessSummary");
      var sWa = el("bkSuccessWa");
      var sMail = el("bkSuccessMail");
      if (sTitle) sTitle.textContent = t.bookingTitle;
      if (sText) sText.textContent = t.bookingText + " " + t.savedNote;
      if (sSummary) sSummary.innerHTML =
        "<strong>" + esc(service) + "</strong> · " + fmtDate(date) + " às " + esc(time) +
        " · " + esc(name);
      if (sWa) sWa.href = waHref;
      if (sMail) sMail.href = mailHref;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      if (err) err.classList.remove("show");
      bookingForm.reset();
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
    if (!list.length) {
      wrap.innerHTML =
        '<div class="empty-note">' + t.caEmpty +
        ' <a href="marcacao.html">' + t.caBookNow + "</a></div>";
      return;
    }
    var html = "";
    list.forEach(function (b) {
      html +=
        '<div class="booking-item">' +
          '<div class="bi-top">' +
            "<div>" +
              "<h4>" + esc(b.service) + "</h4>" +
              '<div class="bi-when">' + fmtDate(b.date) + " · " + esc(b.time) + "</div>" +
            "</div>" +
            '<span class="chip">' + t.caStatus + "</span>" +
          "</div>" +
          '<div class="bi-actions">' +
            '<a class="btn-mini" href="' + waUrl(buildBookingMsg(b)) + '" target="_blank" rel="noopener">' + t.caResend + "</a>" +
            '<button class="btn-mini danger" data-remove="' + b.id + '" type="button">' + t.caRemove + "</button>" +
          "</div>" +
        "</div>";
    });
    wrap.innerHTML = html;
    wrap.querySelectorAll("[data-remove]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        saveBookings(loadBookings().filter(function (x) { return String(x.id) !== btn.getAttribute("data-remove"); }));
        renderBookings();
      });
    });
  }

  if (caGate && caPanel && caCode) {
    var caForm = caGate.querySelector("form");
    if (caForm) {
      caForm.addEventListener("submit", function (e) {
        e.preventDefault();
        if ((caCode.value || "").trim().toUpperCase() === SITE.clientCode.toUpperCase()) {
          caGate.style.display = "none";
          caPanel.classList.add("show");
          renderBookings();
        } else {
          if (caError) { caError.textContent = t.caWrongCode; caError.classList.add("show"); }
          caCode.value = "";
          caCode.focus();
        }
      });
    }
    var logout = el("caLogout");
    if (logout) {
      logout.addEventListener("click", function () {
        caPanel.classList.remove("show");
        caGate.style.display = "";
        caCode.value = "";
      });
    }
  }
})();
