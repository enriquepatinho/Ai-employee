import {
  AVATAR_ALEX,
  AVATAR_ENRIQUE,
  AVATAR_JOHN,
  AVATAR_JOHNNY,
  AVATAR_MAYA,
  JOHNNY_MASCOT,
} from '../assets/croppedAssets';

export function getIframeEmbedSnippet(originUrl: string): string {
  const cleanUrl = originUrl.replace(/\/$/, '');
  return `<!-- PHOS AI Labs — Interactive AI Employees Hero Embed -->
<div style="width: 100%; max-width: 640px; margin: 0 auto; border-radius: 16px; overflow: hidden; box-shadow: 0 12px 32px -8px rgba(15, 23, 42, 0.08); border: 1px solid #E2E8F0; background: #FFFFFF;">
  <iframe
    src="${cleanUrl}/?embed=true"
    title="PHOS AI Employees — Interactive Product Demo"
    style="width: 100%; height: 610px; border: 0; display: block;"
    loading="lazy"
    allow="clipboard-write"
  ></iframe>
</div>`;
}

export function generateStandaloneHtmlBundle(): string {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PHOS AI Employees — Standalone Interactive Hero Embed</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&family=Geist:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <style>
    .phos-ai-demo-root, .phos-ai-demo-root * {
      box-sizing: border-box;
      font-family: 'Geist', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    }
    body {
      margin: 0;
      padding: 16px;
      background: #F8FAFC;
      color: #0F172A;
      display: flex;
      justify-content: center;
    }
    .phos-ai-demo-root {
      width: 100%;
      max-width: 640px;
      height: 600px;
      background: #FAFAFA;
      border: 1px solid #E2E8F0;
      border-radius: 16px;
      display: flex;
      overflow: hidden;
      box-shadow: 0 8px 28px -6px rgba(15, 23, 42, 0.06);
      position: relative;
    }
    .phos-sidebar {
      width: 172px;
      background: #FAFAFA;
      border-right: 1px solid #EAECEF;
      display: flex;
      flex-direction: column;
      padding: 10px 8px;
      flex-shrink: 0;
      user-select: none;
    }
    .phos-brand {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 4px 10px;
    }
    .phos-brand-left {
      display: flex;
      align-items: center;
      gap: 7px;
      font-weight: 600;
      font-size: 12.5px;
      color: #0F172A;
    }
    .phos-logo-box {
      width: 22px;
      height: 22px;
      border-radius: 6px;
      background: #2563EB;
      color: #fff;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
    }
    .phos-new-chat-btn {
      width: 100%;
      background: #1D6AE5;
      color: #fff;
      border: none;
      border-radius: 999px;
      padding: 7px 10px;
      font-size: 11.5px;
      font-weight: 500;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 5px;
      margin-bottom: 12px;
      transition: background 150ms ease;
    }
    .phos-new-chat-btn:hover { background: #1557C0; }
    .phos-sec-label {
      font-size: 9.5px;
      font-weight: 600;
      color: #94A3B8;
      letter-spacing: 0.04em;
      padding: 4px 6px;
      margin-top: 4px;
    }
    .phos-nav-item {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 5px 7px;
      border-radius: 7px;
      font-size: 11.5px;
      color: #475569;
      cursor: pointer;
      border: none;
      background: transparent;
      width: 100%;
      text-align: left;
    }
    .phos-nav-item:hover, .phos-nav-item.active {
      background: #EFF6FF;
      color: #1D4ED8;
    }
    .phos-emp-card {
      background: #EEF4FF;
      border-radius: 10px;
      padding: 6px;
      margin-top: 3px;
    }
    .phos-emp-row {
      display: flex;
      align-items: center;
      gap: 7px;
      padding: 4px 4px;
      cursor: pointer;
    }
    .phos-emp-row img {
      width: 24px;
      height: 24px;
      border-radius: 50%;
    }
    .phos-emp-name {
      font-size: 11.5px;
      font-weight: 600;
      color: #0F172A;
      line-height: 1.15;
    }
    .phos-emp-role {
      font-size: 10px;
      color: #64748B;
    }
    .phos-subchat {
      font-size: 10.5px;
      color: #475569;
      padding: 4px 7px;
      border-radius: 6px;
      cursor: pointer;
      display: block;
      width: 100%;
      text-align: left;
      border: none;
      background: transparent;
      margin-top: 2px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }
    .phos-subchat.active, .phos-subchat:hover {
      background: #DCE8FF;
      color: #1D4ED8;
      font-weight: 500;
    }
    .phos-main {
      flex: 1;
      background: #FFFFFF;
      margin: 6px 6px 6px 0;
      border: 1px solid #EAECEF;
      border-radius: 12px;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      position: relative;
    }
    .phos-topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 12px;
      border-bottom: 1px solid #F1F5F9;
    }
    .phos-pill-btn {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      padding: 4px 9px;
      border-radius: 999px;
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
      font-size: 11px;
      color: #0F172A;
      cursor: pointer;
    }
    .phos-pill-btn:hover { background: #F8FAFC; }
    .phos-body {
      flex: 1;
      overflow-y: auto;
      padding: 14px 16px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .phos-hero-center {
      text-align: center;
      margin: auto 0;
      padding: 6px 0;
    }
    .phos-mascot-wrap {
      width: 78px;
      margin: 0 auto 8px;
      border-radius: 20px;
      overflow: hidden;
      background: #EDF3FC;
      border: 1px solid rgba(226, 232, 240, 0.8);
      padding: 2px;
      box-shadow: 0 4px 14px rgba(15, 23, 42, 0.05);
    }
    .phos-mascot {
      width: 100%;
      height: auto;
      display: block;
      border-radius: 17px;
      object-fit: contain;
    }
    .phos-title {
      font-size: 17px;
      font-weight: 600;
      color: #0F172A;
      line-height: 1.25;
      margin: 0;
    }
    .phos-title span { color: #1D6AE5; }
    .phos-sub {
      font-size: 11.5px;
      color: #64748B;
      margin: 5px 0 10px;
    }
    .phos-actions {
      display: flex;
      flex-wrap: wrap;
      justify-content: center;
      gap: 6px;
      margin-bottom: 12px;
    }
    .phos-chip {
      border: 1px solid #E2E8F0;
      background: #FFFFFF;
      border-radius: 999px;
      padding: 5px 10px;
      font-size: 11px;
      color: #334155;
      cursor: pointer;
      transition: all 150ms ease;
    }
    .phos-chip:hover {
      border-color: #4F46E5;
      color: #4F46E5;
      background: #EEF2FF;
    }
    .phos-composer {
      border: 1px solid #E2E8F0;
      border-radius: 12px;
      padding: 8px 10px;
      background: #FFFFFF;
      box-shadow: 0 2px 6px rgba(15, 23, 42, 0.03);
      margin-bottom: 10px;
    }
    .phos-composer-row {
      display: flex;
      align-items: center;
      gap: 7px;
    }
    .phos-input {
      border: none;
      outline: none;
      width: 100%;
      font-size: 12px;
      color: #0F172A;
    }
    .phos-send {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      border: none;
      background: #1D6AE5;
      color: #fff;
      cursor: pointer;
      font-size: 12px;
    }
    .phos-cards {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 8px;
    }
    .phos-card {
      border: 1px solid #EAECEF;
      border-radius: 10px;
      padding: 8px;
      background: #FFFFFF;
      cursor: pointer;
      text-align: left;
    }
    .phos-card:hover { border-color: #CBD5E1; background: #F8FAFC; }
    .phos-card-top {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10.5px;
      font-weight: 600;
      color: #0F172A;
      margin-bottom: 4px;
    }
    .phos-card-link {
      font-size: 9.5px;
      color: #1D6AE5;
      font-weight: 500;
    }
    .phos-card-desc {
      font-size: 10px;
      color: #64748B;
      line-height: 1.35;
      margin: 0;
    }
  </style>
</head>
<body>
  <div class="phos-ai-demo-root" id="phosApp">
    <aside class="phos-sidebar">
      <div class="phos-brand">
        <div class="phos-brand-left">
          <span class="phos-logo-box">✦</span>
          <span>AI Employee</span>
        </div>
      </div>
      <button class="phos-new-chat-btn" onclick="resetDemo()">+ New Chat</button>
      <div class="phos-sec-label">FEATURES</div>
      <button class="phos-nav-item active" onclick="resetDemo()">💬 Chat</button>
      <button class="phos-nav-item" onclick="runAction('research-competitors')">📅 Scheduled Tasks</button>
      <button class="phos-nav-item" onclick="runAction('generate-report')">📑 Files</button>
      <div class="phos-sec-label">EMPLOYEES</div>
      <div class="phos-emp-card">
        <div class="phos-emp-row">
          <img src="${AVATAR_JOHNNY}" alt="Johnny" />
          <div>
            <div class="phos-emp-name">Johnny</div>
            <div class="phos-emp-role">Sales Research</div>
          </div>
        </div>
        <button class="phos-subchat active" onclick="runAction('research-competitors')">Weekly competitor research</button>
        <button class="phos-subchat" onclick="runAction('generate-report')">Q3 leads report</button>
        <button class="phos-subchat" onclick="runAction('summarize-week')">Update HubSpot contacts</button>
      </div>
      <div class="phos-emp-row" style="margin-top:6px;">
        <img src="${AVATAR_MAYA}" alt="Maya" />
        <div><div class="phos-emp-name">Maya</div><div class="phos-emp-role">Operations</div></div>
      </div>
      <div class="phos-emp-row">
        <img src="${AVATAR_ALEX}" alt="Alex" />
        <div><div class="phos-emp-name">Alex</div><div class="phos-emp-role">Marketing</div></div>
      </div>
      <div style="margin-top:auto; padding-top:8px; border-top:1px solid #EAECEF; display:flex; align-items:center; gap:6px;">
        <img src="${AVATAR_ENRIQUE}" alt="Enrique" style="width:24px;height:24px;border-radius:50%;" />
        <div style="overflow:hidden;">
          <div style="font-size:10.5px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">Enrique Patinho</div>
          <div style="font-size:9.5px;color:#64748B;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">enrique@lowcode.agency</div>
        </div>
      </div>
    </aside>
    <main class="phos-main">
      <header class="phos-topbar">
        <button class="phos-pill-btn" onclick="resetDemo()">
          <strong style="color:#1D6AE5;">J</strong> Johnny - <span style="color:#64748B;">Sales Research</span>
        </button>
        <div style="display:flex;gap:6px;">
          <button class="phos-pill-btn" onclick="runAction('summarize-week')">🛠 Connected Tools</button>
          <button class="phos-pill-btn" onclick="runAction('generate-report')">📄 Files</button>
        </div>
      </header>
      <div class="phos-body" id="phosMainBody"></div>
    </main>
  </div>
  <script>
    const MASCOT = "${JOHNNY_MASCOT}";
    const AVATAR_J = "${AVATAR_JOHNNY}";
    const DATA = {
      'research-competitors': {
        prompt: 'Research competitors',
        title: 'Competitor Intelligence Brief — Q4 Update (Sample Data)',
        body: 'Tracked Veloce AI, Kinetix Ops, and StrataFlow over the last 7 days:\\n• Veloce AI raised Enterprise pricing +32% ($490 → $650/mo) and gated API webhooks.\\n• Kinetix Ops removed its self-serve sandbox trial.\\n• StrataFlow launched beta HubSpot sync but lacks custom RBAC.\\n\\nRecommendation: Position PHOS included webhook automation to save mid-market teams ~$1,920/yr.'
      },
      'generate-report': {
        prompt: 'Generate a report',
        title: 'Q3 Outbound & Pipeline Attribution Report (Sample Data)',
        body: 'Analyzed 412 researched accounts across Q3 outbound sequences:\\n• Attributed Pipeline: $418,500 (+24.2% vs Q2)\\n• Qualified SQLs: 142 (31.4% conversion rate)\\n• Mid-Market SaaS led with 68 SQLs & 34.8% positive reply rate.\\n\\nExported artifact: Q3_Leads_Attribution_Report.xlsx'
      },
      'summarize-week': {
        prompt: 'Summarize my week',
        title: 'Weekly Sales Research Digest — Nov 3 to Nov 10 (Sample Data)',
        body: 'Completed 12 scheduled research runs & 64 HubSpot contact updates:\\n• Northstar Logistics (ICP 96/100): Hiring 2 Sales Ops roles + viewed pricing page.\\n• Meridian Cloud (ICP 91/100): Veloce AI contract renewal in 45 days.\\n• CRM Hygiene: Flagged 14 job changes & replaced 9 bounced emails.'
      }
    };

    function renderHome() {
      document.getElementById('phosMainBody').innerHTML = \`
        <div class="phos-hero-center">
          <img src="\${MASCOT}" class="phos-mascot" alt="Johnny" />
          <h1 class="phos-title">Good Morning, Enrique.<br/>How Can I <span>Assist You Today?</span></h1>
          <p class="phos-sub">Ask a question or give Johnny something to work on.</p>
          <div class="phos-actions">
            <button class="phos-chip" onclick="runAction('research-competitors')">✦ Research competitors</button>
            <button class="phos-chip" onclick="runAction('generate-report')">✦ Generate a report</button>
            <button class="phos-chip" onclick="runAction('summarize-week')">✦ Summarize my week</button>
          </div>
        </div>
        <div>
          <form class="phos-composer" onsubmit="handleSub(event)">
            <div class="phos-composer-row">
              <span style="color:#1D6AE5;">✦</span>
              <input id="phosInput" class="phos-input" placeholder="Assign Johnny a task..." />
              <button type="submit" class="phos-send">↑</button>
            </div>
          </form>
          <div class="phos-cards">
            <div class="phos-card" onclick="runAction('research-competitors')">
              <div class="phos-card-top"><span>↻ Recurring Tasks</span><span class="phos-card-link">View tasks</span></div>
              <p class="phos-card-desc">Automate work that Johnny should run on a schedule.</p>
            </div>
            <div class="phos-card" onclick="runAction('generate-report')">
              <div class="phos-card-top"><span>📄 Files</span><span class="phos-card-link">Browse files</span></div>
              <p class="phos-card-desc">View reports, documents and files created by your employees.</p>
            </div>
            <div class="phos-card" onclick="runAction('summarize-week')">
              <div class="phos-card-top"><span>🕒 Recent Activity</span><span class="phos-card-link">View activity</span></div>
              <p class="phos-card-desc">See what Johnny has recently completed or worked on.</p>
            </div>
          </div>
        </div>
      \`;
    }

    function runAction(key, customText) {
      const item = DATA[key];
      const userMsg = customText || (item ? item.prompt : '');
      const container = document.getElementById('phosMainBody');
      container.innerHTML = \`
        <div style="display:flex;flex-direction:column;gap:10px;">
          <div style="align-self:flex-end;background:#1D6AE5;color:#fff;padding:7px 12px;border-radius:12px 12px 2px 12px;font-size:12px;max-width:80%;">\${userMsg}</div>
          <div id="phosResp" style="padding:10px;border:1px solid #E2E8F0;border-radius:10px;font-size:11.5px;color:#64748B;">Johnny is analyzing sample data...</div>
        </div>
        <div style="margin-top:12px;display:flex;justify-content:space-between;align-items:center;">
          <button class="phos-chip" onclick="resetDemo()">← Back to welcome</button>
          <span style="font-size:10px;color:#94A3B8;">Interactive guided demo · Fictional sample data</span>
        </div>
      \`;
      setTimeout(() => {
        const resp = document.getElementById('phosResp');
        if (!resp) return;
        if (item) {
          resp.style.color = '#0F172A';
          resp.innerHTML = \`<div style="font-weight:600;margin-bottom:6px;color:#1D4ED8;">\${item.title}</div><div style="white-space:pre-line;line-height:1.45;">\${item.body}</div>\`;
        } else {
          resp.style.color = '#0F172A';
          resp.innerHTML = \`<div style="font-weight:600;margin-bottom:6px;">Guided Product Demo</div><div>This interactive preview uses deterministic sample workflows (no external AI or CRM is connected). Choose a supported workflow below:</div><div style="display:flex;gap:6px;margin-top:8px;flex-wrap:wrap;"><button class="phos-chip" onclick="runAction('research-competitors')">Research competitors</button><button class="phos-chip" onclick="runAction('generate-report')">Generate a report</button><button class="phos-chip" onclick="runAction('summarize-week')">Summarize my week</button></div>\`;
        }
      }, 550);
    }

    function handleSub(e) {
      e.preventDefault();
      const val = (document.getElementById('phosInput').value || '').trim();
      if (!val) return;
      const low = val.toLowerCase();
      if (low.includes('competitor') || low.includes('research')) runAction('research-competitors', val);
      else if (low.includes('report') || low.includes('q3') || low.includes('lead')) runAction('generate-report', val);
      else if (low.includes('week') || low.includes('summarize') || low.includes('hubspot')) runAction('summarize-week', val);
      else runAction('unsupported', val);
    }

    function resetDemo() { renderHome(); }
    renderHome();
  </script>
</body>
</html>`;
}
