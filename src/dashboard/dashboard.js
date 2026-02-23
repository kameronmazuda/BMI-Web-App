// src/dashboard/dashboard.js

// Hash route -> view file
const routes = {
  dashboard: "./dashboard/dashboard.html",
  formular: "./formular/formular.html",
  tables: "./tables/tables.html",
};

const loadedScripts = new Set();

function getRouteFromHash() {
  const raw = (location.hash || "#dashboard").replace("#", "").trim();
  return routes[raw] ? raw : "dashboard";
}

function getBaseDir(filePath) {
  const i = filePath.lastIndexOf("/");
  return i >= 0 ? filePath.slice(0, i + 1) : "./";
}

function isAbsoluteUrl(url) {
  return (
    /^(https?:)?\/\//i.test(url) ||
    url.startsWith("data:") ||
    url.startsWith("blob:")
  );
}

function isRootAbsolute(url) {
  return url.startsWith("/");
}

function rewriteRelativeAssets(containerEl, baseDir) {
  const nodes = containerEl.querySelectorAll(
    "link[href], script[src], img[src], source[src], iframe[src]",
  );

  nodes.forEach((el) => {
    const attr = el.hasAttribute("href") ? "href" : "src";
    const val = (el.getAttribute(attr) || "").trim();
    if (!val) {
      return;
    }

    if (isAbsoluteUrl(val) || isRootAbsolute(val)) {
      return;
    }

    // ONLY rewrite "./..."
    if (!val.startsWith("./")) {
      return;
    }

    const newVal = baseDir + val.replace(/^\.\//, "");
    el.setAttribute(attr, newVal);
  });
}

function runInlineScripts(containerEl) {
  // Inline <script> inside innerHTML is NOT executed automatically.
  const scripts = Array.from(containerEl.querySelectorAll("script")).filter(
    (s) => !s.src,
  );

  scripts.forEach((oldScript) => {
    const newScript = document.createElement("script");
    if (oldScript.type) {
      newScript.type = oldScript.type;
    }
    newScript.textContent = oldScript.textContent || "";
    oldScript.replaceWith(newScript);
  });
}

function runExternalScripts(containerEl) {
  const scripts = Array.from(containerEl.querySelectorAll("script[src]"));

  const loaders = scripts.map((oldScript) => {
    const src = (oldScript.getAttribute("src") || "").trim();
    if (!src) {
      return Promise.resolve();
    }

    // schon geladen -> sofort "fertig"
    if (loadedScripts.has(src)) {
      return Promise.resolve();
    }

    loadedScripts.add(src);

    return new Promise((resolve, reject) => {
      const s = document.createElement("script");
      s.src = src;
      s.defer = true;

      if (oldScript.type) {
        s.type = oldScript.type;
      }

      s.onload = () => resolve();
      s.onerror = () => reject(new Error(`Failed to load script: ${src}`));

      document.body.appendChild(s);
    });
  });

  return Promise.all(loaders);
}

async function loadRoute(routeName) {
  console.log("Loading route:", routeName);

  const host = document.getElementById("view");
  const file = routes[routeName];

  if (!host) {
    console.error('Container with id="view" not found.');
    return;
  }

  console.log("Fetching view file:", file);

  const res = await fetch(file, { cache: "no-store" });

  if (!res.ok) {
    host.innerHTML = `<div class="alert alert-danger mb-0">
      Could not load <b>${file}</b> (HTTP ${res.status})
    </div>`;
    console.error("Fetch failed:", res.status, res.statusText);
    return;
  }

  host.innerHTML = await res.text();
  console.log("View injected into #view");

  const baseDir = getBaseDir(file);
  rewriteRelativeAssets(host, baseDir);

  // execute scripts (inline + external) for injected views
  runInlineScripts(host);
  await runExternalScripts(host);

  if (routeName === "tables") {
    window.tablesInit?.();
  }

  document.querySelectorAll("#sidebarNav .nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === routeName);
  });

  // Sidebar active state
  document.querySelectorAll("#sidebarNav .nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === routeName);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  console.log("dashboard.js loaded");

  loadRoute(getRouteFromHash());

  window.addEventListener("hashchange", () => {
    loadRoute(getRouteFromHash());
  });

  document.getElementById("sidebarNav")?.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-page]");
    if (!link) {
      return;
    }

    e.preventDefault();
    location.hash = link.dataset.page;
  });
});
