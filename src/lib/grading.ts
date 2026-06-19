import type { Problem, ProblemType } from "../data/problems";

/** 解答の正規化：前後空白除去・小文字化・連続空白を1つに。 */
export function normalize(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, " ");
}

/** スペル用：前後空白のみ除去し小文字化（内部は1語想定で厳密比較）。 */
export function normalizeSpelling(s: string): string {
  return s.trim().toLowerCase();
}

/** writing 以外は自動採点する。writing は自己採点。 */
export function isAutoGraded(type: ProblemType): boolean {
  return type !== "writing";
}

/** dialogue の空所数（answer を " / " で分割した数）。 */
export function blankCount(problem: Problem): number {
  if (problem.type !== "dialogue") return 1;
  return problem.answer.split(" / ").length;
}

/** 正答候補（answer + accept）を正規化して返す。 */
function candidates(problem: Problem): string[] {
  const all = [problem.answer, ...(problem.accept ?? [])];
  return all.map(normalize);
}

function gradeDialogue(problem: Problem, inputs: string[]): boolean {
  // 各候補は " / " 区切りで空所ごとの正解を持つ。
  const cands = [problem.answer, ...(problem.accept ?? [])].map((c) =>
    c.split(" / ").map((seg) => normalize(seg))
  );
  const user = inputs.map((i) => normalize(i));
  return cands.some(
    (cand) =>
      cand.length === user.length && cand.every((seg, i) => seg === user[i])
  );
}

export type Response = string | string[];

function asString(r: Response): string {
  return Array.isArray(r) ? r.join(" ") : r;
}

/**
 * type 別の自動採点。writing は常に false（UI 側で自己採点）。
 * - mc / choice : 選択値が answer と一致
 * - fill / error: answer または accept[] と一致（正規化比較）
 * - reorder     : 並べた語をスペース連結して answer と一致
 * - spelling    : 厳密一致（大文字小文字のみ無視）
 * - dialogue    : 空所ごとに一致（accept[] も候補に含む）
 */
export function grade(problem: Problem, response: Response): boolean {
  switch (problem.type) {
    case "mc":
    case "choice":
      return normalize(asString(response)) === normalize(problem.answer);

    case "fill":
    case "error":
      return candidates(problem).includes(normalize(asString(response)));

    case "reorder":
      return normalize(asString(response)) === normalize(problem.answer);

    case "spelling":
      return (
        normalizeSpelling(asString(response)) ===
        normalizeSpelling(problem.answer)
      );

    case "dialogue":
      return gradeDialogue(
        problem,
        Array.isArray(response) ? response : [response]
      );

    case "writing":
      return false;
  }
}
