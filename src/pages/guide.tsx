import { t, usePreferences } from "@/state/preferences";
import {
  Badge,
  Box,
  Button,
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
import { Backpack, Check, ExternalLink, MapPin, Shirt } from "lucide-react";
import { Link } from "react-router-dom";

export default function GuidePage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("見学ガイド")} />
      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg" mb="lg">
        <Card radius="lg">
          <Group align="flex-start" gap="md" wrap="nowrap">
            <ThemeIcon size={46} radius="xl" color="var(--accent-neon)" variant="light">
              <MapPin size={24} />
            </ThemeIcon>
            <Box style={{ flex: 1 }}>
              <Badge
                variant="light"
                color="var(--accent-neon)"
                size="md"
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
                style={{ color: "var(--accent-neon)" }}
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

        <Card radius="lg">
          <SectionTitle title={t("配布資料")} />
          <Text size="sm" c="dimmed" mb="md">
            {t("部屋割りや座席表などの資料は、個人情報保護のため学校のTeamsで閲覧できます。")}
          </Text>
          <SimpleGrid cols={1} spacing="lg">
            {guide.documents.map((document) => {
              const linkUrl = (document as { url?: string; file?: string }).url || (document.file ? assetUrl(document.file) : "");
              return (
                <Box key={document.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <Title order={5}>{t(document.title)}</Title>
                  {linkUrl ? (
                    <Group gap="sm" wrap="wrap">
                      <Button
                        component="a"
                        href={linkUrl}
                        target="_blank"
                        rel="noreferrer"
                        variant="light"
                        color="var(--accent-neon)"
                        size="sm"
                        rightSection={<ExternalLink size={15} />}
                      >
                        {t("Teamsで確認")}
                      </Button>
                    </Group>
                  ) : (
                    <>
                      <Badge variant="light" color="var(--accent-neon)" size="lg" radius="xl">{t("準備中")}</Badge>
                    </>
                  )}
                </Box>
              );
            })}
          </SimpleGrid>
        </Card>

        {guide.sections.map((section) => (
          <Card key={section.title} radius="lg">
            <SectionTitle title={t(section.title)} />
            <List
              spacing="xs"
              size="sm"
              icon={
                <ThemeIcon color="var(--accent-neon)" size={20} radius="xl" variant="light">
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
