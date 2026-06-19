import type { Problem } from "../../data/problems";

interface Props {
  problem: Problem;
  value: string;
  onChange: (v: string) => void;
  answered: boolean;
  correct?: boolean;
  onSubmit?: () => void; // Enter キーで解答
}

/** fill（穴埋め）/ spelling（スペル書き）共通カード。 */
export default function FillCard({
  problem,
  value,
  onChange,
  answered,
  correct,
  onSubmit,
}: Props) {
  const isSpelling = problem.type === "spelling";

  let borderCls =
    "border-neutral-300 focus:border-brand-500 focus:ring-brand-500/30 dark:border-neutral-700";
  if (answered)
    borderCls = correct
      ? "border-emerald-400 dark:border-emerald-600"
      : "border-rose-400 dark:border-rose-600";

  return (
    <div>
      <p className="mb-4 whitespace-pre-line font-mono text-lg font-medium leading-relaxed text-neutral-900 dark:text-neutral-100">
        {problem.question}
      </p>

      <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        {isSpelling ? "スペルを入力" : "答えを入力（複数語の場合もそのまま）"}
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
        placeholder={isSpelling ? "例: written" : "ここに入力"}
        className={`w-full rounded-xl border-2 bg-white px-4 py-3 font-mono text-lg text-neutral-900 transition focus:ring-2 disabled:opacity-80 dark:bg-neutral-900 dark:text-neutral-100 ${borderCls}`}
      />
    </div>
  );
}
