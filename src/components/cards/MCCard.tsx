import { CircleCheck, CircleX } from "lucide-react";
import type { Problem } from "../../data/problems";
import { normalize } from "../../lib/grading";

interface Props {
  problem: Problem;
  value: string;
  onChange: (v: string) => void;
  answered: boolean;
}

/** mc（4択）/ choice（選択問題）共通カード。 */
export default function MCCard({ problem, value, onChange, answered }: Props) {
  const choices = problem.choices ?? [];
  const answerN = normalize(problem.answer);

  return (
    <div>
      <p className="mb-4 whitespace-pre-line font-mono text-lg font-medium leading-relaxed text-neutral-900 dark:text-neutral-100">
        {problem.question}
      </p>

      <div className="grid gap-2.5">
        {choices.map((c) => {
          const isAnswer = normalize(c) === answerN;
          const isSelected = normalize(c) === normalize(value);

          let cls =
            "border-neutral-200 bg-white text-neutral-800 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100";
          if (answered) {
            if (isAnswer)
              cls =
                "border-emerald-400 bg-emerald-50 text-emerald-800 dark:border-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-200";
            else if (isSelected)
              cls =
                "border-rose-400 bg-rose-50 text-rose-800 dark:border-rose-600 dark:bg-rose-950/50 dark:text-rose-200";
            else cls += " opacity-60";
          } else if (isSelected) {
            cls =
              "border-brand-500 bg-brand-50 text-brand-900 ring-2 ring-brand-500/30 dark:border-brand-400 dark:bg-brand-950/40 dark:text-brand-100";
          }

          return (
            <button
              key={c}
              disabled={answered}
              onClick={() => onChange(c)}
              className={`flex items-center justify-between gap-3 rounded-xl border-2 px-4 py-3.5 text-left font-mono text-base transition active:scale-[0.98] ${cls}`}
            >
              <span>{c}</span>
              {answered && isAnswer && (
                <CircleCheck size={20} className="shrink-0 text-emerald-600 dark:text-emerald-400" />
              )}
              {answered && isSelected && !isAnswer && (
                <CircleX size={20} className="shrink-0 text-rose-600 dark:text-rose-400" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
