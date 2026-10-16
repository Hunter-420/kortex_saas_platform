/**
 * KORTEX AI - IN-BROWSER INTERACTIVE AI PLAYGROUND
 * 
 * Delivers realistic token streaming, model switching, task presets,
 * and export utilities for client demonstration.
 */

(function () {
  const config = window.KORTEX_CONFIG.playground;

  // State
  let currentModelId = config.models[0].id;
  let currentTaskId = "seo";
  let isStreaming = false;
  let streamInterval = null;

  // DOM Elements
  const modelTabs = document.querySelectorAll(".model-tab-btn");
  const taskButtons = document.querySelectorAll(".task-preset-btn");
  const modelIndicatorBadge = document.getElementById("modelIndicatorBadge");
  const promptInput = document.getElementById("promptInput");
  const runBtn = document.getElementById("runEngineBtn");
  const consoleOutput = document.getElementById("consoleOutput");
  const tokenCountEl = document.getElementById("tokenCount");
  const latencyValEl = document.getElementById("latencyVal");
  const copyBtn = document.getElementById("copyOutputBtn");
  const exportBtn = document.getElementById("exportJsonBtn");
  const clearBtn = document.getElementById("clearOutputBtn");

  // Initialize Models
  function initModels() {
    modelTabs.forEach(tab => {
      tab.addEventListener("click", () => {
        modelTabs.forEach(t => t.classList.remove("active"));
        tab.classList.add("active");
        currentModelId = tab.dataset.modelId;
        const modelObj = config.models.find(m => m.id === currentModelId);
        if (modelObj && modelIndicatorBadge) {
          modelIndicatorBadge.textContent = `${modelObj.name} • ${modelObj.speed}`;
        }
      });
    });
  }

  // Initialize Tasks
  function initTasks() {
    taskButtons.forEach(btn => {
      btn.addEventListener("click", () => {
        taskButtons.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentTaskId = btn.dataset.taskId;
        const taskData = config.tasks[currentTaskId];
        if (taskData && promptInput) {
          promptInput.value = taskData.prompt;
        }
        triggerGeneration(taskData ? taskData.output : null);
      });
    });
  }

  // Trigger Token Streaming Simulation
  function triggerGeneration(forcedText) {
    if (isStreaming) {
      clearInterval(streamInterval);
      isStreaming = false;
    }

    const taskData = config.tasks[currentTaskId];
    const fullText = forcedText || (taskData ? taskData.output : "Execution complete. Result verified by Kortex Multi-Agent Engine.");
    
    consoleOutput.innerHTML = "";
    isStreaming = true;
    runBtn.disabled = true;
    runBtn.style.opacity = "0.7";
    runBtn.innerHTML = `
      <svg class="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 1s linear infinite;">
        <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
        <path d="M12 2a10 10 0 0 1 10 10"></path>
      </svg>
      Synthesizing...
    `;

    // Dynamic latency calculation
    const startLatency = Math.floor(Math.random() * 40) + 210; // 210ms - 250ms
    latencyValEl.textContent = `${startLatency}ms`;

    let charIndex = 0;
    let tokens = 0;
    const chunkSize = 4; // realistic token chunking

    streamInterval = setInterval(() => {
      if (charIndex < fullText.length) {
        const nextChunk = fullText.slice(charIndex, charIndex + chunkSize);
        charIndex += chunkSize;
        consoleOutput.textContent += nextChunk;
        tokens += Math.round(nextChunk.length / 3.5);
        tokenCountEl.textContent = tokens;
        consoleOutput.scrollTop = consoleOutput.scrollHeight;
      } else {
        clearInterval(streamInterval);
        isStreaming = false;
        runBtn.disabled = false;
        runBtn.style.opacity = "1";
        runBtn.innerHTML = `
          <span>Generate with Engine</span>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        `;
      }
    }, 18);
  }

  // Copy to Clipboard
  function setupClipboard() {
    copyBtn.addEventListener("click", async () => {
      const text = consoleOutput.textContent;
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        const originalText = copyBtn.innerHTML;
        copyBtn.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg> Copied!`;
        copyBtn.style.color = "var(--accent-emerald)";
        setTimeout(() => {
          copyBtn.innerHTML = originalText;
          copyBtn.style.color = "";
        }, 2000);
      } catch (err) {
        console.error("Copy failed", err);
      }
    });
  }

  // Export JSON
  function setupExport() {
    exportBtn.addEventListener("click", () => {
      const payload = {
        model: currentModelId,
        task: currentTaskId,
        prompt: promptInput.value,
        output: consoleOutput.textContent,
        tokensGenerated: parseInt(tokenCountEl.textContent, 10),
        latency: latencyValEl.textContent,
        timestamp: new Date().toISOString(),
        engine: "Kortex Autonomous Multi-Agent v2.4"
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(payload, null, 2));
      const downloadAnchor = document.createElement("a");
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `kortex_ai_${currentTaskId}_result.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  // Clear Output
  function setupClear() {
    clearBtn.addEventListener("click", () => {
      if (isStreaming) {
        clearInterval(streamInterval);
        isStreaming = false;
      }
      consoleOutput.textContent = "";
      tokenCountEl.textContent = "0";
      latencyValEl.textContent = "0ms";
    });
  }

  // Form Submission
  function setupForm() {
    runBtn.addEventListener("click", () => {
      const customPrompt = promptInput.value.trim();
      if (!customPrompt) return;
      triggerGeneration(`### Custom Synthesis by Kortex Engine (${currentModelId})\n\nProcessed query: "${customPrompt}"\n\n- Query deconstructed into 4 atomic agent tasks\n- Ingested semantic vector embeddings\n- Synthesized output adhering to strict zero-data-retention security protocols.`);
    });

    promptInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        runBtn.click();
      }
    });
  }

  // Init all
  document.addEventListener("DOMContentLoaded", () => {
    initModels();
    initTasks();
    setupClipboard();
    setupExport();
    setupClear();
    setupForm();

    // Trigger initial preset output
    const initialTask = config.tasks["seo"];
    if (initialTask && promptInput) {
      promptInput.value = initialTask.prompt;
      triggerGeneration(initialTask.output);
    }
  });
})();
