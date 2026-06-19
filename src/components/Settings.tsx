import { useState } from "react";
import { Moon, Sun, Trash2, TriangleAlert, Volume2, VolumeX } from "lucide-react";
import { sfx } from "../lib/sound";
import AppShell from "./common/AppShell";

interface SettingsProps {
  darkMode: boolean;
  sound: boolean;
  onToggleDark: () => void;
  onToggleSound: () => void;
  onReset: () => void;
}

function Toggle({ on }: { on: boolean }) {
  return (
    <span
      className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${
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

export default function Settings({
  darkMode,
  sound,
  onToggleDark,
  onToggleSound,
  onReset,
}: SettingsProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  return (
    <AppShell title="設定" hasTabBar>
      {/* 表示 */}
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        表示・サウンド
      </h2>
      <div className="mb-5 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900">
        <button
          onClick={onToggleDark}
          className="flex w-full items-center justify-between px-4 py-3.5 transition active:bg-neutral-50 dark:active:bg-neutral-800/50"
        >
          <span className="flex items-center gap-2.5 font-semibold text-neutral-800 dark:text-neutral-100">
            {darkMode ? (
              <Moon size={20} className="text-brand-500" />
            ) : (
              <Sun size={20} className="text-amber-500" />
            )}
            {darkMode ? "ダークモード" : "ライトモード"}
          </span>
          <Toggle on={darkMode} />
        </button>

        <button
          onClick={() => {
            // OFF→ON のときに確認音を鳴らす
            if (!sound) sfx.correct();
            onToggleSound();
          }}
          className="flex w-full items-center justify-between px-4 py-3.5 transition active:bg-neutral-50 dark:active:bg-neutral-800/50"
        >
          <span className="flex items-center gap-2.5 font-semibold text-neutral-800 dark:text-neutral-100">
            {sound ? (
              <Volume2 size={20} className="text-brand-500" />
            ) : (
              <VolumeX size={20} className="text-neutral-400" />
            )}
            効果音
          </span>
          <Toggle on={sound} />
        </button>
      </div>

      {/* データ */}
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        データ
      </h2>
      <button
        onClick={() => setConfirmOpen(true)}
        className="flex w-full items-center gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3.5 font-semibold text-rose-700 transition active:scale-[0.99] dark:border-rose-900/50 dark:bg-rose-950/20 dark:text-rose-300"
      >
        <Trash2 size={20} />
        進捗をリセット
      </button>
      <p className="mb-5 mt-2 px-1 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
        解答記録・復習リスト・前回の出題設定をすべて消去します（表示・サウンド設定は残ります）。
      </p>

      {/* About */}
      <h2 className="mb-2 text-xs font-bold uppercase tracking-wider text-neutral-400 dark:text-neutral-500">
        このアプリについて
      </h2>
      <div className="rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-600 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-300">
        <p className="font-semibold text-neutral-800 dark:text-neutral-100">
          文法スプリント
        </p>
        <p className="mt-1 leading-relaxed">
          完了形・助動詞・態の定期テスト直前対策。全106問（うち予想問題15問）を8形式で総ざらい。すべて端末内で動作し、通信は行いません。
        </p>
      </div>

      {/* リセット確認ダイアログ */}
      {confirmOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-6 animate-fade-in"
          onClick={() => setConfirmOpen(false)}
        >
          <div
            className="w-full max-w-sm animate-pop rounded-2xl bg-white p-5 shadow-xl dark:bg-neutral-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-3 flex items-center gap-2 text-rose-600 dark:text-rose-400">
              <TriangleAlert size={22} />
              <h3 className="text-lg font-bold">進捗をリセットしますか？</h3>
            </div>
            <p className="mb-5 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
              すべての解答記録と復習リストが消去されます。この操作は取り消せません。
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="rounded-xl border border-neutral-200 bg-white py-3 font-semibold text-neutral-700 transition active:scale-95 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-200"
              >
                キャンセル
              </button>
              <button
                onClick={() => {
                  onReset();
                  setConfirmOpen(false);
                }}
                className="rounded-xl bg-rose-600 py-3 font-semibold text-white transition active:scale-95 hover:bg-rose-700"
              >
                リセット
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}
