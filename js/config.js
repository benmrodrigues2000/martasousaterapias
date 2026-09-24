/* ============================================================
   Marta Sousa Terapias — config.js
   >>> PERSONALIZE ESTE FICHEIRO ANTES DE PUBLICAR <<<
   (telefonos, email, endereço, redes sociais, código de clientes)
   ============================================================ */

const SITE = {
  name: "Marta Sousa Terapias",
  legalName: "Marta Ferreira Sousa",

  /* Contacto */
  phoneDisplay: "917 005 532",
  phoneIntl: "351917005532",           // usado no wa.me/... e tel:+...
  email: "martacla@gmail.com",

  /* Localização (TODO: colocar o endereço exato quando quiser mostrar) */
  address: "Vila Nova de Gaia, Portugal",
  mapQuery: "Vila Nova de Gaia, Portugal",

  /* Redes sociais (TODO: substituir pelos perfis reais) */
  instagram: "https://www.instagram.com/martasousaterapias",
  facebook:  "https://www.facebook.com/martasousaterapias",

  /* Área de clientes (código partilhado pela Marta ao confirmar) */
  clientCode: "MS2026",

  /* Serviços usados no formulário de marcação (nome PT = texto enviado no WhatsApp) */
  services: [
    { pt: "Sessão individual de Reiki", en: "Individual Reiki session" },
    { pt: "Reiki à distância",          en: "Distance Reiki" },
    { pt: "Tarot dos Anjos",            en: "Angel Tarot reading" },
    { pt: "Reiki + Tarot dos Anjos",    en: "Reiki + Angel Tarot" }
  ],

  /* Horas sugeridas no formulário (a Marta confirma a disponibilidade) */
  timeSlots: ["10:00","11:00","12:00","14:00","15:00","16:00","17:00","18:00"]
};
