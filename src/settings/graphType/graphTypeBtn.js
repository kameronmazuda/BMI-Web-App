// Saved Settings
let graphType = "bar";

// Load Settings from local storage
function loadGraphTypeFromStorage() {
  const savedGraphType = localStorage.getItem("graphType");
  if (savedGraphType) {
    graphType = JSON.parse(savedGraphType);
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
  // Save GraphType in local storage
  localStorage.setItem("graphType", JSON.stringify(graphType));
  console.log("Graph-Typ im localStorage gespeichert:", graphType);
}

function updateButtonText() {
  const button = document.getElementById("graphTypeBtn");
  if (graphType === "bar") {
    button.textContent = "Balkendiagramm";
  } else {
    button.textContent = "Liniendiagramm";
  }
}

// Loads Settings into Btn
document.addEventListener("DOMContentLoaded", () => {
  loadGraphTypeFromStorage();
  updateButtonText();
});
