import type { Problem } from "../../data/problems";
import { blankCount } from "../../lib/grading";

interface Props {
  problem: Problem;
  value: string[];
  onChange: (v: string[]) => void;
  answered: boolean;
  correct?: boolean;
  onSubmit?: () => void;
}

const CIRCLED = ["①", "②", "③", "④"];

/** dialogue（英会話穴埋め）カード。空所が複数の場合あり。 */
export default function DialogueCard({
  problem,
  value,
  onChange,
  answered,
  correct,
  onSubmit,
}: Props) {
  const blanks = blankCount(problem);
  const vals = Array.from({ length: blanks }, (_, i) => value[i] ?? "");

  const setAt = (i: number, v: string) => {
    const next = vals.slice();
    next[i] = v;
    onChange(next);
  };

  let borderCls =
    "border-neutral-300 focus:border-brand-500 focus:ring-brand-500/30 dark:border-neutral-700";
  if (answered)
    borderCls = correct
      ? "border-emerald-400 dark:border-emerald-600"
      : "border-rose-400 dark:border-rose-600";

  return (
    <div>
      <div className="mb-4 rounded-xl border border-neutral-200 bg-neutral-50 p-3.5 dark:border-neutral-800 dark:bg-neutral-900/50">
        <p className="whitespace-pre-line font-mono text-base leading-relaxed text-neutral-900 dark:text-neutral-100">
          {problem.question}
        </p>
      </div>

      <div className="space-y-3">
        {vals.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="w-7 shrink-0 text-center text-lg font-bold text-brand-600 dark:text-brand-400">
              {CIRCLED[i] ?? `(${i + 1})`}
            </span>
            <input
              type="text"
              value={v}
              disabled={answered}
              onChange={(e) => setAt(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !answered) onSubmit?.();
              }}
              autoCapitalize="off"
              autoCorrect="off"
              autoComplete="off"
              spellCheck={false}
              placeholder="空所に入る語"
              className={`w-full rounded-xl border-2 bg-white px-4 py-2.5 font-mono text-base text-neutral-900 transition focus:ring-2 disabled:opacity-80 dark:bg-neutral-900 dark:text-neutral-100 ${borderCls}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
