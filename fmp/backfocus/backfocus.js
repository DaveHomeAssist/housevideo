
(function () {
  'use strict';

  var KEY = 'backfocus.v1';
  var SECTIONS = ['brief', 'prep', 'method', 'run', 'verify', 'trouble', 'watch'];
  var LABELS = {
    brief: 'Start here', prep: 'Prepare the camera', method: 'Identify the method',
    run: 'Run the procedure', verify: 'Verify and hand back', trouble: 'Still soft?', watch: 'Watch it done'
  };
  var CHECKS = ['c1', 'c2', 'c3', 'c4', 'c5', 'c6'];
  var METHOD_META = {
    a: { chip: 'Method A · Electronic', note: 'runNoteA', where: 'Method A · Electronic calibration' },
    b: { chip: 'Method B · Mechanical', note: 'runNoteB', where: 'Method B · Mechanical flange-back' }
  };

  var $ = function (id) { return document.getElementById(id); };
  var stage = $('stage');
  var stepsA = $('stepsA');
  var stepsB = $('stepsB');
  var dotsBox = $('dots');
  var live = $('live');

  var state = load();

  function defaults() { return { method: null, section: 'brief', step: 0, checks: {} }; }

  function load() {
    var base = defaults();
    var raw;
    try { raw = window.localStorage.getItem(KEY); } catch (err) { return base; }
    if (!raw) return base;
    var parsed;
    try { parsed = JSON.parse(raw); } catch (err) { return base; }
    if (!parsed || typeof parsed !== 'object') return base;
    if (parsed.method === 'a' || parsed.method === 'b') base.method = parsed.method;
    if (SECTIONS.indexOf(parsed.section) > -1) base.section = parsed.section;
    var step = parseInt(parsed.step, 10);
    base.step = isNaN(step) || step < 0 ? 0 : step;
    if (parsed.checks && typeof parsed.checks === 'object') {
      CHECKS.forEach(function (id) { if (parsed.checks[id] === true) base.checks[id] = true; });
    }
    return base;
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(state)); } catch (err) { /* private mode */ }
  }

  function activeSteps() {
    if (!state.method) return null;
    return state.method === 'a' ? stepsA : stepsB;
  }

  function stepCount() {
    var list = activeSteps();
    return list ? list.children.length : 0;
  }

  function render() {
    SECTIONS.forEach(function (id) { $(id).hidden = id !== state.section; });

    document.querySelectorAll('.rail-link').forEach(function (link) {
      var id = link.getAttribute('data-go');
      var current = id === state.section;
      link.setAttribute('aria-current', current ? 'true' : 'false');
      link.classList.toggle('is-done', SECTIONS.indexOf(id) < SECTIONS.indexOf(state.section));
    });

    document.querySelectorAll('.method-card').forEach(function (card) {
      card.setAttribute('aria-pressed', card.getAttribute('data-method') === state.method ? 'true' : 'false');
    });

    renderRun();
    renderFoot();
    save();
  }

  function renderRun() {
    var chosen = !!state.method;
    $('runEmpty').hidden = chosen;
    $('runMethodChip').hidden = !chosen;
    $('runCountChip').hidden = !chosen;
    $('runVideoLink').hidden = !chosen;
    dotsBox.hidden = !chosen;
    stepsA.hidden = state.method !== 'a';
    stepsB.hidden = state.method !== 'b';
    $('runNoteA').hidden = state.method !== 'a';
    $('runNoteB').hidden = state.method !== 'b';
    if (!chosen) { dotsBox.innerHTML = ''; return; }

    var list = activeSteps();
    var total = list.children.length;
    if (state.step > total - 1) state.step = total - 1;

    Array.prototype.forEach.call(list.children, function (li, i) { li.hidden = i !== state.step; });
    $('runMethodChip').textContent = METHOD_META[state.method].chip;
    $('runCountChip').textContent = 'Step ' + (state.step + 1) + ' of ' + total;

    if (dotsBox.childElementCount !== total) {
      dotsBox.innerHTML = '';
      for (var i = 0; i < total; i++) {
        var dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'dot';
        dot.setAttribute('data-dot', String(i));
        dot.innerHTML = '<span class="vh">Go to step ' + (i + 1) + '</span>';
        dotsBox.appendChild(dot);
      }
      dotsBox.removeAttribute('aria-hidden');
    }
    Array.prototype.forEach.call(dotsBox.children, function (dot, i) {
      dot.setAttribute('aria-current', i === state.step ? 'true' : 'false');
      dot.classList.toggle('is-past', i < state.step);
    });
  }

  function renderFoot() {
    var pos = position();
    $('where').textContent = state.section === 'run' && state.method
      ? METHOD_META[state.method].where + ' · step ' + (state.step + 1)
      : LABELS[state.section];
    $('bar').style.width = (pos.total > 1 ? (pos.index / (pos.total - 1)) * 100 : 0) + '%';
    $('prevBtn').disabled = pos.index === 0;
    $('nextBtn').disabled = pos.index === pos.total - 1;
    $('nextBtn').innerHTML = pos.index === pos.total - 1 ? 'Done' : 'Next &rarr;';
  }

  function stops() {
    var out = [];
    SECTIONS.forEach(function (id) {
      if (id === 'run' && state.method) {
        for (var i = 0; i < stepCount(); i++) out.push({ section: 'run', step: i });
      } else {
        out.push({ section: id, step: 0 });
      }
    });
    return out;
  }

  function position() {
    var all = stops();
    var index = 0;
    for (var i = 0; i < all.length; i++) {
      if (all[i].section === state.section && (state.section !== 'run' || all[i].step === state.step)) { index = i; break; }
    }
    return { index: index, total: all.length, all: all };
  }

  function move(delta) {
    var pos = position();
    var next = pos.all[pos.index + delta];
    if (!next) return;
    state.section = next.section;
    state.step = next.step;
    render();
    stage.scrollTop = 0;
    announce();
  }

  function goSection(id) {
    if (SECTIONS.indexOf(id) < 0) return;
    state.section = id;
    if (id === 'run') state.step = 0;
    render();
    stage.scrollTop = 0;
    announce();
  }

  function announce() {
    live.textContent = $('where').textContent;
  }

  document.addEventListener('click', function (event) {
    var go = event.target.closest('[data-go]');
    if (go) { event.preventDefault(); goSection(go.getAttribute('data-go')); return; }

    var method = event.target.closest('.method-card');
    if (method) {
      state.method = method.getAttribute('data-method');
      state.step = 0;
      state.section = 'run';
      render();
      stage.scrollTop = 0;
      announce();
      return;
    }

    var dot = event.target.closest('[data-dot]');
    if (dot) { state.step = parseInt(dot.getAttribute('data-dot'), 10) || 0; render(); announce(); return; }

    var play = event.target.closest('.vid-play');
    if (play) { event.preventDefault(); mount(play.parentNode); }
  });

  $('prevBtn').addEventListener('click', function () { move(-1); });
  $('nextBtn').addEventListener('click', function () { move(1); });

  $('resetBtn').addEventListener('click', function () {
    if (!window.confirm('Clear the selected method, step position, and hand-back checklist?')) return;
    state = defaults();
    document.querySelectorAll('#checks input').forEach(function (box) { box.checked = false; });
    tally();
    render();
    announce();
  });

  document.querySelectorAll('#checks input').forEach(function (box) {
    var id = box.getAttribute('data-check');
    box.checked = state.checks[id] === true;
    box.addEventListener('change', function () {
      if (box.checked) state.checks[id] = true; else delete state.checks[id];
      tally();
      save();
    });
  });

  function tally() {
    var done = CHECKS.filter(function (id) { return state.checks[id] === true; }).length;
    $('tally').textContent = done + ' / ' + CHECKS.length;
  }

  document.addEventListener('keydown', function (event) {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    var tag = (event.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
    if (event.key === 'ArrowRight') { event.preventDefault(); move(1); }
    else if (event.key === 'ArrowLeft') { event.preventDefault(); move(-1); }
  });

  function mount(frame) {
    var id = frame.getAttribute('data-video');
    if (!id || frame.querySelector('iframe')) return;
    var iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?rel=0&autoplay=1';
    iframe.title = frame.getAttribute('data-title') || 'Video';
    iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
    iframe.setAttribute('allowfullscreen', '');
    iframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
    frame.appendChild(iframe);
    var button = frame.querySelector('.vid-play');
    if (button) button.hidden = true;
    var badge = frame.querySelector('.vid-badge');
    if (badge) badge.hidden = true;
  }

  tally();
  render();
  document.documentElement.classList.add('js-ready');
})();
