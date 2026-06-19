import { useMemo, useState } from "react";
import {
  GraduationCap,
  History,
  Play,
  Shuffle as ShuffleIcon,
  Sparkles,
} from "lucide-react";
import { TOPIC_LABEL, TYPE_LABEL } from "../data/problems";
import {
  type CountOption,
  type SessionConfig,
  type TopicFilter,
  type TypeFilter,
} from "../lib/storage";
import { TOTAL_PROBLEMS, buildQuiz } from "../lib/quiz";
import { sfx } from "../lib/sound";
import AppShell from "./common/AppShell";

interface HomeProps {
  lastSession: SessionConfig | null;
  onStart: (cfg: SessionConfig) => void;
  onContinue: () => void;
}

const TOPIC_OPTIONS: { key: TopicFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "perfect", label: TOPIC_LABEL.perfect },
  { key: "modal", label: TOPIC_LABEL.modal },
  { key: "passive", label: TOPIC_LABEL.passive },
];

const TYPE_OPTIONS: { key: TypeFilter; label: string }[] = [
  { key: "all", label: "すべて" },
  { key: "mc", label: TYPE_LABEL.mc },
  { key: "fill", label: TYPE_LABEL.fill },
  { key: "reorder", label: TYPE_LABEL.reorder },
  { key: "writing", label: TYPE_LABEL.writing },
  { key: "error", label: TYPE_LABEL.error },
  { key: "dialogue", label: TYPE_LABEL.dialogue },
  { key: "choice", label: TYPE_LABEL.choice },
  { key: "spelling", label: TYPE_LABEL.spelling },
  { key: "predicted", label: "予想問題" },
];

const COUNT_OPTIONS: { key: CountOption; label: string }[] = [
  { key: 10, label: "10問" },
  { key: 20, label: "20問" },
  { key: "all", label: "全問" },
];

function Pill({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={() => {
        sfx.select();
        onClick();
      }}
      className={`rounded-xl border px-3.5 py-2.5 text-sm font-semibold transition-all active:scale-95 ${
        active
          ? "border-brand-600 bg-brand-600 text-white shadow-sm shadow-brand-600/25"
          : "border-neutral-200 bg-white text-neutral-700 hover:border-neutral-300 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-200"
      }`}
    >
      {children}
    </button>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function Home({ lastSession, onStart, onContinue }: HomeProps) {
  const [topic, setTopic] = useState<TopicFilter>("all");
  const [type, setType] = useState<TypeFilter>("all");
  const [count, setCount] = useState<CountOption>(10);
  const [shuffle, setShuffle] = useState(true);

  const cfg: SessionConfig = { topic, type, count, shuffle };
  const available = useMemo(
    () => buildQuiz({ topic, type, count: "all", shuffle: false }).length,
    [topic, type]
  );
  const effective = count === "all" ? available : Math.min(count, available);

  return (
    <AppShell title="文法スプリント" subtitle="完了形 / 助動詞 / 態" hasTabBar>
      {/* ヒーロー（ダーク・エディトリアル） */}
      <div className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-br from-neutral-900 to-neutral-800 p-6 text-white shadow-ink">
        <div className="pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full bg-brand-500/25 blur-3xl" />
        <div className="relative">
          <div className="mb-3 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-luxe text-brand-300">
            <GraduationCap size={14} /> Grammar Sprint
          </div>
          <p className="font-serif text-2xl font-bold leading-snug tracking-tight">
            テスト直前 総ざらい
          </p>
          <p className="mt-2 text-sm text-neutral-400">
            完了形・助動詞・態 / 全{TOTAL_PROBLEMS}問 ・ 8形式＋予想問題
          </p>
        </div>
      </div>

      {/* 前回の続き */}
      {lastSession && (
        <button
          onClick={onContinue}
          className="mb-5 flex w-full items-center gap-3 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-left transition active:scale-[0.99] dark:border-neutral-700 dark:bg-neutral-900"
        >
          <History size={20} className="shrink-0 text-brand-600 dark:text-brand-400" />
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100">
              前回の続き
            </p>
            <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
              {labelForSession(lastSession)}
            </p>
          </div>
        </button>
      )}

      <Section title="単元">
        <div className="grid grid-cols-4 gap-2">
          {TOPIC_OPTIONS.map((o) => (
            <Pill key={o.key} active={topic === o.key} onClick={() => setTopic(o.key)}>
              {o.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="出題形式">
        <div className="flex flex-wrap gap-2">
          {TYPE_OPTIONS.map((o) => (
            <Pill key={o.key} active={type === o.key} onClick={() => setType(o.key)}>
              {o.key === "predicted" && (
                <Sparkles size={13} className="-mt-0.5 mr-1 inline" />
              )}
              {o.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="出題数">
        <div className="grid grid-cols-3 gap-2">
          {COUNT_OPTIONS.map((o) => (
            <Pill key={String(o.key)} active={count === o.key} onClick={() => setCount(o.key)}>
              {o.label}
            </Pill>
          ))}
        </div>
      </Section>

      <Section title="出題順">
        <button
          onClick={() => {
            sfx.select();
            setShuffle((s) => !s);
          }}
          className={`flex w-full items-center justify-between rounded-xl border px-4 py-3 transition active:scale-[0.99] ${
            shuffle
              ? "border-brand-600 bg-brand-50 dark:border-brand-500/60 dark:bg-brand-950/30"
              : "border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-900"
          }`}
        >
          <span className="flex items-center gap-2 font-semibold text-neutral-700 dark:text-neutral-200">
            <ShuffleIcon size={18} className={shuffle ? "text-brand-600 dark:text-brand-400" : ""} />
            シャッフル出題
          </span>
          <Toggle on={shuffle} />
        </button>
      </Section>

      {/* スタート（インクのプライマリ） */}
      <button
        onClick={() => onStart(cfg)}
        disabled={available === 0}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl bg-neutral-900 py-4 text-base font-bold tracking-tight text-white shadow-card transition active:scale-[0.98] enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-50 dark:text-neutral-900 dark:enabled:hover:bg-white"
      >
        <Play size={19} fill="currentColor" />
        {available === 0 ? "該当する問題がありません" : `演習スタート（${effective}問）`}
      </button>
      <p className="mt-2.5 text-center text-xs tracking-luxe text-neutral-400 dark:text-neutral-500">
        該当 {available} 問
      </p>
    </AppShell>
  );
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative h-6 w-11 rounded-full transition-colors ${
        on ? "bg-brand-600" : "bg-neutral-300 dark:bg-neutral-700"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all ${
          on ? "left-[1.375rem]" : "left-0.5"
        }`}
      />
    </span>
  );
}

function labelForSession(s: SessionConfig): string {
  const topic = s.topic === "all" ? "すべて" : TOPIC_LABEL[s.topic];
  const type =
    s.type === "all"
      ? "すべて"
      : s.type === "predicted"
      ? "予想問題"
      : TYPE_LABEL[s.type];
  const count = s.count === "all" ? "全問" : `${s.count}問`;
  return `${topic} ・ ${type} ・ ${count}`;
}
