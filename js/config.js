/* ============================================================
   Marta Sousa Terapias — config.js
   >>> PERSONALIZE ESTE FICHEIRO ANTES DE PUBLICAR <<<
   É a única fonte de valores: telefone, email, redes sociais,
   código da Área de Clientes, serviços, preços e horários.
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

  /* Área de Clientes — código partilhado pela Marta no WhatsApp
     ao confirmar a marcação (também exibido na página de marcação). */
  clientCode: "MS2026",

  /* Serviços do formulário de marcação — o nome (pt/en) é o que
     aparece na mensagem de WhatsApp; minutos e preço aparecem no
     dropdown "Serviço". */
  services: [
    { pt: "Sessão individual de Reiki", en: "Individual Reiki session", minutes: 60, price: 50 },
    { pt: "Reiki à distância",          en: "Distance Reiki",           minutes: 45, price: 35 },
    { pt: "Tarot dos Anjos",            en: "Angel Tarot reading",      minutes: 50, price: 35 },
    { pt: "Reiki + Tarot dos Anjos",    en: "Reiki + Angel Tarot",      minutes: 90, price: 70 }
  ],

  /* Horas sugeridas no formulário (a Marta confirma a disponibilidade) */
  timeSlots: ["10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"]
};
