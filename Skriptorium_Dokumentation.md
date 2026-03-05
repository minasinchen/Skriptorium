# Skriptorium - Projektdokumentation

Stand: 03.03.2026

---

# Projektueberblick

**Skriptorium** ist ein webbasiertes Schreib- und Organisationswerkzeug fuer Autorinnen und Autoren.
Die Anwendung laeuft als einzelne HTML-Datei, funktioniert ohne Server und kann lokal sowie offline genutzt werden.

Ziel ist es, Plot, Szenen, Dramaturgie, Chronologie und Recherche an einem Ort zu verwalten.

---

# Kernbereiche

## 1. Navigator

- Hierarchie: Baende -> Kapitel -> Szenen
- Neue Baende, Kapitel und Szenen direkt in der linken Navigation
- Datumsanzeige im Navigator ein- und ausblendbar
- Status, Reihenfolge und Struktur zentral steuerbar

## 2. Szenen-Editor

Pro Szene stehen unter anderem diese Felder zur Verfuegung:

- Titel
- Zusammenfassung
- Beats
- Haupttext
- Notizen
- Wortziel
- Datum
- Timeline-Label
- Strang
- POV
- Ort
- Tags

Zusaetzlich:

- Wortzaehlung mit Fortschrittsanzeige
- Fokus-Modus fuer ablenkungsarmes Schreiben
- Szenen duplizieren
- Verknuepfung mit Planer-Elementen
- Szenenplanung mit ausgeklapptem Prompt-Bereich
- Ton-Presets plus freier Ton-Zusatz
- Projektweites Standard-Tempus mit optionalem Szenen-Override
- Mehrere Szenentypen mit Leitfeldern (z. B. Szene, Sequel, Konfrontation, Enthuellung, emotionale Szene, Uebergang)
- Freie KI-Notiz pro Szene
- KI-Prompt mit Projektsprache, Projektart und Projekt-Kurzprofil

## 3. Korkboard

- Kartenansicht aller Szenen
- Filter nach Band, Kapitel, Strang und Status
- Visuelle Schnelluebersicht fuer Strukturarbeit

## 4. Suche

- Volltextsuche ueber alle Szenen
- Suchen-und-Ersetzen direkt in der Anwendung

## 5. Charaktere

- Eigene Charakterlisten
- Bearbeitbare Detailansichten je Figur
- Uebernahme einzelner Charaktere aus anderen Projekten

## 6. Orte und Tags

- Verwaltung von Orten
- Nutzung von Orten und Tags in Szenen
- Ortsdaten koennen mit der Weltkarte kombiniert werden
- Uebernahme einzelner Orte aus anderen Projekten

## 7. Planer

- Kanban- und Zeitachsenansicht
- Karten pro Handlungsstrang
- Automatische Datumsverteilung
- Listenansicht fuer chronologische Uebersicht
- Verwaltung eigener Straenge

## 8. Beats

- Eigener Beats-Bereich mit mehreren Boards
- Beats und Phasen frei anlegbar
- Board umbenennen
- Layout zwischen freiem Raster und Spalten umschaltbar
- JSON-Export und -Import pro Beat-Planung
- Verknuepfung einzelner Beats mit Szenen
- Uebersicht fuer Planungsmethoden
- Beat-Notizen-Ansicht mit inhaltlicher Kurz-Hilfe pro Beat
- Fortschrittsanzeige pro Beat auf Basis verknuepfter Szenenwoerter
- Zentrales Modal fuer Beat-Notizen statt Seitenleiste

## 9. Raster / Story-Chronik

Zwei Modi:

- Datumsmodus
- Kapitelmodus

Funktionen:

- Szenen und Planer-Inhalte nach Datum oder Kapitel/Strang anordnen
- Drag and Drop zwischen Zellen
- Tages- und Zellnotizen
- Szenen direkt aus dem Raster verknuepfen oder neu anlegen
- CSV-Export

## 10. Kalender

- Monatsuebersicht fuer datierte Inhalte
- Schnellzugriff auf "Heute"
- Synchronisation mit Szenen, Planer und Raster

## 11. Buchansicht

- Lesefassung ueber Szenen eines Bands oder Kapitels
- Filter nach Band, Kapitel und Strang
- Geeignet fuer zusammenhaengende Durchsicht des Textes

## 12. Storyboard

- Visuelle Planungsansicht fuer Szenen und Storystruktur

## 13. Weltkarte

- Kartenansicht mit Leaflet
- Navigation zwischen Szenen mit Ortsbezug
- Marker fuer Orte
- Eigene Kartenbilder als Hintergrund moeglich
- OpenStreetMap-Hintergrund zuschaltbar

## 14. Dashboard

- Kennzahlen zu Baenden, Kapiteln, Szenen und Woertern
- Fortschrittsanzeige
- Buchcover im Ueberblick
- "Next up" fuer naechste offene Inhalte

## 15. Projekte

- Mehrere getrennte Projekte in einer Instanz
- Projektwechsel ueber das Projektmenue
- Neues Projekt anlegen
- Projekte umbenennen
- Projekte loeschen (Hauptprojekt geschuetzt)
- Eigenes Buchcover pro Projekt
- Projektsprache fuer Prompt-Generator
- Projektart (z. B. Roman, Novelle, Fanfiction)
- Projekt-Kurzprofil fuer Inhalt, Atmosphaere und Stil
- Charaktere und Orte koennen projektuebergreifend uebernommen werden

## 16. Einstellungen

Der Einstellungsbereich buendelt Darstellung, Sicherung und Diagnose.

### Projekt-Kontext

- Sprache fuer Prompt-Generator und Szenenplanung
- Standard-Tempus fuer Szenen (projektweit)
- Genre
- Projektart
- Projekt-Kurzprofil (1-2 Saetze fuer Inhalt, Stil und Atmosphaere)
- Projektspezifisches Schreibziel

### Schrift und Darstellung

- Editor-Schriftgroesse
- Schriftart
- UI-Zoom

### Farben

- Akzentfarbe
- Hintergrundfarbe
- Ruecksetzen auf Standardwerte

### Backup und Import/Export

- JSON-Export fuer alle Projekte
- JSON-Import
- Markdown-Import
- Markdown-Export
- HTML-/Word-Export
- Charakter-Export/-Import
- Orts-Export/-Import
- Speicher-Info

### Automatisches Backup

- Ordnerauswahl ueber den Browser (wenn unterstuetzt)
- Manuelles Sofort-Backup
- Anzeige des letzten Sicherungszeitpunkts

### Diagnose

- Fehler-Konsole fuer JavaScript-Fehler und Warnungen
- Wiederherstellungs-Assistent fuer fehlende Projekte

## 17. Hilfe

- Integrierter Hilfebereich
- Ueber `F1` oder den Hilfe-Button erreichbar

## 18. Spotify-Widget

- Playlists pro Projekt hinterlegbar
- Wechsel zwischen mehreren Playlists in der rechten Sidebar

---

# Datenspeicherung

## Hauptspeicher

- **IndexedDB** speichert den Hauptzustand der Projekte
- Projektbezogene Daten werden getrennt abgelegt

## Schneller Zusatzspeicher

- **localStorage** wird fuer bestimmte Module mit schneller Direktladung verwendet
- Dazu gehoeren insbesondere Beats, Raster, Spotify und Einstellungen

## Export

Der JSON-Export ist als Komplettsicherung gedacht und umfasst die projektweiten Inhalte in einer Datei.

Je nach Bereich stehen zusaetzlich spezialisierte Exporte zur Verfuegung:

- JSON
- CSV
- Markdown
- HTML

---

# Technische Basis

- Single-File-App auf Basis von HTML, CSS und Vanilla JavaScript
- Keine Build-Pipeline fuer die Laufzeit erforderlich
- Lokale Nutzung im Browser
- Leaflet fuer Kartenfunktionen

---

# Hinweise zur Pflege

- Diese Dokumentation beschreibt den aktuellen Funktionsumfang von `index.html`.
- Bei Funktionsaenderungen sollte diese Datei gemeinsam mit der HTML-Datei aktualisiert werden.
- Versionsangaben sollten konsistent an nur einer Stelle gepflegt oder aus dem UI uebernommen werden.

---

# Offene Auffaelligkeiten

- In der Anwendung und in aelteren Dokumentationsstaenden tauchen unterschiedliche Versionsnummern auf.
- Wenn eine feste Release-Version gepflegt werden soll, sollte sie zentral vereinheitlicht werden.
