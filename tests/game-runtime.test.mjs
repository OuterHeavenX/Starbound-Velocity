import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const game = await readFile(new URL("../public/game/game.js", import.meta.url), "utf8");
const styles = await readFile(new URL("../public/game/styles.css", import.meta.url), "utf8");

test("preserves device-pixel scaling during runtime recovery", () => {
  const recovery = game.match(/function recoverRuntime\(error\)\{[\s\S]*?\n  function frame/)?.[0] ?? "";
  assert.match(recovery, /ctx\.setTransform\(dpr,0,0,dpr,0,0\)/);
  assert.doesNotMatch(recovery, /ctx\.setTransform\(1,0,0,1,0,0\)/);
  assert.match(recovery, /ctx\.clearRect\(0,0,width,height\)/);
});

test("sizes the canvas from its visible shell and follows iOS viewport changes", () => {
  assert.match(game, /shell\.getBoundingClientRect\(\)/);
  assert.match(game, /window\.visualViewport\?\.addEventListener\('resize',resize\)/);
  assert.match(styles, /height:100dvh/);
});

test("centers the Mother Base camera when entering the station", () => {
  const entries = [...game.matchAll(/function enterBase\(\)\{[^\n]+/g)];
  const activeEntry = entries.at(-1)?.[0] ?? "";
  assert.match(activeEntry, /stationWorld\.camera\.x=/);
  assert.match(activeEntry, /stationWorld\.camera\.y=/);
});
