/**
 * KORTEX AI - MAIN UI COORDINATOR
 * 
 * Handles navigation scroll states, mobile drawer, Command Palette (Ctrl+K / Cmd+K),
 * interactive asymmetric Bento Grid pipeline, multi-language SDK code switcher,
 * FAQ accordion, and live system latency heartbeat.
 */

document.addEventListener("DOMContentLoaded", () => {
  // ========================================================
  // 1. NAVBAR SCROLLED STATE
  // ========================================================
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    if (window.scrollY > 20) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }
  });

  // ========================================================
  // 2. MOBILE MENU DRAWER
  // ========================================================
  const mobileToggleBtn = document.getElementById("mobileToggleBtn");
  const closeDrawerBtn = document.getElementById("closeDrawerBtn");
  const mobileDrawer = document.getElementById("mobileDrawer");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");

  if (mobileToggleBtn && mobileDrawer) {
    mobileToggleBtn.addEventListener("click", () => {
      mobileDrawer.classList.add("open");
    });
  }

  if (closeDrawerBtn && mobileDrawer) {
    closeDrawerBtn.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
    });
  }

  mobileNavLinks.forEach(link => {
    link.addEventListener("click", () => {
      mobileDrawer.classList.remove("open");
    });
  });

  // ========================================================
  // 3. COMMAND PALETTE (Ctrl+K / Cmd+K)
  // ========================================================
  const cmdPaletteModal = document.getElementById("cmdPaletteModal");
  const cmdPaletteTriggerBtn = document.getElementById("cmdPaletteTriggerBtn");
  const cmdSearchInput = document.getElementById("cmdSearchInput");
  const cmdResultsList = document.getElementById("cmdResultsList");
  const authModal = document.getElementById("authModal");

  function openCommandPalette() {
    if (cmdPaletteModal) {
      cmdPaletteModal.classList.add("active");
      document.body.style.overflow = "hidden";
      if (cmdSearchInput) {
        cmdSearchInput.value = "";
        filterCmdItems("");
        setTimeout(() => cmdSearchInput.focus(), 60);
      }
    }
  }

  function closeCommandPalette() {
    if (cmdPaletteModal) {
      cmdPaletteModal.classList.remove("active");
      document.body.style.overflow = "";
    }
  }

  // Keyboard shortcut: Ctrl+K or Cmd+K
  window.addEventListener("keydown", (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      if (cmdPaletteModal && cmdPaletteModal.classList.contains("active")) {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    } else if (e.key === "Escape") {
      if (cmdPaletteModal && cmdPaletteModal.classList.contains("active")) {
        closeCommandPalette();
      }
      if (authModal && authModal.classList.contains("active")) {
        authModal.classList.remove("active");
        document.body.style.overflow = "";
      }
    }
  });

  if (cmdPaletteTriggerBtn) {
    cmdPaletteTriggerBtn.addEventListener("click", openCommandPalette);
  }

  // Backdrop click to close
  if (cmdPaletteModal) {
    cmdPaletteModal.addEventListener("click", (e) => {
      if (e.target === cmdPaletteModal) {
        closeCommandPalette();
      }
    });
  }

  // Filter Command Palette Items
  function filterCmdItems(query) {
    if (!cmdResultsList) return;
    const items = cmdResultsList.querySelectorAll(".cmd-item-row");
    const q = query.toLowerCase().trim();
    items.forEach(item => {
      const text = item.textContent.toLowerCase();
      if (!q || text.includes(q)) {
        item.style.display = "flex";
      } else {
        item.style.display = "none";
      }
    });
  }

  if (cmdSearchInput) {
    cmdSearchInput.addEventListener("input", (e) => {
      filterCmdItems(e.target.value);
    });
  }

  // Handle Command Item Execution
  if (cmdResultsList) {
    const cmdRows = cmdResultsList.querySelectorAll(".cmd-item-row");
    cmdRows.forEach(row => {
      row.addEventListener("click", () => {
        const action = row.dataset.action;
        closeCommandPalette();

        if (action === "goto") {
          const target = row.dataset.target;
          const targetEl = document.querySelector(target);
          if (targetEl) {
            targetEl.scrollIntoView({ behavior: "smooth" });
          }
        } else if (action === "model") {
          const modelId = row.dataset.model;
          const targetTab = document.querySelector(`.model-tab-btn[data-model-id="${modelId}"]`);
          if (targetTab) {
            targetTab.click();
            const playgroundSection = document.getElementById("playground");
            if (playgroundSection) playgroundSection.scrollIntoView({ behavior: "smooth" });
          }
        } else if (action === "auth") {
          if (authModal) {
            authModal.classList.add("active");
            document.body.style.overflow = "hidden";
          }
        }
      });
    });
  }

  // ========================================================
  // 4. BENTO GRID - INTERACTIVE PIPELINE GRAPH
  // ========================================================
  const pipelineNodes = document.querySelectorAll(".pipeline-node");
  pipelineNodes.forEach(node => {
    node.addEventListener("click", () => {
      pipelineNodes.forEach(n => n.classList.remove("active"));
      node.classList.add("active");
    });
  });

  // ========================================================
  // 5. BENTO GRID - MULTI-LANGUAGE SDK CODE SWITCHER
  // ========================================================
  const sdkSnippets = {
    curl: `curl -X POST https://api.kortex.ai/v1/swarms/deploy \\
  -H "Authorization: Bearer $KORTEX_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "model": "claude-3-5-sonnet",
    "tasks": ["research", "generate_code", "verify_ast"],
    "stream": true
  }'`,
    python: `import kortex

client = kortex.Client(api_key="krtx_live_9941a8b")
swarm = client.swarms.deploy(
    model="claude-3-5-sonnet",
    agents=["researcher", "refactor_engine", "verifier"]
)

for event in swarm.stream("audit src/ --mode enterprise"):
    print(f"[{event.stage}] {event.output}")`,
    typescript: `import { KortexClient } from '@kortex-ai/sdk';

const kortex = new KortexClient({ apiKey: process.env.KORTEX_KEY });
const swarm = await kortex.swarms.create({
  orchestration: 'dual_consensus',
  models: ['claude-3-5-sonnet', 'gpt-4o'],
  edgeRouting: true
});

swarm.on('token', (chunk) => process.stdout.write(chunk));`,
    go: `package main

import (
    "context"
    "fmt"
    "github.com/kortex-ai/sdk-go"
)

func main() {
    client := kortex.NewClient("krtx_live_9941a8b")
    stream, err := client.Swarms.Stream(context.Background(), &kortex.SwarmParams{
        Model: "claude-3-5-sonnet",
        Task:  "security_audit",
    })
    for stream.Next() {
        fmt.Print(stream.Token())
    }
}`
  };

  const sdkTabButtons = document.querySelectorAll(".code-tab-btn");
  const sdkCodeDisplay = document.getElementById("sdkCodeDisplay");
  const copySdkCodeBtn = document.getElementById("copySdkCodeBtn");
  let activeLang = "curl";

  sdkTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sdkTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeLang = btn.dataset.lang;
      if (sdkCodeDisplay && sdkSnippets[activeLang]) {
        sdkCodeDisplay.querySelector("code").textContent = sdkSnippets[activeLang];
      }
    });
  });

  if (copySdkCodeBtn && sdkCodeDisplay) {
    copySdkCodeBtn.addEventListener("click", async () => {
      const codeText = sdkSnippets[activeLang] || sdkCodeDisplay.textContent;
      try {
        await navigator.clipboard.writeText(codeText);
        const originalHTML = copySdkCodeBtn.innerHTML;
        copySdkCodeBtn.innerHTML = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> <span>Copied!</span>`;
        copySdkCodeBtn.style.borderColor = "var(--accent-emerald)";
        copySdkCodeBtn.style.color = "var(--accent-emerald)";
        setTimeout(() => {
          copySdkCodeBtn.innerHTML = originalHTML;
          copySdkCodeBtn.style.borderColor = "";
          copySdkCodeBtn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("SDK copy failed", err);
      }
    });
  }

  // ========================================================
  // 6. FAQ ACCORDION
  // ========================================================
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question-btn");
    const answer = item.querySelector(".faq-answer");

    btn.addEventListener("click", () => {
      const isActive = item.classList.contains("active");

      // Close all other FAQs for clean single-view accordion
      faqItems.forEach(otherItem => {
        otherItem.classList.remove("active");
        const otherAnswer = otherItem.querySelector(".faq-answer");
        if (otherAnswer) otherAnswer.style.maxHeight = null;
      });

      if (!isActive) {
        item.classList.add("active");
        answer.style.maxHeight = answer.scrollHeight + 30 + "px";
      }
    });
  });

  // Open first FAQ by default
  if (faqItems.length > 0) {
    faqItems[0].classList.add("active");
    const firstAnswer = faqItems[0].querySelector(".faq-answer");
    if (firstAnswer) firstAnswer.style.maxHeight = firstAnswer.scrollHeight + 30 + "px";
  }

  // ========================================================
  // 7. SYSTEM LATENCY LIVE HEARTBEAT
  // ========================================================
  const statusPill = document.querySelector(".system-status-pill");
  if (statusPill) {
    setInterval(() => {
      const ms = Math.floor(Math.random() * 8) + 34;
      statusPill.innerHTML = `<span class="status-dot"></span> Systems Normal • ${ms}ms`;
    }, 4500);
  }
});
