import { useMemo } from "react";
import { Target, TrendingUp } from "lucide-react";
import {
  TOPIC_LABEL,
  TYPE_LABEL,
  type Topic,
} from "../data/problems";
import type { ProgressMap } from "../lib/storage";
import {
  TOTAL_PROBLEMS,
  accuracyRate,
  overallStats,
  statsByTopic,
  statsByType,
  type TypeStatKey,
} from "../lib/quiz";
import AppShell from "./common/AppShell";

interface StatsTabProps {
  progress: ProgressMap;
}

const TYPE_ORDER: TypeStatKey[] = [
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

function barColor(pct: number) {
  return pct >= 70
    ? "bg-emerald-500"
    : pct >= 50
    ? "bg-amber-500"
    : "bg-rose-500";
}

export default function StatsTab({ progress }: StatsTabProps) {
  const overall = useMemo(() => overallStats(progress), [progress]);
  const byTopic = useMemo(() => statsByTopic(progress), [progress]);
  const byType = useMemo(() => statsByType(progress), [progress]);

  const rate = accuracyRate(overall);
  const coverage = Math.round((overall.total / TOTAL_PROBLEMS) * 100);

  return (
    <AppShell title="成績" subtitle="単元別・形式別の記録" hasTabBar>
      {/* ヒーロー */}
      <div className="mb-5 grid grid-cols-2 gap-3">
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            <Target size={14} /> 正答率
          </div>
          <p className="font-serif text-4xl font-bold tabular-nums text-brand-600 dark:text-brand-400">
            {rate}
            <span className="text-lg text-neutral-400">%</span>
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {overall.correct} / {overall.total} 問正解
          </p>
        </div>
        <div className="rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
          <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-neutral-400 dark:text-neutral-500">
            <TrendingUp size={14} /> カバー率
          </div>
          <p className="font-serif text-4xl font-bold tabular-nums text-neutral-800 dark:text-neutral-100">
            {coverage}
            <span className="text-lg text-neutral-400">%</span>
          </p>
          <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
            {overall.total} / {TOTAL_PROBLEMS} 問
          </p>
        </div>
      </div>

      {/* 単元別 */}
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        単元別
      </h2>
      <div className="mb-5 space-y-2.5 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        {(["perfect", "modal", "passive"] as Topic[]).map((t) => (
          <StatRow
            key={t}
            label={TOPIC_LABEL[t]}
            correct={byTopic[t].correct}
            total={byTopic[t].total}
            wide
          />
        ))}
      </div>

      {/* 形式別 */}
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        形式別
      </h2>
      <div className="space-y-2.5 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        {TYPE_ORDER.map((k) => (
          <StatRow
            key={k}
            label={k === "predicted" ? "予想問題" : TYPE_LABEL[k]}
            correct={byType[k].correct}
            total={byType[k].total}
            wide
          />
        ))}
      </div>
    </AppShell>
  );
}

function StatRow({
  label,
  correct,
  total,
  wide,
}: {
  label: string;
  correct: number;
  total: number;
  wide?: boolean;
}) {
  const pct = total === 0 ? 0 : Math.round((correct / total) * 100);
  return (
    <div className="flex items-center gap-3">
      <span
        className={`${
          wide ? "w-20" : "w-14"
        } shrink-0 text-xs font-medium text-neutral-600 dark:text-neutral-300`}
      >
        {label}
      </span>
      <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
        <div
          className={`h-full rounded-full transition-all duration-500 ${barColor(pct)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
        {total === 0 ? "—" : `${correct}/${total}`}
      </span>
    </div>
  );
}
