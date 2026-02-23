function calculateBMI() {
  const age = document.getElementById("age")?.value;
  const date = document.getElementById("date")?.value;
  const weight = document.getElementById("weight")?.value;
  const height = document.getElementById("height")?.value;

  const validation = validateInput(age, date, weight, height);
  if (!validation.isValid) {
    showError(validation.message);
    return;
  }

  const heightInMeters = Number(height) / 100;
  const bmi = Number(weight) / (heightInMeters * heightInMeters);
  const bmiRounded = Math.round(bmi * 10) / 10;

  const category = getBMICategory(bmiRounded);

  saveToLocalStorage(age, date, weight, height, bmiRounded, category);
  displayResult(bmiRounded, category);
  hideError();
}

function validateInput(age, date, weight, height) {
  if (!age || !date || !weight || !height) {
    return { isValid: false, message: "Bitte füllen Sie alle Felder aus!" };
  }

  if (Number(age) < 1 || Number(age) > 120) {
    return {
      isValid: false,
      message: "Alter muss zwischen 1 und 120 Jahren liegen!",
    };
  }

  if (Number(weight) < 1 || Number(weight) > 500) {
    return {
      isValid: false,
      message: "Gewicht muss zwischen 1 und 500 kg liegen!",
    };
  }

  if (Number(height) < 50 || Number(height) > 250) {
    return {
      isValid: false,
      message: "Größe muss zwischen 50 und 250 cm liegen!",
    };
  }

  return { isValid: true };
}

function getBMICategory(bmi) {
  if (bmi < 18.5) return "Untergewicht";
  if (bmi < 25) return "Normalgewicht";
  if (bmi < 30) return "Übergewicht";
  return "Adipositas";
}

function displayResult(bmi, category) {
  document.getElementById("bmiValue").textContent = `Ihr BMI: ${bmi}`;
  document.getElementById("bmiCategory").textContent = `Kategorie: ${category}`;

  const categoryElement = document.getElementById("bmiCategory");
  categoryElement.className = category
    .toLowerCase()
    .replace("ü", "ue")
    .replace("ö", "oe");

  document.getElementById("result").style.display = "block";
}

function saveToLocalStorage(age, date, weight, height, bmi, category) {
  const data = {
    age,
    date,
    weight,
    height,
    bmi,
    category,
    timestamp: new Date().toISOString(),
  };

  localStorage.setItem("bmiData", JSON.stringify(data));
}

function loadFromLocalStorage() {
  const savedData = localStorage.getItem("bmiData");
  if (!savedData) {
    return;
  }

  const data = JSON.parse(savedData);

  const ageEl = document.getElementById("age");
  const dateEl = document.getElementById("date");
  const weightEl = document.getElementById("weight");
  const heightEl = document.getElementById("height");

  if (ageEl) ageEl.value = data.age || "";
  if (dateEl) dateEl.value = data.date || "";
  if (weightEl) weightEl.value = data.weight || "";
  if (heightEl) heightEl.value = data.height || "";

  if (data.bmi && data.category) {
    displayResult(data.bmi, data.category);
  }
}

function clearData() {
  localStorage.removeItem("bmiData");

  const ageEl = document.getElementById("age");
  const dateEl = document.getElementById("date");
  const weightEl = document.getElementById("weight");
  const heightEl = document.getElementById("height");

  if (ageEl) ageEl.value = "";
  if (dateEl) dateEl.value = "";
  if (weightEl) weightEl.value = "";
  if (heightEl) heightEl.value = "";

  const result = document.getElementById("result");
  if (result) result.style.display = "none";

  hideError();
}

function showError(message) {
  const errorElement = document.getElementById("error");
  if (!errorElement) return;

  errorElement.textContent = message;
  errorElement.style.display = "block";
}

function hideError() {
  const errorElement = document.getElementById("error");
  if (!errorElement) return;

  errorElement.style.display = "none";
}

function initFormular() {
  loadFromLocalStorage();
}

// Make functions global for inline onclick=""
window.calculateBMI = calculateBMI;
window.clearData = clearData;

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFormular);
} else {
  initFormular();
}
