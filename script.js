// Número com DDI + DDD + telefone, somente dígitos.
const WHATSAPP_NUMBER = "5511939511960";
const FIRST_ORDER_COUPON = "PRIMEIRACOMPRA";

const products = {
  common: {
    name: "Comum",
    individualPrice: 79,
    pairPrice: 144.99,
    discount: "8,23%"
  },
  hall: {
    name: "Hall FX",
    individualPrice: 159.90,
    pairPrice: 279.99,
    discount: "12,45%"
  },
  tmr: {
    name: "TMR",
    individualPrice: 189,
    pairPrice: 289.99,
    discount: "23,28%"
  }
};

const prices = {
  cleaning: 19.99
};

const techDescriptions = {
  common: "O analógico comum utiliza contatos físicos resistivos para detectar o movimento. É a opção tradicional e mais acessível para substituir um módulo com defeito.",
  hall: "O Hall FX detecta a posição por efeito Hall, sem depender do mesmo contato resistivo do módulo tradicional. Pode reduzir o desgaste associado ao uso; instalação e calibração continuam importantes.",
  tmr: "O TMR usa sensores magnetorresistivos para medir o movimento sem contato resistivo. É uma alternativa magnética de alta sensibilidade; o resultado final depende da peça, montagem e calibração.",
  overview: "Analógicos comuns usam contatos físicos resistivos. Hall FX e TMR usam sensores magnéticos, mas tecnologias e características variam entre componentes. Abra o guia completo para comparar os tipos e ver os preços."
};

const form = document.getElementById("quote-form");
const analogType = document.getElementById("analog-type");
const cleaning = document.getElementById("cleaning");
const couponCode = document.getElementById("coupon-code");
const couponStatus = document.getElementById("coupon-status");
const applyCouponButton = document.getElementById("apply-coupon");
const wasReferred = document.getElementById("was-referred");
const referralDetails = document.getElementById("referral-details");
const referrerName = document.getElementById("referrer-name");
const referrerPhone = document.getElementById("referrer-phone");
const summaryName = document.getElementById("summary-analog-name");
const summaryAnalogPrice = document.getElementById("summary-analog-price");
const summaryCleaning = document.getElementById("summary-cleaning");
const summaryTotal = document.getElementById("summary-total");
const summarySavingsRow = document.getElementById("summary-savings-row");
const summarySavingsLabel = document.getElementById("summary-savings-label");
const summarySavings = document.getElementById("summary-savings");
const whatsappButton = document.getElementById("whatsapp-button");
const helpDialog = document.getElementById("help-dialog");
const helpTitle = document.getElementById("help-title");
const helpCopy = document.getElementById("help-copy");
const guideLink = document.getElementById("guide-link");
const helpDialogPanel = helpDialog.querySelector(".help-dialog-panel");
let lastFocusedElement = null;
let lastHelpTrigger = null;
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL"
});

function hasCoupon() {
  return couponCode.value.trim().toUpperCase() === FIRST_ORDER_COUPON;
}

function getQuote() {
  const quantity = Number(form.elements.quantity.value);
  const product = products[analogType.value];
  const couponApplied = hasCoupon() && quantity === 2;
  const analogTotal = quantity === 1
    ? product.individualPrice
    : couponApplied
      ? product.individualPrice
      : product.pairPrice;
  const cleaningTotal = cleaning.checked ? prices.cleaning : 0;
  const savings = quantity === 2
    ? product.individualPrice * 2 - analogTotal
    : 0;

  return {
    quantity,
    product,
    analogTotal,
    cleaningTotal,
    couponApplied,
    savings,
    total: analogTotal + cleaningTotal
  };
}

function updateQuote() {
  const quote = getQuote();
  const quantityLabel = quote.quantity === 1
    ? "· 1 analógico"
    : quote.couponApplied
      ? "· par (cupom)"
      : "· par";

  summaryName.textContent = `Analógico ${quote.product.name} ${quantityLabel}`;
  summaryAnalogPrice.textContent = currency.format(quote.analogTotal);
  summaryCleaning.textContent = quote.cleaningTotal
    ? currency.format(quote.cleaningTotal)
    : "Não incluída";
  summaryTotal.textContent = currency.format(quote.total);
  summarySavingsLabel.textContent = quote.couponApplied
    ? "Economia com PRIMEIRACOMPRA"
    : "Economia do par";
  summarySavings.textContent = currency.format(quote.savings);
  summarySavingsRow.hidden = quote.quantity !== 2;

  if (!couponCode.value.trim()) {
    couponStatus.textContent = "";
    couponStatus.dataset.state = "";
    applyCouponButton.textContent = "Aplicar";
    applyCouponButton.disabled = false;
  } else if (!hasCoupon()) {
    couponStatus.textContent = "Cupom não reconhecido";
    couponStatus.dataset.state = "invalid";
    applyCouponButton.textContent = "Aplicar";
    applyCouponButton.disabled = false;
  } else if (quote.quantity !== 2) {
    couponStatus.textContent = "Cupom válido. Selecione o par para aplicar a oferta.";
    couponStatus.dataset.state = "waiting";
    applyCouponButton.textContent = "Aplicar";
    applyCouponButton.disabled = false;
  } else {
    couponStatus.textContent = "Oferta aplicada ao par.";
    couponStatus.dataset.state = "applied";
    applyCouponButton.textContent = "Aplicado";
    applyCouponButton.disabled = true;
  }
}

function updateReferralFields() {
  referralDetails.hidden = !wasReferred.checked;
  referrerName.required = wasReferred.checked;
  referrerPhone.required = wasReferred.checked;
}

function openHelp(topic, trigger) {
  const selectedType = topic === "overview" ? analogType.value : topic;
  const product = products[selectedType];

  helpTitle.textContent = topic === "overview"
    ? "O que muda entre os analógicos?"
    : `Analógico ${product.name}`;
  helpCopy.textContent = techDescriptions[topic === "overview" ? "overview" : selectedType];
  guideLink.href = topic === "overview"
    ? "#tecnologias"
    : `#guia-${selectedType}`;
  lastFocusedElement = document.activeElement;
  lastHelpTrigger = trigger;
  helpDialog.hidden = false;
  helpDialog.classList.add("is-open");
  trigger.setAttribute("aria-expanded", "true");
  document.body.style.overflow = "hidden";
  helpDialog.querySelector(".dialog-close").focus();
}

function closeHelp() {
  if (helpDialog.hidden) return;

  helpDialog.hidden = true;
  helpDialog.classList.remove("is-open");
  lastHelpTrigger?.setAttribute("aria-expanded", "false");
  document.body.style.overflow = "";

  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
  lastHelpTrigger = null;
}

function sendWhatsAppQuote() {
  const quote = getQuote();
  const quantityLabel = quote.quantity === 1
    ? "1 analógico (avulso)"
    : "par (2 analógicos)";
  const message = [
    "Olá! Encontrei o site da DualFix e gostaria de solicitar um orçamento para meu controle DualSense de PS5. 🎮",
    "",
    "*Meu orçamento*",
    `• Tecnologia: ${quote.product.name}`,
    `• Quantidade: ${quantityLabel}`,
    `• Valor dos analógicos: ${currency.format(quote.analogTotal)}`,
    ...(quote.savings
      ? [`• Economia no par: ${currency.format(quote.savings)}`]
      : []),
    ...(quote.couponApplied
      ? [
          `• Cupom: ${FIRST_ORDER_COUPON}`,
          "• Confirmo que esta é minha primeira compra."
        ]
      : []),
    `• Limpeza preventiva: ${quote.cleaningTotal ? currency.format(quote.cleaningTotal) : "Não incluída"}`,
    `• *Estimativa total: ${currency.format(quote.total)}*`,
    ...(wasReferred.checked
      ? [
          "",
          "*Indicação*",
          `• Nome: ${referrerName.value.trim()}`,
          `• Telefone: ${referrerPhone.value.trim()}`
        ]
      : []),
    "",
    "Sei que o valor pode ser confirmado após avaliação técnica. Poderia me informar a disponibilidade e como faço para levar ou enviar o controle?",
    "",
    "Obrigado!"
  ].join("\n");

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
  window.location.assign(url);
}

document.querySelectorAll("[data-help]").forEach((button) => {
  button.addEventListener("click", () => openHelp(button.dataset.help, button));
});

document.querySelectorAll(".dialog-close").forEach((button) => {
  button.addEventListener("click", closeHelp);
});

guideLink.addEventListener("click", closeHelp);
helpDialog.addEventListener("click", (event) => {
  if (event.target === helpDialog) closeHelp();
});
helpDialog.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    closeHelp();
    return;
  }

  if (event.key === "Tab") {
    const focusableElements = helpDialogPanel.querySelectorAll("a[href], button:not(:disabled)");
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  }
});
applyCouponButton.addEventListener("click", () => {
  couponCode.value = FIRST_ORDER_COUPON;
  updateQuote();
});
wasReferred.addEventListener("change", updateReferralFields);
couponCode.addEventListener("input", updateQuote);
form.addEventListener("change", updateQuote);
whatsappButton.addEventListener("click", () => {
  if (wasReferred.checked && !form.reportValidity()) return;
  sendWhatsAppQuote();
});
updateReferralFields();
updateQuote();

const pageLoader = document.getElementById("page-loader");
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const minimumLoaderTime = reducedMotion ? 250 : 2350;
const loaderStartedAt = performance.now();
let loaderFinished = false;

function finishLoader() {
  if (loaderFinished) return;
  loaderFinished = true;
  const elapsed = performance.now() - loaderStartedAt;
  const remainingTime = Math.max(0, minimumLoaderTime - elapsed);

  window.setTimeout(() => {
    pageLoader.classList.add("is-leaving");
    window.setTimeout(() => {
      pageLoader.hidden = true;
    }, 450);
  }, remainingTime);
}

if (document.readyState === "complete") {
  finishLoader();
} else {
  window.addEventListener("load", finishLoader, { once: true });
  window.setTimeout(finishLoader, 5000);
}
