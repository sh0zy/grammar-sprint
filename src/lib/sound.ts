// Web Audio で効果音を合成（音声ファイル不要・完全オフライン）。
// 初回のユーザー操作（タップ）で AudioContext を生成/再開する。

type AC = AudioContext;

let ctx: AC | null = null;
let soundEnabled = true;

export function setSoundEnabled(v: boolean) {
  soundEnabled = v;
}

function getCtx(): AC | null {
  if (typeof window === "undefined") return null;
  const Ctor: typeof AudioContext | undefined =
    window.AudioContext ||
    (window as unknown as { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!Ctor) return null;
  try {
    if (!ctx) ctx = new Ctor();
    if (ctx.state === "suspended") void ctx.resume();
    return ctx;
  } catch {
    return null;
  }
}

interface Note {
  freq: number;
  start: number; // 秒（再生開始からの相対）
  dur: number;
  type?: OscillatorType;
  gain?: number;
}

function play(notes: Note[]) {
  if (!soundEnabled) return;
  const ac = getCtx();
  if (!ac) return;
  const now = ac.currentTime;
  for (const n of notes) {
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.type = n.type ?? "sine";
    osc.frequency.value = n.freq;
    const peak = n.gain ?? 0.16;
    const t0 = now + n.start;
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + n.dur);
    osc.connect(g);
    g.connect(ac.destination);
    osc.start(t0);
    osc.stop(t0 + n.dur + 0.03);
  }
}

/** 初回タップ等で AudioContext を温めておく。 */
export function warmupSound() {
  getCtx();
}

export const sfx = {
  tap: () =>
    play([{ freq: 600, start: 0, dur: 0.05, type: "triangle", gain: 0.05 }]),
  select: () =>
    play([{ freq: 520, start: 0, dur: 0.07, type: "triangle", gain: 0.08 }]),
  correct: () =>
    play([
      { freq: 659.25, start: 0, dur: 0.12, gain: 0.16 }, // E5
      { freq: 987.77, start: 0.08, dur: 0.2, gain: 0.16 }, // B5
    ]),
  wrong: () =>
    play([
      { freq: 207.65, start: 0, dur: 0.2, gain: 0.13 }, // G#3（やわらかく）
      { freq: 164.81, start: 0.11, dur: 0.26, gain: 0.12 }, // E3
    ]),
  complete: () =>
    play([
      { freq: 523.25, start: 0, dur: 0.13 }, // C5
      { freq: 659.25, start: 0.12, dur: 0.13 }, // E5
      { freq: 783.99, start: 0.24, dur: 0.13 }, // G5
      { freq: 1046.5, start: 0.36, dur: 0.34, gain: 0.18 }, // C6
    ]),
};
