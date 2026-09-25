// 見本デモ：単振り子。新しいデモはこのファイルと pendulum.html をコピーしてつくる
import {T, createStage, material, add} from './stage.js';
import {createIcons, Box, PanelTop, LayoutGrid, RotateCcw} from 'lucide';
import {mountNavigation} from './navigation.js';
import {period, smallAnglePeriod, step} from './pendulum-model.js';
import './style.css';
import './lab.css';

mountNavigation('pendulum');          // demos.json の id
createIcons({icons: {Box, PanelTop, LayoutGrid, RotateCcw}});

const $ = (id) => document.getElementById(id);
const SCALE = 4;                      // 1 m = 4 単位
const PIVOT = new T.Vector3(0, 4.5, 0);
const stage = createStage({position: [6, 3, 13], target: [0, 1.5, 0], floor: -4});

// 3Dの部品
const steel = material(0xc6cbcd, 0.9, 0.25), wood = material(0x8a6a44, 0.1, 0.7), brass = material(0xd0ad70, 0.85, 0.25);
add(new T.BoxGeometry(7, 0.3, 0.6), wood, stage.group, [0, PIVOT.y + 0.15, 0]);
for (const x of [-3.2, 3.2]) add(new T.BoxGeometry(0.3, 8.6, 0.6), wood, stage.group, [x, PIVOT.y - 4.15, 0]);
const arm = new T.Group();                       // 支点を中心に回るグループ
arm.position.copy(PIVOT);
stage.group.add(arm);
const string = add(new T.CylinderGeometry(0.018, 0.018, 1, 8), steel, arm);
const bob = add(new T.SphereGeometry(0.32, 40, 24), brass, arm);
stage.pick(bob, 'bob');
const pivotMark = add(new T.SphereGeometry(0.08, 16, 12), steel, stage.group, PIVOT.toArray());

// 最初の角度の目印と軌跡
const guideMat = new T.LineBasicMaterial({color: 0x84bcdc, transparent: true, opacity: 0.7});
const guide = new T.Line(new T.BufferGeometry(), guideMat);
stage.group.add(guide);
const TRAIL = 240, trailPos = new Float32Array(TRAIL * 3);
const trailGeo = new T.BufferGeometry();
trailGeo.setAttribute('position', new T.BufferAttribute(trailPos, 3));
const trail = new T.Line(trailGeo, new T.LineBasicMaterial({color: 0xc9ef83}));
stage.group.add(trail);
let trailN = 0;

// 状態
let L = 1, amp = 20, state = {theta: (amp * Math.PI) / 180, omega: 0}, playing = !matchMedia('(prefers-reduced-motion: reduce)').matches;

function reset() {
  state = {theta: (amp * Math.PI) / 180, omega: 0};
  trailN = 0;
  const r = L * SCALE, a = (amp * Math.PI) / 180;
  string.scale.y = r;
  string.position.y = -r / 2;
  bob.position.y = -r;
  guide.geometry.setFromPoints([PIVOT, new T.Vector3(PIVOT.x + r * Math.sin(a), PIVOT.y - r * Math.cos(a), 0), PIVOT, new T.Vector3(PIVOT.x - r * Math.sin(a), PIVOT.y - r * Math.cos(a), 0)]);
  const T1 = period(L, amp), T0 = smallAnglePeriod(L);
  $('length-value').innerHTML = `${L.toFixed(2)} <small>m</small>`;
  $('amplitude-value').textContent = `${amp}°`;
  $('period-exact').textContent = `${T1.toFixed(3)} s`;
  $('period-approx').textContent = `${T0.toFixed(3)} s`;
  $('gap').textContent = `小角近似より ${((T1 / T0 - 1) * 100).toFixed(2)} % 長い`;
}
$('length').oninput = (e) => {L = +e.target.value; reset();};
$('amplitude').oninput = (e) => {amp = +e.target.value; reset();};
document.querySelectorAll('[data-amp]').forEach((b) => (b.onclick = () => {amp = +b.dataset.amp; $('amplitude').value = amp; reset();}));
$('play').onclick = () => {playing = !playing; $('play').textContent = playing ? '停止' : '再生'; $('run-status').textContent = playing ? '実時間で再生中' : '停止中';};
$('play').textContent = playing ? '停止' : '再生';
stage.onPick(() => {
  $('part-name').textContent = 'おもり（質点として計算）';
  $('part-description').textContent = 'おもりの重さを変えても周期は変わりません。運動方程式に質量が出てこないためです。';
});
reset();

stage.animate((dt) => {
  if (playing) {
    for (let i = 0; i < 8; i++) state = step(state, dt / 8, L);   // 細かく分けて積分
    arm.rotation.z = state.theta;
    const r = L * SCALE, p = new T.Vector3(PIVOT.x + r * Math.sin(state.theta), PIVOT.y - r * Math.cos(state.theta), 0);
    trailPos.copyWithin(3, 0, (TRAIL - 1) * 3);
    trailPos.set([p.x, p.y, p.z], 0);
    trailN = Math.min(TRAIL, trailN + 1);
    trailGeo.setDrawRange(0, trailN);
    trailGeo.attributes.position.needsUpdate = true;
  }
});
