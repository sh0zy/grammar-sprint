import { useMemo } from "react";
import { PartyPopper, Play } from "lucide-react";
import { TOPIC_LABEL, TYPE_LABEL } from "../data/problems";
import { problemsByIds } from "../lib/quiz";
import AppShell from "./common/AppShell";

interface ReviewTabProps {
  review: string[];
  onStartReview: () => void;
}

export default function ReviewTab({ review, onStartReview }: ReviewTabProps) {
  const items = useMemo(() => problemsByIds(review), [review]);

  return (
    <AppShell title="復習" subtitle="間違えた問題だけ" hasTabBar>
      {items.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-950/50">
            <PartyPopper size={36} className="text-emerald-600 dark:text-emerald-400" />
          </div>
          <p className="text-lg font-bold text-neutral-800 dark:text-neutral-100">
            復習はありません
          </p>
          <p className="mt-1.5 max-w-xs text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            間違えた問題がここに集まります。ホームから演習を始めて、苦手をつぶしていきましょう。
          </p>
        </div>
      ) : (
        <>
          {/* サマリー + スタート */}
          <div className="mb-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-900/50 dark:bg-rose-950/20">
            <p className="text-sm text-rose-700/90 dark:text-rose-300/90">
              苦手な問題が
            </p>
            <p className="mb-3 flex items-baseline">
              <span className="font-serif text-4xl font-bold text-rose-600 dark:text-rose-400">
                {items.length}
              </span>
              <span className="ml-1.5 font-semibold text-rose-700/90 dark:text-rose-300/90">
                問あります
              </span>
            </p>
            <button
              onClick={onStartReview}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-rose-600 py-3.5 text-base font-bold text-white shadow-sm transition active:scale-[0.98] hover:bg-rose-700"
            >
              <Play size={18} fill="currentColor" />
              復習を始める
            </button>
            <p className="mt-2 text-center text-xs text-rose-600/70 dark:text-rose-400/70">
              正解すると一覧から外れます
            </p>
          </div>

          {/* 一覧 */}
          <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
            苦手リスト
          </h2>
          <ul className="space-y-2">
            {items.map((p) => (
              <li
                key={p.id}
                className="rounded-xl border border-neutral-200 bg-white p-3.5 dark:border-neutral-800 dark:bg-neutral-900"
              >
                <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full bg-brand-100 px-2 py-0.5 text-[11px] font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
                    {TOPIC_LABEL[p.topic]}
                  </span>
                  <span className="rounded-full bg-neutral-100 px-2 py-0.5 text-[11px] font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
                    {TYPE_LABEL[p.type]}
                  </span>
                  {p.predicted && (
                    <span className="rounded-full bg-amber-100 px-2 py-0.5 text-[11px] font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
                      予想
                    </span>
                  )}
                </div>
                <p className="line-clamp-2 font-mono text-sm leading-relaxed text-neutral-700 dark:text-neutral-200">
                  {p.question.replace(/\n/g, " ")}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </AppShell>
  );
}
