import {test} from 'node:test';
import assert from 'node:assert/strict';
import {G, smallAnglePeriod, period, step, energy} from './pendulum-model.js';

test('振れ幅が小さいとき、厳密な周期は近似式 2π√(L/g) に一致する', () => {
  for (const L of [0.25, 1, 2]) assert.ok(Math.abs(period(L, 0.01) - smallAnglePeriod(L)) < 1e-7);
  assert.ok(Math.abs(smallAnglePeriod(1) - 2.00641) < 1e-4);
});

test('振れ幅が大きいほど周期は長くなる（等時性は近似）', () => {
  let prev = 0;
  for (let a = 5; a <= 80; a += 5) {const T = period(1, a); assert.ok(T > prev); prev = T;}
  // 60°では近似より約7%長い（既知の値 1.0732）
  assert.ok(Math.abs(period(1, 60) / smallAnglePeriod(1) - 1.0732) < 1e-3);
});

test('数値積分で1周期たつと元の角度にもどり、エネルギーが保存される', () => {
  for (const a of [10, 45, 80]) {
    const L = 1.2, T = period(L, a), n = 4000, dt = T / n;
    let s = {theta: (a * Math.PI) / 180, omega: 0};
    const e0 = energy(s, L);
    for (let i = 0; i < n; i++) s = step(s, dt, L);
    assert.ok(Math.abs(s.theta - (a * Math.PI) / 180) < 1e-6);
    assert.ok(Math.abs(energy(s, L) - e0) / e0 < 1e-8);
  }
  assert.equal(G, 9.80665);
});
