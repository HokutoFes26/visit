import { t, usePreferences } from "@/state/preferences";
import { usePwa } from "@/pwa";
import { Check, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import "@/styles/offline-toast.css";

const DISMISSED_KEY = "factory-visit:offline-toast-dismissed:v1";
let dismissedInMemory = false;

export function OfflineToast() {
  usePreferences();
  const { ready } = usePwa();
  const [dismissed, setDismissed] = useState(() => {
    if (dismissedInMemory) return true;
    try {
      return sessionStorage.getItem(DISMISSED_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [fading, setFading] = useState(false);

  useEffect(() => {
    if (dismissed) return;

    if (ready) {
      const timer = setTimeout(() => {
        setFading(true);
        const hideTimer = setTimeout(() => {
          dismissedInMemory = true;
          try {
            sessionStorage.setItem(DISMISSED_KEY, "true");
          } catch {
            // ignore
          }
          setDismissed(true);
        }, 400); // fade-out animation
        return () => clearTimeout(hideTimer);
      }, 3000); // show ready state for 3 seconds
      return () => clearTimeout(timer);
    }
  }, [ready, dismissed]);

  if (dismissed || import.meta.env.DEV) {
    return null;
  }

  return (
    <div
      className={`offline-toast ${ready ? "toast-ready" : "toast-loading"} ${
        fading ? "toast-fade-out" : ""
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="offline-toast-content">
        {ready ? (
          <>
            <div className="offline-toast-icon toast-icon-check">
              <Check size={14} strokeWidth={2.5} />
            </div>
            <span>{t("オフライン準備完了")}</span>
          </>
        ) : (
          <>
            <div className="offline-toast-icon toast-icon-spin">
              <Loader2 size={14} className="spin-icon" />
            </div>
            <span>{t("オフライン準備中…")}</span>
          </>
        )}
      </div>
    </div>
  );
}
