// "Router-Tabelle": Welche Hash-Route (#dashboard/#forms/#tables) lädt welche HTML-Datei?
const routes = {
  // Wenn die URL ...#dashboard ist, laden wir diese Datei in den Content-Bereich
  dashboard: "./dashboard/dashboard.html",

  // Wenn die URL ...#forms ist, laden wir diese Datei in den Content-Bereich
  forms: "./forms/forms.html",

  // Wenn die URL ...#tables ist, laden wir diese Datei in den Content-Bereich
  tables: "./tables/tables.html",
};

/**
 * Liest die Route aus dem URL-Hash (location.hash).
 * - Kein Hash vorhanden? -> Standard: "dashboard"
 * - Unbekannter Hash?    -> Fallback: "dashboard"
 */
function getRouteFromHash() {
  // location.hash enthält z.B. "#forms", "#dashboard" oder "" (leer)
  // Wenn leer, nehmen wir "#dashboard" als Standard.
  // Danach entfernen wir das "#" und trimmen Whitespace.
  const raw = (location.hash || "#dashboard").replace("#", "").trim();

  // Sicherheits-/Fallback-Logik:
  // Nur wenn raw als Key in routes existiert, verwenden wir ihn,
  // sonst gehen wir zurück auf "dashboard".
  return routes[raw] ? raw : "dashboard";
}

/**
 * Lädt die HTML-Datei für die angegebene Route und rendert sie
 *
 * @param {string} routeName
 */
async function loadRoute(routeName) {
  // Container, in den wir die geladene HTML-Seite einfügen
  const host = document.getElementById("view");

  // Datei-Pfad anhand der Route bestimmen
  const file = routes[routeName];

  // HTML-Datei über HTTP holen
  const res = await fetch(file);

  // Wenn fetch nicht ok ist (z.B. 404), zeigen wir eine Fehlermeldung
  if (!res.ok) {
    host.innerHTML = `<div class="alert alert-danger mb-0">
      Konnte <b>${file}</b> nicht laden (HTTP ${res.status})
    </div>`;
    return;
  }

  // HTML-Text aus der Response lesen...
  host.innerHTML = await res.text();

  // Sidebar-Highlight aktualisieren:
  document.querySelectorAll("#sidebarNav .nav-link").forEach((a) => {
    a.classList.toggle("active", a.dataset.page === routeName);
  });
}

// Sobald das DOM bereit ist, initialisieren wir das Routing/Navigation
document.addEventListener("DOMContentLoaded", () => {
  // Initiale Route laden (aus Hash oder default dashboard)
  loadRoute(getRouteFromHash());

  // Wenn sich der Hash ändert (z.B. Back/Forward oder manuell #forms tippen),
  // dann laden wir die entsprechende Route neu
  window.addEventListener("hashchange", () => {
    loadRoute(getRouteFromHash());
  });

  // Click-Listener auf die Sidebar-Navigation:
  // Wir fangen Klicks ab und setzen nur den Hash
  document.getElementById("sidebarNav")?.addEventListener("click", (e) => {
    const link = e.target.closest("a[data-page]");
    if (!link) return;
    e.preventDefault();
    // Hash auf die gewünschte Route setzen (z.B. "#forms")
    // -> löst "hashchange" aus -> oben wird loadRoute(...) aufgerufen
    location.hash = link.dataset.page;
  });
});
