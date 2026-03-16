/* =========================================================
   Constants
========================================================= */

const STORAGE_KEY = "bmiData";

const LIMITS = {
  age: { min: 1, max: 120 },
  weight: { min: 1, max: 500 },
  height: { min: 50, max: 250 },
};

/* =========================================================
   DOM Helpers
========================================================= */

function getInputValue(id) {
  return document.getElementById(id)?.value.trim();
}

function setInputValue(id, value) {
  const el = document.getElementById(id);
  if (el) el.value = value;
}

function showElement(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "block";
}

function hideElement(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = "none";
}

/* =========================================================
   Core Logic (Pure Functions)
========================================================= */

function calculateBMIValue(weightKg, heightCm) {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);
  return Math.round(bmi * 10) / 10;
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Untergewicht";
  if (bmi < 25) return "Normalgewicht";
  if (bmi < 30) return "Übergewicht";
  return "Adipositas";
}

/* =========================================================
   Validation
========================================================= */

function validateRange(value, { min, max }, fieldName) {
  if (value < min || value > max) {
    return `${fieldName} muss zwischen ${min} und ${max} liegen!`;
  }
  return null;
}

function validateInputs({ age, date, weight, height }) {
  if (!age || !date || !weight || !height) {
    return "Bitte füllen Sie alle Felder aus!";
  }

  const ageError = validateRange(age, LIMITS.age, "Alter");
  if (ageError) return ageError;

  const weightError = validateRange(weight, LIMITS.weight, "Gewicht");
  if (weightError) return weightError;

  const heightError = validateRange(height, LIMITS.height, "Größe");
  if (heightError) return heightError;

  return null;
}

/* =========================================================
   Storage
========================================================= */

function getStoredBMIData() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
}

function saveBMIData(entry) {
  const data = getStoredBMIData();
  data.push(entry);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function getLastBMIEntry() {
  const data = getStoredBMIData();
  return data[data.length - 1];
}

/* =========================================================
   UI Rendering
========================================================= */

function displayResult(bmi, category) {
  document.getElementById("bmiValue").textContent = `Ihr BMI: ${bmi}`;
  document.getElementById("bmiCategory").textContent = `Kategorie: ${category}`;

  const categoryElement = document.getElementById("bmiCategory");
  categoryElement.className = normalizeCategoryClass(category);

  showElement("result");
}

function normalizeCategoryClass(category) {
  return category
    .toLowerCase()
    .replace("ü", "ue")
    .replace("ö", "oe");
}

function showError(message) {
  const toastEl = document.getElementById("errorToast");
  const bodyEl = document.getElementById("errorToastBody");

  if (!toastEl || !bodyEl) return;

  bodyEl.textContent = message;

  const toast = bootstrap.Toast.getOrCreateInstance(toastEl, {
    delay: 4000
  });

  toast.show();
}

function hideError() {
  hideElement("error");
}

/* =========================================================
   Main Feature
========================================================= */

function calculateBMI() {
  console.log("hello")
  const age = document.getElementById("age")?.value;
  const date = document.getElementById("date")?.value;
  const weight = document.getElementById("weight")?.value;
  const height = document.getElementById("height")?.value;

  if (!age || !date || !weight || !height) {
    showError("Bitte füllen Sie alle Felder aus!");
    return;
  }

  const h = height / 100;
  const bmi = weight / (h * h);

  document.getElementById("bmiValue").textContent =
    `Ihr BMI: ${bmi.toFixed(1)}`;

  document.getElementById("result").style.display = "block";
}

/* =========================================================
   Load / Clear
========================================================= */

function loadFromLocalStorage() {
  const data = getLastBMIEntry();
  if (!data) return;

  setInputValue("age", data.age);
  setInputValue("date", data.date);
  setInputValue("weight", data.weight);
  setInputValue("height", data.height);

  if (data.bmi && data.category) {
    displayResult(data.bmi, data.category);
  }
}

function clearData() {
  localStorage.removeItem(STORAGE_KEY);

  ["age", "date", "weight", "height"].forEach((id) =>
    setInputValue(id, "")
  );

  hideElement("result");
  hideError();
}

/* =========================================================
   Initialization
========================================================= */

function initForm() {
  loadFromLocalStorage();
}

window.calculateBMI = calculateBMI;
window.clearData = clearData;

document.addEventListener("DOMContentLoaded", initForm);