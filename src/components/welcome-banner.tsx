import { t, usePreferences } from "@/state/preferences";
import { ChevronRight, HelpCircle, X } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import "@/styles/welcome-banner.css";

const DISMISSED_KEY = "factory-visit:welcome-dismissed:v1";

export function WelcomeBanner() {
  usePreferences();
  const [dismissed, setDismissed] = useState(() => {
    try {
      return localStorage.getItem(DISMISSED_KEY) === "true";
    } catch {
      return false;
    }
  });

  if (dismissed) {
    return null;
  }

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "true");
    setDismissed(true);
  }

  return (
    <div className="welcome-banner" role="region" aria-label={t("はじめての方へ")}>
      <div className="welcome-banner-left">
        <div className="welcome-banner-icon">
          <HelpCircle size={18} />
        </div>
        <div className="welcome-banner-text">
          <div className="welcome-banner-title">
            {t("アプリの使い方")}
          </div>
          <div className="welcome-banner-desc">
            {t("ホーム画面への追加やオフラインでの使い方を確認できます")}
          </div>
        </div>
      </div>
      <div className="welcome-banner-actions">
        <Link to="/about" className="welcome-banner-link">
          <span>{t("見る")}</span>
          <ChevronRight size={15} />
        </Link>
        <button
          type="button"
          onClick={handleDismiss}
          className="welcome-banner-close"
          aria-label={t("閉じる")}
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );
}
