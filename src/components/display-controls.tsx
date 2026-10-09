import { Languages, Moon, Sun } from "lucide-react";
import { usePreferences } from "@/state/preferences";
export function DisplayControls({ expanded = false }: { expanded?: boolean }) {
  const { language, theme, setLanguage, setTheme, error } = usePreferences();
  return (
    <div className={`display-controls ${expanded ? "expanded" : ""}`}>
      <div
        className="language-switch"
        role="group"
        aria-label={language === "ja" ? "言語" : "Language"}
      >
        <Languages size={17} aria-hidden="true" />
        <button
          type="button"
          lang="ja"
          aria-pressed={language === "ja"}
          onClick={() => setLanguage("ja")}
        >
          日本語
        </button>
        <button
          type="button"
          lang="en"
          aria-pressed={language === "en"}
          onClick={() => setLanguage("en")}
        >
          EN
        </button>
      </div>
      <button
        type="button"
        className="theme-switch"
        aria-pressed={theme === "dark"}
        aria-label={language === "ja" ? "ダークモード" : "Dark mode"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        {expanded && (
          <span>
            {language === "ja"
              ? theme === "dark"
                ? "ダークモード"
                : "ライトモード"
              : theme === "dark"
                ? "Dark mode"
                : "Light mode"}
          </span>
        )}
      </button>
      {error && (
        <small role="status">
          {language === "ja"
            ? "設定はこの画面内に反映されますが、端末には保存できません。"
            : "Settings apply here but cannot be saved on this device."}
        </small>
      )}
    </div>
  );
}
