import { useEffect, useMemo, useRef, useState } from "react";
import { House, RotateCcw, Trophy } from "lucide-react";
import {
  TOPIC_LABEL,
  TYPE_LABEL,
  type ProblemType,
  type Topic,
} from "../data/problems";
import { sfx } from "../lib/sound";
import type { AnswerRecord } from "./Quiz";
import AppShell from "./common/AppShell";

interface ResultProps {
  records: AnswerRecord[];
  title: string;
  onRetryWrong: () => void;
  onHome: () => void;
}

interface Tally {
  total: number;
  correct: number;
}
type TypeKey = ProblemType | "predicted";

export default function Result({ records, title, onRetryWrong, onHome }: ResultProps) {
  const total = records.length;
  const correct = records.filter((r) => r.correct).length;
  const wrong = total - correct;
  const rate = total === 0 ? 0 : Math.round((correct / total) * 100);

  // スコアのカウントアップ + 完了音
  const [shown, setShown] = useState(0);
  const played = useRef(false);
  useEffect(() => {
    if (!played.current) {
      played.current = true;
      sfx.complete();
    }
    let raf = 0;
    const start = performance.now();
    const dur = 850;
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / dur);
      const eased = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(eased * rate));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [rate]);

  const { byTopic, byType } = useMemo(() => {
    const bt = new Map<Topic, Tally>();
    const ty = new Map<TypeKey, Tally>();
    for (const r of records) {
      const tk: TypeKey = r.problem.predicted ? "predicted" : r.problem.type;
      const t = bt.get(r.problem.topic) ?? { total: 0, correct: 0 };
      t.total++;
      if (r.correct) t.correct++;
      bt.set(r.problem.topic, t);
      const y = ty.get(tk) ?? { total: 0, correct: 0 };
      y.total++;
      if (r.correct) y.correct++;
      ty.set(tk, y);
    }
    return { byTopic: bt, byType: ty };
  }, [records]);

  const message =
    rate >= 90
      ? "完璧！この調子でいこう"
      : rate >= 70
      ? "good! あと少しで満点"
      : rate >= 50
      ? "復習すれば伸びる"
      : "間違えた問題を見直そう";

  const tone =
    rate >= 70
      ? { text: "text-emerald-500", glow: "bg-emerald-400/20" }
      : rate >= 50
      ? { text: "text-amber-500", glow: "bg-amber-400/20" }
      : { text: "text-rose-500", glow: "bg-rose-400/20" };

  const footer = (
    <div className="grid gap-2.5">
      {wrong > 0 && (
        <button
          onClick={onRetryWrong}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 text-base font-bold tracking-tight text-white shadow-card transition active:scale-[0.98] hover:bg-neutral-800 dark:bg-neutral-50 dark:text-neutral-900 dark:hover:bg-white"
        >
          <RotateCcw size={18} />
          間違えた {wrong} 問だけもう一度
        </button>
      )}
      <button
        onClick={onHome}
        className="flex w-full items-center justify-center gap-2 rounded-2xl border border-neutral-200 bg-white py-3.5 text-base font-semibold text-neutral-700 transition active:scale-[0.98] dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
      >
        <House size={18} />
        ホームに戻る
      </button>
    </div>
  );

  return (
    <AppShell title="結果" subtitle={title} footer={footer}>
      <div className="mb-5 flex animate-slide-up flex-col items-center rounded-3xl border border-neutral-200/80 bg-white px-4 py-8 shadow-card dark:border-neutral-800 dark:bg-neutral-900">
        <div className="relative mb-3">
          <div className={`absolute inset-0 -z-0 scale-150 rounded-full blur-xl ${tone.glow}`} />
          <Trophy size={44} className={`relative animate-pop ${tone.text}`} />
        </div>
        <div className="flex items-baseline gap-1">
          <span className={`font-serif text-7xl font-bold tabular-nums ${tone.text}`}>
            {shown}
          </span>
          <span className="font-serif text-3xl font-bold text-neutral-400">%</span>
        </div>
        <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
          {total} 問中 {correct} 問正解
        </p>
        <p className="mt-3 font-semibold text-neutral-800 dark:text-neutral-100">
          {message}
        </p>
      </div>

      <Breakdown
        title="単元別"
        rows={(["perfect", "modal", "passive"] as Topic[])
          .filter((t) => byTopic.has(t))
          .map((t) => ({ label: TOPIC_LABEL[t], tally: byTopic.get(t)! }))}
      />
      <Breakdown
        title="形式別"
        rows={typeOrder
          .filter((k) => byType.has(k))
          .map((k) => ({
            label: k === "predicted" ? "予想問題" : TYPE_LABEL[k],
            tally: byType.get(k)!,
          }))}
      />

      <div className="h-2" />
    </AppShell>
  );
}

const typeOrder: TypeKey[] = [
  "mc", "fill", "reorder", "writing", "error", "dialogue", "choice", "spelling", "predicted",
];

function Breakdown({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; tally: Tally }[];
}) {
  if (rows.length === 0) return null;
  return (
    <section className="mb-5">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {title}
      </h2>
      <div className="space-y-2.5 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900">
        {rows.map((r) => {
          const pct =
            r.tally.total === 0
              ? 0
              : Math.round((r.tally.correct / r.tally.total) * 100);
          return (
            <div key={r.label} className="flex items-center gap-3">
              <span className="w-20 shrink-0 text-xs font-medium text-neutral-600 dark:text-neutral-300">
                {r.label}
              </span>
              <div className="h-2.5 flex-1 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    pct >= 70 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-500" : "bg-rose-500"
                  }`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="w-14 shrink-0 text-right text-xs tabular-nums text-neutral-500 dark:text-neutral-400">
                {r.tally.correct}/{r.tally.total}
              </span>
            </div>
          );
        })}
      </div>
    </section>
  );
}
