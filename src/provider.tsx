import { t, usePreferences } from "@/state/preferences";
import { PwaProvider, PwaStatus } from "@/pwa";
import { VisitStorageProvider } from "@/state/visit-storage";
import React from "react";
class ErrorBoundary extends React.Component<
  {
    children: React.ReactNode;
  },
  {
    failed: boolean;
  }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="error-screen">
        <h1>{t("画面を表示できませんでした")}</h1>
        <p>{t("データや設定を確認し、再読み込みしてください。")}</p>
        <button onClick={() => location.reload()}>{t("再読み込み")}</button>
      </div>
    ) : (
      this.props.children
    );
  }
}

export function Provider({ children }: { children: React.ReactNode }) {
  usePreferences();
  return (
    <ErrorBoundary>
      <PwaProvider>
        <VisitStorageProvider>
          <PwaStatus />
          {children}
        </VisitStorageProvider>
      </PwaProvider>
    </ErrorBoundary>
  );
}
