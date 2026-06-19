import { useState } from "react";
import { RotateCcw } from "lucide-react";
import type { Problem } from "../../data/problems";

interface Props {
  problem: Problem;
  onChange: (v: string[]) => void;
  answered: boolean;
  correct?: boolean;
}

/** reorder（並び替え）カード。語チップをタップして文を組み立てる。 */
export default function ReorderCard({
  problem,
  onChange,
  answered,
  correct,
}: Props) {
  const tokens = problem.tokens ?? [];
  const [placed, setPlaced] = useState<number[]>([]);

  const update = (next: number[]) => {
    setPlaced(next);
    onChange(next.map((i) => tokens[i]));
  };
  const place = (i: number) => {
    if (answered || placed.includes(i)) return;
    update([...placed, i]);
  };
  const remove = (i: number) => {
    if (answered) return;
    update(placed.filter((x) => x !== i));
  };
  const reset = () => {
    if (!answered) update([]);
  };

  const available = tokens.map((_, i) => i).filter((i) => !placed.includes(i));

  let buildBorder = "border-neutral-300 dark:border-neutral-700";
  if (answered)
    buildBorder = correct
      ? "border-emerald-400 dark:border-emerald-600"
      : "border-rose-400 dark:border-rose-600";

  return (
    <div>
      <p className="mb-1 whitespace-pre-line font-mono text-base leading-relaxed text-neutral-500 dark:text-neutral-400">
        {problem.question}
      </p>
      <p className="mb-3 text-xs text-neutral-400 dark:text-neutral-500">
        語をタップして並べよう
      </p>

      {/* 組み立てエリア */}
      <div
        className={`mb-3 min-h-[3.5rem] rounded-xl border-2 border-dashed bg-neutral-50 p-2.5 dark:bg-neutral-900/50 ${buildBorder}`}
      >
        {placed.length === 0 ? (
          <p className="px-1 py-2 text-sm text-neutral-400 dark:text-neutral-600">
            下の語を順にタップ…
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {placed.map((i, pos) => (
              <button
                key={`${i}-${pos}`}
                disabled={answered}
                onClick={() => remove(i)}
                className="rounded-lg border border-brand-500 bg-brand-600 px-3 py-2 font-mono text-base text-white transition active:scale-95 disabled:opacity-90"
              >
                {tokens[i]}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 語バンク */}
      <div className="flex flex-wrap items-center gap-2">
        {available.map((i) => (
          <button
            key={i}
            disabled={answered}
            onClick={() => place(i)}
            className="rounded-lg border-2 border-neutral-300 bg-white px-3 py-2 font-mono text-base text-neutral-800 transition active:scale-95 dark:border-neutral-600 dark:bg-neutral-800 dark:text-neutral-100"
          >
            {tokens[i]}
          </button>
        ))}
        {placed.length > 0 && !answered && (
          <button
            onClick={reset}
            className="ml-auto flex items-center gap-1 rounded-lg px-2.5 py-2 text-sm text-neutral-500 transition active:scale-95 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800"
          >
            <RotateCcw size={15} /> リセット
          </button>
        )}
      </div>
    </div>
  );
}
