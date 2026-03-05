# Skriptorium - Requirements

Stand: 04.03.2026
Status: Arbeitsdokument (Living Document)

## 1. Ziel und Kontext

Skriptorium ist ein lokales, browserbasiertes Autorentool zur Planung, Strukturierung und Ausarbeitung laengerer Erzaehlprojekte.
Die Anwendung soll Plot, Szenen, Zeitstruktur, Figuren, Orte und KI-gestuetzte Schreibplanung in einem koharenten Workflow verbinden.

## 2. Scope

In Scope:
- Projektverwaltung mit mehreren Projekten
- Szenenarbeit (Planung, Schreiben, Metadaten)
- Dramaturgiearbeit (Beats, Planungsnotizen, Strukturen)
- Chronologie (Timeline, Kalender, Grid)
- Figuren-, Orts- und Beziehungsverwaltung
- KI-Prompt-Erzeugung pro Szene
- Lokaler Import/Export/Backup

Out of Scope:
- Serverbetrieb oder Multi-User-Collaboration in Echtzeit
- Cloud-Zwang, Account-Zwang, kostenpflichtige Online-Backends

## 3. Nutzergruppen

- Autorinnen/Autoren mit Fokus auf Roman-/Serienprojekte
- Plotter und Hybrid-Autorinnen/Autoren
- Nutzer mit Bedarf an offlinefaehiger Schreibumgebung

## 4. Funktionale Anforderungen (FR)

### FR-01 Projektverwaltung
- Muss: Projekte anlegen, umbenennen, loeschen, wechseln.
- Muss: Projektbezogene Einstellungen speichern (z. B. Sprache, Projektart, Tempus-Standard, Kurzprofil).

### FR-02 Szeneneditor
- Muss: Pro Szene mindestens Titel, Text, Zusammenfassung, Notizen, Wortziel, Datum, POV, Ort, Tags verwalten.
- Muss: Wortzaehlung und Ziel-Fortschritt anzeigen.
- Muss: Fokus-Modus bereitstellen.
- Soll: Duplizieren von Szenen.

### FR-03 Szenenplanung und KI-Prompt
- Muss: Prompt pro aktiver Szene erzeugen.
- Muss: Prompt muss mindestens enthalten:
  - Projektsprache
  - Projektart und optional Genre
  - POV-Hinweis (enge personale Perspektive in dritter Person)
  - Ton/Tempus
  - Szenenzielumfang als grobe Vorgabe
- Muss: Wenn kein Szenen-Wortziel gesetzt ist, Default-Zielumfang 2000 Woerter verwenden.
- Muss: Stilvorgaben gegen abgehackten Kurzsatz-/Pseudo-Drama-Stil enthalten.
- Soll: Zusetzliche freie KI-Notiz in Prompt aufnehmen.

### FR-04 Beats und Planungsnotizen
- Muss: Beat-Boards mit Phasen und Beats anzeigen und editieren.
- Muss: Planungsnotizen (Kacheln) Beats zuordnen koennen.
- Muss: Beat-Hinweise/Leitfragen fuer gelaeufige Strukturtypen bereitstellen.
- Muss: Fortschritt pro Beat aus verknuepften Szenenwoertern berechnen.

### FR-05 Planer/Kacheln
- Muss: Karten pro Strang anzeigen, sortieren, datieren, verknuepfen.
- Muss: Aus Karte Szene anlegen koennen.
- Muss: Aus Planungsnotiz-Editor "Als Szene" robust funktionieren.

### FR-06 Buchansicht
- Muss: Szenentexte als Lesefassung anzeigen.
- Muss: Inline-Bearbeitung von Titel/Text pro Szene.
- Muss: Navigation Szene -> Buch und Buch -> Szene unterstuetzen.
- Muss: Szene -> Buch Sprung zur konkreten Szene inklusive sichtbarer Hervorhebung.

### FR-07 Charaktere, Orte, Beziehungen
- Muss: Charaktere/Orte CRUD.
- Muss: Beziehungsgraph mit ziehbaren Knoten, Klick-Interaktion und Beziehungsdialog.
- Muss: Familienbeziehungen als Rollenpaar erfassen (z. B. Mutter | Sohn), nicht nur einseitig.
- Soll: Import von Charakteren/Orten aus anderen Projekten.

### FR-08 Timeline, Kalender, Grid
- Muss: Datumsbasierte Sicht auf Szenen/Karten in Timeline/Kalender.
- Muss: GridPlan als Planungsraster mit Szenenverknuepfung.

### FR-09 Datenhaltung, Import/Export, Backup
- Muss: Lokale persistente Speicherung ohne Server.
- Muss: Projekt-Export/Import als JSON.
- Soll: Markdown-/HTML-Export.
- Soll: Auto-Backup in waehlbaren lokalen Ordnern.

## 5. Nicht-funktionale Anforderungen (NFR)

### NFR-01 Offlinefaehigkeit
- Muss: Kernfunktionen ohne Internet lauffaehig.

### NFR-02 Performance
- Muss: Interaktionen im Editor und Planer ohne wahrnehmbare UI-Lags im Normalfall.
- Soll: Auch bei groesseren Projekten fluesige Navigation.

### NFR-03 Robustheit
- Muss: Keine stillen Klick-Fehler bei Kernaktionen (z. B. Szene anlegen, Beziehungsdialog, Sprungfunktionen).
- Muss: Bei ungueltigen Voraussetzungen klare Fehlhinweise anzeigen.

### NFR-04 Konsistenz
- Muss: Einheitliche Feldlogik (z. B. date vs. datum, Notiz-Felder) ohne parallele konkurrierende Datenpfade.

### NFR-05 Usability
- Muss: Modale und Interaktionen so gestalten, dass Mauswege kurz bleiben.
- Soll: Hilfetexte als ausfuellbare Leitfragen statt abstrakter Beschreibungen.

## 6. UX-Anforderungen (Auszug)

- Szenenplaner initial ausgeklappt.
- Planungsnotiz-Editor mittig als Modal.
- Beat-Kompass mit Funktion, Anteil, Fortschritt und Leitfrage.
- Sichtbare Rueckspruenge zwischen verbundenen Bereichen (Planer, Szene, Buch).

## 7. Abnahmekriterien (hoch)

- AK-01: Nutzer kann aus einer Planer-Karte verlaesslich eine Szene anlegen.
- AK-02: Nutzer kann aus Szeneneditor per Klick zur selben Szene in der Buchansicht springen.
- AK-03: KI-Prompt enthaelt immer eine Wortzielvorgabe (Szenenziel oder Default 2000).
- AK-04: Beziehungsgraph bleibt klick- und ziehbar nach Tabwechseln/Re-Renders.
- AK-05: Familienbeziehung kann als Rollenpaar gespeichert und bearbeitet werden.

## 8. Offene Punkte

- Bereinigung doppelter/alter Logik im Beziehungsgraphen (legacy vs. aktueller Pfad).
- Weitere Spezifikation der Stilregeln fuer KI-Ausgaben je Genre.
- Optionales separates Stammbaum-Board (falls genealogische Darstellung gewuenscht).
