(() => {
  'use strict';

  const shell = document.querySelector('.game-shell');
  const roomLabel = document.querySelector('#baseRoom');
  if (!shell || !roomLabel) return;

  const wrap = document.createElement('div');
  wrap.id = 'hangarAssetDisplay';
  wrap.innerHTML = `
    <div class="hangar-asset-frame">
      <div class="hangar-asset-kicker">AUTHORED HULL // LIVE ASSET</div>
      <img src="assets/vanguard-vx01.png" alt="Vanguard VX-01 ship" decoding="async">
      <div class="hangar-asset-name">VANGUARD VX-01</div>
    </div>`;
  shell.appendChild(wrap);

  const sync = () => {
    const inBase = shell.classList.contains('base-mode');
    const inHangar = /HANGAR/i.test(roomLabel.textContent || '');
    wrap.classList.toggle('active', inBase && inHangar);
  };

  new MutationObserver(sync).observe(shell, { attributes:true, attributeFilter:['class'] });
  new MutationObserver(sync).observe(roomLabel, { childList:true, characterData:true, subtree:true });
  sync();
})();
