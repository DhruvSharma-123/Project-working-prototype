(function () {
  "use strict";
  const APP = document.getElementById("app");
  const DAY = 86400000;
  const today = () => new Date();
  const daysFrom = (n) => {
    let d = new Date();
    d.setHours(12, 0, 0, 0);
    d.setDate(d.getDate() + n);
    return d;
  };
  const fmt = (d) =>
    new Intl.DateTimeFormat("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(d);
  const esc = (s) =>
    String(s ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const docs = {
    marksheet: {
      name: "Class 12 marksheet",
      days: [0, 0],
      detail:
        "Fetch an issued copy through DigiLocker if available, or ask your school/board for the correct certificate.",
      office: "School, board portal or DigiLocker",
      link: "https://www.digilocker.gov.in/",
    },
    identity: {
      name: "Identity proof",
      days: [0, 0],
      detail:
        "Review which identity proof the actual scheme accepts. Never share your OTP or password with an assistant.",
      office: "Official issuing authority",
      link: "https://www.digilocker.gov.in/",
    },
    income: {
      name: "Income certificate",
      days: [6, 15],
      detail:
        "Check the applicable state e-District service for the exact process, supporting papers, fees and timeline. The displayed 6–15 days is a fictional estimate for this demo.",
      office: "State e-District / authorized CSC",
      link: "https://services.india.gov.in/service/detail/uttar-pradesh-e-district-services",
    },
    domicile: {
      name: "Residence / domicile certificate",
      days: [5, 12],
      detail:
        "Use the official state service guide to check evidence of residence and how to apply. Processing times vary by district and service.",
      office: "State e-District / authorized CSC",
      link: "https://services.india.gov.in/service/detail/uttar-pradesh-e-district-services",
    },
    bank: {
      name: "Bank / DBT readiness",
      days: [2, 7],
      detail:
        "Confirm the official scheme payment requirements and check bank mapping/seeding through authorised bank or government channels. No bank details should be entered in this prototype.",
      office: "Your bank and official DBT help channels",
      link: "https://pfms.nic.in/",
    },
    photo: {
      name: "Recent photograph",
      days: [0, 1],
      detail:
        "Check the application’s exact photo format, dimensions and size limits. Use a legible, recent photograph where required.",
      office: "Application instructions",
      link: "https://scholarships.gov.in/",
    },
  };
  const schemes = [
    {
      id: "rural",
      name: "Rural Merit Support",
      category: "Education",
      audience: "Class 12 graduates",
      deadline: 12,
      required: ["marksheet", "identity", "income", "domicile", "bank"],
      about: "Illustrative scholarship to practise the full document journey.",
      symbol: "✦",
    },
    {
      id: "skill",
      name: "Skill Udaan Training Grant",
      category: "Skills",
      audience: "Students seeking training",
      deadline: 21,
      required: ["identity", "marksheet", "bank"],
      about:
        "Illustrative training support opportunity with a simpler application.",
      symbol: "↗",
    },
    {
      id: "future",
      name: "NextStep Learning Award",
      category: "Education",
      audience: "First-generation learners",
      deadline: 8,
      required: [
        "marksheet",
        "identity",
        "income",
        "domicile",
        "bank",
        "photo",
      ],
      about: "Illustrative urgent opportunity used to show deadline risk.",
      symbol: "◎",
    },
  ];
  const official = [
    {
      title: "National Scholarship Portal",
      desc: "Find official scholarship information and follow the actual application and status process.",
      url: "https://scholarships.gov.in/",
      icon: "award",
    },
    {
      title: "myScheme",
      desc: "Search government schemes and eligibility rules using the official source.",
      url: "https://www.myscheme.gov.in/",
      icon: "search",
    },
    {
      title: "UP e-District Services",
      desc: "Find published pathways for income, caste, residence and other certificates.",
      url: "https://services.india.gov.in/service/detail/uttar-pradesh-e-district-services",
      icon: "files",
    },
    {
      title: "DigiLocker",
      desc: "Access issuer-provided digital documents and the official sharing/verification ecosystem.",
      url: "https://www.digilocker.gov.in/",
      icon: "shield",
    },
    {
      title: "PFMS",
      desc: "Use official channels to learn about payment status and correction processes.",
      url: "https://pfms.nic.in/",
      icon: "wallet",
    },
  ];
  const icons = {
    home: '<path d="M3 10 12 3l9 7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1z"/><path d="M9 21v-8h6v8"/>',
    award:
      '<circle cx="12" cy="8" r="5"/><path d="m8.5 12-2 9 5.5-3 5.5 3-2-9"/>',
    files:
      '<rect x="5" y="3" width="13" height="17" rx="2"/><path d="M9 8h5M9 12h5M9 16h4M18 7h2a1 1 0 0 1 1 1v12"/>',
    clock: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.5 2"/>',
    message:
      '<path d="M20 11a7 7 0 0 1-7 7H7l-4 3V9a7 7 0 0 1 7-7h3a7 7 0 0 1 7 7z"/><path d="M8 10h8M8 13h5"/>',
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3zM9 3v15M15 6v15"/>',
    wallet:
      '<rect x="3" y="5" width="18" height="15" rx="3"/><path d="M3 9h18M16 15h3"/>',
    shield:
      '<path d="M12 2 4 5v6c0 5 3 9 8 11 5-2 8-6 8-11V5z"/><path d="m9 12 2 2 4-4"/>',
    search: '<circle cx="10" cy="10" r="7"/><path d="m15 15 6 6"/>',
    arrow: '<path d="M4 12h16m-7-7 7 7-7 7"/>',
    arrowdown: '<path d="m6 9 6 6 6-6"/>',
    check: '<path d="m4 12 5 5L20 6"/>',
    alert: '<path d="M12 3 2 21h20zM12 9v5M12 17h.01"/>',
    wifi: '<path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0M9 16a5 5 0 0 1 6 0M12 20h.01"/>',
    download: '<path d="M12 3v13m-5-5 5 5 5-5M4 19h16"/>',
    upload: '<path d="M12 17V4m-5 5 5-5 5 5M4 20h16"/>',
    spark:
      '<path d="m12 2 2.4 7.6L22 12l-7.6 2.4L12 22l-2.4-7.6L2 12l7.6-2.4z"/>',
    external: '<path d="M13 5h6v6M19 5l-9 9"/><path d="M19 14v5H5V5h6"/>',
    reset: '<path d="M3 11a9 9 0 1 1 2.1 6M3 17v-6h6"/>',
    scan: '<path d="M8 3H5a2 2 0 0 0-2 2v3m13-5h3a2 2 0 0 1 2 2v3M3 16v3a2 2 0 0 0 2 2h3m13-5v3a2 2 0 0 1-2 2h-3M7 12h10"/>',
    menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
    info: '<circle cx="12" cy="12" r="10"/><path d="M12 11v6M12 7h.01"/>',
    mic: '<rect x="9" y="2" width="6" height="13" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v4M8 22h8"/>',
    book: '<path d="M4 4h7a2 2 0 0 1 2 2v15a2 2 0 0 0-2-2H4a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1zm9 2a2 2 0 0 1 2-2h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-5a2 2 0 0 0-2 2"/>',
    lock: '<rect x="4" y="10" width="16" height="12" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/>',
    chart: '<path d="M4 20V12m6 8V7m6 13V4m6 16H2"/>',
    circle: '<circle cx="12" cy="12" r="9"/>',
    calendar:
      '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M7 2v6M17 2v6M3 10h18"/>',
    settings:
      '<circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3m-17-7 2 2m10 10 2 2m0-14-2 2M7 17l-2 2"/>',
  };
  const ico = (name, size = 18) =>
    `<svg aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${icons[name] || icons.info}</svg>`;
  const initial = {
    scheme: "rural",
    docStatus: {
      marksheet: "ready",
      identity: "ready",
      income: "missing",
      domicile: "missing",
      bank: "missing",
      photo: "ready",
    },
    district: "Ghaziabad, Uttar Pradesh",
    pay: "dbt",
    story: 0,
    chat: [
      {
        role: "assistant",
        text: "Namaste! I can explain document steps, deadlines and payment issues using demo guidance. I do not have live government access. Ask me in English or Hindi.",
      },
    ],
  };
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem("grampath-prototype-v1") || "{}");
  } catch (e) {}
  let state = {
    ...initial,
    ...saved,
    docStatus: { ...initial.docStatus, ...(saved.docStatus || {}) },
    chat:
      Array.isArray(saved.chat) && saved.chat.length
        ? saved.chat
        : initial.chat,
    page: "home",
    filter: "",
    search: "",
    scan: null,
  };
  const save = () => {
    try {
      const { page, filter, search, scan, ...persist } = state;
      localStorage.setItem("grampath-prototype-v1", JSON.stringify(persist));
    } catch (e) {}
  };
  function scheme() {
    return schemes.find((s) => s.id === state.scheme) || schemes[0];
  }
  function required() {
    return scheme().required;
  }
  function stats() {
    const d = required();
    const ready = d.filter((k) => state.docStatus[k] === "ready");
    const pending = d.filter((k) => state.docStatus[k] !== "ready");
    const remain = scheme().deadline;
    const critical = pending.length
      ? Math.max(
          ...pending.map(
            (k) =>
              docs[k].days[1] + (state.docStatus[k] === "processing" ? 0 : 2),
          ),
        )
      : 0;
    const risk =
      pending.length === 0
        ? "low"
        : critical > remain
          ? "high"
          : critical >= remain - 4
            ? "medium"
            : "low";
    return {
      done: ready.length,
      total: d.length,
      pending,
      percent: Math.round((ready.length / d.length) * 100),
      remain,
      critical,
      risk,
    };
  }
  const riskTag = (r) =>
    `<span class="tag tag-${r === "high" ? "red" : r === "medium" ? "amber" : "green"}">${r === "high" ? "High" : r === "medium" ? "Watch" : "Low"} demo risk</span>`;
  const statusTag = (s) =>
    `<span class="tag tag-${s === "ready" ? "green" : s === "processing" ? "amber" : "gray"}">${s === "ready" ? "Ready" : s === "processing" ? "In progress" : "Missing"}</span>`;
  const a = (url, label, cls = "") =>
    `<a class="${cls}" target="_blank" rel="noopener noreferrer" href="${esc(url)}">${label} ${ico("external", 12)}</a>`;
  const BUTTON = (txt, action, cl = "btn secondary", extra = "") =>
    `<button class="${cl}" data-action="${action}" ${extra}>${txt}</button>`;
  const navs = [
    ["home", "Overview", "home"],
    ["opportunities", "Opportunities", "award"],
    ["documents", "Document Lab", "files"],
    ["planner", "Deadline Planner", "clock"],
    ["assistant", "AI Guide Demo", "message"],
    ["assistance", "Local Assistance", "map"],
    ["payments", "Payment Rescue", "wallet"],
    ["story", "Judge Demo", "spark"],
    ["sources", "Sources & Tech", "shield"],
  ];
  function navButtons(mobile = false) {
    return navs
      .map(
        ([id, label, ic]) =>
          `<button data-action="nav" data-value="${id}" class="${mobile ? "" : "navbtn "}${state.page === id ? "active" : ""}">${!mobile ? ico(ic) : ""}<span>${label}</span>${id === "documents" && !mobile ? "<small>SCAN</small>" : ""}</button>`,
      )
      .join("");
  }
  function header() {
    const active = navs.find((n) => n[0] === state.page) || navs[0];
    return `<div class="mobile-head"><div class="mobile-top"><div class="mobile-brand">Gram<span>Path</span><small style="font-size:10px;margin-left:5px">AI</small></div><span class="tag tag-amber">DEMO</span></div><div class="mobile-nav">${navButtons(true)}</div></div><aside class="side"><div class="brand"><div class="brandmark">G</div><div><div class="brandname">Gram<span>Path</span> AI</div><div class="brandtag">OPPORTUNITY FOR ALL</div></div></div><div class="nav-label">YOUR WORKSPACE</div><nav class="nav">${navButtons()}</nav><div class="sidebottom"><div class="identity"><div class="identity-top"><div class="avatar">RS</div><div><strong>Rahul Sharma</strong><small>Fictional demo student</small></div></div><p>Profile and opportunity data are simulated. Nothing is submitted to a government service.</p><div class="stage">RuralConnect 2026 · Prototype v1</div></div></div></aside><div class="main"><header class="topbar"><div class="crumb">RuralConnect 2026 / <strong>${active[1]}</strong></div><div class="top-actions"><span class="tiny-status" id="connectivity"></span><span class="tag tag-gray">${fmt(today())}</span><span class="tag tag-amber">SIMULATED DATA</span></div></header><main class="page"><div class="notice">${ico("alert")}<span><strong>Working concept demo, not a government service.</strong> Scholarships, student identity, processing times, deadlines and application statuses are fictional. Official verification and payments are not connected.</span></div>${content()}<div class="footer-note">GramPath AI • Client-side prototype • No sensitive document is uploaded to a server • © Concept demo for RuralConnect 2026</div></main></div>`;
  }
  function section(eye, title, lead, action = "") {
    return `<div class="sectiontop"><div><div class="eyebrow">${eye}</div><h1 class="h1">${title}</h1><p class="lead">${lead}</p></div>${action}</div>`;
  }
  function metrics() {
    const s = stats();
    return `<div class="cards3 mt"><div class="panel statcard"><div><div class="label">DOCUMENTS READY</div><div class="number">${s.done} <span class="muted" style="font-size:16px">/ ${s.total}</span></div><div class="hint">For selected demo opportunity</div></div><span class="ico">${ico("files")}</span></div><div class="panel statcard"><div><div class="label">DAYS REMAINING</div><div class="number">${s.remain}</div><div class="hint">Simulated application deadline</div></div><span class="ico">${ico("calendar")}</span></div><div class="panel statcard"><div><div class="label">DEADLINE READINESS</div><div style="margin-top:15px">${riskTag(s.risk)}</div><div class="hint" style="margin-top:12px">Estimated ${s.critical} days critical path</div></div><span class="ico">${ico("chart")}</span></div></div>`;
  }
  function miniJourney() {
    return `<div class="workflow">${[
      ["Find", "Eligibility", "search"],
      ["Prepare", "Documents", "files"],
      ["Review", "Errors", "scan"],
      ["Submit", "Official portal", "upload"],
      ["Track", "Payment", "wallet"],
    ]
      .map(
        ([t, sub, ic], i) =>
          `<div class="workstep"><div class="bubble">${ico(ic, 17)}</div><b>${t}</b><span>${sub}</span></div>`,
      )
      .join("")}</div>`;
  }
  function overview() {
    const s = stats();
    let next = s.pending
      .slice()
      .sort((x, y) => docs[y].days[1] - docs[x].days[1]);
    return `<div class="hero"><div><div class="eyebrow">DESIGNED FOR LAST-MILE ACCESS</div><h2>From <em>eligible</em> to <em>empowered.</em><br>Every step, one guided path.</h2><p>Help rural students prepare documents, understand deadlines, troubleshoot errors and navigate benefit delivery.</p><div class="hero-buttons">${BUTTON(`Explore opportunities ${ico("arrow", 15)}`, "openOpp", "btn light")}${BUTTON(`Watch the judge demo ${ico("arrow", 15)}`, "demo", "btn secondary")}</div></div><div class="hero-stat"><b>11 → 1</b><span>Eleven pain points. One connected student journey.</span></div></div>${metrics()}<div class="split mt"><div class="panel"><div class="between"><div><h3>Readiness for ${esc(scheme().name)}</h3><p>Mark documents ready and watch risk change automatically.</p></div>${BUTTON("Open checklist", "openDocs", "btn sm secondary")}</div><div class="between mt2"><span class="small bold">Preparation completed</span><span class="small bold">${s.percent}%</span></div><div class="progress-track mt2"><div class="progress-fill" style="width:${s.percent}%"></div></div><div class="doc-list mt">${required()
      .map(
        (k) =>
          `<div class="docrow"><span style="color:${state.docStatus[k] === "ready" ? "#0a997b" : "#b7c7c6"}">${ico(state.docStatus[k] === "ready" ? "check" : "circle", 18)}</span><div class="docbody"><b>${docs[k].name}</b><div class="docmeta">${state.docStatus[k] === "ready" ? "Marked ready by the demo user" : docs[k].days[1] + " day example upper estimate"}</div></div>${statusTag(state.docStatus[k])}</div>`,
      )
      .join(
        "",
      )}</div></div><div class="panel"><div class="between"><h3>Next best action</h3>${riskTag(s.risk)}</div><div class="riskbox ${s.risk}"><h4>${s.pending.length ? "Start with " + docs[next[0]].name : "All documents marked ready"}</h4><p>${s.pending.length ? `Your sample deadline is ${s.remain} days away. The slowest outstanding item has an illustrative upper estimate of ${docs[next[0]].days[1]} days.` : "Review actual eligibility, application windows and verification requirements on the official website."}</p>${BUTTON("View my action plan", "openPlanner", "btn sm dark")}</div><div class="divider"></div><h3>What happens after approval?</h3><p>Even approved applications can need separate payment checks. Explore how to find the correct official support channel without sharing private bank credentials.</p>${BUTTON(`Troubleshoot payment ${ico("arrow", 14)}`, "openPayments", "btn sm secondary")}</div></div><h3 class="subhead">One complete opportunity journey</h3>${miniJourney()}<div class="panel mt"><div class="between"><div><h3>How is this different?</h3><p>GramPath connects discovery, readiness, correction and benefit assistance rather than stopping at an opportunity listing.</p></div>${BUTTON("See official data sources", "openSources", "btn sm secondary")}</div></div>`;
  }
  function oppCard(s) {
    const chosen = state.scheme === s.id;
    return `<article class="opp-card ${chosen ? "selected" : ""}"><div class="between"><span class="tag tag-green">${esc(s.category)}</span><span class="tag tag-gray">Illustrative</span></div><div style="font-size:35px;color:#0f8975;line-height:1">${s.symbol}</div><h3>${esc(s.name)} <span style="color:#758a8c;font-weight:600;font-size:11px">(demo)</span></h3><p>${esc(s.about)}</p><div class="inline-list"><span class="pill">${s.required.length} required items</span><span class="pill">${s.deadline} days left</span></div><div class="foot">${BUTTON(chosen ? `${ico("check", 14)} Selected` : "Select opportunity", "chooseScheme", "btn sm " + (chosen ? "light" : ""), `data-value="${s.id}"`)}${a("https://scholarships.gov.in/", "Real scholarships", "btn sm secondary")}</div></article>`;
  }
  function opportunities() {
    const filtered = schemes.filter(
      (s) =>
        (s.name + " " + s.category + " " + s.about)
          .toLowerCase()
          .includes(state.search.toLowerCase()) &&
        (!state.filter || s.category === state.filter),
    );
    return `${section("DISCOVER", "Opportunity Explorer", "Browse fictional examples to experience the workflow. For actual eligibility and deadlines, use the linked government portals.", BUTTON("Official scholarship portal", "openNsp", "btn secondary"))}<div class="panel mb"><div class="grid-form"><div><label class="fieldlabel" for="opp-search">Search examples</label><input class="field" id="opp-search" value="${esc(state.search)}" placeholder="Scholarships, skills, training..."></div><div><label class="fieldlabel" for="opp-filter">Opportunity type</label><select id="opp-filter" class="field"><option value="">All categories</option><option value="Education" ${state.filter === "Education" ? "selected" : ""}>Education</option><option value="Skills" ${state.filter === "Skills" ? "selected" : ""}>Skills</option></select></div></div></div><div class="opp-grid" id="opportunities-grid">${filtered.length ? filtered.map(oppCard).join("") : '<div class="empty">No matching sample opportunities.</div>'}</div><div class="helpbox mt"><h4>Where real opportunities come from</h4><p>Use myScheme and NSP for authentic scholarship details. This demo intentionally does not fabricate live government scheme deadlines, amounts or eligibility decisions.</p><div class="hero-buttons">${a("https://www.myscheme.gov.in/", "myScheme", "btn sm secondary")}${a("https://scholarships.gov.in/", "NSP", "btn sm secondary")}</div></div>`;
  }
  function docList() {
    return required()
      .map(
        (k) =>
          `<div class="docrow"><span style="color:${state.docStatus[k] === "ready" ? "#098775" : "#b4bfbb"}">${ico(state.docStatus[k] === "ready" ? "check" : "files", 19)}</span><div class="docbody"><b>${esc(docs[k].name)}</b><div class="docmeta">${docs[k].days[1] ? "Fictional processing estimate: " + docs[k].days[0] + "–" + docs[k].days[1] + " days" : "Usually available/prepared separately; check real requirements"}</div></div><select aria-label="Status for ${esc(docs[k].name)}" data-docstatus="${k}"><option value="missing" ${state.docStatus[k] === "missing" ? "selected" : ""}>Missing</option><option value="processing" ${state.docStatus[k] === "processing" ? "selected" : ""}>In progress</option><option value="ready" ${state.docStatus[k] === "ready" ? "selected" : ""}>Ready</option></select>${BUTTON("How?", "guideDoc", "btn sm secondary", `data-value="${k}"`)}</div>`,
      )
      .join("");
  }
  function documents() {
    const s = stats();
    const active = state.guideDoc || s.pending[0] || required()[0];
    const d = docs[active];
    return `${section("DOCUMENT READINESS", "Document Lab", "Track what is missing, find out how to obtain it and locally scan an image for basic upload-quality issues.")}
<div class="cards2"><div class="panel"><div class="between"><h3>My required items</h3><span class="tag tag-green">${s.done} / ${s.total} ready</span></div><p class="small">Selected opportunity: <strong>${esc(scheme().name)}</strong></p><div class="progress-track"><div class="progress-fill" style="width:${s.percent}%"></div></div><div class="doc-list mt">${docList()}</div><p class="note mt2">This is a preparation tracker, not a certificate authenticity check or scheme submission.</p></div><div class="panel"><h3>How do I obtain this?</h3><div class="eyebrow mt2">${esc(d.name)}</div><p style="font-size:13px;line-height:1.8">${esc(d.detail)}</p><div class="listitem"><span class="num">1</span><div><b>Check current instructions</b><p>Confirm actual requirements on the appropriate official service page.</p></div></div><div class="listitem"><span class="num">2</span><div><b>Prepare supporting papers</b><p>Bring only what the relevant service requires; details vary.</p></div></div><div class="listitem"><span class="num">3</span><div><b>Apply and track the request</b><p>Keep the acknowledgement safely and use the government service for updates.</p></div></div>${a(d.link, `View related official service`, "btn sm secondary")}<div class="divider"></div><div class="helpbox"><h4>Verification is a separate step</h4><p>Uploaded scans can look good and still be invalid. Only an official issuer or authorised verification system can confirm authenticity.</p></div></div></div><div class="panel mt"><div class="between"><div><h3>Private upload-quality check</h3><p>Images are analysed only inside this browser. This is a simple heuristic, not OCR or government verification.</p></div><span class="tag tag-outline">${ico("lock", 13)} Local-only</span></div><div class="file-drop mt"><div class="uploadmark" style="display:flex;justify-content:center;color:#0c8176">${ico("scan", 35)}</div><b>Choose a document image to check readability</b><p>Supports JPG / PNG / WebP. PDF is checked only for filename, type and file size.</p><label class="btn sm" for="doc-image">${ico("upload", 14)} Select a file</label><input id="doc-image" type="file" accept="image/*,.pdf" style="display:none"><button class="btn sm secondary" style="margin-left:8px" data-action="sampleScan">Try sample scan</button></div><div id="scan-results">${scanView()}</div></div>`;
  }
  function scanView() {
    if (!state.scan)
      return '<div class="note mt2">No files loaded. Try the sample to see what a quality warning looks like.</div>';
    const sc = state.scan;
    return `<div class="mt"><div class="between"><b>Scan report: ${esc(sc.name)}</b><span class="tag tag-${sc.flags.length ? "amber" : "green"}">${sc.flags.length ? "Review suggested" : "Basic checks passed"}</span></div><div class="quality-grid mt2"><div class="quality"><b>${esc(sc.resolution)}</b><small>Image dimensions</small></div><div class="quality"><b>${esc(sc.brightness)}</b><small>Average brightness</small></div><div class="quality"><b>${esc(sc.contrast)}</b><small>Contrast indicator</small></div></div><div class="${sc.flags.length ? "riskbox" : "helpbox"} mt2"><h4>${sc.flags.length ? "Potential quality issues" : "No obvious basic image-quality issue"}</h4><p>${sc.flags.length ? sc.flags.map(esc).join(" • ") : "Check every field manually. Quality checks cannot determine accuracy, acceptance or authenticity."}</p></div><p class="note">No image is sent to any server. ${sc.sample ? "This result is preconfigured to demonstrate an issue." : "Heuristic results may be inaccurate."}</p></div>`;
  }
  function planner() {
    const s = stats();
    const max = Math.max(s.remain, s.critical + 2, 25);
    const pending = s.pending
      .map((k) => ({ id: k, ...docs[k] }))
      .sort((a, b) => b.days[1] - a.days[1]);
    return `${section("SMART ACTION PLANNING", "Deadline Risk Planner", "A transparent prototype calculation compares fictional document durations against a fictional deadline. No hidden AI prediction or promised issuance date.", BUTTON("Edit document statuses", "openDocs", "btn secondary"))}<div class="cards3"><div class="panel"><div class="label">DEMO DEADLINE</div><div class="number" style="font-size:25px;font-weight:800;margin-top:8px">${fmt(daysFrom(s.remain))}</div><p>${s.remain} days from today</p></div><div class="panel"><div class="label">CRITICAL PREPARATION PATH</div><div class="number" style="font-size:25px;font-weight:800;margin-top:8px">${s.critical} days</div><p>Longest outstanding example estimate + preparation buffer</p></div><div class="panel"><div class="label">RESULT</div><div style="margin-top:13px">${riskTag(s.risk)}</div><p>Updates when document status changes</p></div></div><div class="split mt"><div class="panel"><h3>Document time comparison</h3><p>Visual comparison of scenario durations (not actual government processing statistics).</p><div class="mt">${pending.length ? pending.map((o) => `<div class="risk-row"><div class="between"><b>${esc(o.name)}</b><span class="small muted">${o.days[0]}–${o.days[1]} days (example)</span></div><div class="risk-track"><div class="risk-bar" style="width:${Math.max((o.days[1] / max) * 100, 2)}%"></div><div class="risk-over" style="left:${Math.min((s.remain / max) * 100, 100)}%;width:2px;background:#be553f;opacity:1"></div></div></div>`).join("") : '<div class="empty">All required documents are marked ready.</div>'}</div><div class="mt2 note"><span style="color:#0b9a7d;font-weight:800">■</span> Example upper duration &nbsp; <span style="color:#be553f;font-weight:800">│</span> Demo deadline position</div></div><div class="panel"><h3>Your recommended next actions</h3><div class="riskbox ${s.risk} mt2"><h4>${s.risk === "high" ? "Deadline may be difficult" : s.risk === "medium" ? "Review time-sensitive tasks" : "A more manageable scenario"}</h4><p>${s.pending.length ? `You have ${s.remain} demo days and at least one outstanding item with a ${s.critical}-day illustrative critical path. Actual times must be checked with the issuer.` : "Your tracked items are ready. This does not establish official eligibility or completed submission."}</p></div>${(pending.length ? pending.slice(0, 4) : [{ name: "Check final submission and payment requirements", id: "bank", days: [0, 0] }]).map((o, i) => `<div class="stepitem"><span class="num">${i + 1}</span><div><b>${esc(o.name)}</b><div class="note">${i === 0 ? "Start with this step." : "Can often be prepared while other steps are underway—confirm actual dependencies."}</div></div></div>`).join("")}<div class="helpbox mt2"><h4>Why not simply add all days?</h4><p>Independent documents may be prepared in parallel, so the demo uses the slowest outstanding task as a rough critical path. Real dependencies, queues and corrections can change the result.</p></div></div></div>`;
  }
  function assistant() {
    return `${section("LOCAL RULE-BASED DEMO", "Guidance Assistant", "Try Hindi or English. This prototype routes common questions to scripted, source-linked guidance; it is not yet connected to a trained LLM or live RAG.", BUTTON("Learn about real data", "openSources", "btn secondary"))}<div class="split"><div class="panel"><div class="between"><h3>Ask GramPath</h3><span class="tag tag-amber">Not live AI</span></div><div class="chat mt2" id="chat-area">${state.chat.map((m) => `<div class="msg ${m.role}">${esc(m.text)}</div>`).join("")}</div><div class="suggestions">${["How to get income certificate?", "Will I miss the deadline?", "How do I verify a document?", "My scholarship payment failed", "मेरा इनकम सर्टिफिकेट कैसे बनेगा?"].map((q) => `<button data-action="question" data-value="${esc(q)}">${esc(q)}</button>`).join("")}</div><form id="chat-form" class="chat-controls"><input class="field" id="chat-input" maxlength="400" placeholder="Ask about certificates, deadlines, DBT..." autocomplete="off" required><button class="btn" type="submit" title="Send question">${ico("arrow", 18)}</button><button type="button" data-action="voice" class="btn secondary" title="Speech input if supported">${ico("mic", 17)}</button></form><p class="note">Voice recognition, if available in your browser, may use an online service. Do not enter OTPs, Aadhaar numbers, bank details, or private certificates.</p></div><div class="panel"><h3>What is actually intelligent here?</h3><div class="stepitem"><span class="num">1</span><div><b>Intent detection (prototype)</b><p>The app recognises simple words such as “income”, “deadline” and “DBT”.</p></div></div><div class="stepitem"><span class="num">2</span><div><b>Official source routing</b><p>It suggests the relevant government service rather than inventing new procedures.</p></div></div><div class="stepitem"><span class="num">3</span><div><b>Planned RAG upgrade</b><p>A production system would retrieve current official instructions from a verified database and use an existing AI model to explain them with citations.</p></div></div><div class="helpbox mt"><h4>Why this transparency matters</h4><p>A polished chat interface is not evidence that an AI model was trained. Judges should see exactly which features are implemented and which are future work.</p></div></div></div>`;
  }
  function assistantReply(q) {
    let s = q.toLowerCase();
    const hindi = /[\u0900-\u097f]/.test(q);
    if (/verify|authentic|genuine|सत्यापन|असली/.test(s))
      return "A browser scan cannot prove that a certificate is genuine. Check an issued document through its authorised issuer or DigiLocker workflow where supported: https://www.digilocker.gov.in/. Only officially authorised systems can verify authenticity.";
    if (/income|इनकम|आय प्रमाण|certificate|सर्टिफिकेट|दस्तावेज/.test(s)) {
      return hindi
        ? "आय प्रमाण पत्र के लिए अपने राज्य की आधिकारिक e-District सेवा पर वर्तमान दस्तावेज़ और आवेदन प्रक्रिया देखें। इस डेमो में दिखाया गया समय वास्तविक सरकारी समय नहीं है। आधिकारिक सेवा: https://services.india.gov.in/service/detail/uttar-pradesh-e-district-services"
        : "For an income or residence certificate, check your state e-District instructions and current requirements. The timelines shown in GramPath are fictional, not official. Official reference: https://services.india.gov.in/service/detail/uttar-pradesh-e-district-services";
    }
    if (/deadline|late|time|समय|डेडलाइन|अंतिम तारीख|last date/.test(s)) {
      const r = stats();
      return `In this simulated example, ${scheme().name} has ${r.remain} days remaining, with ${r.pending.length} items still not marked ready and an illustrative ${r.critical}-day critical path. Open Deadline Planner to see the assumptions. Always confirm live deadlines on the official application portal.`;
    }
    if (/pay|dbt|bank|money|scholarship|payment|पेमेंट|पैसे|भुगतान/.test(s))
      return "For scholarship payment problems, identify the official payment stage, read the scheme instructions, and check official bank / DBT / PFMS support channels. Never share account passwords or OTPs. Portal: https://pfms.nic.in/. This demo has no access to your payment status.";
    if (/offline|internet|नेट|इंटरनेट/.test(s))
      return "GramPath can reopen saved guidance and demonstration data without the internet once the webpage is saved or served with its offline cache. Live government checks, up-to-date dates, voice recognition and external help links still require connectivity.";
    if (/help|office|csc|सहायता|केंद्र/.test(s))
      return "Choose the Local Assistance screen and enter your town or district. GramPath can open a map search for nearby CSCs; independently confirm the service, fees and timings before travelling.";
    return "I do not have a verified answer for that question in this demo. Try asking about certificates, deadlines, document checks or scholarship payments. For live rules, use myScheme (https://www.myscheme.gov.in/) or NSP (https://scholarships.gov.in/).";
  }
  function assistance() {
    return `${section("OFFICIAL SUPPORT ROUTING", "Local Assistance Navigator", "Find a nearby service point through a map search and confirm current procedures using government websites. No centres are invented in this demo.")}
<div class="split"><div class="panel"><h3>Find help near your district</h3><p>Enter a locality, then open a CSC search. The search opens an external map service; results are not endorsed or verified by GramPath.</p><div class="mt"><label for="district-input" class="fieldlabel">District or town</label><input class="field" id="district-input" maxlength="90" value="${esc(state.district)}" placeholder="e.g. Ghaziabad, Uttar Pradesh"></div><div class="hero-buttons">${BUTTON(`${ico("map", 15)} Search nearby CSCs`, "nearby", "btn")}${BUTTON("Find government offices", "govtMap", "btn secondary")}</div><div class="divider"></div><div class="helpbox"><h4>Before visiting any centre</h4><p>Check whether it handles your certificate, what original papers are required, the official service charge, working hours and acknowledgement process.</p></div></div><div class="panel"><h3>Help checklist</h3>${["Understand which government office is responsible", "Confirm official requirements and fees", "Carry only necessary documents", "Keep your acknowledgement number secure", "Track any service request on the issuer portal"].map((t, i) => `<div class="stepitem"><span class="num">${i + 1}</span><div class="small">${t}</div></div>`).join("")}<p class="note">Location search requires internet and uses your entered place, not your device’s precise location.</p></div></div><h3 class="subhead">Verified starting points</h3><div class="cards2">${official.slice(0, 4).map(source).join("")}</div>`;
  }
  const paymentCases = {
    dbt: {
      title: "DBT / bank seeding problem",
      subtitle: "The benefit is approved but bank mapping may be incomplete.",
      steps: [
        "Check which payment prerequisites your specific scheme requires.",
        "Use your bank’s authorised support process to confirm Aadhaar seeding / DBT mapping where applicable.",
        "Recheck the official scholarship or payment portal after correction.",
      ],
      note: "An approved scholarship does not guarantee payment completion.",
    },
    pending: {
      title: "Payment not yet credited",
      subtitle: "Your application was processed but the money has not arrived.",
      steps: [
        "Check the official scholarship or PFMS status with your own secure login.",
        "Look for an official disbursement date or processing notice.",
        "If the published processing window has passed, contact the scheme helpdesk or bank.",
      ],
      note: "The prototype cannot tell whether a payment has actually been sent.",
    },
    rejected: {
      title: "Payment returned or rejected",
      subtitle: "An official payment record may list an error reason.",
      steps: [
        "Read the exact error from the official portal or notice.",
        "Follow the issuing authority’s documented correction instructions.",
        "Submit required corrections through the authorised channel, then recheck the status.",
      ],
      note: "Do not upload bank statements or identity details here.",
    },
    unknown: {
      title: "Status is unclear",
      subtitle: "You do not know whether the issue is verification or payment.",
      steps: [
        "First check the application verification stage on the official scheme portal.",
        "Next confirm whether the payment has been initiated.",
        "Use the relevant official helpdesk based on the stage where the process is stuck.",
      ],
      note: "Do not confuse “application submitted” with “payment approved”.",
    },
  };
  function payments() {
    const p = paymentCases[state.pay] || paymentCases.dbt;
    return `${section("AFTER APPROVAL", "Payment Rescue", "Even an approved application may need a separate payment or DBT correction. This demo guides the next safe step; it cannot view live bank or scholarship records.")}
<div class="split"><div class="panel"><h3>What seems to be wrong?</h3><p>Select a sample problem to see the next-step guidance.</p><div class="doc-list mt">${Object.entries(
      paymentCases,
    )
      .map(
        ([id, o]) =>
          `<button class="payment-issue ${state.pay === id ? "selected" : ""}" data-action="setPay" data-value="${id}"><div><b>${esc(o.title)}</b><small>${esc(o.subtitle)}</small></div>${ico(state.pay === id ? "check" : "arrow", 17)}</button>`,
      )
      .join(
        "",
      )}</div></div><div class="panel"><div class="between"><h3>Your payment recovery plan</h3><span class="tag tag-amber">Demo scenario</span></div><p>${esc(p.subtitle)}</p>${p.steps.map((o, i) => `<div class="stepitem"><span class="num">${i + 1}</span><div>${esc(o)}</div></div>`).join("")}<div class="riskbox mt"><h4>Important</h4><p>${esc(p.note)} Never enter bank credentials, card details, Aadhaar numbers, or OTPs into GramPath.</p></div><div class="hero-buttons">${a("https://pfms.nic.in/", "Visit official PFMS", "btn sm secondary")}${a("https://scholarships.gov.in/", "National Scholarship Portal", "btn sm secondary")}</div></div></div><div class="panel mt"><h3>The overlooked final mile</h3>${miniJourney()}<p class="note mt">Our concept continues beyond application submission. Government integration would require approvals and secure, consent-based APIs in a production implementation.</p></div>`;
  }
  const storySteps = [
    {
      h: "The opportunity is found",
      tag: "Discovery",
      t: "Rahul, a fictional rural student, finds a sample scholarship and checks its document requirements.",
      action: "Explore the sample opportunities",
      page: "opportunities",
    },
    {
      h: "A key document is missing",
      tag: "Preparation",
      t: "The demo shows an income certificate as missing. Rahul sees where to check the official issuing procedure and updates its status.",
      action: "Open Document Lab",
      page: "documents",
    },
    {
      h: "The deadline may be at risk",
      tag: "Planning",
      t: "The planner compares the missing certificate’s fictional processing window with the sample application deadline, then highlights the bottleneck.",
      action: "Open Deadline Planner",
      page: "planner",
    },
    {
      h: "A scan may be unreadable",
      tag: "Document quality",
      t: "Rahul tests the basic scan quality locally in his browser. The system highlights readability concerns but does not claim legal verification.",
      action: "Try the scan",
      page: "documents",
    },
    {
      h: "An office visit may be needed",
      tag: "Help",
      t: "He searches for CSCs in his own district and checks official service requirements before travelling.",
      action: "Find assistance",
      page: "assistance",
    },
    {
      h: "Approved does not always mean paid",
      tag: "Benefit delivery",
      t: "Finally, a fictional payment issue is shown. GramPath explains safe next steps and points to official payment checks.",
      action: "Open Payment Rescue",
      page: "payments",
    },
  ];
  function story() {
    let o = storySteps[state.story];
    return `${section("DEMONSTRATE TO JUDGES", "A Student’s Complete Journey", "A guided six-step presentation that proves how GramPath connects 11 problems into one student-centred flow.")}
<div class="panel"><div class="between"><span class="tag tag-green">SCENARIO ${state.story + 1} OF ${storySteps.length}</span><span class="small muted">Fictional case study</span></div><div class="progress-track mt"><div class="progress-fill" style="width:${((state.story + 1) / storySteps.length) * 100}%"></div></div><div style="max-width:650px;margin:32px auto 24px;text-align:center"><div class="eyebrow">${esc(o.tag)}</div><div style="font-size:53px;margin:13px auto;color:#088574">${["①", "②", "③", "④", "⑤", "⑥"][state.story]}</div><h2 style="font-size:29px;letter-spacing:-1px;margin:8px 0">${esc(o.h)}</h2><p style="font-size:14px;line-height:1.8">${esc(o.t)}</p><div class="hero-buttons" style="justify-content:center">${BUTTON("Try this feature " + ico("arrow", 15), "storyGoto", "btn", `data-value="${o.page}"`)}</div></div><div class="between"><button class="btn secondary" data-action="storyPrev" ${state.story === 0 ? "disabled" : ""}>← Previous</button><div class="demo-flow">${storySteps.map((_, i) => `<button aria-label="Jump to story step ${i + 1}" title="Step ${i + 1}" data-action="storyJump" data-value="${i}" style="width:11px;height:11px;border-radius:100%;border:0;background:${i === state.story ? "#0a8875" : "#d5e5e1"};padding:0"></button>`).join("")}</div><button class="btn" data-action="storyNext" ${state.story === storySteps.length - 1 ? "disabled" : ""}>Next →</button></div></div><div class="helpbox mt"><h4>The pitch in one sentence</h4><p>“GramPath doesn't stop at finding opportunities—it helps rural students navigate readiness, deadlines, official support and benefit delivery.”</p></div>`;
  }
  function source(o) {
    return `<div class="source"><div class="source-ico">${ico(o.icon, 20)}</div><div><h4>${esc(o.title)}</h4><p>${esc(o.desc)}</p>${a(o.url, "Open official website")}</div></div>`;
  }
  function sources() {
    return `${section("TECHNOLOGY & TRUST", "Sources and Architecture", "See exactly what runs in this prototype, what would power the production AI, and how official information should be handled.")}
<div class="cards2"><div class="panel"><h3>Working right now</h3>${[
      ["Web application", "HTML + CSS + JavaScript, no installation"],
      [
        "State and records",
        "Browser localStorage + fictional example datasets",
      ],
      ["Planner", "Transparent JavaScript critical-path rules"],
      ["Image pre-check", "Browser canvas image processing"],
      ["Offline", "Standalone page and optional service-worker cache"],
      ["Guide", "Scripted Hindi/English keyword responses"],
    ]
      .map(
        (x) =>
          `<div class="listitem"><span class="num">${ico("check", 14)}</span><div><b>${x[0]}</b><div class="note">${x[1]}</div></div></div>`,
      )
      .join(
        "",
      )}</div><div class="panel"><h3>Production technology roadmap</h3>${[
      ["Frontend", "React + Tailwind / PWA"],
      ["Backend", "Python FastAPI"],
      ["Data", "PostgreSQL / Supabase + source metadata"],
      [
        "AI assistant",
        "Pretrained LLM + RAG over verified government guidance",
      ],
      ["Document checks", "OpenCV / OCR, permitted uploads and secure consent"],
      ["Deployment", "Cloud hosting with encryption, logs, access control"],
    ]
      .map(
        (x) =>
          `<div class="listitem"><span class="num">${ico("arrow", 14)}</span><div><b>${x[0]}</b><div class="note">${x[1]}</div></div></div>`,
      )
      .join(
        "",
      )}</div></div><h3 class="subhead">Government sources to use when building real data</h3><div class="cards2">${official.map(source).join("")}</div><div class="riskbox mt"><h4>Hard boundaries of this demo</h4><p>No actual scholarship eligibility decisions, government certificate authenticity checks, live deadlines, bank/payment queries, or real AI model training are performed. Any real integrations need official authorisation, privacy controls and regularly reverified information.</p></div><div class="panel mt"><div class="between"><div><h3>Start a clean judge demonstration</h3><p>Reset the fictional profile, sample documents and guided story to their original state.</p></div>${BUTTON(`${ico("reset", 15)} Reset demo`, "reset", "btn secondary")}</div></div>`;
  }
  function content() {
    switch (state.page) {
      case "home":
        return overview();
      case "opportunities":
        return opportunities();
      case "documents":
        return documents();
      case "planner":
        return planner();
      case "assistant":
        return assistant();
      case "assistance":
        return assistance();
      case "payments":
        return payments();
      case "story":
        return story();
      case "sources":
        return sources();
      default:
        return overview();
    }
  }
  function onlineState() {
    const el = document.getElementById("connectivity");
    if (el)
      el.innerHTML = `<span class="dot" style="background:${navigator.onLine ? "#28b88e" : "#d88b3a"}"></span> ${navigator.onLine ? "Online" : "Offline"} · saved demo works`;
  }
  function render() {
    APP.innerHTML = `<div class="shell">${header()}</div>`;
    onlineState();
    if (state.page === "assistant") {
      const el = document.getElementById("chat-area");
      if (el) el.scrollTop = el.scrollHeight;
    }
  }
  function toast(txt) {
    const old = document.querySelector(".toast");
    if (old) old.remove();
    const n = document.createElement("div");
    n.className = "toast";
    n.textContent = txt;
    document.body.appendChild(n);
    setTimeout(() => n.remove(), 3100);
  }
  function setPage(page) {
    state.page = page;
    render();
    window.scrollTo(0, 0);
  }
  function openSafe(url) {
    window.open(url, "_blank", "noopener,noreferrer");
  }
  function sample() {
    state.scan = {
      name: "Sample blurry certificate (synthetic)",
      resolution: "720 × 540",
      brightness: "normal",
      contrast: "low",
      flags: [
        "Low resolution for this demonstration",
        "Text may be difficult to read; retake a clear image",
      ],
      sample: true,
    };
    render();
    const e = document.getElementById("scan-results");
    e?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }
  function imageScan(file) {
    if (!file) {
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast("File exceeds the 10 MB demo limit.");
      return;
    }
    if (file.type === "application/pdf" || /\.pdf$/i.test(file.name)) {
      state.scan = {
        name: file.name,
        resolution: "PDF",
        brightness: "not checked",
        contrast: "not checked",
        flags: [
          "PDF content is not analysed in this prototype; check it visually and use official validation channels",
        ],
        sample: false,
      };
      render();
      return;
    }
    if (!file.type.startsWith("image/")) {
      toast("Choose an image or PDF file.");
      return;
    }
    const img = new Image();
    const objectURL = URL.createObjectURL(file);
    img.onload = () => {
      try {
        const w = img.naturalWidth,
          h = img.naturalHeight;
        let cw = Math.min(260, w),
          ch = Math.max(1, Math.round((h * cw) / w));
        const canvas = document.createElement("canvas");
        canvas.width = cw;
        canvas.height = ch;
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, cw, ch);
        let pixels = ctx.getImageData(0, 0, cw, ch).data;
        let count = 0,
          sum = 0,
          sum2 = 0;
        for (let i = 0; i < pixels.length; i += 16) {
          const v =
            pixels[i] * 0.299 + pixels[i + 1] * 0.587 + pixels[i + 2] * 0.114;
          sum += v;
          sum2 += v * v;
          count++;
        }
        const mean = sum / count,
          sd = Math.sqrt(Math.max(0, sum2 / count - mean * mean));
        const flags = [];
        if (w < 900 || h < 650)
          flags.push("Low image resolution for small printed text");
        if (mean < 75) flags.push("Image may be too dark");
        if (mean > 225) flags.push("Image may be overexposed");
        if (sd < 34)
          flags.push("Low contrast: small characters may not be legible");
        state.scan = {
          name: file.name,
          resolution: `${w} × ${h}`,
          brightness: mean < 75 ? "low" : mean > 225 ? "high" : "normal",
          contrast: sd < 34 ? "low" : "moderate / high",
          flags,
          sample: false,
        };
        render();
        toast("Local basic image check complete. No file was uploaded.");
      } catch (err) {
        toast("Unable to inspect this image.");
      } finally {
        URL.revokeObjectURL(objectURL);
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(objectURL);
      toast("This image could not be opened.");
    };
    img.src = objectURL;
  }
  const pages = {
    openOpp: "opportunities",
    demo: "story",
    openDocs: "documents",
    openPlanner: "planner",
    openPayments: "payments",
    openSources: "sources",
  };
  document.addEventListener("click", (e) => {
    const b = e.target.closest("[data-action]");
    if (!b) return;
    const ac = b.dataset.action,
      val = b.dataset.value;
    if (ac === "nav") {
      setPage(val);
      return;
    }
    if (pages[ac]) {
      setPage(pages[ac]);
      return;
    }
    if (ac === "chooseScheme") {
      state.scheme = val;
      save();
      render();
      toast("Sample opportunity selected. Risk and checklists recalculated.");
    } else if (ac === "guideDoc") {
      state.guideDoc = val;
      render();
    } else if (ac === "sampleScan") sample();
    else if (ac === "openNsp") openSafe("https://scholarships.gov.in/");
    else if (ac === "question") {
      state.chat.push(
        { role: "user", text: val },
        { role: "assistant", text: assistantReply(val) },
      );
      save();
      render();
    } else if (ac === "setPay") {
      state.pay = val;
      save();
      render();
    } else if (ac === "storyNext") {
      state.story = Math.min(state.story + 1, storySteps.length - 1);
      save();
      render();
    } else if (ac === "storyPrev") {
      state.story = Math.max(0, state.story - 1);
      save();
      render();
    } else if (ac === "storyJump") {
      state.story = Number(val);
      save();
      render();
    } else if (ac === "storyGoto") {
      setPage(val);
    } else if (ac === "reset") {
      if (confirm("Reset the demonstration to its original fictional data?")) {
        try {
          localStorage.removeItem("grampath-prototype-v1");
        } catch (e) {}
        state = {
          ...initial,
          docStatus: { ...initial.docStatus },
          chat: [...initial.chat],
          page: "home",
          filter: "",
          search: "",
          scan: null,
        };
        render();
        toast("Demo reset successfully.");
      }
    } else if (ac === "nearby" || ac === "govtMap") {
      const q =
        (ac === "nearby"
          ? "Common Service Centre CSC "
          : "government e-District office ") +
        (state.district || "Uttar Pradesh");
      openSafe(
        "https://www.google.com/maps/search/?api=1&query=" +
          encodeURIComponent(q),
      );
    } else if (ac === "voice") {
      const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SR) {
        toast("Voice recognition is unavailable in this browser.");
        return;
      }
      let r = new SR();
      r.lang = "hi-IN";
      r.interimResults = false;
      r.onresult = (ev) => {
        let input = document.getElementById("chat-input");
        if (input) input.value = ev.results[0][0].transcript;
      };
      r.onerror = () =>
        toast("Voice input unavailable. Please type your question.");
      try {
        r.start();
        toast("Listening (browser speech recognition)...");
      } catch (e) {
        toast("Could not start voice input.");
      }
    }
  });
  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("[data-docstatus]")) {
      state.docStatus[t.dataset.docstatus] = t.value;
      save();
      render();
      toast("Document readiness and risk updated.");
    } else if (t.id === "doc-image") imageScan(t.files?.[0]);
    else if (t.id === "opp-filter") {
      state.filter = t.value;
      render();
    }
  });
  document.addEventListener("input", (e) => {
    if (e.target.id === "opp-search") {
      state.search = e.target.value;
      const filtered = schemes.filter(
        (s) =>
          (s.name + " " + s.category + " " + s.about)
            .toLowerCase()
            .includes(state.search.toLowerCase()) &&
          (!state.filter || s.category === state.filter),
      );
      const grid = document.getElementById("opportunities-grid");
      if (grid)
        grid.innerHTML = filtered.length
          ? filtered.map(oppCard).join("")
          : '<div class="empty">No matching sample opportunities.</div>';
    }
    if (e.target.id === "district-input") {
      state.district = e.target.value;
      save();
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "chat-form") return;
    e.preventDefault();
    let input = document.getElementById("chat-input");
    let q = input?.value?.trim();
    if (!q) return;
    state.chat.push(
      { role: "user", text: q },
      { role: "assistant", text: assistantReply(q) },
    );
    if (state.chat.length > 28) state.chat = state.chat.slice(-28);
    save();
    render();
  });
  window.addEventListener("online", onlineState);
  window.addEventListener("offline", onlineState);
  render();
  if (location.protocol.startsWith("http") && "serviceWorker" in navigator) {
    navigator.serviceWorker.register("./sw.js").catch(() => {});
  }
})();
