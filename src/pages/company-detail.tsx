import { t, usePreferences } from "@/state/preferences";
import { useStorage } from "@/state/visit-storage";
import Timeline from "@/components/Timeline";
import {
  Accordion,
  Alert,
  Badge,
  Box,
  Button,
  Card,
  EmptyState,
  Grid,
  Group,
  SectionTitle,
  Stack,
  Text,
  Textarea,
  ThemeIcon,
  Title,
} from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { companies, schedule } from "@/data";
import { useNow } from "@/hooks/useNow";
import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BookOpen,
  Building2,
  Check,
  CheckCircle2,
  MapPin,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import "@/styles/companies.css";

export default function CompanyDetail() {
  usePreferences();
  const { notes } = useStorage();
  const { id } = useParams();
  const c = companies.find((c) => c.id === id);
  const now = useNow();

  if (!c)
    return (
      <EmptyState>
        {t("企業が見つかりません。")}
        <Link to="/companies">{t("企業一覧へ戻る")}</Link>
      </EmptyState>
    );

  const preNote = notes.value[`${c.id}:pre`] || "";
  const postNote = notes.value[`${c.id}:post`] || "";
  const relatedSchedule = schedule.filter((s) => s.companyId === c.id);
  const location =
    relatedSchedule.find((s) => s.location && !s.location.includes("東京都内"))
      ?.location ||
    relatedSchedule.find((s) => s.location)?.location ||
    "";

  const scrollToSection = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <>
      <div className="company-hero-banner">
        <img
          src={assetUrl(c.image)}
          alt={t("企業ビルのイラスト")}
          className="company-hero-image"
        />
        <img
          src={assetUrl(c.image)}
          alt=""
          aria-hidden="true"
          className="company-hero-image company-hero-image-blur"
        />
        <div className="company-hero-overlay" />
        <div className="company-hero-top">
          <Group gap="xs">
            <Link to="/schedule" className="back-link company-hero-back-link">
              {t("← スケジュール")}
            </Link>
            <Link to="/companies" className="back-link company-hero-back-link">
              {t("← 企業一覧")}
            </Link>
          </Group>
        </div>

        <div className="company-hero-bottom">
          <Badge
            variant="filled"
            size="md"
            radius="xl"
            mb={6}
            className="company-hero-industry"
          >
            {t(c.industry)}
          </Badge>

          <Title
            order={2}
            fw={800}
            mb={location ? 6 : 0}
            className="company-hero-title"
          >
            {t(c.name)}
          </Title>

          {location && (
            <Group gap={6} align="center" className="company-hero-location">
              <MapPin size={16} />
              <Text size="sm">{t(location)}</Text>
            </Group>
          )}
        </div>
      </div>

      <Box mb="lg" p="xs" className="company-jump-bar">
        <Group gap="xs" justify="center" grow>
          <Button
            variant="default"
            size="sm"
            radius="xl"
            fw={600}
            leftSection={<Building2 size={15} />}
            rightSection={<ArrowDown size={14} />}
            onClick={() => scrollToSection("company-overview")}
          >
            {t("会社紹介")}
          </Button>
          <Button
            variant="light"
            color="blue"
            size="sm"
            radius="xl"
            fw={600}
            leftSection={<BookOpen size={15} />}
            rightSection={<ArrowDown size={14} />}
            onClick={() => scrollToSection("pre-note-card")}
          >
            {t("事前メモ")}
          </Button>
          <Button
            variant="light"
            color="teal"
            size="sm"
            radius="xl"
            fw={600}
            leftSection={<CheckCircle2 size={15} />}
            rightSection={<ArrowDown size={14} />}
            onClick={() => scrollToSection("post-note-card")}
          >
            {t("事後メモ")}
          </Button>
        </Group>
      </Box>

      <Grid gap="lg" align="stretch">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Card id="company-overview" className="company-detail-card">
            <Group justify="space-between" align="center" mb="md">
              <Group gap="xs">
                <ThemeIcon size="md" radius="md" color="gray" variant="light">
                  <Building2 size={16} />
                </ThemeIcon>
                <Title order={2} size="h3" fw={700}>
                  {t("会社紹介")}
                </Title>
              </Group>
            </Group>

            <Text size="sm" mb="md" className="company-detail-text">
              {t(c.description)}
            </Text>

            <dl>
              <dt>{t("企業名")}</dt>
              <dd>{t(c.legalName)}</dd>
              <dt>{t("主な事業")}</dt>
              <dd>{t(c.business.join(" / ") || "資料に記載なし")}</dd>
              <dt>{t("製品・サービス")}</dt>
              <dd>{t(c.products.join(" / ") || "資料に記載なし")}</dd>
            </dl>

            <Title order={3} size="h4" mt="lg" mb="xs">
              {t("見学内容")}
            </Title>
            <Text size="sm" c="dimmed" mb="md" className="company-detail-text">
              {t(c.factory)}
            </Text>

            {(c.highlights.length > 0 || c.questions.length > 0) && (
              <Accordion variant="separated" radius="md" mt="md" mb="md">
                <Accordion.Item value="hints">
                  <Accordion.Control>
                    <Text size="sm" fw={600}>
                      {t("見学の注目ポイント・質問例")}
                    </Text>
                  </Accordion.Control>
                  <Accordion.Panel>
                    {c.highlights.length > 0 && (
                      <Box mb="sm">
                        <Text size="xs" fw={700} c="dimmed" mb={6}>
                          {t("見学の注目ポイント")}
                        </Text>
                        <ul className="feature-list company-hints-list">
                          {c.highlights.map((h) => (
                            <li key={h}>
                              <Check size={16} color="var(--accent-neon)" />
                              <span>{t(h)}</span>
                            </li>
                          ))}
                        </ul>
                      </Box>
                    )}

                    {c.questions.length > 0 && (
                      <Box mt="xs">
                        <Text size="xs" fw={700} c="dimmed" mb={6}>
                          {t("事前に考えておきたい質問")}
                        </Text>
                        <Stack gap={4}>
                          {c.questions.map((q) => (
                            <Text key={q} size="xs" c="dimmed">
                              • {t(q)}
                            </Text>
                          ))}
                        </Stack>
                      </Box>
                    )}
                  </Accordion.Panel>
                </Accordion.Item>
              </Accordion>
            )}

            {c.website && /^https?:\/\//.test(c.website) ? (
              <Box mt="sm">
                <a
                  className="text-link"
                  href={c.website}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("公式サイト（オンライン接続が必要）")}
                  <ArrowUpRight size={16} />
                </a>
              </Box>
            ) : (
              <p className="quiet-note">{t("公式Webサイトは未登録です。")}</p>
            )}
          </Card>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="lg" className="company-detail-card">
            <Card id="pre-note-card" className="company-detail-card">
              <Group justify="space-between" align="center" mb={4}>
                <Group gap="xs" mb={8}>
                  <ThemeIcon size="md" radius="md" color="blue" variant="light">
                    <BookOpen size={16} />
                  </ThemeIcon>
                  <Title order={3} size="h4" fw={700}>
                    {t("事前メモ")}
                  </Title>
                </Group>
              </Group>

              <Text size="xs" c="dimmed" mb="sm">
                {t("見学前に調べたことや質問したいことを整理しましょう")}
              </Text>

              <Textarea
                value={preNote}
                onChange={(e) =>
                  notes.change(`${c.id}:pre`, e.currentTarget.value)
                }
                placeholder={t(
                  "見学前に調べたこと、質問したいことなどをメモ...",
                )}
                autosize
                minRows={5}
                maxRows={12}
                aria-label={t("事前メモ")}
                className="company-note-textarea"
              />

              <Group justify="space-between" align="center" mt="xs">
                <Text size="xs" c="dimmed">
                  ✓ {t("入力すると自動保存されます")}
                </Text>
                {preNote.length > 0 && (
                  <Text size="xs" c="dimmed">
                    {preNote.length} {t("文字")}
                  </Text>
                )}
              </Group>
            </Card>

            <Card id="post-note-card" className="company-detail-card">
              <Group justify="space-between" align="center" mb={4}>
                <Group gap="xs" mb={8}>
                  <ThemeIcon size="md" radius="md" color="teal" variant="light">
                    <CheckCircle2 size={16} />
                  </ThemeIcon>
                  <Title order={3} size="h4" fw={700}>
                    {t("事後メモ")}
                  </Title>
                </Group>
              </Group>

              <Text size="xs" c="dimmed" mb="sm">
                {t("見学で学んだことや気づき、感想を記録しましょう")}
              </Text>

              <Textarea
                value={postNote}
                onChange={(e) =>
                  notes.change(`${c.id}:post`, e.currentTarget.value)
                }
                placeholder={t(
                  "見学で学んだこと、印象に残ったことなどをメモ...",
                )}
                autosize
                minRows={5}
                maxRows={12}
                aria-label={t("事後メモ")}
                className="company-note-textarea"
              />

              <Group justify="space-between" align="center" mt="xs">
                <Text size="xs" c="dimmed">
                  ✓ {t("入力すると自動保存されます")}
                </Text>
                {postNote.length > 0 && (
                  <Text size="xs" c="dimmed">
                    {postNote.length} {t("文字")}
                  </Text>
                )}
              </Group>
            </Card>

            {notes.error && (
              <Alert color="red" radius="md">
                {t(notes.error)}
              </Alert>
            )}
          </Stack>
        </Grid.Col>
      </Grid>

      {relatedSchedule.length > 0 && (
        <Box mt="xl" id="related-schedule" className="company-related-schedule">
          <SectionTitle title={t("関連スケジュール")} />
          <Timeline items={relatedSchedule} now={now} showCompany={false} />
        </Box>
      )}
    </>
  );
}
