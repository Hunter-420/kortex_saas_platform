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

    // ========================================================
    // ROI & TOKEN VOLUME CALCULATOR
    // ========================================================
    const roiTokenSlider = document.getElementById("roiTokenSlider");
    const sliderTokenDisplay = document.getElementById("sliderTokenDisplay");
    const calcTasksVal = document.getElementById("calcTasksVal");
    const calcRawCostVal = document.getElementById("calcRawCostVal");
    const calcTierVal = document.getElementById("calcTierVal");
    const calcSavingsVal = document.getElementById("calcSavingsVal");

    function updateRoiCalculator(tokens) {
      if (!roiTokenSlider) return;

      const numTokens = parseInt(tokens, 10);
      if (sliderTokenDisplay) {
        sliderTokenDisplay.textContent = numTokens.toLocaleString() + " Tokens";
      }

      // Estimate tasks (~250 tokens per verified agent step)
      const tasks = Math.round(numTokens / 250);
      if (calcTasksVal) {
        calcTasksVal.textContent = "~" + tasks.toLocaleString() + " tasks";
      }

      // Raw unoptimized API cost (average $0.15 per 1k blended tokens)
      const rawCost = Math.round((numTokens / 1000) * 0.15);
      if (calcRawCostVal) {
        calcRawCostVal.textContent = "$" + rawCost.toLocaleString() + " / mo";
      }

      // Determine recommended tier & savings
      let planName = "Pro Builder ($79/mo)";
      let planCost = 79;
      if (numTokens <= 300000) {
        planName = "Starter ($29/mo)";
        planCost = 29;
      } else if (numTokens > 2000000) {
        planName = "Enterprise ($249/mo)";
        planCost = 249;
      }

      const savings = Math.max(0, rawCost - planCost);
      const savingsPct = rawCost > 0 ? Math.round((savings / rawCost) * 100) : 0;

      if (calcTierVal) {
        calcTierVal.textContent = planName;
      }
      if (calcSavingsVal) {
        calcSavingsVal.textContent = `You save ~$${savings.toLocaleString()}/mo (${savingsPct}% efficiency)`;
      }

      // Highlight recommended pricing box
      const pricingBoxes = document.querySelectorAll(".pricing-box");
      pricingBoxes.forEach(box => {
        const title = box.querySelector(".p-plan-title")?.textContent.toLowerCase() || "";
        if (numTokens <= 300000 && title.includes("starter")) {
          box.classList.add("highlight");
        } else if (numTokens > 300000 && numTokens <= 2000000 && title.includes("pro")) {
          box.classList.add("highlight");
        } else if (numTokens > 2000000 && title.includes("enterprise")) {
          box.classList.add("highlight");
        } else {
          box.classList.remove("highlight");
        }
      });
    }

    if (roiTokenSlider) {
      roiTokenSlider.addEventListener("input", (e) => {
        updateRoiCalculator(e.target.value);
      });
      // Initial calculation
      updateRoiCalculator(roiTokenSlider.value);
    }

    // Set initial display
    updatePrices();
  });
})();
