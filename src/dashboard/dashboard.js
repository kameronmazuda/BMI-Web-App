// src/dashboard/dashboard.js

const ROUTES = {
  dashboard: "./dashboard/dashboard.html",
  formular: "./formular/formular.html",
  tables: "./tables/tables.html",
};

const DEFAULT_ROUTE = "dashboard";
const VIEW_ID = "view";
const SIDEBAR_ID = "sidebarNav";

const loadedScripts = new Set();

/* =========================================================
   Routing
========================================================= */

function getCurrentRoute() {
  const hash = location.hash.replace("#", "").trim();
  return ROUTES[hash] ? hash : DEFAULT_ROUTE;
}

function getRouteFile(route) {
  return ROUTES[route];
}

/* =========================================================
   Path Utilities
========================================================= */

function getBaseDirectory(path) {
  const index = path.lastIndexOf("/");
  return index >= 0 ? path.slice(0, index + 1) : "./";
}

function isExternalUrl(url) {
  return /^(https?:)?\/\//i.test(url);
}

function isRootPath(url) {
  return url.startsWith("/");
}

function isSpecialProtocol(url) {
  return ["#", "mailto:", "tel:", "javascript:"].some((prefix) =>
    url.startsWith(prefix),
  );
}

function shouldRewrite(url) {
  if (!url) return false;
  if (isExternalUrl(url)) return false;
  if (isRootPath(url)) return false;
  if (isSpecialProtocol(url)) return false;
  if (url.startsWith("data:") || url.startsWith("blob:")) return false;
  return true;
}

function resolvePath(url, baseDir) {
  const base = new URL(baseDir, window.location.href);
  const resolved = new URL(url, base);
  return `${resolved.pathname}${resolved.search}${resolved.hash}`;
}

/* =========================================================
   Asset Handling
========================================================= */

function rewriteRelativeAssets(container, baseDir) {
  const elements = container.querySelectorAll(
    "link[href], script[src], img[src], source[src], iframe[src]"
  );

  elements.forEach((element) => {
    const attribute = element.hasAttribute("href") ? "href" : "src";
    const value = element.getAttribute(attribute)?.trim();

    if (!shouldRewrite(value)) return;

    element.setAttribute(attribute, resolvePath(value, baseDir));
  });
}

/* =========================================================
   Script Execution
========================================================= */

function executeInlineScripts(container) {
  const scripts = [...container.querySelectorAll("script:not([src])")];

  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    newScript.type = oldScript.type || "text/javascript";
    newScript.textContent = oldScript.textContent || "";
    oldScript.replaceWith(newScript);
  });
}

function loadExternalScript(src, type) {
  if (!src || loadedScripts.has(src)) {
    return Promise.resolve();
  }

  loadedScripts.add(src);

  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = src;
    script.defer = true;
    if (type) script.type = type;

    script.onload = resolve;
    script.onerror = () =>
      reject(new Error(`Failed to load script: ${src}`));

    document.body.appendChild(script);
  });
}

function executeExternalScripts(container) {
  const scripts = [...container.querySelectorAll("script[src]")];

  return Promise.all(
    scripts.map((script) =>
      loadExternalScript(
        script.getAttribute("src")?.trim(),
        script.type
      )
    )
  );
}

/* =========================================================
   View Rendering
========================================================= */

async function fetchView(file) {
  const response = await fetch(file, { cache: "no-store" });

  if (!response.ok) {
    throw new Error(`Failed to load ${file} (HTTP ${response.status})`);
  }

  return response.text();
}

function renderError(container, message) {
  container.innerHTML = `
    <div class="alert alert-danger mb-0">
      ${message}
    </div>
  `;
}

function updateSidebar(route) {
  document
    .querySelectorAll(`#${SIDEBAR_ID} .nav-link`)
    .forEach((link) =>
      link.classList.toggle("active", link.dataset.page === route)
    );
}

/* =========================================================
   Main Route Loader
========================================================= */

async function loadRoute(route) {
  const container = document.getElementById(VIEW_ID);
  if (!container) return;

  const file = getRouteFile(route);

  try {
    const html = await fetchView(file);
    container.innerHTML = html;

    const baseDir = getBaseDirectory(file);

    rewriteRelativeAssets(container, baseDir);
    executeInlineScripts(container);
    await executeExternalScripts(container);

    if (route === "tables") {
      window.tablesInit?.();
    }

    updateSidebar(route);
  } catch (error) {
    renderError(container, error.message);
    console.error(error);
  }
}

/* =========================================================
   Initialization
========================================================= */

function initRouting() {
  loadRoute(getCurrentRoute());

  window.addEventListener("hashchange", () => {
    loadRoute(getCurrentRoute());
  });

  document
    .getElementById(SIDEBAR_ID)
    ?.addEventListener("click", handleSidebarClick);
}

function handleSidebarClick(event) {
  const link = event.target.closest("a[data-page]");
  if (!link) return;

  event.preventDefault();
  location.hash = link.dataset.page;
}

document.addEventListener("DOMContentLoaded", initRouting);