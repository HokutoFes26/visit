import { getLanguage, t, usePreferences } from "@/state/preferences";
import { Badge, Card, PageTitle, Stack, Text, Title, Box } from "@/components/ui";
import { announcements } from "@/data";

export default function AnnouncementsPage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("お知らせ")} />
      <Stack gap="md">
        {announcements.map((a) => (
          <Card key={a.id}>
            <Box mb="xs">
              <Badge
                color={a.importance === "high" ? "red" : "blue"}
                variant="light"
                size="sm"
              >
                {t(a.importance === "high" ? "重要" : "ご案内")}
              </Badge>
            </Box>
            <Title order={2} size="h3" mb="xs">
              {t(a.title)}
            </Title>
            <Text size="sm" c="dimmed" mb="md" style={{ lineHeight: 1.6 }}>
              {t(a.body)}
            </Text>
            <Text size="xs" c="dimmed">
              {t("資料の掲載日：")}
              {t(
                a.publishedAt
                  ? new Date(a.publishedAt).toLocaleDateString(
                      getLanguage() === "ja" ? "ja-JP" : "en-US",
                      {
                        timeZone: "Asia/Tokyo",
                      },
                    )
                  : "記載なし",
              )}
              {t(" ")}
              {t("/ サイト反映日：")}
              {t(
                new Date(a.updatedAt).toLocaleDateString(
                  getLanguage() === "ja" ? "ja-JP" : "en-US",
                  {
                    timeZone: "Asia/Tokyo",
                  },
                ),
              )}
            </Text>
          </Card>
        ))}
      </Stack>
    </>
  );
}
