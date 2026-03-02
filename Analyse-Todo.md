# Analyse-Todo

> Ergebnisse der Code-Analyse vom 16.02.2026 auf Branch `release/v1.0.0-alpha.2`.
> Aufgaben sind nach Prioritaet sortiert. Arbeitet die Abschnitte von oben nach unten ab.

---

## 1. Doppelter Code zusammenfuehren (Prioritaet: Hoch)

Die BMI-Berechnung und die BMI-Kategorie-Einstufung existieren in **3 verschiedenen Dateien** mit fast identischem Code. Wenn sich die Grenzwerte aendern, muesste man alle 3 Stellen anpassen — das fuehrt zu Fehlern.

### Aufgabe 1.1 — Gemeinsame Hilfsdatei erstellen

1. Erstellt eine neue Datei `src/shared/bmi-utils.js`.
2. Verschiebt diese beiden Funktionen dort hinein:

```javascript
// BMI berechnen: Gewicht in kg, Groesse in cm
function calculateBMI(weight, height) {
  const heightInMeters = height / 100;
  return Math.round((weight / (heightInMeters * heightInMeters)) * 10) / 10;
}

// BMI-Kategorie bestimmen
function getBMICategory(bmi) {
  if (bmi < 18.5) return "Untergewicht";
  if (bmi < 25)   return "Normalgewicht";
  if (bmi < 30)   return "Uebergewicht";
  return "Adipositas";
}
```

3. Bindet `src/shared/bmi-utils.js` per `<script>`-Tag in jeder HTML-Datei ein, die diese Funktionen braucht — **vor** dem jeweiligen Modul-Script.

### Aufgabe 1.2 — Doppelten Code entfernen

Loescht nach dem Einbinden die alten Kopien der Funktionen aus diesen Dateien:

- [ ] `src/formular/js/formular.js` — Funktion `calculateBMI()` (Zeile 7-37) und `getBMICategory()` (Zeile 75-85) entfernen. In `calculateBMI()` stattdessen die shared-Funktion aufrufen.
- [ ] `src/tables/tables.js` — Funktion `calculateBMI()` (Zeile 23-26) und `bmiRating()` (Zeile 29-34) entfernen. Ersetzt `bmiRating(bmi)` ueberall durch `getBMICategory(bmi)`.
- [ ] `src/barchart/script.js` — Funktion `getBMIColor()` (Zeile 15-20) kann bleiben (sie macht etwas anderes: Farben), aber die BMI-Berechnung in Zeile 65 soll die shared-Funktion nutzen.

**Tipp:** Nach jeder Aenderung im Browser testen, ob die BMI-Berechnung noch korrekt funktioniert.

---

## 2. Fehlerbehandlung verbessern (Prioritaet: Hoch)

### Aufgabe 2.1 — Fehlermeldung fuer Tabelle sichtbar machen

**Datei:** `src/tables/tables.js`, Zeile 14

**Problem:** Wenn die JSON-Datei nicht geladen werden kann, sieht der Nutzer nichts — der Fehler landet nur in der Konsole.

**So soll es aussehen:**

```javascript
.catch(err => {
  console.error('Fehler beim Laden der JSON:', err);
  tableBody.innerHTML = '<tr><td colspan="6" class="text-center text-danger">Daten konnten nicht geladen werden.</td></tr>';
});
```

- [ ] Aendert die `.catch()`-Zeile in `src/tables/tables.js` so ab, dass eine sichtbare Fehlermeldung in der Tabelle erscheint.

### Aufgabe 2.2 — localStorage sicher auslesen

**Datei:** `src/formular/js/formular.js`, Zeile 124

**Problem:** Wenn jemand den localStorage-Inhalt manuell veraendert (z.B. ueber die Browser-DevTools), kann `JSON.parse()` abstuerzen.

**Loesung:** Umschliesst `JSON.parse()` mit `try/catch`:

```javascript
let data;
try {
  data = JSON.parse(savedData);
} catch (e) {
  console.error('Fehlerhafte Daten im localStorage:', e);
  localStorage.removeItem('bmiData');
  return;
}
```

- [ ] Aendert die Funktion `loadFromLocalStorage()` in `src/formular/js/formular.js`.
- [ ] Aendert auch `src/barchart/script.js` Zeile 13 — dort wird ebenfalls `JSON.parse()` ohne Schutz verwendet.

---

## 3. Console.log-Ausgaben entfernen (Prioritaet: Mittel)

Debug-Ausgaben sollen nicht im fertigen Produkt landen. Loescht oder kommentiert diese Zeilen aus:

- [ ] `src/formular/js/formular.js` — Zeile 115: `console.log('Data saved to Local Storage:', data)`
- [ ] `src/formular/js/formular.js` — Zeile 137: `console.log('Data loaded from Local Storage:', data)`
- [ ] `src/formular/js/formular.js` — Zeile 156: `console.log('All data cleared')`
- [ ] `src/AI_Assistant/js/ai.js` — Zeile 3: `console.log(savedData)`
- [ ] `src/Settings/js/setting.js` — Zeile 30: `console.log('Einstellungen im localStorage gespeichert:', settings)`
- [ ] `src/Settings/js/graphTypeBtn.js` — Zeile 26: `console.log('Graph-Typ im localStorage gespeichert:', graphType)`

**Tipp:** Nutzt die Browser-DevTools (F12 > Konsole), um zu pruefen, dass danach keine ungewollten Ausgaben mehr erscheinen.

---

## 4. Barrierefreiheit / Accessibility (Prioritaet: Mittel)

### Aufgabe 4.1 — Labels fuer Formularfelder ergaenzen

**Datei:** `src/formular/html/formular.html`

**Problem:** Die `<input>`-Felder haben keine `<label>`-Elemente. Screenreader koennen nicht vorlesen, welches Feld was ist.

**Vorher (Zeile 13):**
```html
<input type="number" id="age" name="Age" placeholder="Age (Years)" required min="1" max="120">
```

**Nachher:**
```html
<label for="age">Alter (Jahre)</label>
<input type="number" id="age" name="Age" placeholder="z.B. 25" required min="1" max="120">
```

- [ ] Fuegt fuer **jedes** `<input>` in `src/formular/html/formular.html` ein `<label>` mit passendem `for`-Attribut hinzu (age, date, weight, height).
- [ ] Aendert die Placeholder-Texte auf Deutsch passend zum Label.

### Aufgabe 4.2 — Labels fuer Select-Felder ergaenzen

**Datei:** `src/tables/tables.html`

**Problem:** Die Dropdown-Menues (Zeile 19 und 27) haben keine Labels.

- [ ] Fuegt `<label for="filterSelect">Filter</label>` vor dem Filter-Select ein.
- [ ] Fuegt `<label for="sortSelect">Sortierung</label>` vor dem Sortier-Select ein.

### Aufgabe 4.3 — Sprache im HTML-Tag korrigieren

**Datei:** `src/formular/html/formular.html`, Zeile 2

- [ ] Aendert `<html lang="en">` zu `<html lang="de">`, da die Seite auf Deutsch ist.

---

## 5. innerHTML durch sichere DOM-Methoden ersetzen (Prioritaet: Mittel)

### Aufgabe 5.1 — Tabellenzeilen sicher erzeugen

**Datei:** `src/tables/tables.js`, Zeile 79-86

**Problem:** `innerHTML` mit Template-Literals kann ein Sicherheitsrisiko sein (XSS), wenn spaeter Nutzerdaten direkt eingefuegt werden.

**Vorher:**
```javascript
tr.innerHTML = `
  <td>${entry.date}</td>
  <td>${entry.weight}</td>
  ...
`;
```

**Nachher — erstellt jede Zelle einzeln:**
```javascript
function createCell(text) {
  const td = document.createElement('td');
  td.textContent = text;
  return td;
}

tr.appendChild(createCell(entry.date));
tr.appendChild(createCell(entry.weight));
tr.appendChild(createCell(entry.height));
tr.appendChild(createCell(bmi));
tr.appendChild(createCell(getBMICategory(bmi)));

// Loeschen-Button separat erstellen
const tdAction = document.createElement('td');
const btn = document.createElement('button');
btn.textContent = 'Loeschen';
btn.addEventListener('click', function() { deleteEntry(index); });
tdAction.appendChild(btn);
tr.appendChild(tdAction);
```

- [ ] Baut die Funktion `buildTable()` in `src/tables/tables.js` so um, dass kein `innerHTML` mehr fuer Tabellenzeilen verwendet wird.

**Bonus:** Damit entfaellt auch der unsichere `onclick="deleteEntry(${index})"` in Zeile 85.

---

## 6. Magische Zahlen durch Konstanten ersetzen (Prioritaet: Mittel)

### Aufgabe 6.1 — BMI-Grenzwerte als Konstanten

Die Zahlen `18.5`, `25` und `30` tauchen in mehreren Dateien auf. Wenn ihr Aufgabe 1 erledigt habt, definiert die Grenzwerte in `src/shared/bmi-utils.js`:

```javascript
const BMI_GRENZWERTE = {
  UNTERGEWICHT: 18.5,
  NORMALGEWICHT: 25,
  UEBERGEWICHT: 30
};
```

- [ ] Definiert die Konstante in `src/shared/bmi-utils.js`.
- [ ] Nutzt `BMI_GRENZWERTE.UNTERGEWICHT` statt `18.5` in `getBMICategory()` und `getBMIColor()`.

### Aufgabe 6.2 — Filter-Zeitraeume als Konstanten

**Datei:** `src/tables/tables.js`, Zeile 45-47

```javascript
// Vorher:
const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
if (filterSelect.value === 'week') return diffDays <= 7;
if (filterSelect.value === 'month') return diffDays <= 30;

// Nachher:
const MS_PRO_TAG = 1000 * 60 * 60 * 24;
const TAGE_WOCHE = 7;
const TAGE_MONAT = 30;
```

- [ ] Erstellt die Konstanten am Anfang der Datei und verwendet sie im Filter-Code.

---

## 7. CSS-Dopplung beseitigen (Prioritaet: Niedrig)

### Aufgabe 7.1 — Gemeinsame Button-Styles auslagern

Die Button-Styles (Farbe, Hover, Border-Radius) sind in **3 CSS-Dateien** fast identisch kopiert:

- `src/formular/css/formular.css` (Zeile 58-77)
- `src/Settings/css/settings.css` (Zeile 22-40)
- `src/Settings/css/graphTypeBtn.css` (Zeile 2-20)

**Aufgabe:**

1. Erstellt eine neue Datei `src/shared/shared.css`.
2. Verschiebt die gemeinsamen Button-Styles dort hinein.
3. Bindet `src/shared/shared.css` in den betroffenen HTML-Dateien ein.
4. Loescht die doppelten Button-Regeln aus den 3 CSS-Dateien.

- [ ] `src/shared/shared.css` erstellen mit den Button-Styles.
- [ ] Doppelte Styles in `formular.css`, `settings.css` und `graphTypeBtn.css` entfernen.

### Aufgabe 7.2 — Feste Breite im Barchart responsive machen

**Datei:** `src/barchart/style.css`, Zeile 29

**Vorher:**
```css
.chart-container {
  width: 750px;
}
```

**Nachher:**
```css
.chart-container {
  width: 100%;
  max-width: 750px;
}
```

- [ ] Aendert die Breite auf `width: 100%; max-width: 750px;`, damit das Diagramm sich an kleinere Bildschirme anpasst.

---

## 8. Inline-Event-Handler durch addEventListener ersetzen (Prioritaet: Niedrig)

### Aufgabe 8.1 — Formular-Buttons

**Datei:** `src/formular/html/formular.html`, Zeile 17-19

**Vorher:**
```html
<button type="button" onclick="calculateBMI()">BMI berechnen</button>
```

**Nachher — im HTML:**
```html
<button type="button" id="btnCalculate">BMI berechnen</button>
```

**Nachher — in `formular.js` (am Ende der Datei):**
```javascript
document.getElementById('btnCalculate').addEventListener('click', calculateBMI);
```

Macht dasselbe fuer alle Buttons mit `onclick`:

- [ ] `src/formular/html/formular.html` — beide Buttons (Zeile 17, 18)
- [ ] `src/AI_Assistant/html/index.html` — AI-Button (Zeile 1)
- [ ] `src/Settings/html/settings.html` — beide Buttons (Zeile 8, 20)
- [ ] `src/Settings/html/graphTypeBtn.html` — Graph-Type-Button (Zeile 8)

**Warum?** Trennung von HTML (Struktur) und JavaScript (Verhalten) ist ein wichtiges Prinzip der Webentwicklung. Ausserdem erlaubt es spaeter die Nutzung einer Content Security Policy (CSP).

---

## 9. ESLint-Konfiguration erweitern (Prioritaet: Niedrig)

**Datei:** `eslint.config.mjs`

Die aktuelle Konfiguration prueft nur die Basis-Empfehlungen. Fuegt nuetzliche Regeln hinzu:

```javascript
rules: {
  "no-console": "warn",         // warnt bei console.log
  "no-var": "error",            // erzwingt let/const statt var
  "prefer-const": "warn",       // empfiehlt const wenn moeglich
  "eqeqeq": "error",           // erzwingt === statt ==
  "no-unused-vars": "warn"      // warnt bei ungenutzten Variablen
}
```

- [ ] Fuegt den `rules`-Block in `eslint.config.mjs` ein.
- [ ] Fuehrt `npx eslint src/` aus und behebt die gemeldeten Warnungen.

---

## Checkliste Zusammenfassung

| Nr  | Aufgabe                                    | Prioritaet | Dateien                                      |
| --- | ------------------------------------------ | ---------- | -------------------------------------------- |
| 1.1 | Gemeinsame `bmi-utils.js` erstellen        | Hoch       | Neue Datei `src/shared/bmi-utils.js`         |
| 1.2 | Doppelten Code entfernen                   | Hoch       | `formular.js`, `tables.js`, `script.js`      |
| 2.1 | Fehlermeldung in Tabelle anzeigen          | Hoch       | `tables.js`                                  |
| 2.2 | localStorage sicher auslesen              | Hoch       | `formular.js`, `script.js`                   |
| 3   | Console.log entfernen                      | Mittel     | 4 Dateien (siehe Liste)                      |
| 4.1 | Labels fuer Formularfelder                 | Mittel     | `formular.html`                              |
| 4.2 | Labels fuer Select-Felder                  | Mittel     | `tables.html`                                |
| 4.3 | HTML-Sprache auf `de` setzen               | Mittel     | `formular.html`                              |
| 5.1 | innerHTML durch DOM-Methoden ersetzen      | Mittel     | `tables.js`                                  |
| 6.1 | BMI-Grenzwerte als Konstanten              | Mittel     | `bmi-utils.js`                               |
| 6.2 | Filter-Zeitraeume als Konstanten           | Mittel     | `tables.js`                                  |
| 7.1 | Gemeinsame CSS-Datei fuer Buttons          | Niedrig    | Neue Datei + 3 CSS-Dateien                   |
| 7.2 | Barchart responsive machen                 | Niedrig    | `barchart/style.css`                         |
| 8.1 | onclick durch addEventListener ersetzen    | Niedrig    | `formular.html`, `settings.html` u.a.        |
| 9   | ESLint-Regeln erweitern                    | Niedrig    | `eslint.config.mjs`                          |
