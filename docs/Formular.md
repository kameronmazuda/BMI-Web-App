# BMI Form - Input Component

## 📝 Project Description
This part of the BMI calculator is responsible for **user input**. Users can enter their personal data and calculate their BMI.

## 🎯 Features

### Input Fields
- **Age** (1-120 years)
- **Date** (calculation date)
- **Weight** (1-500 kg)
- **Height** (50-250 cm)

### Buttons
- **BMI berechnen** - Starts the calculation
- **Clear/Reset** - Clears all inputs and results

### Functionality
- ✅ **Input Validation** - Checks for empty fields and valid values
- ✅ **BMI Calculation** - Formula: `Weight / (Height/100)²`
- ✅ **BMI Categories** - Underweight, Normal weight, Overweight, Obesity
- ✅ **Local Storage** - Saves inputs in browser
- ✅ **Auto-Load** - Loads saved data on page start
- ✅ **Responsive Design** - Works on desktop and mobile


## 🚀 Usage

1. Open `formular.html` in browser
2. Fill all 4 input fields
3. Click "BMI berechnen"
4. Result is displayed and saved
5. On reload: Data is still there
6. "Clear/Reset" deletes all data


## 💾 LocalStorage

**Speicherort:** `localStorage['bmiData']`

Daten werden nach der Berechnung als JSON-String gespeichert:

```json
{
    "age": "25",
    "date": "2025-02-23",
    "weight": "75",
    "height": "180",
    "bmi": 23.1,
    "category": "Normalgewicht",
    "timestamp": "2025-02-23T14:30:45.123Z" // new Date().toISOString()
}
```

### Daten extrahieren
```javascript
// Einfaches Auslesen
const data = JSON.parse(localStorage.getItem('bmiData'));
console.log(data.bmi, data.category);

// Mit Null-Check
if (localStorage.getItem('bmiData')) {
    const data = JSON.parse(localStorage.getItem('bmiData'));
    console.log('Gespeicherte Daten:', data);
}
```

### Daten löschen
```javascript
localStorage.removeItem('bmiData');
```