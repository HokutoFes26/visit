import { t, usePreferences } from "@/state/preferences";
import {
  Badge,
  Box,
  Card,
  Group,
  List,
  PageTitle,
  SectionTitle,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
} from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { event, formatDate, formatTime, guide } from "@/data";
import { Backpack, Check, MapPin, Shirt } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuidePage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("見学ガイド")} />
      <Card mb="lg" radius="lg">
        <Group align="flex-start" gap="md" wrap="nowrap">
          <ThemeIcon size={46} radius="md" color="blue" variant="light">
            <MapPin size={24} />
          </ThemeIcon>
          <Box style={{ flex: 1 }}>
            <Badge
              variant="light"
              color="blue"
              size="xs"
              radius="xl"
              mb={6}
              style={{ fontWeight: 700 }}
            >
              {t("集合場所")}
            </Badge>
            <Title order={2} size="h3" mb={4}>
              {t(event.meetingPlace)}
            </Title>
            <Text
              size="sm"
              fw={600}
              style={{ color: "var(--mantine-color-blue-filled)" }}
              mb={4}
            >
              {t(formatDate(event.date))} · {formatTime(event.meetingTime)}
              {t("集合")}
            </Text>
            <Text size="sm" c="dimmed">
              {t(event.meetingNote)}
            </Text>
          </Box>
        </Group>
      </Card>

      <Card mb="lg" radius="lg">
        <SectionTitle title={t("配布資料（PDF）")} />
        <Text size="sm" c="dimmed" mb="md">{t("PDFの閲覧にはインターネット接続が必要です。")}</Text>
        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
          {guide.documents.map((document) => (
            <Box key={document.id} p="md" style={{ border: "1px solid var(--border)", borderRadius: 12, minWidth: 0 }}>
              <Title order={3} size="h4" mb="sm">{t(document.title)}</Title>
              {document.file ? (
                <>
                  <Group gap="md" mb="sm">
                    <a className="text-link" href={assetUrl(document.file)} target="_blank" rel="noreferrer">{t("PDFを開く")}</a>
                    <a className="text-link" href={assetUrl(document.file)} download>{t("PDFをダウンロード")}</a>
                  </Group>
                  <details>
                    <summary style={{ cursor: "pointer" }}>{t("このページで表示")}</summary>
                    <iframe src={assetUrl(document.file)} title={t(document.title)} loading="lazy" style={{ width: "100%", height: 480, border: 0, marginTop: 12 }} />
                    <Text size="xs" c="dimmed">{t("PDFを表示できない場合は「PDFを開く」をご利用ください。")}</Text>
                  </details>
                </>
              ) : (
                <>
                  <Badge variant="light" color="gray" mb="xs">{t("準備中")}</Badge>
                  <Text size="sm" c="dimmed">{t("資料は準備ができ次第、掲載します。")}</Text>
                </>
              )}
            </Box>
          ))}
        </SimpleGrid>
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
        {guide.sections.map((section) => (
          <Card key={section.title} radius="lg">
            <SectionTitle title={t(section.title)} />
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon color="blue" size={20} radius="xl" variant="light">
                  <Check size={12} />
                </ThemeIcon>
              }
            >
              {section.items.map((item) => (
                <List.Item key={item}>
                  <Text size="sm" c="dimmed">
                    {t(item)}
                  </Text>
                </List.Item>
              ))}
            </List>
            {section.title === "当日までの準備" && (
              <Box mt="md">
                <Link className="text-link" to="/sightseeing">
                  {t("地図で東京の観光スポットを探す")}
                </Link>
              </Box>
            )}
          </Card>
        ))}
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
        <Card radius="lg">
          <SectionTitle title={t("持ち物リスト")} />
          <List
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon color="teal" size={22} radius="md" variant="light">
                <Backpack size={13} />
              </ThemeIcon>
            }
          >
            {guide.belongings.map((item) => (
              <List.Item key={item}>
                <Text size="sm" c="dimmed">
                  {t(item)}
                </Text>
              </List.Item>
            ))}
          </List>
        </Card>
        <Card radius="lg">
          <SectionTitle title={t("服装について")} />
          <List
            spacing="xs"
            size="sm"
            icon={
              <ThemeIcon color="orange" size={22} radius="md" variant="light">
                <Shirt size={13} />
              </ThemeIcon>
            }
          >
            {guide.clothing.map((item) => (
              <List.Item key={item}>
                <Text size="sm" c="dimmed">
                  {t(item)}
                </Text>
              </List.Item>
            ))}
          </List>
        </Card>
      </SimpleGrid>

      <Card radius="lg">
        <SectionTitle title={t("安全に見学するために")} />
        <List type="ordered" spacing="sm" size="sm">
          {guide.precautions.map((item) => (
            <List.Item key={item}>
              <Text size="sm" c="dimmed" style={{ lineHeight: 1.6 }}>
                {t(item)}
              </Text>
            </List.Item>
          ))}
        </List>
      </Card>
    </>
  );
}
