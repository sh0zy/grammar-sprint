import type { Problem } from "../../data/problems";

interface Props {
  problem: Problem;
  value: string;
  onChange: (v: string) => void;
  answered: boolean; // 模範解答を表示済みか
}

/** writing（英作文）カード。自由記述。採点は Feedback 側で自己採点。 */
export default function WritingCard({
  problem,
  value,
  onChange,
  answered,
}: Props) {
  return (
    <div>
      <p className="mb-4 whitespace-pre-line text-lg font-medium leading-relaxed text-neutral-900 dark:text-neutral-100">
        {problem.question}
      </p>

      <label className="mb-1.5 block text-xs font-medium text-neutral-500 dark:text-neutral-400">
        英文を書いてみよう（書かずに「答えを見る」でもOK）
      </label>
      <textarea
        value={value}
        disabled={answered}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
        autoCapitalize="off"
        autoCorrect="off"
        autoComplete="off"
        spellCheck={false}
        placeholder="ここに英作文を入力"
        className="w-full resize-none rounded-xl border-2 border-neutral-300 bg-white px-4 py-3 font-mono text-base leading-relaxed text-neutral-900 transition focus:border-brand-500 focus:ring-2 focus:ring-brand-500/30 disabled:opacity-80 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100"
      />
    </div>
  );
}
