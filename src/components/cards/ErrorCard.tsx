import { AlertTriangle } from "lucide-react";
import type { Problem } from "../../data/problems";

interface Props {
  problem: Problem;
  value: string;
  onChange: (v: string) => void;
  answered: boolean;
  correct?: boolean;
  onSubmit?: () => void;
}

/** error（正誤）カード。誤文を提示し、正しい英文を入力させる。 */
export default function ErrorCard({
  problem,
  value,
  onChange,
  answered,
  correct,
  onSubmit,
}: Props) {
  let borderCls =
    "border-neutral-300 focus:border-brand-500 focus:ring-brand-500/30 dark:border-neutral-700";
  if (answered)
    borderCls = correct
      ? "border-emerald-400 dark:border-emerald-600"
      : "border-rose-400 dark:border-rose-600";

  return (
    <div>
      <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50/70 p-3.5 dark:border-rose-900/50 dark:bg-rose-950/20">
        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400">
          <AlertTriangle size={14} aria-hidden />
          誤りを含む英文
        </div>
        <p className="font-mono text-lg leading-relaxed text-neutral-900 dark:text-neutral-100">
          {problem.question}
        </p>
      </div>

      <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        正しい英文を入力
      </label>
      <input
        type="text"
        value={value}
        disabled={answered}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !answered) onSubmit?.();
        }}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        placeholder="訂正した文を入力"
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 font-mono text-base text-neutral-900 transition focus:ring-2 disabled:opacity-80 dark:bg-neutral-900 dark:text-neutral-100 ${borderCls}`}
      />
    </div>
  );
}
