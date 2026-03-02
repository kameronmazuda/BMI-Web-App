# Dashboard Documentation

## Überblick

Das Dashboard ist die zentrale Übersichtsseite der BMI-Web-App. Es dient als Startpunkt der Anwendung und zeigt (aktuell als Platzhalter/Wireframe) typische Dashboard-Elemente wie Karten/Widgets, Charts und eine tabellarische Übersicht. Die Inhalte werden dynamisch in einen zentralen Content-Bereich geladen, ohne dass die komplette Seite neu geladen werden muss.

## Ziel / Zweck

- **Schneller Einstieg** in die App über eine zentrale Oberfläche
- **Navigation** zu weiteren Bereichen (Forms, Tables)
- **Darstellung von Kennzahlen** (z.B. BMI-Verläufe, letzte Einträge) – derzeit als Platzhalter vorgesehen
- **Skalierbare Struktur**, damit später weitere Seiten/Widgets leicht ergänzt werden können

---

## Projektstruktur (relevant)

Typische Struktur (Auszug):

- `index.html` (Projekt-Root)  
  Einstiegspunkt. Leitet auf die App weiter.

- `src/app.html`  
  Enthält Layout (Sidebar + Content-Area `#view`) und bindet CSS/JS ein.

- `src/dashboard/dashboard.html`  
  Dashboard-Inhalt (Platzhalter-Layout, Cards/Charts/Tables-Bereiche).

- `src/dashboard/dashboard.css`  
  Styling für Sidebar, Layout, Platzhalter-Komponenten.

- `src/dashboard/dashboard.js`  
  Client-seitige Navigation (Routing) und dynamisches Nachladen der Seiten in `#view`.

- `src/forms/forms.html`  
  Inhalt für den Forms-Bereich.

- `src/tables/tables.html`  
  Inhalt für den Tables-Bereich.

---

## Starten & Aufrufen

### Lokaler Webserver

Im Projekt-Root (dort wo `index.html` liegt) ausführen:

```bash
python3 -m http.server 8000
```
