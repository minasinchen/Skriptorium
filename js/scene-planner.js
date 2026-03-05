/* ScenePlanner module extracted from index.html */
'use strict';

const SCENE_TYPE_FIELDS = {
  scene: [
    { key:'goal', label:'Szenensziel', hint:'Was will der POV-Charakter in dieser Szene konkret erreichen?',
      micro:'Tipp: Je greifbarer das Ziel, desto klarer der Konflikt. Vermeide vage Wuensche - lieber "Er will den Brief stehlen" als "Er will Informationen".' },
    { key:'conflict', label:'Konflikt', hint:'Was hindert ihn am Erreichen des Ziels? (Person, Umstand, innere Sperre)',
      micro:'Tipp: Der Konflikt sollte direkt gegen das Ziel arbeiten. Mehrere Hindernisse eskalieren - beginnend mit dem Kleinsten.' },
    { key:'disaster', label:'Desaster', hint:'Wie endet die Szene schlechter als sie begann? ("Ja, aber..." oder "Nein, und ausserdem...")',
      micro:'Tipp: Vermeide "Ja, und alles ist gut" - das stoppt den Sog. Das Desaster zwingt den Charakter in eine neue Reaktion (Sequel).' },
  ],
  sequel: [
    { key:'reaction', label:'Reaktion', hint:'Wie reagiert der Charakter emotional und koerperlich auf das vorangegangene Desaster?',
      micro:'Tipp: Lass den Leser den Schmerz oder Schock spueren, bevor der Charakter handelt. Ueberstuerzte Entscheidungen ohne Reaktion wirken flach.' },
    { key:'dilemma', label:'Dilemma', hint:'Welche 2-3 Optionen hat der Charakter - und warum sind alle problematisch?',
      micro:'Tipp: Das beste Dilemma hat keine gute Loesung. Alle Optionen sollten einen Preis haben.' },
    { key:'decision', label:'Entscheidung', hint:'Was entscheidet der Charakter? (Wird zum Ziel der naechsten Szene)',
      micro:'Tipp: Die Entscheidung enthuellt Charakter. Zeige, wer der Mensch wirklich ist, wenn es darauf ankommt.' },
  ],
  exposition: [
    { key:'exposPurpose', label:'Zweck', hint:'Welche Information oder welcher Uebergang wird in dieser Szene geleistet?',
      micro:'Tipp: Jede Expositions-Szene sollte mindestens eine emotionale Frage oder Spannung enthalten.' },
    { key:'exposHook', label:'Lesehaken', hint:'Wie machst du die Szene trotz geringer Aktion interessant?',
      micro:'Tipp: Foreshadowing, Charaktermoment, Weltenbau-Detail oder eine offene Frage halten den Leser bei der Stange.' },
    { key:'exposSetup', label:'Setup/Foreshadowing', hint:'Was bereitest du hier fuer spaetere Szenen vor?',
      micro:'Tipp: Notiere hier nur, was du tatsaechlich abrufst - dann hilft es beim Redigieren.' },
  ],
  confrontation: [
    { key:'confrontationAim', label:'Druckpunkt', hint:'Was will die POV-Figur in der Konfrontation durchsetzen, erzwingen oder verhindern?',
      micro:'Tipp: Gib der Szene eine klare Forderung oder Grenze. Sonst bleibt der Schlagabtausch nur Laerm.' },
    { key:'confrontationResistance', label:'Widerstand', hint:'Wie haelt die Gegenseite dagegen oder dreht die Lage gegen die POV-Figur?',
      micro:'Tipp: Die andere Seite braucht eigene Ziele, nicht nur Gegenwehr. Das macht die Szene schaerfer.' },
    { key:'confrontationShift', label:'Verschiebung', hint:'Was kippt am Ende? Wer hat die Oberhand oder was ist endgueltig beschaedigt?',
      micro:'Tipp: Eine gute Konfrontation veraendert Macht, Vertrauen oder Handlungsoptionen sichtbar.' },
  ],
  discovery: [
    { key:'discoveryQuestion', label:'Leitfrage', hint:'Welche konkrete Frage, Spur oder Unsicherheit treibt diese Szene an?',
      micro:'Tipp: Formuliere die Suchbewegung so konkret, dass am Ende klar ist, ob die Figur naeher an der Wahrheit ist.' },
    { key:'discoveryClue', label:'Fund / Enthuellung', hint:'Welche Information, welches Indiz oder welcher Widerspruch kommt ans Licht?',
      micro:'Tipp: Die neue Information sollte Bedeutung haben, nicht nur Weltwissen anhaeufen.' },
    { key:'discoveryConsequence', label:'Folge', hint:'Wie veraendert der Fund jetzt Risiko, Verdacht, Beziehung oder Plan?',
      micro:'Tipp: Wenn die Enthuellung nichts verschiebt, gehoert sie eher in die Zusammenfassung als in eine Szene.' },
  ],
  emotional: [
    { key:'emotionalNeed', label:'Inneres Beduerfnis', hint:'Was braucht die POV-Figur emotional wirklich, auch wenn sie es nicht offen sagt?',
      micro:'Tipp: Oft liegt die Kraft dieser Szene im Gegensatz zwischen aeusserem Verhalten und innerem Wunsch.' },
    { key:'emotionalSubtext', label:'Subtext', hint:'Was wird nicht gesagt, aber durch Gesten, Pausen oder Wortwahl spuerbar?',
      micro:'Tipp: Notiere hier den unausgesprochenen Konflikt oder die Verletzlichkeit unter dem Dialog.' },
    { key:'emotionalShift', label:'Emotionale Veraenderung', hint:'Wie ist die Beziehung oder Selbstwahrnehmung am Ende anders als am Anfang?',
      micro:'Tipp: Die Szene braucht eine klare Bewegung: Naehe, Distanz, Einsicht, Enttaeuschung, Hoffnung oder Bruch.' },
  ],
  transition: [
    { key:'transitionCarry', label:'Nachhall', hint:'Was traegt die Figur sichtbar aus der vorherigen Szene noch mit sich?',
      micro:'Tipp: Gute Uebergaenge schliessen die vorige Szene emotional nicht ab, sondern lassen sie nachklingen.' },
    { key:'transitionChange', label:'Neuordnung', hint:'Was hat sich jetzt praktisch geaendert: Ort, Zeit, Plan, Kraefteverhaeltnis, Wissen?',
      micro:'Tipp: Benenne die neue Lage glasklar. Uebergaenge sind Orientierung, nicht Fuellmaterial.' },
    { key:'transitionPull', label:'Zug nach vorn', hint:'Welcher Impuls zieht die Geschichte sofort in die naechste Szene weiter?',
      micro:'Tipp: Auch ruhige Uebergaenge brauchen eine Richtung: Frage, Termin, Drohung, Wunsch oder neuer Auftrag.' },
  ],
};

const ScenePlanner = (() => {
  let _open = true;
  let _promptOpen = false;
  const SCENE_TYPE_LABELS = {
    scene:'Szene (dramatische Aktion)',
    sequel:'Sequel (Reflexion & Entscheidung)',
    exposition:'Exposition / Ueberleitung',
    confrontation:'Konfrontation / Schlagabtausch',
    discovery:'Enthuellung / Spurensuche',
    emotional:'Beziehungs- / Charakterszene',
    transition:'Uebergang / Nachhall / Neuausrichtung'
  };

  function normalizeTenseLabel(val) {
    const raw = String(val || '').trim();
    if (!raw) return '';
    if (raw === 'Präteritum') return 'Praeteritum';
    if (raw === 'Präsens') return 'Praesens';
    if (raw === 'Plusquamperfekt (Rückblende)') return 'Plusquamperfekt';
    if (raw === 'Plusquamperfekt (Rueckblende)') return 'Plusquamperfekt';
    return raw;
  }

  function displayTenseLabel(val) {
    const norm = normalizeTenseLabel(val);
    if (norm === 'Praeteritum') return 'Praeteritum';
    if (norm === 'Praesens') return 'Praesens';
    if (norm === 'Plusquamperfekt') return 'Plusquamperfekt (Rueckblende)';
    return norm;
  }

  function toggle() {
    _open = !_open;
    const body = document.getElementById('sc-plan-body');
    const tog = document.getElementById('sc-plan-toggle');
    if (body) body.style.display = _open ? '' : 'none';
    if (tog) tog.textContent = _open ? '▼' : '▶';
    if (_open) updatePrompt();
  }

  function togglePrompt() {
    _promptOpen = !_promptOpen;
    const b = document.getElementById('sc-prompt-body');
    if (b) b.style.display = _promptOpen ? '' : 'none';
    if (_promptOpen) updatePrompt();
  }

  function render(sc) {
    if (!sc) return;
    const tone = document.getElementById('sc-tone');
    const toneCustom = document.getElementById('sc-tone-custom');
    const tense = document.getElementById('sc-tense');
    const typeSel = document.getElementById('sc-scene-type');
    const legacyTone = sc.tone || '';
    if (tone) tone.value = sc.tonePreset || '';
    if (toneCustom) toneCustom.value = sc.toneCustom !== undefined ? sc.toneCustom : (sc.tonePreset ? '' : legacyTone);
    if (tense) tense.value = normalizeTenseLabel(sc.tense);
    if (typeSel) typeSel.value = sc.sceneType || '';
    const promptNote = document.getElementById('sc-prompt-note');
    if (promptNote) promptNote.value = sc.promptNote || '';
    _renderTypeFields(sc);
    if (_promptOpen) updatePrompt();
  }

  function saveTone() {
    const sc = (typeof getActiveScene === 'function') ? getActiveScene() : null;
    if (!sc) return;
    const preset = (document.getElementById('sc-tone')?.value || '').trim();
    const custom = (document.getElementById('sc-tone-custom')?.value || '').trim();
    sc.tonePreset = preset;
    sc.toneCustom = custom;
    sc.tone = [preset, custom].filter(Boolean).join(', ');
    saveState();
    updatePrompt();
  }

  function setType(typeVal) {
    const sc = (typeof getActiveScene === 'function') ? getActiveScene() : null;
    if (!sc) return;
    sc.sceneType = typeVal;
    saveState();
    _renderTypeFields(sc);
    updatePrompt();
  }

  function _renderTypeFields(sc) {
    const wrap = document.getElementById('sc-type-fields');
    if (!wrap) return;
    const fields = SCENE_TYPE_FIELDS[sc && sc.sceneType] || [];
    if (!fields.length) { wrap.innerHTML = ''; return; }
    wrap.innerHTML = fields.map(f => `
      <div style="margin-bottom:10px">
        <div style="display:flex;align-items:baseline;gap:6px;margin-bottom:2px">
          <div class="fl" style="font-size:10px;margin:0">${esc(f.label)}</div>
          <span style="font-family:var(--mono);font-size:9px;color:var(--text3)">- ${esc(f.hint)}</span>
        </div>
        <textarea class="fi" rows="2"
          style="resize:vertical;font-family:var(--font);font-size:12px;line-height:1.4"
          placeholder="${esc(f.hint)}"
          oninput="ScenePlanner._saveField('${f.key}',this.value)"
          onfocus="ScenePlanner._showMicro('sc-micro-${f.key}')"
          onblur="ScenePlanner._hideMicro('sc-micro-${f.key}')"
        >${esc((sc && sc[f.key]) || '')}</textarea>
        <div id="sc-micro-${f.key}" style="display:none;font-family:var(--mono);font-size:9px;color:var(--accent);margin-top:3px;padding:4px 8px;background:var(--bg0);border-left:2px solid var(--accent)">${esc(f.micro)}</div>
      </div>`).join('');
  }

  function _saveField(key, val) {
    const sc = (typeof getActiveScene === 'function') ? getActiveScene() : null;
    if (!sc) return;
    sc[key] = val;
    saveState();
    updatePrompt();
  }

  function _showMicro(id) { const el = document.getElementById(id); if (el) el.style.display = ''; }
  function _hideMicro(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

  function updatePrompt() {
    const outEl = document.getElementById('sc-prompt-output');
    if (!outEl) return;
    const sc = (typeof getActiveScene === 'function') ? getActiveScene() : null;
    if (!sc) { outEl.value = '[Keine aktive Szene.]'; return; }
    const ps = typeof ProjectMgr !== 'undefined' && ProjectMgr.getSettings ? ProjectMgr.getSettings() : {};
    const langMap = { de:'Deutsch', en:'English', fr:'Français', es:'Español' };
    const promptLanguage = langMap[ps.language] || ps.language || 'Deutsch';
    const projectType = (ps.projectType || 'Roman').trim() || 'Roman';
    const projectGenre = (ps.genre || '').trim();
    const projectBrief = (ps.projectBrief || '').trim();
    const projectTense = normalizeTenseLabel(ps.projectTense || 'Praeteritum');
    const sceneTense = normalizeTenseLabel(sc.tense);
    const effectiveTense = sceneTense || projectTense;

    const chars = (state.characters||[])
      .filter(c => c.name && ((sc.pov && c.name === sc.pov) || (sc.text||'').toLowerCase().includes((c.name||'').toLowerCase())))
      .map(c => `  - ${c.name}${c.role?' ('+c.role+')':''}${c.description?' - '+c.description:''}`)
      .join('\n') || '  (keine verknuepften Charaktere)';

    const typeLabel = SCENE_TYPE_LABELS[sc.sceneType] || '';
    const typeBlock = _buildTypeBlock(sc);
    const povGuidance = sc.pov
      ? `Erzaehlperspektive: Enge personale Perspektive in der dritten Person mit Fokus auf ${sc.pov}. Die Wahrnehmung, Gedanken und Deutungen liegen bei ${sc.pov}, ohne dass in Ich-Form geschrieben werden muss.`
      : null;
    const sceneWordGoal = Math.max(0, parseInt(sc.wordGoal, 10) || parseInt(document.getElementById('sc-goal')?.value || '', 10) || 2000);

    const lines = [
      `Schreibe eine erzaehlerisch ausformulierte Szene fuer ein ${projectType}${projectGenre ? ` im Genre ${projectGenre}` : ''}.`,
      `Schreibe in ${promptLanguage}.`,
      `Sprachstil: Schreibe konkret, praezise und lesbar. Bevorzuge klare Bilder, aktive Verben, glaubwuerdigen Subtext und rhythmische Saetze statt Floskeln, Erklaerprosa oder generischem KI-Klang.`,
      `Schreibe in natuerlichen, zusammenhaengenden Absaetzen und nicht in kuenstlich zerstueckelten Kurzsatz-Zeilen. Vermeide pathetische Ein-Wort-Saetze, staendige Absatzbrueche zur Scheindramatik und jede Form von aufgesetztem Bedeutungston.`,
      `Zeige statt zu behaupten: Emotionen, Spannung und Konflikte sollen ueber Handlung, Wahrnehmung, Reaktion, Koerpersprache und Dialog spuerbar werden, nicht ueber erklaerende Behauptungen.`,
      `Halte die Szene emotional fokussiert und nah an der Wahrnehmung der POV-Figur; jede Formulierung sollte Atmosphaere, Konflikt oder Figurenwirkung tragen.`,
      projectBrief ? `Projekt-Kontext:\n${projectBrief}` : null,
      ``,
      `=== SZENE ===`,
      `Titel: ${sc.title||'(kein Titel)'}`,
      typeLabel ? `Szenentyp: ${typeLabel}` : null,
      sc.pov ? `POV-Fokus: ${sc.pov}` : null,
      povGuidance,
      sc.location ? `Ort: ${sc.location}` : null,
      sc.tone ? `Ton: ${sc.tone}` : null,
      effectiveTense ? `Tempus: ${displayTenseLabel(effectiveTense)}${sceneTense ? ' (Szenen-Override)' : ' (Projektstandard)'}` : null,
      sceneWordGoal ? `Zielumfang (grobe Vorgabe): ca. ${sceneWordGoal} Woerter. Leichte Abweichungen sind in Ordnung, aber die Szene sollte sich grob an diesem Umfang orientieren.` : null,
      ``,
      sc.summary ? `Zusammenfassung:\n${sc.summary}` : null,
      typeBlock ? `\n=== SZENENSTRUKTUR ===\n${typeBlock}` : null,
      `\n=== CHARAKTERE ===\n${chars}`,
      sc.notes ? `\n=== NOTIZEN ===\n${sc.notes}` : null,
      sc.promptNote ? `\n=== ZUSAETZLICHE KI-HINWEISE ===\n${sc.promptNote}` : null,
      `\n=== AUFGABE ===`,
      sceneWordGoal ? `Peile fuer diese Szene grob ${sceneWordGoal} Woerter an, ohne den Text kuenstlich zu strecken.` : null,
      `Schreibe die Szene direkt und vollstaendig, ohne Einleitung, Zusammenfassung oder Kommentar danach.`,
    ].filter(l => l !== null);

    outEl.value = lines.join('\n');
  }

  function _buildTypeBlock(sc) {
    const fields = SCENE_TYPE_FIELDS[sc.sceneType] || [];
    return fields.map(f => sc[f.key] ? `${f.label}: ${sc[f.key]}` : null).filter(Boolean).join('\n');
  }

  function copyPrompt() {
    const outEl = document.getElementById('sc-prompt-output');
    if (!outEl || !outEl.value) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(outEl.value).then(() => {
        const btn = document.getElementById('sc-prompt-copy-btn');
        if (btn) { const o = btn.textContent; btn.textContent = '✓ Kopiert!'; setTimeout(()=>{ btn.textContent = o; }, 2000); }
        toast('Prompt kopiert!','ok');
      }).catch(() => { outEl.select(); document.execCommand('copy'); toast('Prompt kopiert!','ok'); });
    } else {
      outEl.select(); document.execCommand('copy'); toast('Prompt kopiert!','ok');
    }
  }

  return { toggle, togglePrompt, render, setType, saveTone, _saveField, _showMicro, _hideMicro, updatePrompt, copyPrompt };
})();

window.ScenePlanner = ScenePlanner;
