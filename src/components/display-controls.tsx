import { Languages, Moon, Sun } from "lucide-react";
import { usePreferences } from "@/state/preferences";
import "@/styles/display-controls.css";

export function DisplayControls({ expanded = false }: { expanded?: boolean }) {
  const { language, theme, setLanguage, setTheme, error } = usePreferences();

  if (expanded) {
    return (
      <div className="display-controls expanded">
        <div
          className="capsule-switch-group"
          role="group"
          aria-label="言語の選択"
        >
          <span className="capsule-switch-lead-icon" aria-hidden="true">
            <Languages size={16} />
          </span>
          <div className="capsule-switch-track">
            <div
              className="capsule-switch-indicator"
              style={{
                transform: `translateX(${language === "en" ? "100%" : "0%"})`,
              }}
              aria-hidden="true"
            />
            <button
              type="button"
              className={`capsule-switch-btn ${language === "ja" ? "active" : ""}`}
              aria-pressed={language === "ja"}
              onClick={() => setLanguage("ja")}
            >
              日本語
            </button>
            <button
              type="button"
              className={`capsule-switch-btn ${language === "en" ? "active" : ""}`}
              aria-pressed={language === "en"}
              onClick={() => setLanguage("en")}
            >
              English
            </button>
          </div>
        </div>

        <div
          className="capsule-switch-group"
          role="group"
          aria-label="テーマの選択"
        >
          <div className="capsule-switch-track">
            <div
              className="capsule-switch-indicator"
              style={{
                transform: `translateX(${theme === "dark" ? "100%" : "0%"})`,
              }}
              aria-hidden="true"
            />
            <button
              type="button"
              className={`capsule-switch-btn ${theme === "light" ? "active" : ""}`}
              aria-pressed={theme === "light"}
              onClick={() => setTheme("light")}
            >
              <Sun size={15} aria-hidden="true" />
              <span>{language === "ja" ? "ライト" : "Light"}</span>
            </button>
            <button
              type="button"
              className={`capsule-switch-btn ${theme === "dark" ? "active" : ""}`}
              aria-pressed={theme === "dark"}
              onClick={() => setTheme("dark")}
            >
              <Moon size={15} aria-hidden="true" />
              <span>{language === "ja" ? "ダーク" : "Dark"}</span>
            </button>
          </div>
        </div>

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

  return (
    <div className="display-controls">
      <button
        type="button"
        className="language-toggle-btn"
        onClick={() => setLanguage(language === "ja" ? "en" : "ja")}
      >
        <Languages size={18} aria-hidden="true" />
        <span>{language === "ja" ? "EN" : "日本語"}</span>
      </button>
      <button
        type="button"
        className="theme-switch"
        aria-pressed={theme === "dark"}
        aria-label={language === "ja" ? "ダークモード" : "Dark mode"}
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      >
        {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
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
