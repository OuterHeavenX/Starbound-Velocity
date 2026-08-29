(() => {
  'use strict';

  const shell = document.querySelector('.game-shell');
  const canvas = document.querySelector('#gameCanvas');
  const terminal = document.querySelector('#stationTerminal');

  if (!shell || !canvas) return;

  const restoreFlightCanvas = () => {
    shell.classList.remove('base-mode');
    canvas.style.transform = '';
    canvas.style.filter = '';
    canvas.style.opacity = '';
    canvas.style.visibility = 'visible';
  };

  document.addEventListener('pointerdown', (event) => {
    const launch = event.target.closest('[data-station-action="launch"]');
    if (!launch) return;

    // Mother Base is a full-screen render mode. Release its presentation layer
    // immediately when launch begins so the warp/flight canvas cannot remain
    // hidden or visually stuck on mobile Safari / GitHub Pages.
    terminal?.classList.remove('active');
    shell.classList.remove('base-mode');

    // The authored warp animation runs for ~900 ms. Once gameplay takes over,
    // explicitly clear any retained animation transform/filter state.
    window.setTimeout(() => {
      shell.classList.remove('base-mode', 'warping');
      restoreFlightCanvas();
      window.dispatchEvent(new Event('resize'));
    }, 1050);
  }, true);

  // Extra recovery for WebKit when an animation leaves an inline/composited
  // canvas layer stale after a class transition.
  const observer = new MutationObserver(() => {
    if (!shell.classList.contains('base-mode') && !shell.classList.contains('warping')) {
      restoreFlightCanvas();
    }
  });
  observer.observe(shell, { attributes: true, attributeFilter: ['class'] });
})();
