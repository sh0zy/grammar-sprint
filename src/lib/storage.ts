import type { ProblemType, Topic } from "../data/problems";

// ============================================================
// 型
// ============================================================
export type TopicFilter = Topic | "all";
export type TypeFilter = ProblemType | "predicted" | "all";
export type CountOption = 10 | 20 | "all";

export interface SessionConfig {
  topic: TopicFilter;
  type: TypeFilter;
  count: CountOption;
  shuffle: boolean;
}

export interface ProgressEntry {
  correct: boolean;
  attempts: number;
  lastAt: number;
}
export type ProgressMap = Record<string, ProgressEntry>;

export interface Settings {
  darkMode: boolean;
  sound: boolean;
}

// ============================================================
// localStorage キー
// ============================================================
const KEY = {
  progress: "gs_progress",
  review: "gs_review",
  settings: "gs_settings",
  lastSession: "gs_lastSession",
} as const;

// ============================================================
// 低レベル read / write（壊れたデータは初期化）
// ============================================================
function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    try {
      localStorage.removeItem(key);
    } catch {
      /* ignore */
    }
    return fallback;
  }
}

function write(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    /* ストレージ不可（プライベートモード等）でも落とさない */
  }
}

// ============================================================
// 進捗
// ============================================================
export function loadProgress(): ProgressMap {
  const data = read<ProgressMap>(KEY.progress, {});
  return data && typeof data === "object" ? data : {};
}

export function saveProgress(map: ProgressMap): void {
  write(KEY.progress, map);
}

/** 解答結果を記録し、復習リストを更新する。最新の進捗を返す。 */
export function recordResult(id: string, correct: boolean): ProgressMap {
  const map = loadProgress();
  const prev = map[id];
  map[id] = {
    correct,
    attempts: (prev?.attempts ?? 0) + 1,
    lastAt: Date.now(),
  };
  saveProgress(map);

  // 復習リスト：不正解は追加、正解なら除外
  if (correct) removeReview(id);
  else addReview(id);

  return map;
}

// ============================================================
// 復習リスト
// ============================================================
export function loadReview(): string[] {
  const data = read<string[]>(KEY.review, []);
  return Array.isArray(data) ? data.filter((x) => typeof x === "string") : [];
}

export function saveReview(ids: string[]): void {
  write(KEY.review, Array.from(new Set(ids)));
}

export function addReview(id: string): void {
  const ids = loadReview();
  if (!ids.includes(id)) {
    ids.push(id);
    saveReview(ids);
  }
}

export function removeReview(id: string): void {
  const ids = loadReview().filter((x) => x !== id);
  saveReview(ids);
}

// ============================================================
// 設定
// ============================================================
export function loadSettings(): Settings {
  const data = read<Partial<Settings>>(KEY.settings, {});
  return {
    darkMode: !!data.darkMode,
    sound: data.sound === undefined ? true : !!data.sound, // 既定ON
  };
}

export function saveSettings(s: Settings): void {
  write(KEY.settings, s);
}

// ============================================================
// 直近の出題設定（「前回の続き」用）
// ============================================================
export function loadLastSession(): SessionConfig | null {
  const data = read<SessionConfig | null>(KEY.lastSession, null);
  if (!data || typeof data !== "object") return null;
  return data;
}

export function saveLastSession(cfg: SessionConfig): void {
  write(KEY.lastSession, cfg);
}

// ============================================================
// 全リセット
// ============================================================
export function resetAllProgress(): void {
  try {
    localStorage.removeItem(KEY.progress);
    localStorage.removeItem(KEY.review);
    localStorage.removeItem(KEY.lastSession);
  } catch {
    /* ignore */
  }
}
