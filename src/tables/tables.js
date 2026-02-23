// src/tables/tables.js
(() => {
  // Prevent double-execution (router + iframe + route switches)
  if (window.__tablesLoaded) {
    // Still expose init in case router wants to call it again
    if (typeof window.tablesInit === "function") {
      return;
    }
  }
  window.__tablesLoaded = true;

  let bmiList = [];

  function resolveUrl(relativeToThisScript) {
    const base = document.currentScript?.src || window.location.href;
    return new URL(relativeToThisScript, base).toString();
  }

  function calculateBMI(weight, height) {
    const w = Number(weight);
    const hCm = Number(height);
    if (!Number.isFinite(w) || !Number.isFinite(hCm) || hCm <= 0) {
      return null;
    }
    const h = hCm / 100;
    return Number((w / (h * h)).toFixed(1));
  }

  function bmiRating(bmi) {
    const v = Number(bmi);
    if (!Number.isFinite(v)) return "—";
    if (v < 18.5) return "Untergewicht";
    if (v < 25) return "Normalgewicht";
    if (v < 30) return "Übergewicht";
    return "Adipositas";
  }

  function buildTable(filterSelect, sortSelect, tableBody) {
    let list = [...bmiList];
    const now = new Date();

    if (filterSelect.value !== "all") {
      list = list.filter((entry) => {
        const entryDate = new Date(entry.date);
        const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
        if (filterSelect.value === "week") return diffDays <= 7;
        if (filterSelect.value === "month") return diffDays <= 30;
        return true;
      });
    }

    switch (sortSelect.value) {
      case "date-asc":
        list.sort((a, b) => new Date(a.date) - new Date(b.date));
        break;
      case "date-desc":
        list.sort((a, b) => new Date(b.date) - new Date(a.date));
        break;
      case "bmi-asc":
        list.sort((a, b) => {
          const aBmi = calculateBMI(a.weight, a.height) ?? 1e15;
          const bBmi = calculateBMI(b.weight, b.height) ?? 1e15;
          return aBmi - bBmi;
        });
        break;
      case "bmi-desc":
        list.sort((a, b) => {
          const aBmi = calculateBMI(a.weight, a.height) ?? -1e15;
          const bBmi = calculateBMI(b.weight, b.height) ?? -1e15;
          return bBmi - aBmi;
        });
        break;
    }

    tableBody.innerHTML = "";

    list.forEach((entry, index) => {
      const bmi = calculateBMI(entry.weight, entry.height);

      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${entry.date ?? "—"}</td>
        <td>${entry.weight ?? "—"}</td>
        <td>${entry.height ?? "—"}</td>
        <td>${bmi ?? "—"}</td>
        <td>${bmiRating(bmi)}</td>
        <td><button class="btn btn-sm btn-danger" data-index="${index}">Löschen</button></td>
      `;

      tr.querySelector("button")?.addEventListener("click", () => {
        bmiList.splice(index, 1);
        buildTable(filterSelect, sortSelect, tableBody);
      });

      tableBody.appendChild(tr);
    });
  }

  function tablesInit() {
    const filterSelect = document.getElementById("filterSelect");
    const sortSelect = document.getElementById("sortSelect");
    const tableBody = document.getElementById("bmiTableBody");

    if (!filterSelect || !sortSelect || !tableBody) {
      // view not present (yet)
      return;
    }

    // Bind listeners only once per DOM element
    if (!filterSelect.dataset.bound) {
      filterSelect.addEventListener("change", () =>
        buildTable(filterSelect, sortSelect, tableBody),
      );
      filterSelect.dataset.bound = "1";
    }

    if (!sortSelect.dataset.bound) {
      sortSelect.addEventListener("change", () =>
        buildTable(filterSelect, sortSelect, tableBody),
      );
      sortSelect.dataset.bound = "1";
    }

    // Prefer stable root path if you serve /src as web root:
    // fetch("/data/mock.json")
    // Otherwise keep script-relative:
    const jsonUrl = resolveUrl("../data/mock.json");

    fetch(jsonUrl, { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        bmiList = data?.tables?.bmiEntries || [];
        buildTable(filterSelect, sortSelect, tableBody);
      })
      .catch((err) => console.error("Fehler beim Laden der JSON:", err));
  }

  // Export global, so the router can call it after injecting the view
  window.tablesInit = tablesInit;

  // If tables.html is opened directly or inside an iframe, init normally
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tablesInit);
  } else {
    tablesInit();
  }
})();
