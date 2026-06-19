import { CircleCheck } from "lucide-react";

interface ProgressBarProps {
  current: number; // 1-based の現在問番号
  total: number;
  score: number; // 正解数
}

export default function ProgressBar({ current, total, score }: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round(((current - 1) / total) * 100);
  return (
    <div className="mb-4">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-sm font-bold tabular-nums text-neutral-700 dark:text-neutral-200">
          {current}
          <span className="text-neutral-400 dark:text-neutral-500"> / {total}</span>
        </span>
        <span className="flex items-center gap-1 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
          <CircleCheck size={13} />
          {score}
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-brand-600 transition-all duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
