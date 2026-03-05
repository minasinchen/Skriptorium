'use strict';

/* Extracted IdeaCards logic from index.html */

const BeatNotizen = (() => {
  const uid = () => 'k'+Math.random().toString(36).slice(2,10);
  let _editId = null;

  function kacheln() {
    if (!state.ideaCards) state.ideaCards = [];
    return state.ideaCards.filter(c => c.type === 'beat');
  }

  let _strandCols = false;

  // ── helpers ──────────────────────────────────────────────────────────────
  function _board() {
    const bs = typeof Beats !== 'undefined' && Beats._getState ? Beats._getState() : null;
    if (!bs) return null;
    return bs.boards.find(b=>b.id===bs.activeBoardId) || bs.boards[0] || null;
  }

  function _projectWordStats() {
    const allScenes = typeof getAllScenes === 'function' ? getAllScenes() : [];
    const current = allScenes.reduce((sum, { sc }) => sum + countWords(sc ? (sc.text || '') : ''), 0);
    const projTarget = typeof ProjectMgr !== 'undefined' && ProjectMgr.getSettings
      ? Math.max(0, parseInt(ProjectMgr.getSettings().writingTarget, 10) || 0) : 0;
    const globalTarget = typeof SettingsState !== 'undefined' && SettingsState.get
      ? Math.max(0, parseInt(SettingsState.get().wordGoal, 10) || 0) : 0;
    const configured = projTarget || globalTarget;
    const target = configured > 0 && current <= configured ? configured : current;
    return { current, configured, target };
  }

  function _beatRange(board, beat) {
    if (!board || !beat) return null;
    const beats = board.beats || [];
    const phases = board.phases || [];
    const totalBeats = beats.length || 1;
    const phaseBeats = beats
      .filter(b => b.phaseId === beat.phaseId)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
    if (!phaseBeats.length) return null;
    const phaseIndex = phases.findIndex(p => p.id === beat.phaseId);
    let startBase = 0;
    for (let i = 0; i < phaseIndex; i++) {
      const p = phases[i];
      const beatCount = beats.filter(b => b.phaseId === p.id).length;
      const autoPct = Math.round(beatCount / totalBeats * 100);
      startBase += p.targetPct != null ? p.targetPct : autoPct;
    }
    const phase = phases.find(p => p.id === beat.phaseId) || null;
    const phaseAutoPct = Math.round(phaseBeats.length / totalBeats * 100);
    const phasePct = phase && phase.targetPct != null ? phase.targetPct : phaseAutoPct;
    const idx = Math.max(0, phaseBeats.findIndex(b => b.id === beat.id));
    const start = Math.round(startBase + (phasePct * idx / phaseBeats.length));
    const end = Math.round(startBase + (phasePct * (idx + 1) / phaseBeats.length));
    return {
      start: Math.max(0, Math.min(100, start)),
      end: Math.max(0, Math.min(100, Math.max(start, end)))
    };
  }

  function _beatPurposeText(beat) {
    if (!beat) return 'Ordne die Notiz einem Beat zu, damit du gezielte Orientierung für Funktion, Umfang und Fortschritt siehst.';
    const stored = (beat.note || '').trim();
    if (stored) return stored;
    const title = (beat.title || '').toLowerCase();
    const hints = [
      [/meet cute|erstes treffen/i, 'Lass die zentrale Beziehung mit sofortiger Chemie, Reibung und einem klaren romantischen Versprechen starten.'],
      [/anziehung|ann[aä]herung/i, 'Vertiefe die emotionale Anziehung: Naehe, Sehnsucht und Verletzlichkeit sollen spuerbar wachsen.'],
      [/ext\.?\s*hindernis|externes hindernis|a[uß]eres hindernis/i, 'Zeige das aeussere Problem, das die Beziehung real erschwert, obwohl die Figuren einander wollen.'],
      [/int\.?\s*hindernis|internes hindernis|inneres hindernis/i, 'Lege die innere Blockade offen, durch die eine Figur echte Naehe vermeidet oder sabotiert.'],
      [/trennung|bruch|separation/i, 'Die Beziehung muss hier glaubhaft auseinanderbrechen oder auf Distanz geraten und sich wie echter Verlust anfuehlen.'],
      [/reflexion|einsicht nach trennung/i, 'Nutze den Abstand fuer Einsicht: Was erkennt die Figur jetzt ueber sich, die Beziehung und ihren Fehler?'],
      [/grand gesture|gro[ßs]e geste/i, 'Hier braucht es eine sichtbare Handlung, die Liebe, Reue oder Entschlossenheit beweist statt nur zu behaupten.'],
      [/hea\/hfn|hea|hfn|happy ever after|happy for now/i, 'Loese das romantische Versprechen ein und zeige einen emotional glaubhaften neuen Beziehungszustand.'],
      [/protagonist/i, 'Verankere die Hauptfigur des Thrillers: Kompetenz, Verwundbarkeit und persoenlicher Einsatz muessen sofort greifbar sein.'],
      [/hook|opening|auftakt|eröffnung|opening image/i, 'Setze Ton, Erwartung und das zentrale Versprechen dieser Geschichte.'],
      [/setup|alltag|welt|gewöhnliche welt|welt & figur/i, 'Verankere Figur, Status quo, Defizit und die Welt, bevor der Druck steigt.'],
      [/catalyst|auslöser|inciting|ruf/i, 'Hier muss etwas das alte Gleichgewicht stören und die eigentliche Handlung auslösen.'],
      [/debate|weigerung|zweifel|innerer konflikt/i, 'Zeige Widerstand, Zögern oder Angst, damit die spätere Entscheidung Gewicht bekommt.'],
      [/break into two|schwelle|aufbruch|plot point 1|1\. wendepunkt/i, 'Dieser Beat verschiebt die Geschichte sichtbar in eine neue Lage: kein bequemes Zurück mehr.'],
      [/fun and games|tests|hindernisse|erste hälfte|ermittlung|verfolgung|flucht|jagd/i, 'Liefere die Kernversprechen der Geschichte: Versuche, Reibung und steigende Komplikationen.'],
      [/pinch|bad guys close in|komplikation|zuspitzung/i, 'Erinnere an den Druck: Gegner, Risiko oder Konsequenzen müssen jetzt enger werden.'],
      [/antagonist|gegner/i, 'Schaerfe die Gegenkraft: Der Gegner braucht Ziel, Methode und spuerenbare Ueberlegenheit.'],
      [/verlust|opfer|schlag/i, 'Lass die Figur einen echten Preis zahlen, damit der Druck nicht abstrakt bleibt.'],
      [/midpoint|wahrer einsatz|offenbarung|reveal|wendepunkt/i, 'Die Mitte braucht neue Klarheit, höhere Einsätze oder eine Erkenntnis, die den Kurs verändert.'],
      [/all is lost|tiefpunkt|krise|dark night/i, 'Führe die Figur an den Punkt, an dem alte Strategien scheitern und ein echter Preis sichtbar wird.'],
      [/entscheidung|neuer plan|break into three|letzter plan/i, 'Aus Verlust oder Einsicht entsteht jetzt ein bewusster neuer Kurs.'],
      [/finale|showdown|auflösung|final image|nachklang|rückkehr|harmonie/i, 'Löse den zentralen Konflikt ein, zahle das emotionale Versprechen aus und zeige den veränderten Zustand danach.']
    ];
    const hit = hints.find(([re]) => re.test(title));
    return hit ? hit[1] : 'Definiere klar, was sich in diesem Beat ändert, warum er unverzichtbar ist und was danach anders sein muss als davor.';
  }

  function _beatPromptText(beat) {
    if (!beat) return 'Wähle zuerst einen Beat. Dann kannst du die Notiz gezielt auf Zweck, Wendung und Umfang dieses Plotpunkts ausrichten.';
    const title = (beat.title || '').toLowerCase();
    if (/meet cute|erstes treffen/i.test(title)) return 'Prüffrage: Wodurch werden Chemie, Reibung und das Beziehungsversprechen schon im ersten Aufeinandertreffen sofort greifbar?';
    if (/anziehung|ann[aä]herung/i.test(title)) return 'Prüffrage: Was zieht die Figuren emotional näher zueinander und warum ist genau diese Nähe zugleich riskant?';
    if (/ext\.?\s*hindernis|externes hindernis|a[uß]eres hindernis/i.test(title)) return 'Prüffrage: Welcher äußere Druck verhindert gerade jetzt, dass die Beziehung einfach wachsen kann?';
    if (/int\.?\s*hindernis|internes hindernis|inneres hindernis/i.test(title)) return 'Prüffrage: Welche innere Angst oder Wunde sabotiert hier die Beziehung?';
    if (/trennung|bruch|separation/i.test(title)) return 'Prüffrage: Warum fühlt sich die Trennung an diesem Punkt unausweichlich und schmerzhaft an?';
    if (/grand gesture|gro[ßs]e geste/i.test(title)) return 'Prüffrage: Welche sichtbare Handlung beweist hier mehr als Worte, was die Beziehung der Figur wert ist?';
    if (/hea\/hfn|hea|hfn|happy ever after|happy for now/i.test(title)) return 'Prüffrage: Woran erkennt man konkret, dass die Beziehung jetzt einen glaubhaften neuen Zustand erreicht hat?';
    if (/protagonist/i.test(title)) return 'Prüffrage: Welche Stärke, Verwundbarkeit und persönlicher Einsatz der Hauptfigur müssen hier glasklar werden?';
    if (/flucht|jagd|verfolgungsjagd|chase/i.test(title)) return 'Prüffrage: Wovor flieht die Figur genau, und was steht auf dem Spiel, wenn sie jetzt scheitert?';
    if (/antagonist|gegner/i.test(title)) return 'Prüffrage: Wodurch zeigt sich hier, dass die Gegenkraft kompetent, gefährlich und schwer zu stoppen ist?';
    if (/verlust|opfer|schlag/i.test(title)) return 'Prüffrage: Was geht hier unwiderruflich verloren und warum verändert genau das die weitere Strategie?';
    if (/midpoint|wahrer einsatz|offenbarung|reveal/i.test(title)) return 'Prüffrage: Welche neue Information oder Entscheidung kippt hier die bisherige Richtung?';
    if (/finale|showdown|auflösung|final image|nachklang/i.test(title)) return 'Prüffrage: Welche offene Spannung wird hier aufgelöst und welcher bleibende Zustand entsteht daraus?';
    if (/catalyst|auslöser|inciting|ruf/i.test(title)) return 'Prüffrage: Welches Ereignis verhindert, dass die Figur einfach weitermacht wie bisher?';
    if (/tiefpunkt|krise|all is lost|dark night/i.test(title)) return 'Prüffrage: Was geht hier sichtbar verloren und warum reicht ein kleiner Rückzug jetzt nicht mehr?';
    return 'Prüffrage: Welche neue Lage, Entscheidung oder Erkenntnis muss nach diesem Beat definitiv existieren?';
  }

  function _beatProgress(beat) {
    if (!beat) return null;
    const sceneIds = [];
    const addSceneId = id => { if (id && !sceneIds.includes(id)) sceneIds.push(id); };
    if (Array.isArray(beat.sceneIds)) beat.sceneIds.forEach(addSceneId);
    addSceneId(beat.sceneId);
    kacheln().filter(k => k.beatId === beat.id).forEach(k => addSceneId(k.sceneId));
    if (!sceneIds.length) return null;
    const sceneMap = new Map((typeof getAllScenes === 'function' ? getAllScenes() : []).map(({ sc }) => [sc.id, sc]));
    const words = sceneIds.reduce((sum, id) => sum + countWords((sceneMap.get(id)?.text) || ''), 0);
    const stats = _projectWordStats();
    if (!stats.target) return null;
    return {
      words,
      goal: stats.target,
      pct: Math.min(100, Math.round(words / stats.target * 100)),
      sceneCount: sceneIds.length
    };
  }

  function _beatGuideHtml(beatId) {
    const board = _board();
    if (!beatId || !board) {
      return `<div class="kn-guide">
        <div class="kn-guide-kicker">Beat-Kompass</div>
        <div class="kn-guide-copy">Ordne diese Planungsnotiz einem Beat zu. Dann siehst du hier, wofür der Beat da ist, welchen Anteil er ungefähr im Buch trägt und wie weit er über verknüpfte Szenen schon gefüllt ist.</div>
      </div>`;
    }
    const beat = (board.beats || []).find(b => b.id === beatId);
    if (!beat) return '';
    const phase = (board.phases || []).find(p => p.id === beat.phaseId);
    const range = _beatRange(board, beat);
    const progress = _beatProgress(beat);
    const rangeLabel = range ? (range.start === range.end ? `ca. ${range.end}%` : `ca. ${range.start}-${range.end}%`) : 'offen';
    const progressLabel = progress
      ? `${progress.words} / ${progress.goal} Wörter (${progress.pct}%)`
      : 'Noch keine verknüpften Szenen';
    return `<div class="kn-guide">
      <div class="kn-guide-kicker">Beat-Kompass</div>
      <div class="kn-guide-title">${esc(beat.title || 'Beat')}</div>
      <div class="kn-guide-copy">${esc(_beatPurposeText(beat))}</div>
      <div class="kn-guide-grid">
        <div class="kn-guide-stat">
          <span class="kn-guide-stat-label">Phase</span>
          <span class="kn-guide-stat-value">${esc((phase && phase.name) || 'Ohne Phase')}</span>
        </div>
        <div class="kn-guide-stat">
          <span class="kn-guide-stat-label">Buchanteil</span>
          <span class="kn-guide-stat-value">${esc(rangeLabel)}</span>
        </div>
        <div class="kn-guide-stat">
          <span class="kn-guide-stat-label">Fortschritt</span>
          <span class="kn-guide-stat-value">${esc(progressLabel)}</span>
        </div>
      </div>
      <div class="kn-guide-prompt">${esc(_beatPromptText(beat))}</div>
    </div>`;
  }

  function _kachelCardHtml(k) {
    const strands = typeof getStrands==='function' ? getStrands() : [];
    const strand = strands.find(s=>s.id===k.strandId);
    const sc = k.sceneId ? (typeof findScene==='function' ? findScene(k.sceneId) : null) : null;
    const kDate = k.date || k.datum || '';
    const kTitle = k.title || k.titel || '(ohne Titel)';
    const kNote = k.note || k.notes || k.notiz || '';
    const hasMeta = kDate || sc || k.ort;
    let badges = '';
    if (kDate) badges += `<span class="bn-badge bn-badge-date">📅 ${esc(kDate)}</span>`;
    if (sc) badges += `<span class="bn-badge bn-badge-scene">↗ ${esc((sc.sc&&sc.sc.title)||'Szene')}</span>`;
    if (k.ort) badges += `<span class="bn-badge bn-badge-ort">📍 ${esc(k.ort)}</span>`;
    return `<div class="bn-kachel-card" data-kid="${k.id}" style="border-left-color:${strand?strand.color:'var(--border2)'}">
      <div class="bn-card-title">${esc(kTitle)}</div>
      ${hasMeta ? `<div class="bn-card-badges">${badges}</div>` : `<div class="bn-card-nometa">Ohne Metadaten</div>`}
      ${kNote ? `<div class="bn-card-note">${esc(kNote)}</div>` : ''}
    </div>`;
  }

  // Renders cards for one beat – either flat list or strand columns
  function _beatCardsHtml(beatCards, beatId) {
    if (!_strandCols) {
      if (!beatCards.length)
        return `<div class="bn-beat-empty"><button class="zoom-btn" onclick="BeatNotizen.addKachel(${beatId?`'${beatId}'`:'null'})">＋ Idee</button></div>`;
      return beatCards.map(k=>_kachelCardHtml(k)).join('');
    }
    // strand columns
    const strands = typeof getStrands==='function' ? getStrands() : [];
    const cols = strands.length
      ? [...strands, {id:'none', label:'Ohne Strang', color:'var(--border2)'}]
      : [{id:'none', label:'Ideen', color:'var(--border2)'}];
    const colHtml = cols.map(s => {
      const items = beatCards.filter(k=>(k.strandId||'none')===(s.id||'none'));
      return `<div class="bn-sc">
        <div class="bn-sc-hdr" style="color:${s.color}">${esc(s.label||s.id)}</div>
        ${items.map(k=>_kachelCardHtml(k)).join('')}
        <button class="zoom-btn bn-sc-add" onclick="BeatNotizen._addWithStrand(${beatId?`'${beatId}'`:'null'},'${s.id}')">＋</button>
      </div>`;
    }).join('');
    return `<div class="bn-sc-wrap">${colHtml}</div>`;
  }

  // ── main render ──────────────────────────────────────────────────────────
  function render() {
    const el = document.getElementById('bn-view');
    const countEl = document.getElementById('bn-count');
    const beatCountEl = document.getElementById('bn-beat-count');
    if (!el) return;

    const all = kacheln();
    const board = _board();

    // header counts
    if (countEl) countEl.textContent = all.length + (all.length===1?' Idee':' Ideen');
    if (beatCountEl) {
      if (board) {
        const total = (board.beats||[]).length;
        const covered = (board.beats||[]).filter(b=>all.some(k=>k.beatId===b.id)).length;
        beatCountEl.textContent = total ? `· Beats: ${covered}/${total}` : '';
      } else beatCountEl.textContent = '';
    }

    if (!board) {
      el.innerHTML = `<div class="bn-empty">Kein Beat-Board aktiv.</div>`;
      return;
    }

    const { phases=[], beats=[] } = board;
    let html = '';

    for (const phase of phases) {
      const pb = beats.filter(b=>b.phaseId===phase.id);
      if (!pb.length) continue;
      const phaseCnt = pb.reduce((s,b)=>s+all.filter(k=>k.beatId===b.id).length,0);
      html += `<div class="bn-phase-row">
        <span>${esc(phase.name||'Phase')}</span>
        ${phaseCnt?`<span class="bn-phase-cnt">${phaseCnt} Idee${phaseCnt!==1?'n':''}</span>`:''}
      </div>`;
      for (const beat of pb) {
        // key: beat.id (stable random string) === kachel.beatId
        const beatCards = all.filter(k => k.beatId === beat.id);
        const beatRange = _beatRange(board, beat);
        const beatProgress = _beatProgress(beat);
        const rangeLabel = beatRange ? (beatRange.start === beatRange.end ? `ca. ${beatRange.end}% vom Buch` : `ca. ${beatRange.start}-${beatRange.end}% vom Buch`) : '';
        const progressHtml = beatProgress
          ? `<div class="bn-beat-progress">
              <div class="bn-beat-progress-bar"><div class="bn-beat-progress-fill" style="width:${beatProgress.pct}%"></div></div>
              <div class="bn-beat-progress-meta"><span>${beatProgress.pct}% erfüllt</span><span>${beatProgress.words}/${beatProgress.goal} W.</span></div>
            </div>`
          : '';
        html += `<div class="bn-beat-row">
          <div class="bn-beat-label">
            <span class="bn-beat-label-title">${esc(beat.title||'Beat')}</span>
            <span class="bn-beat-label-note">${esc(_beatPurposeText(beat))}</span>
            ${rangeLabel ? `<span class="bn-beat-label-meta">${esc(rangeLabel)}</span>` : ''}
            ${beatCards.length?`<span class="bn-beat-label-cnt">${beatCards.length}</span>`:''}
            ${progressHtml}
            <button class="zoom-btn bn-beat-add" onclick="BeatNotizen.addKachel('${beat.id}')">＋</button>
          </div>
          <div class="bn-beat-cards">
            ${_beatCardsHtml(beatCards, beat.id)}
          </div>
        </div>`;
      }
    }

    // unassigned
    const unassigned = all.filter(k=>!k.beatId);
    if (unassigned.length) {
      html += `<div class="bn-phase-row bn-phase-row-muted"><span>Ohne Beat</span><span class="bn-phase-cnt">${unassigned.length}</span></div>`;
      html += `<div class="bn-beat-row">
        <div class="bn-beat-label"><span class="bn-beat-label-title" style="opacity:.4">–</span></div>
        <div class="bn-beat-cards">${_beatCardsHtml(unassigned, null)}</div>
      </div>`;
    }

    el.innerHTML = html || `<div class="bn-empty">Noch keine Ideen.<br><br><button class="zoom-btn" onclick="BeatNotizen.addKachel(null)">＋ Erste Idee</button></div>`;
    el.querySelectorAll('[data-kid]').forEach(c => {
      c.addEventListener('click', () => openEditor(c.dataset.kid));
    });
  }

  function toggleStrandCols() {
    _strandCols = !_strandCols;
    const btn = document.getElementById('beats-strand-btn');
    if (btn) btn.style.color = _strandCols ? 'var(--accent)' : '';
    render();
  }

  function _addWithStrand(beatId, strandId) {
    if (!state.ideaCards) state.ideaCards = [];
    if (!state.orders) state.orders = { planner:{}, beats:{}, grid:{} };
    const k = { id:uid(), type:'beat', title:'', note:'', beatId:beatId||null,
      strandId:strandId||'none', ort:'', date:'', dateManual:false, sceneId:null, status:'idea', tags:'' };
    state.ideaCards.push(k);
    const sid = k.strandId || 'none';
    if (!state.orders.planner[sid]) state.orders.planner[sid] = [];
    state.orders.planner[sid].push(k.id);
    saveState();
    openEditor(k.id, true);
  }

  function addKachel(beatId) {
    if (!state.ideaCards) state.ideaCards = [];
    if (!state.orders) state.orders = { planner:{}, beats:{}, grid:{} };
    const k = { id:uid(), type:'beat', title:'', note:'', beatId:beatId||null,
      strandId:'none', ort:'', date:'', dateManual:false, sceneId:null, status:'idea', tags:'' };
    state.ideaCards.push(k);
    const sid = k.strandId || 'none';
    if (!state.orders.planner[sid]) state.orders.planner[sid] = [];
    state.orders.planner[sid].push(k.id);
    saveState();
    openEditor(k.id, true);
  }

  function openEditor(id, isNew) {
    _editId = id;
    // If card is still in planner.cards (not yet migrated), convert it to ideaCard
    let k = (state.ideaCards||[]).find(x=>x.id===id);
    if (!k) {
      const pc = (state.planner?.cards||[]).find(x=>x.id===id);
      if (pc) {
        if (!state.ideaCards) state.ideaCards = [];
        k = { id:pc.id, type:'plan', title:pc.title||'', note:pc.note||pc.notes||'',
          strandId:pc.strandId||null, beatId:null, sceneId:pc.sceneId||null,
          ort:pc.ort||'', date:pc.date||'', dateManual:!!pc.dateManual,
          status:pc.status||'idea', tags:pc.tags||'' };
        state.ideaCards.push(k);
        state.planner.cards = state.planner.cards.filter(x=>x.id!==id);
        saveState();
      }
    }
    if (!k) return;
    const ov = document.getElementById('kn-overlay');
    const body = document.getElementById('kn-body');
    const titleEl = document.getElementById('kn-editor-title');
    if (!ov||!body) return;
    if (titleEl) titleEl.textContent = isNew ? 'Neue Planungsnotiz' : 'Planungsnotiz bearbeiten';
    const delBtn = document.getElementById('kn-del-btn');
    if (delBtn) delBtn.style.display = isNew?'none':'';

    // Beat options — alle Boards
    const bs = typeof Beats!=='undefined'&&Beats._getState?Beats._getState():null;
    let beatOpts = '<option value="">— Kein Beat —</option>';
    if (bs && bs.boards) {
      for (const brd of bs.boards) {
        const brdBeats = brd.beats || [];
        if (!brdBeats.length) continue;
        beatOpts += `<optgroup label="${esc(brd.name||'Board')}">`;
        for (const phase of (brd.phases||[])) {
          const pb = brdBeats.filter(b=>b.phaseId===phase.id);
          pb.forEach(b=>{ beatOpts+=`<option value="${b.id}"${k.beatId===b.id?' selected':''}>${esc(phase.name||'?')} › ${esc(b.title||'Beat')}</option>`; });
        }
        const noPhase = brdBeats.filter(b=>!(brd.phases||[]).find(p=>p.id===b.phaseId));
        noPhase.forEach(b=>{ beatOpts+=`<option value="${b.id}"${k.beatId===b.id?' selected':''}>${esc(b.title||'Beat')}</option>`; });
        beatOpts += '</optgroup>';
      }
    }

    // Scene options
    const allSc = typeof getAllScenes==='function'?getAllScenes():[];
    let scOpts = '<option value="">— Keine Szene —</option>';
    allSc.forEach(({vol,ch,sc})=>{scOpts+=`<option value="${sc.id}"${k.sceneId===sc.id?' selected':''}>${esc(sc.title)} — ${esc(vol.title)} › ${esc(ch.title)}</option>`;});

    // Strand dots
    const strands = typeof getStrands==='function'?getStrands():[];
    let strandHtml = `<label data-sid="" style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--mono);font-size:9px;color:var(--text3);padding:3px 6px;border:1px solid ${!k.strandId?'var(--text3)':'transparent'};border-radius:2px" onclick="BeatNotizen._setStrand(this)">
      <span style="width:10px;height:10px;border-radius:50%;background:var(--border2);display:inline-block"></span>Kein Strang</label>`;
    strands.forEach(s=>{strandHtml+=`<label data-sid="${s.id}" style="display:flex;align-items:center;gap:6px;cursor:pointer;font-family:var(--mono);font-size:9px;color:var(--text2);padding:3px 6px;border:1px solid ${k.strandId===s.id?'var(--text3)':'transparent'};border-radius:2px;transition:border-color .1s" onclick="BeatNotizen._setStrand(this)"><span style="width:10px;height:10px;border-radius:50%;background:${s.color};display:inline-block"></span>${esc(s.label||s.id)}</label>`;});

    // Format date for input
    const kDate = k.date || k.datum || '';
    let dateVal = '';
    if (kDate) {
      if (kDate.match(/^\d{2}\.\d{2}\.\d{4}$/)) {
        const [d,m,y]=kDate.split('.');dateVal=`${y}-${m}-${d}`;
      } else { dateVal=kDate; }
    }

    body.innerHTML=`
      <div id="kn-beat-guide">${_beatGuideHtml(k.beatId)}</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <div class="beats-ml">Beat (Optional)</div>
          <select class="beats-select" id="kn-beat" style="width:100%" onchange="BeatNotizen.refreshBeatGuide()">${beatOpts}</select>
        </div>
        <div></div>
      </div>
      <div>
        <div class="beats-ml">Titel</div>
        <input class="beats-inp" id="kn-titel" value="${esc(k.title||k.titel||'')}" placeholder="Was soll in dieser Idee passieren?">
      </div>
      <div>
        <div class="beats-ml">Notiz</div>
        <textarea class="beats-ta" id="kn-notiz" rows="4" placeholder="Was soll in dieser Idee passieren?">${esc(k.note||k.notes||k.notiz||'')}</textarea>
      </div>
      <div>
        <div class="beats-ml">Strang</div>
        <div style="display:flex;flex-wrap:wrap;gap:4px;padding:8px;background:var(--bg1);border:1px solid var(--border)" id="kn-strand-wrap">${strandHtml}</div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div>
          <div class="beats-ml">Datum (Optional)</div>
          <input class="beats-inp" id="kn-datum" type="date" value="${dateVal}">
        </div>
        <div>
          <div class="beats-ml">Ort (Optional)</div>
          <input class="beats-inp" id="kn-ort" value="${esc(k.ort)}" placeholder="z.B. Hogwarts"
            list="kn-ort-list" autocomplete="off">
          <datalist id="kn-ort-list">${getAllLocations().map(l=>`<option value="${esc(l)}">`).join('')}</datalist>
        </div>
      </div>
      <div>
        <div class="beats-ml">Szene verknüpfen (Optional)</div>
        <select class="beats-select" id="kn-scene" style="width:100%">${scOpts}</select>
      </div>`;

    ov.classList.add('open');
    refreshBeatGuide();
    setTimeout(()=>{const i=document.getElementById('kn-titel');if(i)i.focus();},80);
  }

  function refreshBeatGuide() {
    const guide = document.getElementById('kn-beat-guide');
    if (!guide) return;
    const beatId = document.getElementById('kn-beat')?.value || '';
    guide.innerHTML = _beatGuideHtml(beatId);
  }

  function _setStrand(el) {
    document.querySelectorAll('#kn-strand-wrap label').forEach(l=>{ l.style.borderColor='transparent'; });
    el.style.borderColor = 'var(--text3)';
    const sid = el.dataset.sid;
    const k = kacheln().find(x=>x.id===_editId);
    if (k) k._ts = sid;
  }

  function saveKachel() {
    const k = (state.ideaCards||[]).find(x=>x.id===_editId);
    if (!k) return;
    const oldStrand = k.strandId || 'none';
    k.title = (document.getElementById('kn-titel')?.value||'').trim();
    k.note = (document.getElementById('kn-notiz')?.value||'').trim();
    k.beatId = document.getElementById('kn-beat')?.value||null;
    const dv = document.getElementById('kn-datum')?.value||'';
    k.date = dv;
    k.dateManual = !!dv;
    k.ort = (document.getElementById('kn-ort')?.value||'').trim();
    k.sceneId = document.getElementById('kn-scene')?.value||null;
    // Get strand from visual selection
    const activeLabel = [...(document.querySelectorAll('#kn-strand-wrap label')||[])].find(l=>l.style.borderColor&&l.style.borderColor!=='transparent');
    if (activeLabel) { k.strandId = activeLabel.dataset.sid||'none'; }
    else if (k._ts !== undefined) { k.strandId = k._ts||'none'; }
    delete k._ts;
    // Sync orders.planner on strand change
    if (!state.orders) state.orders = { planner:{}, beats:{}, grid:{} };
    if (!state.orders.planner) state.orders.planner = {};
    const newStrand = k.strandId || 'none';
    if (oldStrand !== newStrand) {
      if (state.orders.planner[oldStrand])
        state.orders.planner[oldStrand] = state.orders.planner[oldStrand].filter(id=>id!==k.id);
      if (!state.orders.planner[newStrand]) state.orders.planner[newStrand] = [];
      if (!state.orders.planner[newStrand].includes(k.id)) state.orders.planner[newStrand].push(k.id);
    } else {
      if (!state.orders.planner[newStrand]) state.orders.planner[newStrand] = [];
      if (!state.orders.planner[newStrand].includes(k.id)) state.orders.planner[newStrand].push(k.id);
    }
    saveState();
    closeEditor();
    render();
    try{showToast('Kachel gespeichert','ok');}catch(_){}
  }

  function deleteKachel() {
    if (!confirm('Kachel löschen?')) return;
    if (state.ideaCards) state.ideaCards = state.ideaCards.filter(x=>x.id!==_editId);
    saveState(); closeEditor(); render();
    try{showToast('Kachel gelöscht','ok');}catch(_){}
  }

  function closeEditor() {
    const ov = document.getElementById('kn-overlay');
    if (ov) ov.classList.remove('open');
    _editId = null;
  }

  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeEditor(); });

  return { render, addKachel, _addWithStrand, openEditor, saveKachel, deleteKachel, closeEditor, _setStrand, toggleStrandCols, refreshBeatGuide,
    get _editId() { return _editId; } };
})();
window.BeatNotizen = BeatNotizen;

const Kacheln = (() => {
  const uid = () => 'k'+Math.random().toString(36).slice(2,10);
  let _view = 'beats';
  let _boardId = null;

  function getKacheln() {
    if (!state.ideaCards) state.ideaCards = [];
    return state.ideaCards.filter(c => c.type === 'beat');
  }

  function init() {
    // Set board from state or first available
    const bs = typeof Beats !== 'undefined' ? (Beats._getState ? Beats._getState() : null) : null;
    const boards = bs ? bs.boards : [];
    if (!_boardId && boards.length) _boardId = boards[0].id;
    if (state.ui && state.ui.kachelnBoardId) _boardId = state.ui.kachelnBoardId;
    if (state.ui && state.ui.kachelnView) _view = state.ui.kachelnView;
    populateBoardSel(boards);
    render();
  }

  function populateBoardSel(boards) {
    const sel = document.getElementById('kacheln-board-sel');
    if (!sel) return;
    sel.innerHTML = '<option value="">— Kein Beat-Board —</option>' +
      boards.map(b=>`<option value="${b.id}"${b.id===_boardId?' selected':''}>${esc(b.name||'Board')}</option>`).join('');
  }

  function setBoard(id) {
    _boardId = id;
    if (state.ui) state.ui.kachelnBoardId = id;
    saveState();
    render();
  }

  function setView(v, btn) {
    _view = v;
    if (state.ui) state.ui.kachelnView = v;
    document.querySelectorAll('.k-view-btn').forEach(b=>b.classList.remove('active'));
    if (btn) btn.classList.add('active');
    else {
      const el = document.getElementById('kv-'+v);
      if (el) el.classList.add('active');
    }
    render();
  }

  function getBoardBeats() {
    if (!_boardId) return { phases:[], beats:[] };
    const bs = typeof Beats !== 'undefined' && Beats._getState ? Beats._getState() : null;
    if (!bs) return { phases:[], beats:[] };
    const board = bs.boards.find(b=>b.id===_boardId);
    if (!board) return { phases:[], beats:[] };
    return { phases: board.phases||[], beats: board.beats||[] };
  }

  function render() {
    const body = document.getElementById('kacheln-body');
    if (!body) return;
    const kacheln = getKacheln();
    const count = document.getElementById('kacheln-count');
    if (count) count.textContent = kacheln.length + ' Kacheln';

    if (_view === 'beats') renderBeatsView(body, kacheln);
    else renderFreeView(body, kacheln);
  }

  function renderBeatsView(body, kacheln) {
    const strands = getStrands();
    const { phases, beats } = getBoardBeats();

    if (!beats.length) {
      body.innerHTML = `<div style="padding:40px;text-align:center;font-family:var(--mono);font-size:10px;color:var(--text3)">
        Kein Beat-Board gewählt oder leer. Bitte zuerst im Beats-Tab ein Board anlegen und Beats hinzufügen.
        <br><br><button class="zoom-btn" onclick="App.switchTab('beats',document.querySelector('[data-tab=beats]'))">→ Zum Beats-Tab</button>
      </div>`;
      return;
    }

    // Table: rows = beats, cols = strands + "ohne Strang"
    const cols = [...strands, { id:'none', label:'Ohne Strang', color:'#5c5550' }];

    let html = `<table class="kacheln-table"><thead><tr>
      <th class="beat-col">Beat</th>
      ${cols.map(s=>`<th style="min-width:160px"><span style="width:8px;height:8px;border-radius:50%;background:${s.color};display:inline-block;margin-right:4px"></span>${esc(s.label||s.id)}</th>`).join('')}
    </tr></thead><tbody>`;

    // Group beats by phase
    for (const phase of phases) {
      const phaseBeats = beats.filter(b=>b.phaseId===phase.id);
      if (!phaseBeats.length) continue;

      // Phase header row
      const phaseWeight = phase.weight || 0;
      const phaseRange = phase.rangeStart !== undefined ? `${phase.rangeStart}–${phase.rangeEnd}%` : '';
      html += `<tr><td colspan="${cols.length+1}" style="background:var(--bg2);padding:6px 10px;border:1px solid var(--border2)">
        <span style="font-family:var(--mono);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--accent)">${esc(phase.name||'Phase')}</span>
        ${phaseWeight?`<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:8px">Anteil: ${phaseWeight}%</span>`:''}
        ${phaseRange?`<span style="font-family:var(--mono);font-size:8px;color:var(--text3);margin-left:6px">Verortung: ${phaseRange}</span>`:''}
      </td></tr>`;

      for (const beat of phaseBeats) {
        const beatWeight = beat.weight || 0;
        const beatRangeStart = beat.rangeStart !== undefined ? beat.rangeStart : null;
        const beatRangeEnd = beat.rangeEnd !== undefined ? beat.rangeEnd : null;

        html += `<tr>
          <td class="beat-cell">
            <div class="kt-beat-name">${esc(beat.title||'Beat')}</div>
            ${beat.note ? `<div class="kt-beat-meta">${esc(beat.note.slice(0,60))}${beat.note.length>60?'…':''}</div>` : ''}
            <div class="kt-beat-weight">
              ${beatWeight ? `<span class="kt-weight-tag">${beatWeight}%</span>` : ''}
              ${beatRangeStart !== null ? `<span class="kt-range-tag">${beatRangeStart}–${beatRangeEnd}%</span>` : ''}
            </div>
            ${beatWeight ? `<div class="kt-pct-bar"><div class="kt-pct-fill" style="width:${Math.min(100,beatWeight*3)}%"></div></div>` : ''}
          </td>
          ${cols.map(strand => {
            const cellKacheln = kacheln.filter(k=>k.beatId===beat.id && (k.strandId||'none')===(strand.id||'none'));
            const chips = cellKacheln.map(k => renderChip(k, strand.color)).join('');
            return `<td><div class="kacheln-cell" onclick="Kacheln.addKachel('${beat.id}','${strand.id||'none'}')" title="Kachel hinzufügen">${chips}<div class="kacheln-cell-add">＋</div></div></td>`;
          }).join('')}
        </tr>`;
      }
    }

    html += '</tbody></table>';
    body.innerHTML = html;
    // Re-attach chip click handlers
    body.querySelectorAll('.kachel-chip').forEach(el => {
      el.addEventListener('click', e => {
        e.stopPropagation();
        openEditor(el.dataset.id);
      });
    });
  }

  function renderFreeView(body, kacheln) {
    const strands = getStrands();
    if (!kacheln.length) {
      body.innerHTML = `<div style="padding:50px;text-align:center;color:var(--text3)">
        <div style="font-size:32px;opacity:.2;margin-bottom:10px">◈</div>
        <div style="font-family:var(--mono);font-size:10px;letter-spacing:.1em">Noch keine Kacheln. Klick auf + Kachel oben rechts.</div>
      </div>`;
      return;
    }

    // Group by strand
    const groups = {};
    for (const k of kacheln) {
      const sid = k.strandId || 'none';
      if (!groups[sid]) groups[sid] = [];
      groups[sid].push(k);
    }

    const allGroups = [...strands.map(s=>({...s})), {id:'none',label:'Ohne Strang',color:'#5c5550'}];
    let html = '<div style="padding:14px;display:flex;flex-direction:column;gap:16px">';
    for (const strand of allGroups) {
      const group = groups[strand.id||'none'];
      if (!group || !group.length) continue;
      html += `<div>
        <div style="font-family:var(--mono);font-size:9px;letter-spacing:.1em;color:${strand.color};text-transform:uppercase;margin-bottom:8px;display:flex;align-items:center;gap:6px">
          <span style="width:8px;height:8px;border-radius:50%;background:${strand.color}"></span>
          ${esc(strand.label||strand.id)} <span style="color:var(--text3)">(${group.length})</span>
        </div>
        <div style="display:flex;flex-wrap:wrap;gap:8px">
          ${group.map(k=>renderChip(k,strand.color)).join('')}
        </div>
      </div>`;
    }
    html += '</div>';
    body.innerHTML = html;
    body.querySelectorAll('.kachel-chip').forEach(el => {
      el.addEventListener('click', e => { e.stopPropagation(); openEditor(el.dataset.id); });
    });
  }

  function renderChip(k, strandColor) {
    const sc = k.sceneId ? findScene(k.sceneId) : null;
    const badges = [];
    const kDate = k.date||k.datum||''; const kNote = k.note||k.notes||k.notiz||''; const kTitle = k.title||k.titel||'(ohne Titel)';
    if (kDate) badges.push(`<span class="kbadge" style="background:var(--sd)">📅 ${kDate}</span>`);
    if (k.ort) badges.push(`<span class="kbadge" style="background:#4a3f30">📍 ${esc(k.ort.slice(0,12))}</span>`);
    if (sc) badges.push(`<span class="kbadge" style="background:var(--sk)">↗ Szene</span>`);
    return `<div class="kachel-chip${sc?' linked-scene':''}" data-id="${k.id}" style="${sc?'border-left-color:'+strandColor:''}">
      <div class="kachel-chip-title">${esc(kTitle)}</div>
      ${kNote ? `<div class="kachel-chip-note">${esc(kNote.slice(0,50))}${kNote.length>50?'…':''}</div>` : ''}
      ${badges.length ? `<div class="kachel-badges">${badges.join('')}</div>` : ''}
    </div>`;
  }

  function addKachel(beatId, strandId) {
    if (!state.ideaCards) state.ideaCards = [];
    if (!state.orders) state.orders = { planner:{}, beats:{}, grid:{} };
    const k = { id:uid(), type:'beat', title:'', note:'', beatId:beatId||null,
      strandId:strandId||'none', ort:'', date:'', dateManual:false, sceneId:null, status:'idea', tags:'' };
    state.ideaCards.push(k);
    const sid = k.strandId || 'none';
    if (!state.orders.planner[sid]) state.orders.planner[sid] = [];
    state.orders.planner[sid].push(k.id);
    saveState();
    openEditor(k.id);
  }

  function openEditor(id) {
    const k = (state.ideaCards||[]).find(x=>x.id===id);
    if (!k) return;
    const strands = getStrands();
    const strandOpts = `<option value="none">Ohne Strang</option>` +
      strands.map(s=>`<option value="${s.id}"${k.strandId===s.id?' selected':''}>${esc(s.label)}</option>`).join('');

    // Build beat options from all boards
    const bs = typeof Beats !== 'undefined' && Beats._getState ? Beats._getState() : null;
    let beatOpts = '<option value="">— Kein Beat —</option>';
    if (bs && bs.boards) {
      for (const board of bs.boards) {
        for (const beat of (board.beats||[])) {
          beatOpts += `<option value="${beat.id}"${k.beatId===beat.id?' selected':''}>${esc(board.name)} › ${esc(beat.title||'Beat')}</option>`;
        }
      }
    }

    // Scene link
    const allScenes = getAllScenes();
    let sceneOpts = '<option value="">— Keine Szene verknüpfen —</option>';
    for (const {vol,ch,sc} of allScenes) {
      sceneOpts += `<option value="${sc.id}"${k.sceneId===sc.id?' selected':''}>${esc(vol.title)} › ${esc(ch.title)} › ${esc(sc.title)}</option>`;
    }

    showModal(`<div class="kachel-modal-title">Kachel bearbeiten</div>
      <div class="kachel-form">
        <div class="kf-group">
          <label class="kf-lbl">Titel</label>
          <input class="kf-inp" id="kf-titel" value="${esc(k.title||k.titel||'')}" placeholder="Idee / Szenenkonzept…">
        </div>
        <div class="kf-group">
          <label class="kf-lbl">Notiz / Idee</label>
          <textarea class="kf-ta" id="kf-notiz" rows="4" placeholder="Was passiert hier? Wozu dient diese Szene?">${esc(k.note||k.notes||k.notiz||'')}</textarea>
        </div>
        <div class="kf-row">
          <div class="kf-group">
            <label class="kf-lbl">Beat</label>
            <select class="kf-sel" id="kf-beat">${beatOpts}</select>
          </div>
          <div class="kf-group">
            <label class="kf-lbl">Strang</label>
            <select class="kf-sel" id="kf-strand">${strandOpts}</select>
          </div>
        </div>
        <div class="kf-row">
          <div class="kf-group">
            <label class="kf-lbl">Ort</label>
            <input class="kf-inp" id="kf-ort" value="${esc(k.ort)}" placeholder="Wo findet es statt?"
              list="kf-ort-list" autocomplete="off">
            <datalist id="kf-ort-list">${getAllLocations().map(l=>`<option value="${esc(l)}">`).join('')}</datalist>
          </div>
          <div class="kf-group">
            <label class="kf-lbl">Datum / Zeit</label>
            <input class="kf-inp" id="kf-datum" value="${esc(k.date||k.datum||'')}" placeholder="YYYY-MM-DD oder freier Text">
          </div>
        </div>
        <div class="kf-group">
          <label class="kf-lbl">Verknüpfte Szene</label>
          <select class="kf-sel" id="kf-scene">${sceneOpts}</select>
        </div>
      </div>
      <div class="modal-btns">
        <button class="mbtn danger" onclick="Kacheln.deleteKachel('${id}')">Löschen</button>
        <button class="mbtn" onclick="closeModal()">Abbrechen</button>
        <button class="mbtn primary" onclick="Kacheln.saveKachel('${id}')">Speichern</button>
      </div>`, b => b.querySelector('#kf-titel').focus());
  }

  function saveKachel(id) {
    const k = (state.ideaCards||[]).find(x=>x.id===id);
    if (!k) return;
    const oldStrand = k.strandId || 'none';
    k.title = document.getElementById('kf-titel').value.trim();
    k.note = document.getElementById('kf-notiz').value.trim();
    k.beatId = document.getElementById('kf-beat').value || null;
    k.strandId = document.getElementById('kf-strand').value || 'none';
    k.ort = document.getElementById('kf-ort').value.trim();
    const dv = document.getElementById('kf-datum').value.trim();
    k.date = dv; k.dateManual = !!dv;
    k.sceneId = document.getElementById('kf-scene').value || null;
    // Sync orders.planner on strand change
    if (!state.orders) state.orders = { planner:{}, beats:{}, grid:{} };
    if (!state.orders.planner) state.orders.planner = {};
    const newStrand = k.strandId || 'none';
    if (oldStrand !== newStrand) {
      if (state.orders.planner[oldStrand])
        state.orders.planner[oldStrand] = state.orders.planner[oldStrand].filter(x=>x!==k.id);
      if (!state.orders.planner[newStrand]) state.orders.planner[newStrand] = [];
      if (!state.orders.planner[newStrand].includes(k.id)) state.orders.planner[newStrand].push(k.id);
    } else {
      if (!state.orders.planner[newStrand]) state.orders.planner[newStrand] = [];
      if (!state.orders.planner[newStrand].includes(k.id)) state.orders.planner[newStrand].push(k.id);
    }
    saveState();
    closeModal();
    render();
    toast('Kachel gespeichert','ok');
  }

  function deleteKachel(id) {
    if (state.ideaCards) state.ideaCards = state.ideaCards.filter(x=>x.id!==id);
    saveState();
    closeModal();
    render();
    toast('Kachel gelöscht','ok');
  }

  return { init, setBoard, setView, addKachel, openEditor, saveKachel, deleteKachel, render };
})();
window.Kacheln = Kacheln;
