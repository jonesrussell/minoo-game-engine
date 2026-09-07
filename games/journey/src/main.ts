import { fitViewport } from '@minoo/engine';
import './style.css';

const canvas = document.querySelector<HTMLCanvasElement>('canvas')!;
const context = canvas.getContext('2d');
if (!context) throw new Error('A Canvas 2D context is required for this preview.');
const ctx = context;
const start = document.querySelector<HTMLButtonElement>('#start')!;
const inspect = document.querySelector<HTMLButtonElement>('#inspect')!;
const reset = document.querySelector<HTMLButtonElement>('#reset')!;
const title = document.querySelector<HTMLElement>('#stage-title')!;
const status = document.querySelector<HTMLElement>('#status')!;
let mode: 'start' | 'explore' = 'start';
let selected = false;

function tree(x: number, y: number, size: number, color: string) {
  ctx.fillStyle = '#665940';
  ctx.fillRect(x - 4 * size, y - 10 * size, 8 * size, 55 * size);
  ctx.fillStyle = color;
  for (let level = 0; level < 3; level++) {
    const top = y - (105 - level * 30) * size;
    const half = (28 + level * 12) * size;
    ctx.beginPath(); ctx.moveTo(x, top); ctx.lineTo(x - half, top + 65 * size);
    ctx.lineTo(x + half, top + 65 * size); ctx.closePath(); ctx.fill();
  }
}

function draw() {
  const v = fitViewport(960, 460, canvas.width, canvas.height);
  ctx.setTransform(v.scale, 0, 0, v.scale, v.x, v.y);
  ctx.fillStyle = '#dce6d9'; ctx.fillRect(0, 0, 960, 460);
  ctx.fillStyle = '#f4eed0'; ctx.beginPath(); ctx.arc(732, 98, 43, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#b2c6b0'; ctx.beginPath(); ctx.moveTo(0, 220);
  ctx.bezierCurveTo(190, 90, 360, 240, 570, 160); ctx.bezierCurveTo(790, 100, 860, 210, 960, 180);
  ctx.lineTo(960, 460); ctx.lineTo(0, 460); ctx.fill();
  ctx.fillStyle = '#94bcb8'; ctx.beginPath(); ctx.ellipse(645, 293, 390, 92, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#8caa80'; ctx.beginPath(); ctx.moveTo(0, 264);
  ctx.bezierCurveTo(200, 240, 420, 340, 960, 354); ctx.lineTo(960, 460); ctx.lineTo(0, 460); ctx.fill();
  ctx.fillStyle = '#dfd5b5'; ctx.beginPath(); ctx.moveTo(320, 460);
  ctx.bezierCurveTo(390, 360, 500, 350, 562, 319); ctx.bezierCurveTo(510, 365, 484, 390, 483, 460); ctx.fill();
  tree(108, 263, 1.2, '#3d6351'); tree(208, 295, 1.5, '#2d5647');
  tree(830, 287, 1.15, '#486d56'); tree(895, 318, 1.6, '#345846');
  for (const [x, y] of [[80, 392], [565, 412], [615, 386], [739, 422]]) {
    ctx.fillStyle = '#69896d'; ctx.beginPath(); ctx.ellipse(x, y, 16, 5, -.2, 0, Math.PI * 2); ctx.fill();
  }
  if (selected) {
    ctx.strokeStyle = '#fff5c7'; ctx.lineWidth = 4;
    ctx.beginPath(); ctx.ellipse(208, 236, 85, 125, 0, 0, Math.PI * 2); ctx.stroke();
  }
}

function render() {
  start.hidden = mode !== 'start'; inspect.hidden = reset.hidden = mode === 'start';
  title.textContent = mode === 'start' ? 'The clearing awaits' : selected ? 'A tree in the clearing' : 'Look a little closer';
  status.textContent = mode === 'start' ? 'Open the preview to inspect a sample object.' : selected ? 'Tree selected. This is an English fixture, not a vocabulary lesson.' : 'Choose Inspect tree to highlight the sample object.';
  inspect.setAttribute('aria-pressed', String(selected));
  draw();
}
start.addEventListener('click', () => { mode = 'explore'; render(); inspect.focus(); });
inspect.addEventListener('click', () => { selected = !selected; render(); });
reset.addEventListener('click', () => { mode = 'start'; selected = false; render(); start.focus(); });

declare global {
  interface Window { render_game_to_text: () => string; advanceTime: (ms: number) => void; }
}
window.render_game_to_text = () => JSON.stringify({ mode, fixture: true, selected: selected ? 'tree' : null, coordinates: '960x460; origin top left; x right; y down' });
// Static fixture has no simulation clock. Redrawing is deterministic.
window.advanceTime = () => draw();
render();
