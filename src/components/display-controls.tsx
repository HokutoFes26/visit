import { Languages, Moon, Sun } from "lucide-react";
import { usePreferences } from "@/state/preferences";
export function DisplayControls({ expanded = false }: { expanded?: boolean }) {
  const { language, theme, setLanguage, setTheme, error } = usePreferences();
  return (
    <div className={`display-controls ${expanded ? "expanded" : ""}`}>
      <button
        type="button"
        className="language-toggle-btn"
        onClick={() => setLanguage(language === "ja" ? "en" : "ja")}
      >
        <Languages size={15} aria-hidden="true" />
        <span>{language === "ja" ? "EN" : "日本語"}</span>
      </button>
      <button
        type="button"
        className="theme-switch"
        aria-pressed={theme === "dark"}
        aria-label={language === "ja" ? "ダークモード" : "Dark mode"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun size={18} /> : <Moon size={16} />}
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
