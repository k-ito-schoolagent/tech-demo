// 単振り子の計算モデル（画面の描画とは分けて書き、node --test で検証する）
// 前提: 糸は伸びず質量なし、おもりは質点、空気抵抗・摩擦なし、g = 9.80665 m/s²
export const G = 9.80665;

// 振れ幅が小さいときの近似周期 T0 = 2π√(L/g)
export function smallAnglePeriod(length) {
  return 2 * Math.PI * Math.sqrt(length / G);
}

// 算術幾何平均（第1種完全楕円積分 K の計算に使う）
function agm(a, b) {
  for (let i = 0; i < 30 && Math.abs(a - b) > 1e-15; i++) [a, b] = [(a + b) / 2, Math.sqrt(a * b)];
  return a;
}

// 振れ幅 θ0 での厳密な周期 T = 4√(L/g)·K(sin(θ0/2))、K(k) = π / (2·AGM(1, √(1−k²)))
export function period(length, amplitudeDeg) {
  const k = Math.sin((amplitudeDeg * Math.PI) / 360);
  const K = Math.PI / (2 * agm(1, Math.sqrt(1 - k * k)));
  return 4 * Math.sqrt(length / G) * K;
}

// 運動方程式 θ'' = −(g/L)·sinθ を4次のルンゲ＝クッタ法で dt だけ進める
export function step({theta, omega}, dt, length) {
  const f = (th) => (-G / length) * Math.sin(th);
  const k1t = omega, k1w = f(theta);
  const k2t = omega + (dt / 2) * k1w, k2w = f(theta + (dt / 2) * k1t);
  const k3t = omega + (dt / 2) * k2w, k3w = f(theta + (dt / 2) * k2t);
  const k4t = omega + dt * k3w, k4w = f(theta + dt * k3t);
  return {
    theta: theta + (dt / 6) * (k1t + 2 * k2t + 2 * k3t + k4t),
    omega: omega + (dt / 6) * (k1w + 2 * k2w + 2 * k3w + k4w),
  };
}

// 質量 1 kg あたりの力学的エネルギー（最下点を高さ0）
export function energy({theta, omega}, length) {
  return 0.5 * (length * omega) ** 2 + G * length * (1 - Math.cos(theta));
}
