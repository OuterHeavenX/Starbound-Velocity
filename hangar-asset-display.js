(() => {
  'use strict';

  const shell = document.querySelector('.game-shell');
  const roomLabel = document.querySelector('#baseRoom');
  if (!shell || !roomLabel) return;

  const style = document.createElement('style');
  style.textContent = `
    #hangarAssetDisplay{position:absolute;z-index:4;left:4.5vw;top:30vh;width:min(43vw,310px);display:none;pointer-events:none}
    #hangarAssetDisplay.active{display:block}
    .hangar-asset-frame{position:relative;padding:14px 12px 16px;border:1px solid rgba(101,244,255,.42);background:linear-gradient(180deg,rgba(1,6,10,.97),rgba(5,2,10,.94));box-shadow:0 0 28px rgba(101,244,255,.14),inset 0 0 35px rgba(184,113,255,.07);overflow:hidden}
    .hangar-asset-frame:before{content:"";position:absolute;inset:0;background:linear-gradient(90deg,transparent 49.5%,rgba(101,244,255,.08) 50%,transparent 50.5%),linear-gradient(0deg,transparent 49.5%,rgba(184,113,255,.08) 50%,transparent 50.5%);background-size:52px 52px;opacity:.7}
    .hangar-asset-frame img{position:relative;display:block;width:100%;height:auto;max-height:36vh;object-fit:contain;filter:drop-shadow(0 0 14px rgba(101,244,255,.55)) drop-shadow(0 0 28px rgba(184,113,255,.28));z-index:1}
    .hangar-asset-kicker,.hangar-asset-name{position:relative;z-index:2;font-family:Orbitron,sans-serif;letter-spacing:.14em;text-align:center}
    .hangar-asset-kicker{margin-bottom:8px;color:#6f8d99;font-size:7px}
    .hangar-asset-name{margin-top:7px;color:#dffeff;font-size:10px;text-shadow:0 0 10px #65f4ff}
    @media(max-width:620px){#hangarAssetDisplay{left:4vw;top:31vh;width:43vw}.hangar-asset-frame{padding:9px 7px 10px}.hangar-asset-kicker{font-size:5px}.hangar-asset-name{font-size:8px}.hangar-asset-frame img{max-height:32vh}}
  `;
  document.head.appendChild(style);

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
