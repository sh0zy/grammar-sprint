import type { ReactNode } from "react";
import { ChevronLeft } from "lucide-react";

interface AppShellProps {
  title: string;
  subtitle?: string;
  onBack?: () => void;
  right?: ReactNode;
  /** 画面下部に固定するアクションバー（出題画面の解答/次へなど） */
  footer?: ReactNode;
  /** 下部タブバーがある画面では本文に余白を足す */
  hasTabBar?: boolean;
  children: ReactNode;
}

export default function AppShell({
  title,
  subtitle,
  onBack,
  right,
  footer,
  hasTabBar,
  children,
}: AppShellProps) {
  return (
    <div className="flex min-h-full flex-col bg-neutral-50 dark:bg-neutral-950">
      <header className="sticky top-0 z-20 border-b border-neutral-200/80 bg-white/85 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/85">
        <div className="pt-safe" />
        <div className="mx-auto flex h-14 w-full max-w-xl items-center gap-2 px-3">
          <div className="flex w-10 shrink-0 justify-start">
            {onBack && (
              <button
                onClick={onBack}
                aria-label="戻る"
                className="-ml-1 rounded-full p-2 text-neutral-600 transition active:scale-90 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
              >
                <ChevronLeft size={22} />
              </button>
            )}
          </div>
          <div className="min-w-0 flex-1 text-center">
            <h1 className="truncate font-serif text-lg font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
              {title}
            </h1>
            {subtitle && (
              <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex w-10 shrink-0 justify-end">{right}</div>
        </div>
      </header>

      <main
        className={`mx-auto w-full max-w-xl flex-1 px-4 py-4 ${
          hasTabBar ? "pb-28" : ""
        }`}
      >
        {children}
      </main>

      {footer && (
        <footer className="sticky bottom-0 z-20 border-t border-neutral-200/80 bg-white/90 backdrop-blur-md dark:border-neutral-800/80 dark:bg-neutral-900/90">
          <div className="mx-auto w-full max-w-xl px-4 pt-3 pb-safe">
            {footer}
          </div>
        </footer>
      )}
    </div>
  );
}
