import {
  problems,
  type Problem,
  type ProblemType,
  type Topic,
} from "../data/problems";
import type { ProgressMap, SessionConfig } from "./storage";
import { shuffle } from "./shuffle";

/** 出題設定から問題リストを組み立てる。 */
export function buildQuiz(cfg: SessionConfig): Problem[] {
  let pool: Problem[];

  if (cfg.type === "predicted") {
    pool = problems.filter((p) => p.predicted);
  } else if (cfg.type === "all") {
    pool = problems.filter((p) => !p.predicted);
  } else {
    pool = problems.filter((p) => !p.predicted && p.type === cfg.type);
  }

  if (cfg.topic !== "all") {
    pool = pool.filter((p) => p.topic === cfg.topic);
  }

  if (cfg.shuffle) pool = shuffle(pool);

  if (cfg.count !== "all") pool = pool.slice(0, cfg.count);

  return pool;
}

/** ID 配列から問題を解決（復習モード用）。存在しない ID は除外。 */
export function problemsByIds(ids: string[]): Problem[] {
  const map = new Map(problems.map((p) => [p.id, p]));
  return ids.map((id) => map.get(id)).filter((p): p is Problem => !!p);
}

// ============================================================
// 集計
// ============================================================
export interface Accuracy {
  total: number; // 解答済み数
  correct: number; // 正解数
}

function rate(a: Accuracy): number {
  return a.total === 0 ? 0 : Math.round((a.correct / a.total) * 100);
}
export const accuracyRate = rate;

/** 単元別の正答率（解答済みのみカウント）。 */
export function statsByTopic(progress: ProgressMap): Record<Topic, Accuracy> {
  const out: Record<Topic, Accuracy> = {
    perfect: { total: 0, correct: 0 },
    modal: { total: 0, correct: 0 },
    passive: { total: 0, correct: 0 },
  };
  for (const p of problems) {
    const e = progress[p.id];
    if (!e) continue;
    out[p.topic].total += 1;
    if (e.correct) out[p.topic].correct += 1;
  }
  return out;
}

/** 形式別の正答率。予想問題は "predicted" キーにまとめる。 */
export type TypeStatKey = ProblemType | "predicted";
export function statsByType(
  progress: ProgressMap
): Record<TypeStatKey, Accuracy> {
  const out = {} as Record<TypeStatKey, Accuracy>;
  const keys: TypeStatKey[] = [
    "mc",
    "fill",
    "reorder",
    "writing",
    "error",
    "dialogue",
    "choice",
    "spelling",
    "predicted",
  ];
  for (const k of keys) out[k] = { total: 0, correct: 0 };

  for (const p of problems) {
    const e = progress[p.id];
    if (!e) continue;
    const key: TypeStatKey = p.predicted ? "predicted" : p.type;
    out[key].total += 1;
    if (e.correct) out[key].correct += 1;
  }
  return out;
}

/** 全体の解答済み数・正答率。 */
export function overallStats(progress: ProgressMap): Accuracy {
  let total = 0;
  let correct = 0;
  for (const p of problems) {
    const e = progress[p.id];
    if (!e) continue;
    total += 1;
    if (e.correct) correct += 1;
  }
  return { total, correct };
}

export const TOTAL_PROBLEMS = problems.length;
