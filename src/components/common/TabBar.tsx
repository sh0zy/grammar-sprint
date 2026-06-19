import { ChartColumn, House, ListChecks, Settings } from "lucide-react";
import { sfx } from "../../lib/sound";

export type TabKey = "home" | "review" | "stats" | "settings";

interface TabBarProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  reviewCount: number;
}

const TABS: { key: TabKey; label: string; Icon: typeof House }[] = [
  { key: "home", label: "ホーム", Icon: House },
  { key: "review", label: "復習", Icon: ListChecks },
  { key: "stats", label: "成績", Icon: ChartColumn },
  { key: "settings", label: "設定", Icon: Settings },
];

export default function TabBar({ active, onChange, reviewCount }: TabBarProps) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200/80 bg-white/90 backdrop-blur-lg dark:border-neutral-800/80 dark:bg-neutral-900/90">
      <div className="mx-auto grid w-full max-w-xl grid-cols-4 px-2 pt-1.5 pb-safe">
        {TABS.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => {
                if (!isActive) {
                  sfx.tap();
                  onChange(key);
                }
              }}
              aria-label={label}
              aria-current={isActive ? "page" : undefined}
              className="group flex flex-col items-center gap-0.5 py-1"
            >
              <span
                className={`relative flex h-8 w-14 items-center justify-center rounded-full transition-all duration-200 ${
                  isActive
                    ? "bg-brand-100 text-brand-700 dark:bg-brand-950/70 dark:text-brand-300"
                    : "text-neutral-400 group-active:scale-90 dark:text-neutral-500"
                }`}
              >
                <Icon
                  size={21}
                  className={isActive ? "animate-tab-pop" : ""}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                {key === "review" && reviewCount > 0 && (
                  <span className="absolute -right-0 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold leading-none text-white">
                    {reviewCount > 99 ? "99+" : reviewCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[11px] font-semibold tracking-tight transition-colors ${
                  isActive
                    ? "text-brand-700 dark:text-brand-300"
                    : "text-neutral-400 dark:text-neutral-500"
                }`}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
