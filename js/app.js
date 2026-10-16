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
    curl: `<span class="c-fn">curl</span> -X POST https://api.kortex.ai/v1/swarms/deploy \\
  -H <span class="c-str">"Authorization: Bearer $KORTEX_API_KEY"</span> \\
  -H <span class="c-str">"Content-Type: application/json"</span> \\
  -d <span class="c-str">'{
    "model": "claude-3-5-sonnet",
    "tasks": ["research", "generate_code", "verify_ast"],
    "stream": true
  }'</span>`,
    python: `<span class="c-kw">import</span> kortex

client = kortex.<span class="c-fn">Client</span>(api_key=<span class="c-str">"krtx_live_9941a8b"</span>)
swarm = client.swarms.<span class="c-fn">deploy</span>(
    model=<span class="c-str">"claude-3-5-sonnet"</span>,
    agents=[<span class="c-str">"researcher"</span>, <span class="c-str">"refactor_engine"</span>, <span class="c-str">"verifier"</span>]
)

<span class="c-kw">for</span> event <span class="c-kw">in</span> swarm.<span class="c-fn">stream</span>(<span class="c-str">"audit src/ --mode enterprise"</span>):
    <span class="c-fn">print</span>(<span class="c-str">f"[{event.stage}] {event.output}"</span>)`,
    typescript: `<span class="c-kw">import</span> { <span class="c-type">KortexClient</span> } <span class="c-kw">from</span> <span class="c-str">'@kortex-ai/sdk'</span>;

<span class="c-kw">const</span> kortex = <span class="c-kw">new</span> <span class="c-type">KortexClient</span>({ apiKey: process.env.KORTEX_KEY });
<span class="c-kw">const</span> swarm = <span class="c-kw">await</span> kortex.swarms.<span class="c-fn">create</span>({
  orchestration: <span class="c-str">'dual_consensus'</span>,
  models: [<span class="c-str">'claude-3-5-sonnet'</span>, <span class="c-str">'gpt-4o'</span>],
  edgeRouting: <span class="c-bool">true</span>
});

swarm.<span class="c-fn">on</span>(<span class="c-str">'token'</span>, (chunk) =&gt; process.stdout.<span class="c-fn">write</span>(chunk));`,
    go: `<span class="c-kw">package</span> main

<span class="c-kw">import</span> (
    <span class="c-str">"context"</span>
    <span class="c-str">"fmt"</span>
    <span class="c-str">"github.com/kortex-ai/sdk-go"</span>
)

<span class="c-kw">func</span> <span class="c-fn">main</span>() {
    client := kortex.<span class="c-fn">NewClient</span>(<span class="c-str">"krtx_live_9941a8b"</span>)
    stream, err := client.Swarms.<span class="c-fn">Stream</span>(context.<span class="c-fn">Background</span>(), &amp;kortex.<span class="c-type">SwarmParams</span>{
        Model: <span class="c-str">"claude-3-5-sonnet"</span>,
        Task:  <span class="c-str">"security_audit"</span>,
    })
    <span class="c-kw">for</span> stream.<span class="c-fn">Next</span>() {
        fmt.<span class="c-fn">Print</span>(stream.<span class="c-fn">Token</span>())
    }
}`
  };

  const sdkRawText = {
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

  // Initial set
  if (sdkCodeDisplay && sdkSnippets[activeLang]) {
    sdkCodeDisplay.querySelector("code").innerHTML = sdkSnippets[activeLang];
  }

  sdkTabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      sdkTabButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      activeLang = btn.dataset.lang;
      if (sdkCodeDisplay && sdkSnippets[activeLang]) {
        sdkCodeDisplay.querySelector("code").innerHTML = sdkSnippets[activeLang];
      }
    });
  });

  if (copySdkCodeBtn && sdkCodeDisplay) {
    copySdkCodeBtn.addEventListener("click", async () => {
      const codeText = sdkRawText[activeLang] || sdkCodeDisplay.textContent;
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
  // HERO DEVELOPER STUDIO WORKSPACE CONTROLS
  // ========================================================
  const studioTabBtns = document.querySelectorAll("#heroStudioTabs .studio-tab-btn");
  const studioViews = {
    pipeline: document.getElementById("studioViewPipeline"),
    stream: document.getElementById("studioViewStream"),
    telemetry: document.getElementById("studioViewTelemetry")
  };

  studioTabBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      studioTabBtns.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      const viewKey = btn.dataset.studioView;
      Object.keys(studioViews).forEach(key => {
        if (studioViews[key]) {
          if (key === viewKey) {
            studioViews[key].classList.add("active");
          } else {
            studioViews[key].classList.remove("active");
          }
        }
      });
    });
  });

  const studioRailItems = document.querySelectorAll(".studio-rail-item");
  studioRailItems.forEach(item => {
    item.addEventListener("click", () => {
      studioRailItems.forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    });
  });

  const studioExecuteBtn = document.getElementById("studioExecuteBtn");
  const toastNotification = document.getElementById("toastNotification");
  const toastMessage = document.getElementById("toastMessage");

  function showToast(msg) {
    if (toastNotification && toastMessage) {
      toastMessage.textContent = msg;
      toastNotification.classList.add("show");
      setTimeout(() => {
        toastNotification.classList.remove("show");
      }, 3500);
    }
  }

  if (studioExecuteBtn) {
    studioExecuteBtn.addEventListener("click", () => {
      const origText = studioExecuteBtn.innerHTML;
      studioExecuteBtn.innerHTML = `<span>Deploying Swarm...</span>`;
      studioExecuteBtn.disabled = true;

      const dagCards = document.querySelectorAll(".studio-dag-card");
      dagCards.forEach(c => c.style.borderColor = "var(--accent-cyan)");

      setTimeout(() => {
        studioExecuteBtn.innerHTML = origText;
        studioExecuteBtn.disabled = false;
        dagCards.forEach(c => c.style.borderColor = "");
        showToast("Swarm #SWRM-98402 successfully dispatched to edge cluster (34ms)");
      }, 1000);
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
