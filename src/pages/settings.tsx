import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import {
  Button,
  Card,
  Group,
  PageTitle,
  Stack,
  Text,
  Title,
} from "@/components/ui";
import { PwaSettings } from "@/pwa";
import { LogOut, Route } from "lucide-react";
import { useState } from "react";
import { CourseSelectModal } from "@/components/course-modal";
import { currentCourse, COURSE_LABELS } from "@/data/course";

export default function SettingsPage({ logout }: { logout: () => void }) {
  usePreferences();
  const [courseModalOpen, setCourseModalOpen] = useState(false);
  return (
    <>
      <CourseSelectModal
        opened={courseModalOpen}
        onClose={() => setCourseModalOpen(false)}
        allowClose
      />
      <div style={{ maxWidth: "600px", margin: "0 auto" }}>
        <PageTitle title={t("設定・このアプリについて")} />
        <Card p="xl">
          <Stack gap="lg">
            <div>
              <Title order={2} size="h4" mb="xs">
                {t("見学コース")}
              </Title>
              <Group justify="space-between" align="center" wrap="wrap" gap="sm">
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  <Text fw={600} size="lg" c="var(--foreground)">
                    {COURSE_LABELS[currentCourse]}
                  </Text>
                  <Button
                    color="var(--foreground)"
                    size="md"
                    variant="light"
                    leftSection={<Route size={16} />}
                    onClick={() => setCourseModalOpen(true)}
                  >
                    {t("学科切り替え")}
                  </Button>
                </div>
                <Text size="xs" c="dimmed">
                  {t("現在読み込まれているデータです。")}
                </Text>
              </Group>
            </div>
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
      </div>
    </>
  );
}
