/* ============================================================
   Marta Sousa Terapias — base de dados em Google Sheets
   ------------------------------------------------------------
   Recebe os formulários do site (marcações e contactos), guarda
   cada envio numa linha da folha de cálculo e envia um email de
   aviso à Marta.

   Instalação (uma só vez) — ver README, "Base de dados dos formulários":
   1. Criar uma Google Sheet nova → Extensões → Apps Script
   2. Apagar o código que lá está e colar TODO este ficheiro
   3. Implementar → Nova implementação → tipo "Aplicação Web"
        Executar como: Eu
        Quem tem acesso: Qualquer pessoa
   4. Autorizar, copiar o URL que termina em /exec e colá-lo em
      formEndpoint, em js/config.js
   ============================================================ */

/* Email que recebe o aviso de cada envio ("" = não enviar email) */
var NOTIFY_EMAIL = "martacla@gmail.com";

var SHEETS = {
  booking: {
    name: "Marcações",
    columns: ["Recebido em", "Código", "Nome", "Telefone", "Email", "Serviço",
              "Data", "Hora", "Contacto preferido", "Mensagem", "Idioma", "Estado"],
    row: function (d, now) {
      return [now, d.token, d.name, d.phone, d.email, d.service,
              d.date, d.time, d.pref, d.message, d.lang, "Por confirmar"];
    }
  },
  contact: {
    name: "Contactos",
    columns: ["Recebido em", "Nome", "Email", "Telefone", "Assunto", "Mensagem", "Idioma"],
    row: function (d, now) {
      return [now, d.name, d.email, d.phone, d.subject, d.message, d.lang];
    }
  }
};

var MAX_LEN = 2000;

function doPost(e) {
  try {
    var data = JSON.parse((e && e.postData && e.postData.contents) || "{}");

    /* Campo "armadilha": pessoas não o veem; robôs preenchem-no. */
    if (data.website) return json({ ok: true });

    var def = SHEETS[data.type];
    if (!def) return json({ ok: false, error: "tipo desconhecido" });
    if (!clean(data.name)) return json({ ok: false, error: "nome em falta" });

    Object.keys(data).forEach(function (k) { data[k] = clean(data[k]); });

    var lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      var sheet = getSheet(def);
      sheet.appendRow(def.row(data, new Date()).map(safeCell));
    } finally {
      lock.releaseLock();
    }

    notify(data);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

/* Abrir o URL /exec no navegador mostra isto (útil para testar). */
function doGet() {
  return json({ ok: true, service: "Marta Sousa Terapias — formulários" });
}

function getSheet(def) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(def.name);
  if (!sheet) {
    sheet = ss.insertSheet(def.name);
    sheet.appendRow(def.columns);
    sheet.getRange(1, 1, 1, def.columns.length).setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function notify(d) {
  if (!NOTIFY_EMAIL) return;
  var isBooking = d.type === "booking";
  var subject = isBooking
    ? "Nova marcação (site): " + d.name + " — " + d.service + " " + d.date + " " + d.time
    : "Novo contacto (site): " + d.name + (d.subject ? " — " + d.subject : "");
  var lines = isBooking
    ? ["Código: " + d.token, "Nome: " + d.name, "Telefone: " + d.phone, "Email: " + d.email,
       "Serviço: " + d.service, "Data: " + d.date, "Hora: " + d.time,
       "Contacto preferido: " + d.pref, "", d.message]
    : ["Nome: " + d.name, "Email: " + d.email, "Telefone: " + d.phone,
       "Assunto: " + d.subject, "", d.message];
  var opts = {};
  if (d.email) opts.replyTo = d.email;
  MailApp.sendEmail(NOTIFY_EMAIL, subject,
    lines.join("\n") + "\n\n— Guardado na folha \"" + SHEETS[d.type].name + "\".", opts);
}

function clean(v) {
  return String(v == null ? "" : v).trim().slice(0, MAX_LEN);
}

/* Evita que um texto começado por = + - @ seja lido como fórmula. */
function safeCell(v) {
  if (v instanceof Date) return v;
  var s = String(v == null ? "" : v);
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
