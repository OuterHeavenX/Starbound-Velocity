(() => {
  'use strict';

  const shell = document.querySelector('.game-shell');
  const canvas = document.querySelector('#gameCanvas');
  const terminal = document.querySelector('#stationTerminal');

  if (!shell || !canvas) return;

  // Central authored-asset manifest. Resolve every path against the current
  // GitHub Pages document URL so project-site subpaths work reliably.
  const assetManifest = {
    playerShip: 'assets/vanguard-vx01.png',
    dreadnoughtPhase1: 'assets/bosses/dreadnought-phase1.webp',
    dreadnoughtPhase2: 'assets/bosses/dreadnought-phase2.webp',
    dreadnoughtPhase3: 'assets/bosses/dreadnought-phase3.webp'
  };

  const assetState = {};
  window.SV_ASSET_MANIFEST = assetManifest;
  window.SV_ASSETS = assetState;

  const preloadAsset = (key, relativePath) => new Promise((resolve) => {
    const img = new Image();
    img.decoding = 'async';
    const url = new URL(relativePath, document.baseURI).href;
    const finish = (ok, error = null) => {
      assetState[key] = {
        ok,
        url,
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0,
        image: img,
        error: error ? String(error) : null
      };
      resolve(assetState[key]);
    };
    img.addEventListener('load', () => finish(true), { once: true });
    img.addEventListener('error', () => finish(false, `Failed to load ${url}`), { once: true });
    img.src = url;
  });

  window.SV_ASSETS_READY = Promise.all(
    Object.entries(assetManifest).map(([key, path]) => preloadAsset(key, path))
  ).then((results) => {
    const loaded = results.filter((item) => item.ok).length;
    const failed = results.filter((item) => !item.ok).map((item) => item.url);
    const summary = { loaded, total: results.length, failed };
    try { localStorage.setItem('sv_asset_status', JSON.stringify(summary)); } catch {}
    console.info(`STARBOUND VELOCITY assets: ${loaded}/${results.length} loaded`, summary);
    window.dispatchEvent(new CustomEvent('sv-assets-ready', { detail: summary }));
    return summary;
  });

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

    terminal?.classList.remove('active');
    shell.classList.remove('base-mode');

    // Touch the decoded authored assets at launch time so Safari keeps them in
    // its decoded image cache while Canvas2D switches from Mother Base to flight.
    window.SV_ASSETS_READY?.then(() => {
      for (const entry of Object.values(assetState)) {
        if (entry.ok && entry.image?.decode) entry.image.decode().catch(() => {});
      }
    });

    window.setTimeout(() => {
      shell.classList.remove('base-mode', 'warping');
      restoreFlightCanvas();
      window.dispatchEvent(new Event('resize'));
    }, 1050);
  }, true);

  const observer = new MutationObserver(() => {
    if (!shell.classList.contains('base-mode') && !shell.classList.contains('warping')) {
      restoreFlightCanvas();
    }
  });
  observer.observe(shell, { attributes: true, attributeFilter: ['class'] });
})();
