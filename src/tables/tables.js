// src/tables/tables.js
(() => {
  if (window.__tablesLoaded) return;
  window.__tablesLoaded = true;

  /* =========================================================
     Constants
  ========================================================= */

  const STORAGE_KEY = "bmiData";
  const DAY_IN_MS = 1000 * 60 * 60 * 24;

  /* =========================================================
     State
  ========================================================= */

  let bmiEntries = [];

  /* =========================================================
     Pure Utilities
  ========================================================= */

  function calculateBMI(weight, heightCm) {
    const w = Number(weight);
    const h = Number(heightCm);

    if (!Number.isFinite(w) || !Number.isFinite(h) || h <= 0) {
      return null;
    }

    const heightM = h / 100;
    return Number((w / (heightM * heightM)).toFixed(1));
  }

  function getBMICategory(bmi) {
    if (!Number.isFinite(bmi)) return "—";
    if (bmi < 18.5) return "Untergewicht";
    if (bmi < 25) return "Normalgewicht";
    if (bmi < 30) return "Übergewicht";
    return "Adipositas";
  }

  function isWithinDays(dateString, days) {
    const entryDate = new Date(dateString);
    if (Number.isNaN(entryDate.getTime())) return false;

    const diff = Date.now() - entryDate.getTime();
    return diff <= days * DAY_IN_MS;
  }

  /* =========================================================
     Storage
  ========================================================= */

  function loadFromStorage() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    } catch {
      return [];
    }
  }

  function saveToStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(bmiEntries));
  }

  function removeEntryByTimestamp(timestamp) {
    bmiEntries = bmiEntries.filter((e) => e.timestamp !== timestamp);
    saveToStorage();
  }

  /* =========================================================
     Filtering & Sorting
  ========================================================= */

  function filterEntries(entries, filterValue) {
    if (filterValue === "week") {
      return entries.filter((e) => isWithinDays(e.date, 7));
    }

    if (filterValue === "month") {
      return entries.filter((e) => isWithinDays(e.date, 30));
    }

    return entries;
  }

  function sortEntries(entries, sortValue) {
    const list = [...entries];

    switch (sortValue) {
      case "date-asc":
        return list.sort((a, b) => new Date(a.date) - new Date(b.date));

      case "date-desc":
        return list.sort((a, b) => new Date(b.date) - new Date(a.date));

      case "bmi-asc":
        return list.sort(
          (a, b) =>
            (calculateBMI(a.weight, a.height) ?? Infinity) -
            (calculateBMI(b.weight, b.height) ?? Infinity),
        );

      case "bmi-desc":
        return list.sort(
          (a, b) =>
            (calculateBMI(b.weight, b.height) ?? -Infinity) -
            (calculateBMI(a.weight, a.height) ?? -Infinity),
        );

      default:
        return list;
    }
  }

  /* =========================================================
     Rendering
  ========================================================= */

  function createRow(entry) {
    const bmi = calculateBMI(entry.weight, entry.height);

    const tr = document.createElement("tr");

    tr.innerHTML = `
      <td>${entry.date ?? "—"}</td>
      <td>${entry.weight ?? "—"}</td>
      <td>${entry.height ?? "—"}</td>
      <td>${bmi ?? "—"}</td>
      <td>${getBMICategory(bmi)}</td>
      <td>
        <button 
          class="btn btn-sm btn-danger" 
          data-timestamp="${entry.timestamp}">
          Löschen
        </button>
      </td>
    `;

    return tr;
  }

  function renderTable(entries, tableBody) {
    tableBody.innerHTML = "";
    entries.forEach((entry) =>
      tableBody.appendChild(createRow(entry)),
    );
  }

  /* =========================================================
     Controller
  ========================================================= */

  function rebuildTable(filterSelect, sortSelect, tableBody) {
    const filtered = filterEntries(bmiEntries, filterSelect.value);
    const sorted = sortEntries(filtered, sortSelect.value);
    renderTable(sorted, tableBody);
  }

  function bindControls(filterSelect, sortSelect, tableBody) {
    if (!filterSelect.dataset.bound) {
      filterSelect.addEventListener("change", () =>
        rebuildTable(filterSelect, sortSelect, tableBody),
      );
      filterSelect.dataset.bound = "1";
    }

    if (!sortSelect.dataset.bound) {
      sortSelect.addEventListener("change", () =>
        rebuildTable(filterSelect, sortSelect, tableBody),
      );
      sortSelect.dataset.bound = "1";
    }

    // Event delegation for delete buttons
    if (!tableBody.dataset.bound) {
      tableBody.addEventListener("click", (event) => {
        const btn = event.target.closest("button[data-timestamp]");
        if (!btn) return;

        removeEntryByTimestamp(btn.dataset.timestamp);
        rebuildTable(filterSelect, sortSelect, tableBody);
      });

      tableBody.dataset.bound = "1";
    }
  }

  /* =========================================================
     Initialization
  ========================================================= */

  function tablesInit() {
    const filterSelect = document.getElementById("filterSelect");
    const sortSelect = document.getElementById("sortSelect");
    const tableBody = document.getElementById("bmiTableBody");

    if (!filterSelect || !sortSelect || !tableBody) {
      return; // View not loaded yet
    }

    bmiEntries = loadFromStorage();

    bindControls(filterSelect, sortSelect, tableBody);
    rebuildTable(filterSelect, sortSelect, tableBody);
  }

  window.tablesInit = tablesInit;

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", tablesInit);
  } else {
    tablesInit();
  }
})();