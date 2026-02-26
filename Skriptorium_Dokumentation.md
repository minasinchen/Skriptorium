# Skriptorium — Projekt-Dokumentation

Version: 2.3 | Aktualisiert: 26.02.2026

---

# Projektübersicht

**Skriptorium** ist ein webbasiertes Schreib- und Organisationswerkzeug für Autor:innen.  
Szenenverwaltung, Strukturplanung, Timeline-Logik, Beat-Planung, Weltkarte und Musik — alles in einer HTML-Datei. Kein Server, keine Installation, offline nutzbar.

---

# Kernmodule

## 1. Navigator (Bände → Kapitel → Szenen)

- Hierarchische Struktur: Bände → Kapitel → Szenen
- Drag & Drop, Statusanzeige, Wortzählung

## 2. Szenen-Editor

Felder: Titel, Zusammenfassung, Haupttext, Notizen, Wortziel, Datum, Strang, POV, Tags, Ort

## 3. Beats-Planer

**17+ Strukturmethoden:** Save the Cat, Drei-Akt, Freytag-Pyramide, Hero's Journey, Seven-Point, Kishōtenketsu, Aristotelisch, Snowflake, Dan Harmon, Fichtean Curve, In Medias Res, Nonlinear, Romance, Mystery, Thriller, Blank (frei), u.v.m.

**Funktionen:**
- **Multi-Board:** Beliebig viele Boards parallel (Tabs)
- **Phasen-% Zielwert:** Pro Phase — Anteil am Buch in %, klickbar zum Bearbeiten
- **Beat-% pro Karte:** Jede Beat-Karte zeigt ihre ungefähre Position im Buch als „~X%"-Tag
- **Mehrere Szenen pro Beat:** „＋ Szene" verknüpft beliebig viele. Chips: grün = Fertig, blau = Entwurf
- Drag & Drop innerhalb und zwischen Phasen
- JSON Export / Import (auch im Gesamtexport enthalten)

## 4. Korkboard

Kartenansicht aller Szenen. Drag & Drop, Strang-Farbmarkierung.

## 5. Planer

Kanban-Ansicht (Spalte pro Strang). 🔒 = manuelles Datum, ⟳ = automatisch interpoliert.

## 6. Story-Chronik (Raster)

**Datum-Ansicht:** Tage × Stränge. Szenen und Planer-Blöcke mit Datum erscheinen automatisch. Drag & Drop setzt/verschiebt Datum. Synchron mit allen anderen Ansichten.

**Kapitel-Ansicht:** Kapitel × Stränge. Drag & Drop zwischen Zellen (Kapitel/Strang wechseln). ⊕ Szene verknüpfen, ＋ Neu erstellen.

Datumskonflikte werden erkannt. CSV-Export.

## 7. Kalender & Timeline

Monatsübersicht und Timeline-Balken. Synchron mit Raster und Planer.

## 8. Weltkarte

- Leaflet + CartoDB Dark Hintergrund
- Orte geocodierbar oder per Klick markieren
- **🗺 Eigene Weltkarte hochladen:** JPG/PNG als Kartenhintergrund (ideal für Fantasy)
- **🌍 OSM-Toggle:** OpenStreetMap ein-/ausblenden — erneuter Klick stellt wieder her
- Pro Projekt gespeichert

## 9. Mehrere Projekte

**📁 Projekt-Menü** oben links. Vollständig getrennte Daten pro Projekt.

- **🖼 Buchcover:** „Cover"-Button im Menü → JPG/PNG hochladen. Erscheint als Thumbnail im Menü und Header-Logo. Automatisch auf max. 200×300px skaliert.
- ＋ Neu, ✎ Umbenennen, ✕ Löschen (Hauptprojekt geschützt)
- Beim Wechsel: automatisch gespeichert

## 10. Dashboard

- Statistiken: Bände, Kapitel, Szenen, Wörter
- **Beat-Fortschritt:** Pro Board/Phase — Doppelbalken (gedämpft = in Arbeit, voll = fertig) und % der abgeschlossenen Beats. Unterstützt jetzt mehrere Szenen pro Beat.
- **Buchcover:** Das Buchcover wird prominent oben im Dashboard angezeigt (80×120 px). Upload direkt im Dashboard über ✎ oder über das 📁 Projekt-Menü.
- „Next up" — nächste offene Szenen und Planer-Karten

## 11. Buchansicht / Storyboard / Suche

Buchansicht: alle Szenen als Lesefassung. Storyboard: visuelle Kartenplanung. Suche: Volltext.

## 12. Einstellungen (⚙-Tab)

Einstellungen-Tab ganz rechts in der Tab-Leiste:

**Schrift & Darstellung:**
- Schriftgröße Editor (10–30 px)
- Schriftart: Serif (Georgia) / Sans (System UI) / Mono (Courier)
- UI-Zoom 80–120% (skaliert gesamte Oberfläche)

**Farben:**
- Akzentfarbe: 8 Voreinstellungen + freier Colorpicker
- Hintergrundfarbe: 5 Dunkel-Presets + freier Picker — bg1–bg4 und Borders automatisch abgeleitet

**Daten & Sicherung:** Alle Export/Import-Funktionen gesammelt (JSON, MD, Chars, Orte, HTML/Word)

**Fehler-Konsole:** Erfasst `console.error`, `console.warn` und globale Exceptions ab Seitenstart. Zur Diagnose ohne Browser-DevTools.

**Wiederherstellungs-Assistent** und **Speicher-Info** ebenfalls hier.

## 13. Spotify-Widget (rechte Sidebar)

Mehrere Playlists anpinnen (Link + ▶ + Name). Chips zum Wechseln. Pro Projekt getrennt.

---

# Datenspeicherung

## Was steckt alles in der JSON-Sicherung?

Der **„↓ JSON"-Export** im Header enthält **alles** in einer Datei:

| Daten | Enthalten? |
|---|---|
| **Alle Projekte** (inkl. Beats, Raster, Spotify) | ✅ `_allProjects` |
| Bände, Kapitel, Szenen | ✅ |
| Charaktere, Orte | ✅ |
| Planer-Karten + Reihenfolge | ✅ |
| Handlungsstränge | ✅ |
| Beats (alle Boards, Phasen, Verknüpfungen) | ✅ als `_beats` |
| Story-Chronik (Raster-Notizen, Zellen) | ✅ als `_grid` |
| Spotify-Playlists | ✅ als `_spotify` |
| Weltkarte (eigenes Bild, Pins) | ✅ |
| Buchcover | ✅ (im Projekt-Eintrag) |

> **Hinweis:** Beats und Raster werden technisch in localStorage gespeichert (schneller), aber beim Export automatisch gebündelt. Ein einziger Export reicht für eine vollständige Sicherung.

## Warum sind Beats/Raster/Spotify technisch getrennt?

Diese Module speichern in localStorage für schnelle, synchrone Zugriffe ohne IndexedDB-Roundtrip. Funktional ist alles beim Export vereint — für den Nutzer gibt es nur eine Sicherungsdatei.

## Speicherverbrauch

- **Typisches Romanprojekt** (80.000 Wörter): ~2–8 MB
- **IndexedDB:** Meist GB-Kapazität, kein praktisches Problem
- **localStorage-Limit:** ~5–10 MB
- **Bilder (Weltkarte, Cover, Storyboard):** Als Base64 → komprimierte JPGs verwenden!

## Backup-Empfehlung

`↓ JSON` im Header regelmäßig ausführen — sichert wirklich alles.

---

# Technische Basis

- **HTML / CSS / Vanilla JavaScript** — Single-File, keine Dependencies
- **IndexedDB** (`TrilogyWriterV3`) — Hauptstate, project-scoped (`state` / `state_<id>`)
- **localStorage** — Beats, Grid, Spotify (Keys: `skriptorium.*.v2.<projektId>`)
- **Leaflet.js** — Weltkarte (CDN, einmalig Internet nötig)

---

# Bekannte Fixes (v2.3 / v2.2)

- **Grid-Datum korrupt / nicht gespeichert:** Kritischer Bug behoben — `lsKey()` wurde in `load()`/`save()` nicht korrekt aufgerufen (`LS` war undefined), dadurch wurden alle Grid-Daten unter dem falschen Key gespeichert.
- **Beat-Fortschritt Dashboard:** Unterstützt jetzt `sceneIds[]` (mehrere Szenen pro Beat). Doppelbalken zeigt In-Arbeit + Fertig getrennt.
- **Multi-Projekt-Export:** `↓ JSON` exportiert jetzt *alle* Projekte, nicht nur das aktive. Import stellt alle Projekte wieder her.
- **Spotify abgeschnitten:** `min-height:0` an Timeline-Bereichen verhindert, dass das Widget aus dem Viewport geschoben wird. Max-Höhe viewport-relativ.
- **Cover prominent:** Buchcover erscheint als Hero-Block oben im Dashboard.
- **Wiederherstellungs-Button:** Unauffälliges `⚠`-Icon statt prominenter gelber Button im Header.
- **Einstellungsseite (v2.3):** Neuer ⚙-Tab mit Schriftgröße, Schriftart, UI-Zoom, Akzent- und Hintergrundfarbe, allen Export/Import-Funktionen, Fehler-Konsole und Wiederherstellungs-Assistent.
- **Syntaxfehler (v2.3):** Mehrzeiliger `confirm()`-String mit Literal-Newlines korrigiert.

---

# Vision

Skriptorium ist ein **Story-Architektur-System** — für Autor:innen, die komplexe Plots planen, mehrere Stränge koordinieren, Dramaturgie bewusst einsetzen und Chronologie exakt kontrollieren. Alles in einer Datei. Ohne Abo.

---

*Ende der Dokumentation — Version 2.1*
