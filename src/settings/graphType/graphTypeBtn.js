// Saved Settings
let graphType = "bar";

// Load Settings from local storage
function loadGraphTypeFromStorage() {
  try {
    const savedGraphType = localStorage.getItem("graphType");
    if (savedGraphType) {
      graphType = JSON.parse(savedGraphType);
    }
  } catch (e) {
    console.log("Fehler beim Laden des Graphtypens aus dem LocalStorage:\n" + e)
  }
}

function toggleGraphType() {
  if (graphType === "bar") {
    graphType = "line";
  } else {
    graphType = "bar";
  }

  updateButtonText();
  saveGraphType();
}

function saveGraphType() {
  try {
    // Save GraphType in local storage
    localStorage.setItem("graphType", JSON.stringify(graphType));
  } catch (e) {
    console.log("Fehler beim Speichern des Graphtypens im LocalStorage:\n" + e)
  }
}

function updateButtonText() {
  const button = document.getElementById("graphTypeBtn");
  const status = document.getElementById("graphTypeStatus");
  if (graphType === "bar") {
    button.textContent = "Balkendiagramm";
    button.setAttribute("aria-label", "Graphtyp: Balkendiagramm");
    if (status) {
      status.textContent = "Graphtyp auf Balkendiagramm gestellt.";
    }
  } else {
    button.textContent = "Liniendiagramm";
    button.setAttribute("aria-label", "Graphtyp: Liniendiagramm");
    if (status) {
      status.textContent = "Graphtyp auf Liniendiagramm gestellt.";
    }
  }

  if (status) {
    setTimeout(() => {
      status.textContent = "";
    }, 1500);
  }
}

// Loads Settings into Btn
document.addEventListener("DOMContentLoaded", () => {
  loadGraphTypeFromStorage();
  updateButtonText();
});
