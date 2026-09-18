/* Shared FMP chrome: wire Light/Dark/Auto selects to window.fmpTheme (theme.js). */
(() => {
  const bind = (el) => {
    if (!el || el.dataset.fmpThemeBound === '1' || !window.fmpTheme) return;
    el.dataset.fmpThemeBound = '1';
    el.value = window.fmpTheme.preference;
    el.addEventListener('change', () => window.fmpTheme.set(el.value));
    document.addEventListener('fmp-theme', () => {
      if (document.activeElement !== el) el.value = window.fmpTheme.preference;
    });
  };
  const mount = () => {
    document.querySelectorAll('select#theme, select[data-fmp-theme]').forEach(bind);
  };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', mount);
  else mount();
})();
