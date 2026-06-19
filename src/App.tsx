import { useEffect, useState } from "react";
import type { Problem } from "./data/problems";
import { TOPIC_LABEL, TYPE_LABEL } from "./data/problems";
import {
  loadLastSession,
  loadProgress,
  loadReview,
  loadSettings,
  resetAllProgress,
  saveLastSession,
  saveSettings,
  type ProgressMap,
  type SessionConfig,
} from "./lib/storage";
import { buildQuiz, problemsByIds } from "./lib/quiz";
import { shuffle } from "./lib/shuffle";
import { setSoundEnabled } from "./lib/sound";
import Home from "./components/Home";
import ReviewTab from "./components/ReviewTab";
import StatsTab from "./components/StatsTab";
import Quiz, { type AnswerRecord } from "./components/Quiz";
import Result from "./components/Result";
import Settings from "./components/Settings";
import TabBar, { type TabKey } from "./components/common/TabBar";

type View = "main" | "quiz" | "result";

function sessionTitle(cfg: SessionConfig): string {
  const topic = cfg.topic === "all" ? "すべて" : TOPIC_LABEL[cfg.topic];
  const type =
    cfg.type === "all"
      ? "全形式"
      : cfg.type === "predicted"
      ? "予想問題"
      : TYPE_LABEL[cfg.type];
  return `${topic} ・ ${type}`;
}

export default function App() {
  const [view, setView] = useState<View>("main");
  const [tab, setTab] = useState<TabKey>("home");

  const initial = loadSettings();
  const [darkMode, setDarkMode] = useState(initial.darkMode);
  const [sound, setSound] = useState(initial.sound);

  const [progress, setProgress] = useState<ProgressMap>(() => loadProgress());
  const [review, setReview] = useState<string[]>(() => loadReview());
  const [lastSession, setLastSession] = useState<SessionConfig | null>(() =>
    loadLastSession()
  );

  const [quizProblems, setQuizProblems] = useState<Problem[]>([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [results, setResults] = useState<AnswerRecord[]>([]);

  // 設定を <html> / 効果音 / localStorage に反映
  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", darkMode);
    setSoundEnabled(sound);
    saveSettings({ darkMode, sound });
  }, [darkMode, sound]);

  const reloadStores = () => {
    setProgress(loadProgress());
    setReview(loadReview());
    setLastSession(loadLastSession());
  };

  const startSession = (cfg: SessionConfig) => {
    const list = buildQuiz(cfg);
    if (list.length === 0) return;
    saveLastSession(cfg);
    setLastSession(cfg);
    setQuizProblems(list);
    setQuizTitle(sessionTitle(cfg));
    setView("quiz");
  };

  const continueLast = () => {
    const cfg = loadLastSession();
    if (cfg) startSession(cfg);
  };

  const startReview = () => {
    const list = shuffle(problemsByIds(loadReview()));
    if (list.length === 0) return;
    setQuizProblems(list);
    setQuizTitle("復習モード");
    setView("quiz");
  };

  const handleFinish = (records: AnswerRecord[]) => {
    setResults(records);
    reloadStores();
    setView("result");
  };

  const retryWrong = () => {
    const wrong = results.filter((r) => !r.correct).map((r) => r.problem);
    if (wrong.length === 0) return backToMain("home");
    setQuizProblems(shuffle(wrong));
    setQuizTitle("間違い直し");
    setView("quiz");
  };

  const backToMain = (toTab?: TabKey) => {
    reloadStores();
    if (toTab) setTab(toTab);
    setView("main");
  };

  // ---- 全画面フロー ----
  if (view === "quiz") {
    return (
      <Quiz
        problems={quizProblems}
        title={quizTitle}
        onFinish={handleFinish}
        onExit={() => backToMain()}
      />
    );
  }
  if (view === "result") {
    return (
      <Result
        records={results}
        title={quizTitle}
        onRetryWrong={retryWrong}
        onHome={() => backToMain("home")}
      />
    );
  }

  // ---- タブ（メイン）----
  return (
    <>
      {tab === "home" && (
        <Home
          lastSession={lastSession}
          onStart={startSession}
          onContinue={continueLast}
        />
      )}
      {tab === "review" && (
        <ReviewTab review={review} onStartReview={startReview} />
      )}
      {tab === "stats" && <StatsTab progress={progress} />}
      {tab === "settings" && (
        <Settings
          darkMode={darkMode}
          sound={sound}
          onToggleDark={() => setDarkMode((d) => !d)}
          onToggleSound={() => setSound((s) => !s)}
          onReset={() => {
            resetAllProgress();
            reloadStores();
          }}
        />
      )}

      <TabBar active={tab} onChange={setTab} reviewCount={review.length} />
    </>
  );
}
