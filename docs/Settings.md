# Settings Feature Dokumentation

## Übersicht
Das Settings-Feature ermöglicht es Benutzern, ihre persönlichen Einstellungen sowie Diagramm-Präferenzen zu speichern und zu verwalten. Alle Einstellungen werden persistent im Browser-localStorage gespeichert.

---

## 1. User Settings

### Beschreibung
Verwaltet benutzerspezifische Einstellungen wie das Geschlecht. Nach jeder Änderung werden die Daten automatisch im localStorage gespeichert und bleiben auch nach einem Neustart der Anwendung erhalten.

### LocalStorage Struktur
**Key:** `userSettings`

**Value:**
```json
{
  "gender": "none" | "male" | "female"
}
```

### Implementation

#### Initialisierung
```javascript
// Standard-Einstellungen
let settings = {
    gender: 'none'
};
```

#### Laden aus LocalStorage
```javascript
function loadSettingsFromStorage() {
    const savedSettings = localStorage.getItem('userSettings');
    if (savedSettings) {
        try {
            settings = JSON.parse(savedSettings);
        } catch (error) {
            console.error('Fehler beim Laden der Einstellungen:', error);
        }
    }
}
```

#### Speichern in LocalStorage
```javascript
function saveSettingsToStorage() {
    try {
        localStorage.setItem('userSettings', JSON.stringify(settings));
    } catch (error) {
        console.error('Fehler beim Speichern der Einstellungen:', error);
    }
}
```

#### Verwendungsbeispiel
```javascript
// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    loadSettingsFromStorage();
    applySettings();
});

// Bei Änderung der Einstellungen
function updateGender(newGender) {
    settings.gender = newGender;
    saveSettingsToStorage();
}
```

---

## 2. Graph Type Button

### Beschreibung
Ermöglicht dem Benutzer, zwischen verschiedenen Diagrammtypen (Balkendiagramm oder Liniendiagramm) zu wechseln. Die Auswahl wird im localStorage gespeichert und beim nächsten Besuch wieder geladen.

### LocalStorage Struktur
**Key:** `graphType`

**Value:** `'bar'` oder `'line'`

### Implementation

#### Initialisierung
```javascript
// Standard-Diagrammtyp
let graphType = 'bar';
```

#### Laden aus LocalStorage
```javascript
function loadGraphTypeFromStorage() {
    const savedGraphType = localStorage.getItem('graphType');
    if (savedGraphType) {
        try {
            graphType = JSON.parse(savedGraphType);
        } catch (error) {
            console.error('Fehler beim Laden des Diagrammtyps:', error);
            graphType = 'bar'; // Fallback zum Standard
        }
    }
}
```

#### Speichern in LocalStorage
```javascript
function saveGraphTypeToStorage(type) {
    try {
        localStorage.setItem('graphType', JSON.stringify(type));
    } catch (error) {
        console.error('Fehler beim Speichern des Diagrammtyps:', error);
    }
}
```

#### Verwendungsbeispiel
```javascript
// Beim Laden der Seite
document.addEventListener('DOMContentLoaded', () => {
    loadGraphTypeFromStorage();
    renderGraph(graphType);
});

// Bei Klick auf den Button
function toggleGraphType() {
    graphType = graphType === 'bar' ? 'line' : 'bar';
    saveGraphTypeToStorage(graphType);
    renderGraph(graphType);
}
```