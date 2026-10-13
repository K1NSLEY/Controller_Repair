// Número com DDI + DDD + telefone, somente dígitos.test
const WHATSAPP_NUMBER = "5511939511960";

const prices = {
  common: { 1: 89, 2: 300 },
  hall: { 1: 159.90, 2: 319.80 },
  tmr: { 1: 179, 2: 399 },
  cleaning: 59.90
};

const analogNames = {
  common: "Comum",
  hall: "Hall Effect",
  tmr: "TMR"
};

const form = document.getElementById("quote-form");
const analogType = document.getElementById("analog-type");
const cleaning = document.getElementById("cleaning");
const summaryName = document.getElementById("summary-analog-name");
const summaryAnalogPrice = document.getElementById("summary-analog-price");
const summaryCleaning = document.getElementById("summary-cleaning");
const summaryTotal = document.getElementById("summary-total");
const whatsappButton = document.getElementById("whatsapp-button");

const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function getQuote() {
  const quantity = Number(form.elements.quantity.value);
  const type = analogType.value;
  const analogTotal = prices[type][quantity];
  const cleaningTotal = cleaning.checked ? prices.cleaning : 0;
  const total = analogTotal + cleaningTotal;
  const typeName = analogNames[type];

  return { quantity, typeName, analogTotal, cleaningTotal, total };
}

function updateQuote() {
  const quote = getQuote();

  summaryName.textContent = `Analógico ${quote.typeName} × ${quote.quantity}`;
  summaryAnalogPrice.textContent = currency.format(quote.analogTotal);
  summaryCleaning.textContent = quote.cleaningTotal
    ? currency.format(quote.cleaningTotal)
    : "Não incluída";
  summaryTotal.textContent = currency.format(quote.total);
}

function sendWhatsAppQuote() {
  const quote = getQuote();
  const quantityLabel = quote.quantity === 1 ? "1 analógico" : "par (2 analógicos)";
  const message = [
    "Olá! Encontrei o site da DualFix e gostaria de fazer um orçamento para meu controle DualSense de PS5. 🎮",
    "",
    "*Serviços selecionados*",
    `• Analógico: ${quote.typeName}`,
    `• Quantidade: ${quantityLabel}`,
    `• Troca dos analógicos: ${currency.format(quote.analogTotal)}`,
    `• Limpeza preventiva: ${quote.cleaningTotal ? currency.format(quote.cleaningTotal) : "Não incluída"}`,
    "",
    `*Estimativa total: ${currency.format(quote.total)}*`,
    "",
    "Esse valor pode ser confirmado após a avaliação do controle. Poderia me informar a disponibilidade e como faço para levar ou enviar o controle?",
    "",
    "Obrigado!"
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.open(url, "_blank", "noopener,noreferrer");
}

form.addEventListener("change", updateQuote);
whatsappButton.addEventListener("click", sendWhatsAppQuote);
updateQuote();
