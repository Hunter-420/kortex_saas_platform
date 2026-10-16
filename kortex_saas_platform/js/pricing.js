/**
 * KORTEX AI - DYNAMIC PRICING ENGINE
 * 
 * Handles monthly vs annual discount calculations, billing period switches,
 * and plan selection flows.
 */

(function () {
  const pricingConfig = window.KORTEX_CONFIG.pricing;

  // DOM Elements
  const billingToggle = document.getElementById("billingToggle");
  const monthlyLabel = document.getElementById("monthlyLabel");
  const annualLabel = document.getElementById("annualLabel");
  const starterPriceEl = document.getElementById("starterPrice");
  const proPriceEl = document.getElementById("proPrice");
  const enterprisePriceEl = document.getElementById("enterprisePrice");
  const planPeriodLabels = document.querySelectorAll(".plan-period");

  let isAnnual = false;

  function updatePrices() {
    const plans = pricingConfig.plans;
    if (isAnnual) {
      if (starterPriceEl) starterPriceEl.textContent = plans.starter.annualPrice;
      if (proPriceEl) proPriceEl.textContent = plans.pro.annualPrice;
      if (enterprisePriceEl) enterprisePriceEl.textContent = plans.enterprise.annualPrice;
      
      planPeriodLabels.forEach(lbl => {
        lbl.textContent = "/mo (billed annually)";
      });
      annualLabel.classList.add("active");
      monthlyLabel.classList.remove("active");
    } else {
      if (starterPriceEl) starterPriceEl.textContent = plans.starter.monthlyPrice;
      if (proPriceEl) proPriceEl.textContent = plans.pro.monthlyPrice;
      if (enterprisePriceEl) enterprisePriceEl.textContent = plans.enterprise.monthlyPrice;

      planPeriodLabels.forEach(lbl => {
        lbl.textContent = "/month";
      });
      monthlyLabel.classList.add("active");
      annualLabel.classList.remove("active");
    }
  }

  document.addEventListener("DOMContentLoaded", () => {
    if (billingToggle) {
      billingToggle.addEventListener("change", (e) => {
        isAnnual = e.target.checked;
        updatePrices();
      });
    }

    if (monthlyLabel) {
      monthlyLabel.addEventListener("click", () => {
        if (billingToggle.checked) {
          billingToggle.checked = false;
          isAnnual = false;
          updatePrices();
        }
      });
    }

    if (annualLabel) {
      annualLabel.addEventListener("click", () => {
        if (!billingToggle.checked) {
          billingToggle.checked = true;
          isAnnual = true;
          updatePrices();
        }
      });
    }

    // Set initial display
    updatePrices();
  });
})();
