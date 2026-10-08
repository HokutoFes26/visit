import { Card, PageTitle } from "@/components/ui";
import { PwaSettings } from "@/pwa";
import { LogOut } from "lucide-react";
export default function SettingsPage({ logout }: { logout: () => void }) {
  return (
    <>
      <PageTitle
        title="設定・このアプリについて"
        description="Factory Visit Guide · 発表概要版 v0.2"
      />
      <Card>
        <h2>閲覧ゲートについて</h2>
        <p>
          ログイン状態はこのタブのセッション内に保持されます。この仕組みは機密情報を保護する認証ではありません。
        </p>
        <PwaSettings />
        <h2>時刻表示</h2>
        <p>端末の日時を正しく設定してください。</p>
        <button className="button secondary" onClick={logout}>
          <LogOut size={18} />
          ログアウト
        </button>
      </Card>
    </>
  );
}
