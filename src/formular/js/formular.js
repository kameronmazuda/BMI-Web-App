// Load saved data when page loads
window.addEventListener('load', function () {
    loadFromLocalStorage();
});


function calculateBMI() {
    // Get input values
    const age = document.getElementById('age').value;
    const date = document.getElementById('date').value;
    const weight = document.getElementById('weight').value;
    const height = document.getElementById('height').value;

    // Validate inputs
    const validation = validateInput(age, date, weight, height);
    if (!validation.isValid) {
        showError(validation.message);
        return;
    }

    // Calculate BMI
    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    const bmiRounded = Math.round(bmi * 10) / 10; // 1 decimal place

    // Get BMI category
    const category = getBMICategory(bmiRounded);

    // Save to Local Storage
    saveToLocalStorage(age, date, weight, height, bmiRounded, category);

    // Display result
    displayResult(bmiRounded, category);

    // Hide error messages
    hideError();
}


// Validate all input fields
function validateInput(age, date, weight, height) {
    if (!age || !date || !weight || !height) {
        return {
            isValid: false,
            message: "Bitte füllen Sie alle Felder aus!"
        };
    }

    if (age < 1 || age > 120) {
        return {
            isValid: false,
            message: "Alter muss zwischen 1 und 120 Jahren liegen!"
        };
    }

    if (weight < 1 || weight > 500) {
        return {
            isValid: false,
            message: "Gewicht muss zwischen 1 und 500 kg liegen!"
        };
    }

    if (height < 50 || height > 250) {
        return {
            isValid: false,
            message: "Größe muss zwischen 50 und 250 cm liegen!"
        };
    }

    return { isValid: true };
}


// Get BMI category based on value
function getBMICategory(bmi) {
    if (bmi < 18.5) {
        return "Untergewicht";
    } else if (bmi < 25) {
        return "Normalgewicht";
    } else if (bmi < 30) {
        return "Übergewicht";
    } else {
        return "Adipositas";
    }
}


// Display BMI result
function displayResult(bmi, category) {
    document.getElementById('bmiValue').textContent = `Ihr BMI: ${bmi}`;
    document.getElementById('bmiCategory').textContent = `Kategorie: ${category}`;

    // Add category class for styling
    const categoryElement = document.getElementById('bmiCategory');
    categoryElement.className = category.toLowerCase().replace('ü', 'ue').replace('ö', 'oe');

    // Show result area
    document.getElementById('result').style.display = 'block';
}


// Save data to Local Storage
function saveToLocalStorage(age, date, weight, height, bmi, category) {
    const data = {
        age: age,
        date: date,
        weight: weight,
        height: height,
        bmi: bmi,
        category: category,
        timestamp: new Date().toISOString()
    };

    localStorage.setItem('bmiData', JSON.stringify(data));
    console.log('Data saved to Local Storage:', data);
}


// Load data from Local Storage
function loadFromLocalStorage() {
    const savedData = localStorage.getItem('bmiData');

    if (savedData) {
        const data = JSON.parse(savedData);

        // Fill input fields
        document.getElementById('age').value = data.age || '';
        document.getElementById('date').value = data.date || '';
        document.getElementById('weight').value = data.weight || '';
        document.getElementById('height').value = data.height || '';

        // Show previous result if exists
        if (data.bmi && data.category) {
            displayResult(data.bmi, data.category);
        }

        console.log('Data loaded from Local Storage:', data);
    }
}

// Clear all data and reset form
function clearData() {
    // Clear Local Storage
    localStorage.removeItem('bmiData');

    // Clear form inputs
    document.getElementById('age').value = '';
    document.getElementById('date').value = '';
    document.getElementById('weight').value = '';
    document.getElementById('height').value = '';

    // Hide result and error
    document.getElementById('result').style.display = 'none';
    hideError();

    console.log('All data cleared');
}

// Show error message
function showError(message) {
    const errorElement = document.getElementById('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

// Hide error message
function hideError() {
    document.getElementById('error').style.display = 'none';
}