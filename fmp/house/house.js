import { houseData } from './house-data.js?v=b6ceac4caaf6ca7e';

const $ = selector => document.querySelector(selector);
const escape = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[character]));
const tabs = [...document.querySelectorAll('.tabs a')];
const panels = [...document.querySelectorAll('.panel')];
const labels = { ok:'Recorded in source', caution:'Partial / check required', issue:'Source conflict', unknown:'Unidentified' };
let selectedUnit = null;
let rear = false;
let evidence = false;

function showPanel(hash, scroll = false) {
  const tab = tabs.find(item => item.hash === hash) || tabs[0];
  for (const item of tabs) item.setAttribute('aria-current', item === tab ? 'page' : 'false');
  for (const panel of panels) panel.hidden = `#${panel.id}` !== tab.hash;
  if (scroll) document.querySelector('.tabs').scrollIntoView({ block:'start' });
}
function navigate(hash) {
  if (location.hash !== hash) history.pushState(null, '', hash);
  showPanel(hash, true);
}
document.addEventListener('click', event => {
  const link = event.target.closest('a[href^="#"]');
  if (!link || !tabs.some(tab => tab.hash === link.hash) || event.button || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  navigate(link.hash);
});
addEventListener('hashchange', () => showPanel(location.hash));
addEventListener('popstate', () => showPanel(location.hash));

function syncThemeLabel() {
  const themeEl = $('#theme'); if (themeEl && themeEl.tagName !== 'SELECT') themeEl.textContent = window.fmpTheme.theme === 'dark' ? 'Light mode' : 'Dark mode';
}
// The existing suite controller handles preference persistence and delegated toggles.
document.addEventListener('fmp-theme', syncThemeLabel);
syncThemeLabel();
