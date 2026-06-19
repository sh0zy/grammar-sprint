import { useEffect, useState } from "react";
import { TOPIC_LABEL, TYPE_LABEL, type Problem } from "../data/problems";
import { blankCount, grade, isAutoGraded, type Response } from "../lib/grading";
import { recordResult } from "../lib/storage";
import { sfx } from "../lib/sound";
import AppShell from "./common/AppShell";
import ProgressBar from "./common/ProgressBar";
import Feedback from "./common/Feedback";
import MCCard from "./cards/MCCard";
import FillCard from "./cards/FillCard";
import ReorderCard from "./cards/ReorderCard";
import WritingCard from "./cards/WritingCard";
import ErrorCard from "./cards/ErrorCard";
import DialogueCard from "./cards/DialogueCard";

export interface AnswerRecord {
  problem: Problem;
  correct: boolean;
}

interface QuizProps {
  problems: Problem[];
  title: string;
  onFinish: (records: AnswerRecord[]) => void;
  onExit: () => void;
}

function initialResponse(p: Problem): Response {
  if (p.type === "dialogue")
    return Array.from({ length: blankCount(p) }, () => "");
  if (p.type === "reorder") return [];
  return "";
}

function canSubmit(p: Problem, r: Response): boolean {
  switch (p.type) {
    case "writing":
      return true;
    case "reorder":
      return (
        Array.isArray(r) && r.length > 0 && r.length === (p.tokens?.length ?? 0)
      );
    case "dialogue":
      return (
        Array.isArray(r) &&
        r.length === blankCount(p) &&
        r.every((s) => s.trim() !== "")
      );
    default:
      return typeof r === "string" && r.trim() !== "";
  }
}

export default function Quiz({ problems, title, onFinish, onExit }: QuizProps) {
  const [index, setIndex] = useState(0);
  const [response, setResponse] = useState<Response>(() =>
    initialResponse(problems[0])
  );
  const [phase, setPhase] = useState<"input" | "answered">("input");
  const [correct, setCorrect] = useState(false);
  const [selfResult, setSelfResult] = useState<boolean | null>(null);
  const [records, setRecords] = useState<AnswerRecord[]>([]);

  const current = problems[index];
  const isLast = index === problems.length - 1;
  const score = records.filter((r) => r.correct).length;

  useEffect(() => {
    setResponse(initialResponse(current));
    setPhase("input");
    setCorrect(false);
    setSelfResult(null);
  }, [index]); // eslint-disable-line react-hooks/exhaustive-deps

  // mc / choice / reorder のタップ操作に効果音
  const selectAndSet = (v: Response) => {
    sfx.select();
    setResponse(v);
  };

  const handleSubmit = () => {
    if (phase !== "input") return;
    if (current.type === "writing") {
      sfx.tap();
      setPhase("answered");
      return;
    }
    if (!canSubmit(current, response)) return;
    const ok = grade(current, response);
    recordResult(current.id, ok);
    setRecords((prev) => [...prev, { problem: current, correct: ok }]);
    setCorrect(ok);
    setPhase("answered");
    ok ? sfx.correct() : sfx.wrong();
  };

  const handleSelfGrade = (ok: boolean) => {
    recordResult(current.id, ok);
    setRecords((prev) => [...prev, { problem: current, correct: ok }]);
    setSelfResult(ok);
    setCorrect(ok);
    ok ? sfx.correct() : sfx.wrong();
  };

  const handleNext = () => {
    if (isLast) {
      onFinish(records);
    } else {
      sfx.tap();
      setIndex((i) => i + 1);
    }
  };

  const answered = phase === "answered";
  const writingPending =
    current.type === "writing" && answered && selfResult == null;
  const showWrong = answered && !correct && current.type !== "writing";

  let footer: React.ReactNode;
  if (!answered) {
    const submittable =
      current.type === "writing" || canSubmit(current, response);
    footer = (
      <button
        onClick={handleSubmit}
        disabled={!submittable}
        className="w-full rounded-2xl bg-neutral-900 py-4 text-base font-bold tracking-tight text-white shadow-card transition active:scale-[0.98] enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-50 dark:text-neutral-900 dark:enabled:hover:bg-white"
      >
        {current.type === "writing" ? "答えを見る" : "解答する"}
      </button>
    );
  } else {
    footer = (
      <button
        onClick={handleNext}
        disabled={writingPending}
        className="w-full rounded-2xl bg-neutral-900 py-4 text-base font-bold tracking-tight text-white shadow-card transition active:scale-[0.98] enabled:hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-40 dark:bg-neutral-50 dark:text-neutral-900 dark:enabled:hover:bg-white"
      >
        {writingPending ? "○ / ✕ を選んでね" : isLast ? "結果を見る" : "次へ"}
      </button>
    );
  }

  const userAnswerStr = Array.isArray(response)
    ? current.type === "dialogue"
      ? response.join(" / ")
      : response.join(" ")
    : response;

  return (
    <AppShell
      title={title}
      subtitle={`${index + 1} / ${problems.length}`}
      onBack={onExit}
      footer={footer}
    >
      <ProgressBar current={index + 1} total={problems.length} score={score} />

      <div
        key={current.id}
        className={`rounded-2xl border border-neutral-200/80 bg-white p-5 shadow-soft dark:border-neutral-800 dark:bg-neutral-900 ${
          showWrong ? "animate-shake" : "animate-slide-up"
        }`}
      >
        <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
          <span className="rounded-full bg-brand-100 px-2.5 py-0.5 text-xs font-semibold text-brand-700 dark:bg-brand-950/60 dark:text-brand-300">
            {TOPIC_LABEL[current.topic]}
          </span>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-600 dark:bg-neutral-800 dark:text-neutral-300">
            {TYPE_LABEL[current.type]}
          </span>
          {current.predicted && (
            <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/60 dark:text-amber-300">
              予想
            </span>
          )}
        </div>

        <p className="mb-3 text-sm font-medium text-neutral-600 dark:text-neutral-300">
          {current.instruction}
        </p>

        {(current.type === "mc" || current.type === "choice") && (
          <MCCard problem={current} value={response as string} onChange={selectAndSet} answered={answered} />
        )}
        {(current.type === "fill" || current.type === "spelling") && (
          <FillCard
            problem={current}
            value={response as string}
            onChange={setResponse}
            answered={answered}
            correct={correct}
            onSubmit={handleSubmit}
          />
        )}
        {current.type === "reorder" && (
          <ReorderCard
            key={current.id}
            problem={current}
            onChange={selectAndSet}
            answered={answered}
            correct={correct}
          />
        )}
        {current.type === "writing" && (
          <WritingCard problem={current} value={response as string} onChange={setResponse} answered={answered} />
        )}
        {current.type === "error" && (
          <ErrorCard
            problem={current}
            value={response as string}
            onChange={setResponse}
            answered={answered}
            correct={correct}
            onSubmit={handleSubmit}
          />
        )}
        {current.type === "dialogue" && (
          <DialogueCard
            problem={current}
            value={response as string[]}
            onChange={setResponse}
            answered={answered}
            correct={correct}
            onSubmit={handleSubmit}
          />
        )}
      </div>

      {answered && (
        <Feedback
          problem={current}
          mode={isAutoGraded(current.type) ? "auto" : "writing"}
          correct={correct}
          userAnswer={userAnswerStr}
          selfResult={selfResult}
          onSelfGrade={handleSelfGrade}
        />
      )}

      <div className="h-2" />
    </AppShell>
  );
}
