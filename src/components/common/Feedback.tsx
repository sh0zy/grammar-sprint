import { CircleCheck, CircleX, Lightbulb, PencilLine } from "lucide-react";
import type { Problem } from "../../data/problems";

interface FeedbackProps {
  problem: Problem;
  /** "auto" は自動採点結果、"writing" は模範解答→自己採点 */
  mode: "auto" | "writing";
  correct: boolean; // auto モードの正誤
  userAnswer?: string; // ユーザーの解答（表示用）
  selfResult?: boolean | null; // writing の自己採点結果
  onSelfGrade?: (ok: boolean) => void;
}

export default function Feedback({
  problem,
  mode,
  correct,
  userAnswer,
  selfResult,
  onSelfGrade,
}: FeedbackProps) {
  const answerLabel = mode === "writing" ? "模範解答" : "正解";
  const showTranslation =
    problem.translation && problem.translation !== problem.answer;

  // バナーの状態
  let banner: { tone: "ok" | "ng" | "neutral"; text: string };
  if (mode === "writing") {
    if (selfResult == null)
      banner = { tone: "neutral", text: "模範解答とくらべてみよう" };
    else
      banner = selfResult
        ? { tone: "ok", text: "できた！" }
        : { tone: "ng", text: "復習リストに追加したよ" };
  } else {
    banner = correct
      ? { tone: "ok", text: "正解！" }
      : { tone: "ng", text: "不正解" };
  }

  const toneStyles = {
    ok: "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300",
    ng: "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300",
    neutral:
      "border-brand-300 bg-brand-50 text-brand-800 dark:border-brand-800 dark:bg-brand-950/40 dark:text-brand-300",
  }[banner.tone];

  return (
    <div className="mt-4 animate-slide-up space-y-3">
      {/* バナー（色＋アイコン＋テキストで明示） */}
      <div
        className={`flex animate-pop items-center gap-2 rounded-xl border px-3.5 py-3 text-[15px] font-bold ${toneStyles}`}
      >
        {banner.tone === "ok" && <CircleCheck size={20} aria-hidden />}
        {banner.tone === "ng" && <CircleX size={20} aria-hidden />}
        {banner.tone === "neutral" && <PencilLine size={20} aria-hidden />}
        <span>{banner.text}</span>
      </div>

      {/* ユーザーの解答（auto かつ不正解時に参考表示） */}
      {mode === "auto" && !correct && userAnswer && userAnswer.trim() !== "" && (
        <p className="text-sm text-neutral-500 line-through dark:text-neutral-500">
          あなたの解答: {userAnswer}
        </p>
      )}

      {/* 正解 / 模範解答 */}
      <div className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900">
        <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
          {answerLabel}
        </p>
        <p className="font-mono text-[15px] font-semibold leading-relaxed text-neutral-900 dark:text-neutral-100">
          {problem.answer}
        </p>
        {problem.accept && problem.accept.length > 0 && (
          <p className="mt-1.5 text-xs text-neutral-500 dark:text-neutral-400">
            他の正解例: {problem.accept.join(" / ")}
          </p>
        )}
      </div>

      {/* 解説 */}
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-3.5 dark:border-amber-900/60 dark:bg-amber-950/30">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-400">
          <Lightbulb size={14} aria-hidden />
          解説
        </div>
        <p className="text-[15px] leading-relaxed text-neutral-800 dark:text-neutral-200">
          {problem.explanation}
        </p>
        {showTranslation && (
          <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
            {problem.translation}
          </p>
        )}
      </div>

      {/* writing の自己採点 */}
      {mode === "writing" && selfResult == null && onSelfGrade && (
        <div>
          <p className="mb-2 text-center text-sm font-medium text-neutral-600 dark:text-neutral-400">
            模範解答と比べて、書けていましたか？
          </p>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => onSelfGrade(true)}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-emerald-300 bg-emerald-50 py-3 font-semibold text-emerald-700 transition active:scale-95 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300"
            >
              <CircleCheck size={20} /> できた
            </button>
            <button
              onClick={() => onSelfGrade(false)}
              className="flex items-center justify-center gap-2 rounded-xl border-2 border-rose-300 bg-rose-50 py-3 font-semibold text-rose-700 transition active:scale-95 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-300"
            >
              <CircleX size={20} /> できなかった
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
