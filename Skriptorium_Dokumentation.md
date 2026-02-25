# Skriptorium — Projekt-Dokumentation

Version: 2.0  
Aktualisiert: 25.02.2026

---

# Projektübersicht

**Skriptorium** ist ein webbasiertes Schreib- und Organisationswerkzeug für Autor:innen.  
Es kombiniert Szenenverwaltung, Strukturplanung, Timeline-Logik, Beat-Planung und Weltkarte in einer einzigen HTML-Datei — ohne Server, ohne Installation.

Ziel: komplexe Geschichten strukturiert, chronologisch und plot-orientiert planen.

---

# Kernmodule

## 1. Navigator (Bände → Kapitel → Szenen)

- Hierarchische Struktur: Bände → Kapitel → Szenen
- Drag & Drop zur Neuanordnung
- Statusanzeige (Idee / Entwurf / Revise / Fertig)
- Wortzählung pro Szene, Kapitel und Band

## 2. Szenen-Editor

Felder: Titel, Zusammenfassung, Haupttext, Notizen, Wortziel, Datum, Strang, POV, Tags, Ort

## 3. Beats-Planer

Unterstützte Strukturmethoden (17+):
Save the Cat, Drei-Akt-Struktur, Freytag-Pyramide, Hero's Journey, Seven-Point Structure,
Kishōtenketsu, Aristotelische Dramaturgie, Snowflake-Methode, Dan Harmon Story Circle,
Fichtean Curve, In Medias Res, Nonlinear/Episodic, Blank (frei), und weitere.

Funktionen:
- **Multi-Board:** Beliebig viele Boards parallel. Tabs zum Wechseln, Doppelklick = umbenennen.
- **Phasen-% Zielwert:** Jede Phase zeigt ihren Anteil am Buch in %. Klick zum Bearbeiten. Ohne manuellen Wert: automatisch aus Beat-Anzahl errechnet.
- **Mehrere Szenen pro Beat:** „＋ Szene" verknüpft beliebig viele Szenen. Chips zeigen Status (grün = Fertig, blau = Entwurf). Klick auf Chip öffnet Verwaltung.
- **Drag & Drop** innerhalb und zwischen Phasen
- **Methoden ausblenden:** Kopfbereich bleibt sichtbar (Knopf bleibt zugänglich). Einstellung pro Projekt gespeichert.
- **Vorschau:** Klick auf Methodenkarte zeigt alle Phasen/Beats vorab.
- JSON Export / Import

## 4. Korkboard

Kartenansicht aller Szenen, Drag & Drop zur Neuanordnung, Strang-Farbmarkierung.

## 5. Planer

Kanban-Ansicht (Spalte pro Handlungsstrang). Karten mit Titel, Notiz, Datum, Status, Szenenverknüpfung.  
Datum-Logik: Manuell = 🔒 (fest), automatisch = ⟳ (interpoliert zwischen festen Karten).

## 6. Story-Chronik (Raster)

**Datum-Ansicht:** Zeilen = Tage, Spalten = Stränge.
- Szenen und Planer-Blöcke mit Datum erscheinen automatisch in der richtigen Zelle
- Planer-Blöcke ohne verknüpfte Szene: orange ⊡-Chips
- Drag & Drop: Szene/Planer-Block in andere Zelle → Datum wird gesetzt und überall synchronisiert
- 🔒 = manuell gesetztes Datum, ⟳ = errechnetes Datum
- Tagesnotizen, leere Tage ausblendbar

**Kapitel-Ansicht:** Zeilen = Kapitel, Spalten = Stränge.
- Drag & Drop zwischen Zellen (Kapitel und/oder Strang wechseln)
- ⊕ Szene verknüpfen, ＋ Neue Szene erstellen — direkt aus dem Raster

Datumskonflikte (Datumsreihenfolge ≠ Kapitelreihenfolge) werden erkannt und als Warnung angezeigt.  
CSV-Export der kompletten Chronik.

## 7. Kalender & Timeline

Monatsübersicht und Timeline-Balken. Gleiches Datum-System wie Raster und Planer — alles synchron.

## 8. Weltkarte

- Leaflet-basierte interaktive Karte (CartoDB Dark)
- Orte mit Pins markieren (geocodierbar oder per Klick)
- **Eigene Weltkarte hochladen:** JPG/PNG als Kartenhintergrund (ideal für Fantasy/Sci-Fi)
- **🌍 OpenStreetMap ausblenden:** Echte Karte deaktivieren, nur eigene Karte zeigen
- Karten-Bild und Pins pro Projekt gespeichert

## 9. Mehrere Projekte

**📁 Projekt-Menü** oben links. Jedes Projekt hat vollständig getrennten Stand:  
Bände/Kapitel/Szenen, Charaktere, Orte, Planer, Stränge, Beats, Story-Chronik, Spotify, Weltkarte.  
Beim Wechsel: automatisch gespeichert. ＋ Neu, ✎ Umbenennen, ✕ Löschen (Hauptprojekt geschützt).

## 10. Dashboard

- Gesamtstatistiken: Bände, Kapitel, Szenen, Wörter, Wortziel-Fortschritt
- Status-Verteilung, Strang-Fortschritt
- **Beat-Fortschritt:** Pro Board und Phase: wie viele Beats haben eine „Fertig"-Szene? Balken + Prozent.
- „Next up" — nächste offene Szenen und Planer-Karten

## 11. Buchansicht

Alle Szenen als zusammenhängende Lesefassung. Gut für Durchlesen, Beta-Feedback, Exportvorbereitung.

## 12. Storyboard

Visuelle Shot-/Szenenplanung mit Karten. Ideal für filmisches Denken.

## 13. Suche

Volltext-Suche über alle Szenen (Titel, Text, Zusammenfassung, Notizen).

## 14. Spotify-Widget (rechte Sidebar)

Mehrere Playlists anpinnen: Link einfügen + ▶ + Name vergeben → als Chip gespeichert.  
Unterstützt Playlists, Tracks, Alben, Podcasts. Pro Projekt getrennt gespeichert.

---

# Datenspeicherung

## Wo wird gespeichert?

| Daten | Speicher | Key |
|---|---|---|
| Szenen, Kapitel, Bände, Charaktere, Orte, Planer | IndexedDB `TrilogyWriterV3` | `state` (Hauptprojekt) / `state_<id>` |
| Beats | localStorage | `skriptorium.beats.v2.<projektId>` |
| Story-Chronik | localStorage | `skriptorium.chronik.v1.<projektId>` |
| Spotify | localStorage | `skriptorium.spotify.v2.<projektId>` |
| Projektliste | localStorage | `skriptorium.projects` |

Alle Daten bleiben lokal im Browser. Kein Server, keine Cloud.

## Speicherverbrauch

- **Typisches Romanprojekt** (80.000 Wörter, 100 Szenen): ca. 2–8 MB
- **IndexedDB-Limit:** Üblicherweise 50 MB – 1 GB+ (kein praktisches Problem)
- **localStorage-Limit:** ca. 5–10 MB (bei sehr vielen Projekten kann es eng werden)

## Bilder (Storyboard / Weltkarte)

Bilder werden als **Base64** im State gespeichert — das kann den Speicher schnell füllen!

Empfehlung:
- Eigene Weltkarten als komprimiertes JPG unter 1 MB hochladen
- Storyboard-Bilder klein halten
- Regelmäßig per „↓ JSON" exportieren als Backup

## Backup-Empfehlung

`↓ JSON` im Header sichert alle Daten des aktiven Projekts. Mit `↑ JSON` jederzeit wiederherstellbar.

---

# Technische Basis

- **HTML / CSS / Vanilla JavaScript** — keine Abhängigkeiten, keine Build-Pipeline
- **IndexedDB** für Hauptstate (pro Projekt eigener Schlüssel)
- **localStorage** für Module (Beats, Grid, Spotify) mit Projekt-Scoping
- **Leaflet.js** für Weltkarte (CDN, Internetverbindung bei erstem Laden nötig)
- **Single-File-App:** Alles in einer `.html`-Datei, danach offline nutzbar

---

# Design-Ziele

- Chronologische Klarheit — Datum-Logik zieht sich durch alle Ansichten
- Mehrstrang-Übersicht — alle Stränge gleichzeitig sichtbar
- Strukturunabhängigkeit — keine Zwangsdramaturgie
- Bidirektionale Synchronisation — Änderungen propagieren in alle anderen Ansichten
- Persistente Speicherung ohne Cloud
- Single-File — portabel, keine Installation

---

# Vision

Skriptorium soll ein **Story-Architektur-System** sein —  
für Autor:innen, die komplexe Plots planen, mehrere Stränge koordinieren,  
Dramaturgie bewusst einsetzen und Chronologie exakt kontrollieren.  
Alles in einer Datei. Ohne Abo.

---

*Ende der Dokumentation — Version 2.0*
