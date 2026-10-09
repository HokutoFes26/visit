import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import { Card, PageTitle } from "@/components/ui";
import { PwaSettings } from "@/pwa";
import { LogOut } from "lucide-react";
export default function SettingsPage({ logout }: { logout: () => void }) {
  usePreferences();
  return (
    <>
      <PageTitle
        title={t("設定・このアプリについて")}
        description={t("Company Visit Guide · 発表概要版 v0.2")}
      />
      <Card>
        <h2>{t("表示設定")}</h2>
        <DisplayControls expanded />
        <h2>{t("閲覧ゲートについて")}</h2>
        <p>
          {t(
            "ログイン状態はこのタブのセッション内に保持されます。この仕組みは機密情報を保護する認証ではありません。",
          )}
        </p>
        <PwaSettings />
        <h2>{t("時刻表示")}</h2>
        <p>{t("端末の日時を正しく設定してください。")}</p>
        <button className="button secondary" onClick={logout}>
          <LogOut size={18} />
          {t("ログアウト")}
        </button>
      </Card>
    </>
  );
}
