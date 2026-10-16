const puppeteer = require('/home/rusty/.gemini/antigravity-cli/brain/f361e0dc-a29a-41d7-9ef1-e2503dd4a08b/scratch/node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUTPUT_DIR = '/home/rusty/Desktop/gig2_kortex_ai_saas/gallery_and_assets';

// Shared CSS styles for all 1280x769 showcase graphics
const SHARED_CSS = `
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  body {
    width: 1280px;
    height: 769px;
    overflow: hidden;
    background-color: #06080E;
    background-image: 
      radial-gradient(ellipse 65% 55% at 50% 0%, rgba(99, 102, 241, 0.15) 0%, transparent 70%),
      radial-gradient(ellipse 45% 40% at 85% 15%, rgba(0, 242, 254, 0.12) 0%, transparent 60%),
      radial-gradient(circle at 1px 1px, rgba(255, 255, 255, 0.05) 1px, transparent 0);
    background-size: 100% 100%, 100% 100%, 28px 28px;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    color: #F8FAFC;
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 28px 36px 20px;
    -webkit-font-smoothing: antialiased;
  }

  /* Header Section */
  .slide-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 18px;
    z-index: 10;
  }

  .header-left {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .pill-badge {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 242, 254, 0.08);
    border: 1px solid rgba(0, 242, 254, 0.25);
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    color: #00F2FE;
    letter-spacing: 0.05em;
    width: fit-content;
  }

  .slide-title {
    font-size: 26px;
    font-weight: 800;
    letter-spacing: -0.025em;
    color: #FFFFFF;
    line-height: 1.15;
  }

  .gradient-span {
    background: linear-gradient(135deg, #00F2FE 0%, #4FACFE 50%, #6366F1 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .slide-subtitle {
    font-size: 13px;
    color: #94A3B8;
    font-weight: 500;
  }

  .header-right {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .seller-trust-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.04);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 6px 14px;
    border-radius: 8px;
  }

  .seller-rating {
    display: flex;
    align-items: center;
    gap: 3px;
    color: #F59E0B;
    font-weight: 700;
    font-size: 12px;
  }

  .seller-label {
    font-size: 11px;
    color: #CBD5E1;
    font-weight: 600;
  }

  /* Mockup Window Canvas */
  .mockup-window {
    flex: 1;
    background: #090C16;
    border: 1px solid rgba(255, 255, 255, 0.12);
    border-radius: 12px;
    box-shadow: 0 25px 60px -10px rgba(0, 0, 0, 0.85), 0 0 40px rgba(0, 242, 254, 0.08);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    z-index: 5;
  }

  .window-topbar {
    background: #0D111E;
    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
    padding: 8px 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .window-dots {
    display: flex;
    gap: 7px;
  }
  .dot { width: 10px; height: 10px; border-radius: 50%; }
  .dot-red { background: #EF4444; }
  .dot-yellow { background: #F59E0B; }
  .dot-green { background: #10B981; }

  .window-address-bar {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(0, 0, 0, 0.4);
    border: 1px solid rgba(255, 255, 255, 0.06);
    border-radius: 6px;
    padding: 3px 14px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    color: #94A3B8;
  }

  .window-status-pill {
    display: flex;
    align-items: center;
    gap: 6px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    color: #10B981;
    background: rgba(16, 185, 129, 0.1);
    border: 1px solid rgba(16, 185, 129, 0.25);
    padding: 2px 10px;
    border-radius: 9999px;
  }
  .status-pulse {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #10B981;
    box-shadow: 0 0 6px #10B981;
  }

  /* Footer Tech Stack Bar */
  .slide-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    z-index: 10;
  }

  .tech-pills-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .tech-pill {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.08);
    padding: 4px 10px;
    border-radius: 6px;
    font-size: 11px;
    font-weight: 600;
    color: #CBD5E1;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .guarantee-badge {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 11px;
    font-weight: 700;
    color: #10B981;
    background: rgba(16, 185, 129, 0.08);
    border: 1px solid rgba(16, 185, 129, 0.2);
    padding: 4px 12px;
    border-radius: 6px;
  }

  /* Floating Feature Callout Badges */
  .floating-badge {
    position: absolute;
    background: rgba(13, 17, 30, 0.95);
    backdrop-filter: blur(8px);
    border: 1px solid rgba(0, 242, 254, 0.35);
    border-radius: 8px;
    padding: 6px 12px;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.6), 0 0 15px rgba(0, 242, 254, 0.15);
    z-index: 20;
    font-size: 11.5px;
    font-weight: 700;
    color: #FFFFFF;
  }
  .fb-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 6px;
    background: rgba(0, 242, 254, 0.15);
    color: #00F2FE;
  }
`;

// Slide 1: Main Gig Showcase (Hero Studio Workspace)
const SLIDE_1_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${SHARED_CSS}
    .studio-grid {
      display: grid;
      grid-template-columns: 210px 1fr 200px;
      height: 100%;
      background: #080A12;
    }
    .s-left-rail {
      background: #090C16;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 14px;
    }
    .s-rail-title {
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      font-weight: 700;
      color: #64748B;
      letter-spacing: 0.12em;
    }
    .s-rail-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 6px 8px;
      border-radius: 6px;
      font-size: 11.5px;
      font-weight: 600;
      color: #94A3B8;
    }
    .s-rail-item.active {
      background: rgba(0, 242, 254, 0.08);
      color: #00F2FE;
      border-left: 2px solid #00F2FE;
    }
    .s-quota-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 6px;
      padding: 10px;
      margin-top: auto;
    }
    .s-quota-track {
      height: 5px;
      background: rgba(255, 255, 255, 0.08);
      border-radius: 3px;
      overflow: hidden;
      margin: 6px 0;
    }
    .s-quota-fill {
      width: 64%;
      height: 100%;
      background: linear-gradient(90deg, #00F2FE, #6366F1);
    }
    .s-canvas {
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #080A12;
    }
    .s-dag-grid {
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .s-dag-card {
      flex: 1;
      background: rgba(255, 255, 255, 0.025);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 4px;
    }
    .s-dag-card.active {
      border-color: #00F2FE;
      background: rgba(0, 242, 254, 0.04);
    }
    .dag-head {
      display: flex;
      justify-content: space-between;
      font-family: 'JetBrains Mono', monospace;
      font-size: 9px;
      color: #64748B;
      font-weight: 700;
    }
    .dag-badge {
      padding: 1px 5px;
      border-radius: 3px;
      font-size: 8.5px;
      font-weight: 700;
    }
    .dag-badge.done { background: rgba(16, 185, 129, 0.15); color: #10B981; }
    .dag-badge.run { background: rgba(0, 242, 254, 0.15); color: #00F2FE; }
    .dag-title { font-size: 11.5px; font-weight: 700; color: #FFFFFF; }
    .dag-desc { font-size: 9.5px; color: #94A3B8; line-height: 1.3; }
    .s-code-box {
      background: #05070D;
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 12px 14px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11px;
      line-height: 1.6;
    }
    .c-kw { color: #C084FC; font-weight: 700; }
    .c-fn { color: #67E8F9; }
    .c-type { color: #93C5FD; }
    .c-str { color: #86EFAC; }
    .c-bool { color: #F472B6; font-weight: 700; }
    .c-num { color: #FBBF24; }
    .s-right-rail {
      background: #090C16;
      border-left: 1px solid rgba(255, 255, 255, 0.08);
      padding: 14px;
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    .inspect-row {
      display: flex;
      justify-content: space-between;
      font-size: 10.5px;
      padding: 3px 0;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
    }
    .inspect-lbl { color: #64748B; }
    .inspect-val { font-family: 'JetBrains Mono', monospace; color: #FFFFFF; font-weight: 600; }
    .tool-chip {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 10.5px;
      padding: 3px 0;
    }
    .tool-dot { width: 5px; height: 5px; border-radius: 50%; background: #10B981; margin-right: 5px; display: inline-block; }
  </style>
</head>
<body>
  <!-- Header -->
  <div class="slide-header">
    <div class="header-left">
      <div class="pill-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span>TOP-RATED FULL STACK SAAS SERVICE</span>
      </div>
      <h1 class="slide-title">PRODUCTION-READY <span class="gradient-span">AI SAAS WEB APP</span></h1>
      <p class="slide-subtitle">Multi-Tenant Architecture • Multi-Model LLM Streaming • Vector RAG • Stripe &amp; Google OAuth</p>
    </div>
    <div class="header-right">
      <div class="seller-trust-badge">
        <div class="seller-rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="#F59E0B"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>5.0</span>
        </div>
        <span class="seller-label">100% Client Satisfaction</span>
      </div>
    </div>
  </div>

  <!-- Center Mockup Window -->
  <div class="mockup-window">
    <div class="window-topbar">
      <div class="window-dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
      </div>
      <div class="window-address-bar">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
        <span>https://app.kortex.ai/workspace/swarm-orchestrator</span>
      </div>
      <div class="window-status-pill">
        <span class="status-pulse"></span>
        <span>EDGE MESH ACTIVE • 34ms</span>
      </div>
    </div>

    <!-- 3-Column Studio Body -->
    <div class="studio-grid">
      <!-- Left Rail -->
      <div class="s-left-rail">
        <div class="s-rail-title">NAVIGATION</div>
        <div class="s-rail-item active">
          <span>Agent Swarms</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 9px; color: #00F2FE;">4 LIVE</span>
        </div>
        <div class="s-rail-item">
          <span>Token Workbench</span>
        </div>
        <div class="s-rail-item">
          <span>Vector DB &amp; RAG</span>
        </div>
        <div class="s-rail-item">
          <span>API Keys &amp; Webhooks</span>
        </div>

        <div class="s-quota-box">
          <div style="display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; color: #CBD5E1;">
            <span>Monthly Quota</span>
            <span style="color: #00F2FE;">64%</span>
          </div>
          <div class="s-quota-track"><div class="s-quota-fill"></div></div>
          <div style="font-family: 'JetBrains Mono'; font-size: 9px; color: #64748B;">84,200 / 150,000 tok</div>
        </div>
      </div>

      <!-- Center Stage Canvas -->
      <div class="s-canvas">
        <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 8px;">
          <div style="font-size: 12px; font-weight: 700; color: #FFFFFF;">
            Pipeline #SWRM-98402 &bull; <span style="color: #00F2FE;">Autonomous Microservice Deploy</span>
          </div>
          <div style="font-family: 'JetBrains Mono'; font-size: 10px; color: #10B981;">Latency: 34ms &bull; Model: Claude 3.5 Sonnet</div>
        </div>

        <!-- 4 DAG Nodes -->
        <div class="s-dag-grid">
          <div class="s-dag-card">
            <div class="dag-head"><span>01 / VECTOR</span><span class="dag-badge done">14ms</span></div>
            <div class="dag-title">Pinecone RAG</div>
            <div class="dag-desc">3,410 embeddings indexed. Cosine 0.94.</div>
          </div>
          <div class="s-dag-card">
            <div class="dag-head"><span>02 / REASONING</span><span class="dag-badge done">140 t/s</span></div>
            <div class="dag-title">Claude 3.5</div>
            <div class="dag-desc">Generated TypeScript microservice schema.</div>
          </div>
          <div class="s-dag-card">
            <div class="dag-head"><span>03 / VERIFY</span><span class="dag-badge done">PASS</span></div>
            <div class="dag-title">Sandboxed AST</div>
            <div class="dag-desc">0 vulnerabilities detected. Null checks ok.</div>
          </div>
          <div class="s-dag-card active">
            <div class="dag-head"><span>04 / EMIT</span><span class="dag-badge run">HTTP 200</span></div>
            <div class="dag-title">Edge Webhook</div>
            <div class="dag-desc">Dispatched to 312 edge serverless nodes.</div>
          </div>
        </div>

        <!-- Code Snippet -->
        <div class="s-code-box">
          <span class="c-kw">export async function</span> <span class="c-fn">handleSwarmEvent</span>(req: <span class="c-type">Request</span>): <span class="c-type">Promise&lt;Response&gt;</span> {<br>
          &nbsp;&nbsp;<span class="c-kw">const</span> { swarmId, tokens } = <span class="c-kw">await</span> req.json();<br>
          &nbsp;&nbsp;<span class="c-kw">const</span> result = <span class="c-kw">await</span> kortex.verifyAndExecute({ swarmId, zdrStrict: <span class="c-bool">true</span> });<br>
          &nbsp;&nbsp;<span class="c-kw">return</span> Response.json({ success: <span class="c-bool">true</span>, latencyMs: <span class="c-num">34</span>, payload: result });<br>
          }
        </div>
      </div>

      <!-- Right Inspector -->
      <div class="s-right-rail">
        <div class="s-rail-title">AGENT INSPECTOR</div>
        <div class="inspect-row"><span class="inspect-lbl">Model</span><span class="inspect-val">Claude 3.5</span></div>
        <div class="inspect-row"><span class="inspect-lbl">Temp</span><span class="inspect-val">0.20</span></div>
        <div class="inspect-row"><span class="inspect-lbl">Context</span><span class="inspect-val">200k tokens</span></div>
        <div class="inspect-row"><span class="inspect-lbl">ZDR Policy</span><span class="inspect-val" style="color: #10B981;">Strict SOC-2</span></div>

        <div class="s-rail-title" style="margin-top: 6px;">TOOL STATUS</div>
        <div class="tool-chip"><div><span class="tool-dot"></span><span>Pinecone</span></div><span style="font-family: 'JetBrains Mono'; font-size: 9px; color: #10B981;">Connected</span></div>
        <div class="tool-chip"><div><span class="tool-dot"></span><span>PostgreSQL</span></div><span style="font-family: 'JetBrains Mono'; font-size: 9px; color: #10B981;">Connected</span></div>
        <div class="tool-chip"><div><span class="tool-dot"></span><span>Stripe Webhooks</span></div><span style="font-family: 'JetBrains Mono'; font-size: 9px; color: #10B981;">Active</span></div>
      </div>
    </div>
  </div>

  <!-- Floating Callouts (Clean bottom badges) -->
  <div class="floating-badge" style="bottom: 75px; left: 240px;">
    <div class="fb-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="1" y="4" width="22" height="16" rx="2" ry="2"></rect><line x1="1" y1="10" x2="23" y2="10"></line></svg></div>
    <span>Stripe Subscriptions &amp; Usage Credits</span>
  </div>

  <div class="floating-badge" style="bottom: 75px; right: 240px;">
    <div class="fb-icon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div>
    <span>Google Identity OAuth 2.0 &amp; ZDR</span>
  </div>

  <!-- Footer Tech Stack -->
  <div class="slide-footer">
    <div class="tech-pills-row">
      <div class="tech-pill">Next.js 14</div>
      <div class="tech-pill">React</div>
      <div class="tech-pill">TypeScript</div>
      <div class="tech-pill">TailwindCSS</div>
      <div class="tech-pill">Python FastAPI</div>
      <div class="tech-pill">Claude 3.5 &amp; GPT-4o</div>
      <div class="tech-pill">Pinecone RAG</div>
      <div class="tech-pill">Stripe</div>
    </div>
    <div class="guarantee-badge">
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
      <span>100% Working Code &bull; Turnkey Delivery</span>
    </div>
  </div>
</body>
</html>
`;

// Slide 2: Interactive AI Agent Studio & Token Streaming
const SLIDE_2_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${SHARED_CSS}
    .split-layout {
      display: grid;
      grid-template-columns: 360px 1fr;
      height: 100%;
      background: #080A12;
    }
    .controls-col {
      background: #0A0D18;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .model-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 10px 14px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .model-card.active {
      background: rgba(0, 242, 254, 0.08);
      border-color: #00F2FE;
    }
    .output-col {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 14px;
      background: #06080F;
    }
    .terminal-output {
      flex: 1;
      background: rgba(0, 0, 0, 0.5);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      line-height: 1.7;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="slide-header">
    <div class="header-left">
      <div class="pill-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span>MULTI-MODEL AI STREAMING ENGINE</span>
      </div>
      <h1 class="slide-title">AUTONOMOUS AGENT <span class="gradient-span">STREAMING PLAYGROUND</span></h1>
      <p class="slide-subtitle">Claude 3.5 Sonnet (140 t/s) • GPT-4o Omnimodal • Pinecone Vector Retrieval (14ms)</p>
    </div>
    <div class="header-right">
      <div class="seller-trust-badge">
        <span class="seller-label">Real-Time LLM Token Streaming</span>
      </div>
    </div>
  </div>

  <div class="mockup-window">
    <div class="window-topbar">
      <div class="window-dots">
        <span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span>
      </div>
      <div class="window-address-bar">
        <span>https://app.kortex.ai/console/token-streamer</span>
      </div>
      <div class="window-status-pill">
        <span class="status-pulse"></span>
        <span>STREAMING 140 TOKENS/SEC</span>
      </div>
    </div>

    <div class="split-layout">
      <div class="controls-col">
        <div style="font-family: 'JetBrains Mono'; font-size: 10px; color: #64748B; font-weight: 700;">FOUNDATION MODEL SELECTOR</div>
        <div class="model-card active">
          <div>
            <div style="font-size: 12.5px; font-weight: 700; color: #FFFFFF;">Claude 3.5 Sonnet</div>
            <div style="font-size: 10.5px; color: #64748B;">Anthropic • 140 tokens/sec</div>
          </div>
          <span style="font-family: 'JetBrains Mono'; font-size: 10px; color: #00F2FE;">ACTIVE</span>
        </div>
        <div class="model-card">
          <div>
            <div style="font-size: 12.5px; font-weight: 700; color: #CBD5E1;">GPT-4o Omnimodal</div>
            <div style="font-size: 10.5px; color: #64748B;">OpenAI • 110 tokens/sec</div>
          </div>
          <span style="font-family: 'JetBrains Mono'; font-size: 10px; color: #64748B;">STANDBY</span>
        </div>
        <div class="model-card">
          <div>
            <div style="font-size: 12.5px; font-weight: 700; color: #CBD5E1;">Gemini 1.5 Pro</div>
            <div style="font-size: 10.5px; color: #64748B;">Google • 2M Context Window</div>
          </div>
          <span style="font-family: 'JetBrains Mono'; font-size: 10px; color: #64748B;">READY</span>
        </div>

        <div style="font-family: 'JetBrains Mono'; font-size: 10px; color: #64748B; font-weight: 700; margin-top: 8px;">ACTIVE AGENT PRESETS</div>
        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 10px; font-size: 11.5px; color: #CBD5E1;">
          &bull; Autonomous Code Refactor &amp; Security Audit<br>
          &bull; Pinecone Semantic Search &amp; Document Q&amp;A<br>
          &bull; Deterministic SQL Query Optimization
        </div>
      </div>

      <div class="output-col">
        <div style="display: flex; justify-content: space-between; font-family: 'JetBrains Mono'; font-size: 11px;">
          <span>Tokens Streamed: <strong style="color: #00F2FE;">1,420</strong></span>
          <span>Time to First Token: <strong style="color: #10B981;">34ms</strong></span>
          <span>Consensus Score: <strong style="color: #10B981;">99.8%</strong></span>
        </div>
        <div class="terminal-output">
          <span style="color: #6366F1;">[STAGE 01 &bull; RETRIEVAL]</span> Connecting to Pinecone vector index 'enterprise-docs-v2'...<br>
          &rarr; Cosine similarity lookup complete: 18 high-confidence chunks retrieved (14ms)<br><br>
          <span style="color: #00F2FE;">[STAGE 02 &bull; SYNTHESIS]</span> Claude 3.5 Sonnet streaming generation at 140 t/s:<br>
          <span style="color: #E2E8F0;">
          const authMiddleware = async (req: Request, next: NextFunction) =&gt; {<br>
          &nbsp;&nbsp;const token = req.headers.authorization?.split(" ")[1];<br>
          &nbsp;&nbsp;if (!token) return res.status(401).json({ error: "Unauthorized" });<br>
          &nbsp;&nbsp;const user = await verifySupabaseJwt(token);<br>
          &nbsp;&nbsp;return next();<br>
          };
          </span><br>
          <span style="color: #10B981;">[STAGE 03 &bull; SECURITY AUDIT]</span> Sandboxed AST parser verified: 0 CVEs detected. Zero Data Retention confirmed.
        </div>
        <div style="display: flex; gap: 10px; align-items: center; background: rgba(0,0,0,0.5); border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 6px 12px;">
          <span style="font-family: 'JetBrains Mono'; font-size: 11px; color: #00F2FE;">&gt;</span>
          <span style="flex: 1; font-family: 'JetBrains Mono'; font-size: 11px; color: #FFFFFF;">Run autonomous multi-agent AST audit and dispatch to serverless edge cluster</span>
          <div style="background: #00F2FE; color: #000; font-weight: 700; font-size: 10.5px; padding: 4px 12px; border-radius: 4px;">Execute Swarm &rarr;</div>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="tech-pills-row">
      <div class="tech-pill">Real-Time WebSockets</div>
      <div class="tech-pill">SSE Streaming</div>
      <div class="tech-pill">Pinecone Vector DB</div>
      <div class="tech-pill">LangChain</div>
      <div class="tech-pill">OpenAI SDK</div>
      <div class="tech-pill">Anthropic SDK</div>
    </div>
    <div class="guarantee-badge">
      <span>Sub-50ms Edge Response Guarantee</span>
    </div>
  </div>
</body>
</html>
`;

// Slide 3: Stripe Recurring Billing & Usage ROI Calculator
const SLIDE_3_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${SHARED_CSS}
    .calc-and-pricing {
      display: flex;
      flex-direction: column;
      height: 100%;
      background: #080A12;
      padding: 16px 20px;
      gap: 14px;
    }
    .slider-box {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 14px 18px;
    }
    .calc-metrics {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      margin-top: 10px;
    }
    .c-metric {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 6px;
      padding: 10px 14px;
    }
    .c-metric.highlight {
      background: rgba(0, 242, 254, 0.06);
      border-color: rgba(0, 242, 254, 0.3);
    }
    .pricing-row {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 14px;
      flex: 1;
    }
    .plan-card {
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 14px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .plan-card.popular {
      background: rgba(0, 242, 254, 0.04);
      border-color: #00F2FE;
    }
  </style>
</head>
<body>
  <div class="slide-header">
    <div class="header-left">
      <div class="pill-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span>TURNKEY MONETIZATION &amp; BILLING</span>
      </div>
      <h1 class="slide-title">STRIPE SUBSCRIPTIONS &amp; <span class="gradient-span">USAGE ROI CALCULATOR</span></h1>
      <p class="slide-subtitle">Credit Metronome Engine • Recurring Revenue Tiers • Interactive Monthly Volume Slider</p>
    </div>
    <div class="header-right">
      <div class="seller-trust-badge">
        <span class="seller-label">Stripe Checkout &amp; Webhooks Ready</span>
      </div>
    </div>
  </div>

  <div class="mockup-window">
    <div class="window-topbar">
      <div class="window-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
      <div class="window-address-bar"><span>https://app.kortex.ai/pricing/roi-calculator</span></div>
      <div class="window-status-pill"><span class="status-pulse"></span><span>STRIPE BILLING PORTAL VERIFIED</span></div>
    </div>

    <div class="calc-and-pricing">
      <!-- Calculator Box -->
      <div class="slider-box">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <span style="font-size: 13px; font-weight: 700; color: #FFFFFF;">Monthly Token Capacity Volume:</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 16px; font-weight: 700; color: #00F2FE;">1,200,000 Tokens / mo</span>
        </div>
        <div style="width: 100%; height: 8px; background: rgba(255,255,255,0.08); border-radius: 4px; position: relative;">
          <div style="width: 45%; height: 100%; background: #00F2FE; border-radius: 4px;"></div>
        </div>
        <div class="calc-metrics">
          <div class="c-metric">
            <div style="font-size: 10px; color: #64748B; font-weight: 700;">AUTONOMOUS TASKS</div>
            <div style="font-family: 'JetBrains Mono'; font-size: 16px; font-weight: 700; color: #FFFFFF;">~4,800 tasks</div>
            <div style="font-size: 9.5px; color: #64748B;">@ 250 tokens per step</div>
          </div>
          <div class="c-metric">
            <div style="font-size: 10px; color: #64748B; font-weight: 700;">RAW API COST</div>
            <div style="font-family: 'JetBrains Mono'; font-size: 16px; font-weight: 700; color: #94A3B8; text-decoration: line-through;">$180 / mo</div>
            <div style="font-size: 9.5px; color: #64748B;">Unoptimized provider billing</div>
          </div>
          <div class="c-metric highlight">
            <div style="font-size: 10px; color: #00F2FE; font-weight: 700;">RECOMMENDED TIER</div>
            <div style="font-family: 'JetBrains Mono'; font-size: 16px; font-weight: 700; color: #00F2FE;">Pro Builder ($79/mo)</div>
            <div style="font-size: 9.5px; color: #10B981; font-weight: 600;">You save ~$101/mo (56% ROI)</div>
          </div>
        </div>
      </div>

      <!-- Pricing Plans Row -->
      <div class="pricing-row">
        <div class="plan-card">
          <div>
            <div style="font-size: 13.5px; font-weight: 700; color: #FFFFFF;">Starter MVP</div>
            <div style="font-size: 10px; color: #64748B;">For indie makers &amp; prototypes</div>
            <div style="font-family: 'JetBrains Mono'; font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 6px 0;">$29 <span style="font-size: 11px; color: #64748B;">/mo</span></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 5px; font-size: 10.5px; color: #94A3B8; margin: 6px 0;">
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>150,000 Fast Tokens / mo</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Up to 3 Autonomous Swarms</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Claude 3.5 &amp; GPT-4o Access</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Standard Community Support</span></div>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 7px; text-align: center; font-size: 11px; font-weight: 600; color: #FFFFFF;">Deploy Starter</div>
        </div>

        <div class="plan-card popular">
          <div>
            <div style="display: flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 13.5px; font-weight: 700; color: #00F2FE;">Pro Builder</span>
              <span style="font-size: 8.5px; font-weight: 700; background: #00F2FE; color: #000; padding: 2px 6px; border-radius: 3px;">STANDARD</span>
            </div>
            <div style="font-size: 10px; color: #64748B;">For scaling startups &amp; SaaS apps</div>
            <div style="font-family: 'JetBrains Mono'; font-size: 20px; font-weight: 800; color: #00F2FE; margin: 6px 0;">$79 <span style="font-size: 11px; color: #64748B;">/mo</span></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 5px; font-size: 10.5px; color: #FFFFFF; margin: 6px 0;">
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>1,200,000 High-Speed Tokens</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Unlimited Multi-Agent Swarms</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Custom Webhooks &amp; DB Tools</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#00F2FE" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Sub-50ms Global Priority Routing</span></div>
          </div>
          <div style="background: linear-gradient(135deg, #00F2FE, #4FACFE); border-radius: 6px; padding: 7px; text-align: center; font-size: 11px; font-weight: 700; color: #000;">Start 14-Day Free Pro Trial &rarr;</div>
        </div>

        <div class="plan-card">
          <div>
            <div style="font-size: 13.5px; font-weight: 700; color: #FFFFFF;">Enterprise</div>
            <div style="font-size: 10px; color: #64748B;">For dedicated high-volume clusters</div>
            <div style="font-family: 'JetBrains Mono'; font-size: 20px; font-weight: 800; color: #FFFFFF; margin: 6px 0;">$249 <span style="font-size: 11px; color: #64748B;">/mo</span></div>
          </div>
          <div style="display: flex; flex-direction: column; gap: 5px; font-size: 10.5px; color: #94A3B8; margin: 6px 0;">
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Custom Multi-Million Allowance</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Dedicated Single-Tenant VPC</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>99.99% Uptime SLA Guarantee</span></div>
            <div style="display: flex; align-items: center; gap: 6px;"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg><span>Dedicated Solutions Architect</span></div>
          </div>
          <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: 6px; padding: 7px; text-align: center; font-size: 11px; font-weight: 600; color: #FFFFFF;">Contact Solutions Architect</div>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="tech-pills-row">
      <div class="tech-pill">Stripe Checkout</div>
      <div class="tech-pill">Stripe Webhooks</div>
      <div class="tech-pill">Customer Portal</div>
      <div class="tech-pill">Usage Metronome</div>
      <div class="tech-pill">Invoicing &amp; Tax</div>
    </div>
    <div class="guarantee-badge">
      <span>Turnkey SaaS Monetization Architecture</span>
    </div>
  </div>
</body>
</html>
`;

// Slide 4: Enterprise Security & Multi-Language SDKs
const SLIDE_4_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${SHARED_CSS}
    .security-grid {
      display: grid;
      grid-template-columns: 380px 1fr;
      height: 100%;
      background: #080A12;
    }
    .auth-col {
      background: #0A0D18;
      border-right: 1px solid rgba(255, 255, 255, 0.08);
      padding: 24px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }
    .google-btn-mock {
      background: #FFFFFF;
      color: #1F2937;
      border-radius: 6px;
      padding: 10px 16px;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      font-weight: 600;
      font-size: 13px;
    }
    .sdk-col {
      padding: 20px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      background: #06080F;
    }
    .sdk-code-box {
      flex: 1;
      background: rgba(0, 0, 0, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 8px;
      padding: 16px;
      font-family: 'JetBrains Mono', monospace;
      font-size: 11.5px;
      line-height: 1.6;
      color: #94A3B8;
    }
  </style>
</head>
<body>
  <div class="slide-header">
    <div class="header-left">
      <div class="pill-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span>ENTERPRISE SECURITY &amp; ZERO DATA RETENTION</span>
      </div>
      <h1 class="slide-title">AUTHENTICATION &amp; <span class="gradient-span">MULTI-LANGUAGE SDKs</span></h1>
      <p class="slide-subtitle">Official Google Identity OAuth 2.0 • SOC-2 Type II Compliance • Python, TypeScript, Go &amp; cURL</p>
    </div>
    <div class="header-right">
      <div class="seller-trust-badge">
        <span class="seller-label">AES-256 GCM Encryption</span>
      </div>
    </div>
  </div>

  <div class="mockup-window">
    <div class="window-topbar">
      <div class="window-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
      <div class="window-address-bar"><span>https://app.kortex.ai/security/zero-data-retention</span></div>
      <div class="window-status-pill"><span class="status-pulse"></span><span>SOC-2 COMPLIANCE VALIDATED</span></div>
    </div>

    <div class="security-grid">
      <!-- Auth Left Column -->
      <div class="auth-col">
        <div style="font-family: 'JetBrains Mono'; font-size: 10px; color: #64748B; font-weight: 700;">USER AUTHENTICATION</div>
        <div style="font-size: 16px; font-weight: 700; color: #FFFFFF;">Sign in to Workspace</div>
        
        <div class="google-btn-mock">
          <svg width="18" height="18" viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/></svg>
          <span>Continue with Google</span>
        </div>

        <div style="background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 12px; margin-top: auto;">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#10B981" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
            <span style="font-size: 12px; font-weight: 700; color: #FFFFFF;">Zero Data Retention</span>
          </div>
          <div style="font-family: 'JetBrains Mono'; font-size: 10px; color: #64748B; line-height: 1.5;">
            Audit Cert: #KRTX-SOC2-9941<br>
            Encryption: AES-256 GCM • TLS 1.3<br>
            Data: No customer training logs
          </div>
        </div>
      </div>

      <!-- SDK Code Switcher Right Column -->
      <div class="sdk-col">
        <div style="display: flex; gap: 6px;">
          <div style="background: rgba(0, 242, 254, 0.12); color: #00F2FE; border: 1px solid rgba(0, 242, 254, 0.3); padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: 600;">TypeScript</div>
          <div style="background: rgba(255,255,255,0.03); color: #94A3B8; padding: 4px 12px; border-radius: 4px; font-size: 11px;">Python</div>
          <div style="background: rgba(255,255,255,0.03); color: #94A3B8; padding: 4px 12px; border-radius: 4px; font-size: 11px;">Go</div>
          <div style="background: rgba(255,255,255,0.03); color: #94A3B8; padding: 4px 12px; border-radius: 4px; font-size: 11px;">cURL</div>
        </div>

        <div class="sdk-code-box" style="flex: 1.2;">
          <span style="color: #C084FC; font-weight: 700;">import</span> { <span style="color: #93C5FD;">KortexClient</span> } <span style="color: #C084FC; font-weight: 700;">from</span> <span style="color: #86EFAC;">'@kortex-ai/sdk'</span>;<br><br>
          <span style="color: #C084FC; font-weight: 700;">const</span> kortex = <span style="color: #C084FC; font-weight: 700;">new</span> <span style="color: #93C5FD;">KortexClient</span>({ apiKey: process.env.KORTEX_KEY });<br>
          <span style="color: #C084FC; font-weight: 700;">const</span> swarm = <span style="color: #C084FC; font-weight: 700;">await</span> kortex.swarms.<span style="color: #67E8F9;">create</span>({<br>
          &nbsp;&nbsp;orchestration: <span style="color: #86EFAC;">'dual_consensus'</span>,<br>
          &nbsp;&nbsp;models: [<span style="color: #86EFAC;">'claude-3-5-sonnet'</span>, <span style="color: #86EFAC;">'gpt-4o'</span>],<br>
          &nbsp;&nbsp;edgeRouting: <span style="color: #F472B6; font-weight: 700;">true</span><br>
          });<br><br>
          swarm.<span style="color: #67E8F9;">on</span>(<span style="color: #86EFAC;">'token'</span>, (chunk) =&gt; process.stdout.<span style="color: #67E8F9;">write</span>(chunk));
        </div>

        <!-- API Key Manager Box -->
        <div style="background: rgba(255, 255, 255, 0.02); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 8px; padding: 12px 14px; display: flex; flex-direction: column; gap: 6px;">
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <span style="font-size: 11.5px; font-weight: 700; color: #FFFFFF;">API Key Credentials &amp; Scopes</span>
            <span style="font-family: 'JetBrains Mono'; font-size: 9.5px; color: #10B981; background: rgba(16, 185, 129, 0.1); padding: 2px 6px; border-radius: 3px;">Active Secret</span>
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; background: #000; border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 6px; padding: 5px 10px; font-family: 'JetBrains Mono'; font-size: 10.5px;">
            <span style="color: #94A3B8;">krtx_live_9941a8b••••••••••••••••••••</span>
            <span style="color: #00F2FE; font-size: 10px; font-weight: 600;">Copy</span>
          </div>
          <div style="display: flex; justify-content: space-between; font-size: 10px; color: #64748B;">
            <span>Scopes: swarms:deploy, rag:query, billing:read</span>
            <span style="color: #10B981;">TLS 1.3 Strict Verified</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="tech-pills-row">
      <div class="tech-pill">Google OAuth 2.0</div>
      <div class="tech-pill">NextAuth.js</div>
      <div class="tech-pill">Supabase Auth</div>
      <div class="tech-pill">TypeScript SDK</div>
      <div class="tech-pill">Python SDK</div>
      <div class="tech-pill">Go Client</div>
    </div>
    <div class="guarantee-badge">
      <span>Zero Hallucinations &bull; Zero Data Leaks</span>
    </div>
  </div>
</body>
</html>
`;

// Slide 5: Cross-Device Responsiveness (Desktop & Mobile)
const SLIDE_5_HTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    ${SHARED_CSS}
    .responsive-stage {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 36px;
      height: 100%;
      background: #080A12;
      padding: 16px 24px;
    }
    .desktop-preview {
      flex: 1;
      height: 100%;
      background: #090C16;
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 8px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .phone-preview {
      width: 220px;
      height: 100%;
      background: #090C16;
      border: 2px solid rgba(255, 255, 255, 0.2);
      border-radius: 28px;
      padding: 10px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.8);
      display: flex;
      flex-direction: column;
    }
    .phone-screen {
      flex: 1;
      background: #06080F;
      border-radius: 20px;
      overflow: hidden;
      padding: 10px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  </style>
</head>
<body>
  <div class="slide-header">
    <div class="header-left">
      <div class="pill-badge">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        <span>100% CROSS-DEVICE RESPONSIVE</span>
      </div>
      <h1 class="slide-title">DESKTOP &amp; MOBILE <span class="gradient-span">OPTIMIZED SAAS</span></h1>
      <p class="slide-subtitle">Tested on iPhone 15 Pro, iPad &amp; Ultra-Wide Displays • Sub-50ms Global Edge Routing</p>
    </div>
    <div class="header-right">
      <div class="seller-trust-badge">
        <span class="seller-label">Lighthouse 99+ Performance</span>
      </div>
    </div>
  </div>

  <div class="mockup-window">
    <div class="responsive-stage">
      <!-- Desktop Screen -->
      <div class="desktop-preview">
        <div class="window-topbar">
          <div class="window-dots"><span class="dot dot-red"></span><span class="dot dot-yellow"></span><span class="dot dot-green"></span></div>
          <span style="font-family: 'JetBrains Mono'; font-size: 10px; color: #94A3B8;">Desktop Workspace &bull; kortex.ai/app</span>
          <span style="font-family: 'JetBrains Mono'; font-size: 9.5px; color: #10B981;">34ms Edge Mesh</span>
        </div>
        <div style="padding: 12px; flex: 1; display: flex; flex-direction: column; gap: 8px; background: #070911;">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 6px;">
            <div style="font-size: 11px; font-weight: 700; color: #FFFFFF;">
              Swarm Pipeline: <span style="color: #00F2FE;">#SWRM-98402 &bull; Microservice Deploy</span>
            </div>
            <div style="font-family: 'JetBrains Mono'; font-size: 9.5px; color: #10B981;">140 t/s &bull; Claude 3.5</div>
          </div>
          <!-- 4 DAG Mini Cards -->
          <div style="display: flex; gap: 6px;">
            <div style="flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 6px;">
              <div style="font-size: 8px; color: #64748B; font-weight: 700;">01 / RAG</div>
              <div style="font-size: 9.5px; font-weight: 700; color: #FFF;">Pinecone</div>
              <div style="font-size: 8px; color: #10B981;">14ms [OK]</div>
            </div>
            <div style="flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 6px;">
              <div style="font-size: 8px; color: #64748B; font-weight: 700;">02 / LLM</div>
              <div style="font-size: 9.5px; font-weight: 700; color: #FFF;">Claude 3.5</div>
              <div style="font-size: 8px; color: #00F2FE;">140 t/s</div>
            </div>
            <div style="flex: 1; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 6px;">
              <div style="font-size: 8px; color: #64748B; font-weight: 700;">03 / AST</div>
              <div style="font-size: 9.5px; font-weight: 700; color: #FFF;">Verifier</div>
              <div style="font-size: 8px; color: #10B981;">0 CVEs</div>
            </div>
            <div style="flex: 1; background: rgba(0,242,254,0.05); border: 1px solid #00F2FE; border-radius: 4px; padding: 6px;">
              <div style="font-size: 8px; color: #00F2FE; font-weight: 700;">04 / DISPATCH</div>
              <div style="font-size: 9.5px; font-weight: 700; color: #FFF;">Edge Node</div>
              <div style="font-size: 8px; color: #00F2FE;">HTTP 200</div>
            </div>
          </div>
          <!-- Code Block -->
          <div style="background: #000; border: 1px solid rgba(255,255,255,0.06); border-radius: 6px; padding: 10px; font-family: 'JetBrains Mono'; font-size: 10px; line-height: 1.5; color: #94A3B8;">
            <span style="color: #C084FC;">const</span> swarm = <span style="color: #C084FC;">await</span> kortex.deploy({ model: <span style="color: #86EFAC;">"claude-3-5"</span> });<br>
            <span style="color: #C084FC;">for await</span> (<span style="color: #C084FC;">const</span> chunk <span style="color: #C084FC;">of</span> swarm.stream()) {<br>
            &nbsp;&nbsp;process.stdout.write(chunk); <span style="color: #64748B;">// 140 tokens/sec streamed</span><br>
            }
          </div>
          <!-- Telemetry Wave Strip -->
          <div style="display: flex; justify-content: space-between; align-items: center; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 6px 10px; font-size: 9.5px; color: #64748B;">
            <span>Cluster: <strong style="color: #FFF;">us-east-1</strong></span>
            <span>Uptime: <strong style="color: #10B981;">99.99%</strong></span>
            <span>Global Edge Nodes: <strong style="color: #00F2FE;">312 PoPs</strong></span>
          </div>
        </div>
      </div>

      <!-- Mobile Screen -->
      <div class="phone-preview" style="width: 240px;">
        <div class="phone-screen">
          <div style="display: flex; justify-content: space-between; align-items: center; padding-bottom: 6px; border-bottom: 1px solid rgba(255,255,255,0.08);">
            <div style="display: flex; align-items: center; gap: 5px;">
              <div style="width: 6px; height: 6px; border-radius: 50%; background: #10B981;"></div>
              <span style="font-weight: 700; font-size: 11px; color: #FFF;">Kortex<span style="color: #00F2FE;">.ai</span></span>
            </div>
            <div style="display: flex; gap: 2px;">
              <div style="width: 3px; height: 3px; background: #94A3B8; border-radius: 50%;"></div>
              <div style="width: 3px; height: 3px; background: #94A3B8; border-radius: 50%;"></div>
              <div style="width: 3px; height: 3px; background: #94A3B8; border-radius: 50%;"></div>
            </div>
          </div>
          <div style="display: flex; gap: 4px; margin: 4px 0;">
            <div style="background: rgba(0,242,254,0.15); color: #00F2FE; font-size: 9px; font-weight: 700; padding: 2px 8px; border-radius: 3px;">Swarm</div>
            <div style="background: rgba(255,255,255,0.03); color: #94A3B8; font-size: 9px; padding: 2px 8px; border-radius: 3px;">Stream</div>
            <div style="background: rgba(255,255,255,0.03); color: #94A3B8; font-size: 9px; padding: 2px 8px; border-radius: 3px;">Metrics</div>
          </div>
          <div style="background: #000; border: 1px solid rgba(255,255,255,0.08); border-radius: 6px; padding: 8px; flex: 1; font-family: 'JetBrains Mono'; font-size: 8.5px; line-height: 1.5; color: #94A3B8;">
            <span style="color: #10B981;">[OK]</span> Claude 3.5 Sonnet<br>
            <span style="color: #00F2FE;">[RAG]</span> 14ms Pinecone lookup<br>
            <span style="color: #C084FC;">[GEN]</span> TypeScript AST verified<br>
            <span style="color: #FBBF24;">[P99]</span> 34ms edge routing active
          </div>
          <div style="background: linear-gradient(135deg, #00F2FE, #4FACFE); border-radius: 4px; padding: 6px; text-align: center; font-size: 9.5px; font-weight: 700; color: #000; margin-top: auto;">
            Deploy Agent Swarm &rarr;
          </div>
        </div>
      </div>
    </div>
  </div>

  <div class="slide-footer">
    <div class="tech-pills-row">
      <div class="tech-pill">Mobile-First UI</div>
      <div class="tech-pill">Tailwind Grid</div>
      <div class="tech-pill">Dynamic Viewports</div>
      <div class="tech-pill">Touch Optimized</div>
      <div class="tech-pill">PWA Ready</div>
    </div>
    <div class="guarantee-badge">
      <span>100% Fluid Responsive Layouts</span>
    </div>
  </div>
</body>
</html>
`;

async function generateAllShowcases() {
  console.log('Launching Chromium for agency-grade Fiverr showcase slides generation...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    args: ['--no-sandbox', '--disable-gpu'],
    headless: true
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 769, deviceScaleFactor: 2 }); // 2x retina scale for ultra-crisp output

  const slides = [
    { name: '01_hero_saas_platform_showcase.png', html: SLIDE_1_HTML },
    { name: '02_developer_studio_and_agents.png', html: SLIDE_2_HTML },
    { name: '03_dynamic_roi_and_monetization.png', html: SLIDE_3_HTML },
    { name: '04_security_oauth_and_sdks.png', html: SLIDE_4_HTML },
    { name: '05_full_stack_architecture_and_mobile.png', html: SLIDE_5_HTML }
  ];

  for (const slide of slides) {
    console.log('Rendering slide:', slide.name);
    await page.setContent(slide.html, { waitUntil: 'domcontentloaded' });
    await new Promise(r => setTimeout(r, 600));
    const outputPath = path.join(OUTPUT_DIR, slide.name);
    await page.screenshot({ path: outputPath, type: 'png' });
    console.log('Successfully saved:', outputPath);
  }

  // Also capture raw real-app views for portfolio PDF inclusions
  console.log('Capturing real app sections...');
  await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
  await page.goto('file:///home/rusty/Desktop/gig2_kortex_ai_saas/index.html', { waitUntil: 'networkidle0' });

  // 1. Raw Hero Studio view
  await page.screenshot({ path: path.join(OUTPUT_DIR, '01_desktop_hero_showcase.jpg'), type: 'jpeg', quality: 95 });
  console.log('Updated 01_desktop_hero_showcase.jpg');

  // 2. Raw Playground view
  await page.evaluate(() => document.getElementById('playground').scrollIntoView());
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '02_interactive_ai_playground.jpg'), type: 'jpeg', quality: 95 });
  console.log('Updated 02_interactive_ai_playground.jpg');

  // 3. Raw Bento view
  await page.evaluate(() => document.getElementById('bento').scrollIntoView());
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '03_asymmetric_bento_grid.jpg'), type: 'jpeg', quality: 95 });
  console.log('Updated 03_asymmetric_bento_grid.jpg');

  // 4. Raw Pricing and ROI view
  await page.evaluate(() => document.getElementById('pricing').scrollIntoView());
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUTPUT_DIR, '04_dynamic_pricing_calculator.jpg'), type: 'jpeg', quality: 95 });
  console.log('Updated 04_dynamic_pricing_calculator.jpg');

  await browser.close();
  console.log('All agency-grade Fiverr showcase slides generated successfully!');
}

generateAllShowcases().catch(err => {
  console.error('Fatal showcase generation error:', err);
  process.exit(1);
});
