import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import { Button, Card, PageTitle, Stack, Text, Title, Box } from "@/components/ui";
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
      <Card p="xl">
        <Stack gap="lg">
          <div>
            <Title order={2} size="h4" mb="xs">
              {t("表示設定")}
            </Title>
            <DisplayControls expanded />
          </div>
          <div>
            <Title order={2} size="h4" mb="xs">
              {t("閲覧ゲートについて")}
            </Title>
            <Text size="sm" c="dimmed">
              {t(
                "ログイン状態はこのタブのセッション内に保持されます。この仕組みは機密情報を保護する認証ではありません。",
              )}
            </Text>
          </div>
          <PwaSettings />
          <div>
            <Title order={2} size="h4" mb="xs">
              {t("時刻表示")}
            </Title>
            <Text size="sm" c="dimmed" mb="md">
              {t("端末の日時を正しく設定してください。")}
            </Text>
            <Button
              variant="light"
              color="gray"
              leftSection={<LogOut size={16} />}
              onClick={logout}
            >
              {t("ログアウト")}
            </Button>
          </div>
        </Stack>
      </Card>
    </>
  );
}
