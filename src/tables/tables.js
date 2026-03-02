let bmiList = [];

const filterSelect = document.getElementById('filterSelect');
const sortSelect = document.getElementById('sortSelect');
const tableBody = document.getElementById('bmiTableBody');

// JSON laden
fetch('../data/mock.json')
  .then(res => res.json())
  .then(data => {
    bmiList = data.tables.bmiEntries;
    buildTable();
  })
  .catch(err => console.error('Fehler beim Laden der JSON:', err));

// Events
filterSelect.addEventListener('change', buildTable);
sortSelect.addEventListener('change', buildTable);

// BMI Berechung
// Weight number
// height number
function calculateBMI(weight, height) {
  const h = height / 100;
  return (weight / (h * h)).toFixed(1);
}

// BMI bewerten
function bmiRating(bmi) {
  if (bmi < 18.5) return 'Untergewicht';
  if (bmi < 25) return 'Normalgewicht';
  if (bmi < 30) return 'Übergewicht';
  return 'Adipositas';
}

// Tabelle neu aufbauen
function buildTable() {
  let list = [...bmiList];
  const now = new Date();

  // Filtern
  if (filterSelect.value !== 'all') {
    list = list.filter(entry => {
      const entryDate = new Date(entry.date);
      const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
      if (filterSelect.value === 'week') return diffDays <= 7;
      if (filterSelect.value === 'month') return diffDays <= 30;
    });
  }

  // Sortieren
  switch (sortSelect.value) {
    case 'date-asc':
      list.sort((a, b) => new Date(a.date) - new Date(b.date));
      break;
    case 'date-desc':
      list.sort((a, b) => new Date(b.date) - new Date(a.date));
      break;
    case 'bmi-asc':
      list.sort((a, b) =>
        calculateBMI(a.weight, a.height) - calculateBMI(b.weight, b.height)
      );
      break;
    case 'bmi-desc':
      list.sort((a, b) =>
        calculateBMI(b.weight, b.height) - calculateBMI(a.weight, a.height)
      );
      break;
  }

  // Tabelle leeren
  tableBody.innerHTML = '';

  // Zeilen erzeugen
  list.forEach((entry, index) => {
    const bmi = calculateBMI(entry.weight, entry.height);

    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${entry.date}</td>
      <td>${entry.weight}</td>
      <td>${entry.height}</td>
      <td>${bmi}</td>
      <td>${bmiRating(bmi)}</td>
      <td><button onclick="deleteEntry(${index})">Löschen</button></td>
    `;
    tableBody.appendChild(tr);
  });
}

// Löschen
function deleteEntry(index) {
  bmiList.splice(index, 1);
  buildTable();
}
