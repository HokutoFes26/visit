import { t, usePreferences } from "@/state/preferences";
import {
  Alert,
  Badge,
  Button,
  Card,
  Checkbox,
  EmptyState,
  Group,
  List,
  PageTitle,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from "@/components/ui";
import { companies, guide } from "@/data";
import learning from "@/data/learning.json";
import { useStorage } from "@/state/visit-storage";
import { AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function LearningPage() {
  usePreferences();
  const { checks } = useStorage();

  return (
    <>
      <PageTitle title={t("事前学習")} />
      <Card className="preparation" mb="lg" radius="lg">
        <Title order={2} size="h3" mb="xs">
          {t("当日までの準備")}
        </Title>
        <List spacing={4} size="sm" mb="sm">
          {guide.sections
            .find((s) => s.title === "当日までの準備")
            ?.items.map((item) => (
              <List.Item key={item}>
                <Text size="sm" c="dimmed">
                  {t(item)}
                </Text>
              </List.Item>
            ))}
        </List>
        <Link className="text-link" to="/sightseeing">
          {t("地図で東京の観光スポットを探す")}
        </Link>
      </Card>

      {checks.error && (
        <Alert
          icon={<AlertCircle size={16} />}
          title={t("エラー")}
          color="red"
          variant="light"
          radius="md"
          mb="md"
        >
          <Text size="sm" mb="xs">
            {t(checks.error)}
          </Text>
          <Button variant="light" color="red" size="xs" onClick={checks.save}>
            {t("保存を再試行")}
          </Button>
        </Alert>
      )}

      <Text size="xs" c="dimmed" mb="md" role="status">
        {t("チェック状態はこの端末に")}
        {t(checks.dirty ? "保存できていません。" : "保存されます。")}
      </Text>

      {companies.length === 0 && (
        <EmptyState>{t("企業情報が登録されていません。")}</EmptyState>
      )}

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        {companies.map((company) => {
          const content = learning.find((l) => l.companyId === company.id);
          const items = content?.checklist || [];
          const count = items.filter(
            (item) => checks.value[`${company.id}:${item.id}`],
          ).length;

          return (
            <Card key={company.id} radius="lg">
              <Title order={2} size="h3" mb="xs">
                <Link to={`/companies/${company.id}`} style={{ color: "inherit", textDecoration: "none" }}>
                  {t(company.name)}
                </Link>
              </Title>
              <Title order={3} size="h5" c="dimmed" mt="sm" mb={4}>
                {t("事前に知っておきたいこと")}
              </Title>
              {content?.basics.length ? (
                <List spacing={4} size="xs" mb="sm">
                  {content.basics.map((text, i) => (
                    <List.Item key={i}>
                      <Text size="xs" c="dimmed">
                        {t(text)}
                      </Text>
                    </List.Item>
                  ))}
                </List>
              ) : (
                <Text size="xs" c="dimmed" mb="sm">
                  {t("未登録")}
                </Text>
              )}
              <Title order={3} size="h5" c="dimmed" mt="xs" mb={4}>
                {t("見学の注目ポイント")}
              </Title>
              {!company.highlights.length && (
                <Text size="xs" c="dimmed" mb="xs">
                  {t("知りたいことを事前に整理してください。")}
                </Text>
              )}
              <List spacing={4} size="xs" mb="sm">
                {company.highlights.map((text, i) => (
                  <List.Item key={i}>
                    <Text size="xs" c="dimmed">
                      {t(text)}
                    </Text>
                  </List.Item>
                ))}
              </List>
              <Title order={3} size="h5" c="dimmed" mt="xs" mb={4}>
                {t("事前質問例")}
              </Title>
              {!company.questions.length && (
                <Text size="xs" c="dimmed" mb="xs">
                  {t(
                    "資料に具体例はありません。事業概要を調べて質問を準備してください。",
                  )}
                </Text>
              )}
              <List spacing={4} size="xs" mb="sm">
                {company.questions.map((text, i) => (
                  <List.Item key={i}>
                    <Text size="xs" c="dimmed">
                      {t(text)}
                    </Text>
                  </List.Item>
                ))}
              </List>
              <Group justify="space-between" align="center" mt="md" mb="xs">
                <Title order={3} size="h5">
                  {t("学習チェックリスト")}
                </Title>
                <Badge
                  variant="light"
                  color={count === items.length && items.length > 0 ? "teal" : "blue"}
                  size="sm"
                  radius="xl"
                  style={{ fontWeight: 600 }}
                >
                  {count} / {items.length}
                </Badge>
              </Group>
              <Stack gap="xs" mt="xs" className="checklist">
                {items.map((item) => (
                  <Checkbox
                    key={item.id}
                    label={t(item.text)}
                    size="sm"
                    radius="sm"
                    color="blue"
                    checked={!!checks.value[`${company.id}:${item.id}`]}
                    onChange={(e) =>
                      checks.change(
                        `${company.id}:${item.id}`,
                        e.currentTarget.checked,
                      )
                    }
                    styles={{
                      label: { cursor: "pointer", fontSize: "0.875rem" },
                      root: { padding: "6px 8px", borderRadius: 8, background: "var(--surface-secondary)" },
                    }}
                  />
                ))}
              </Stack>
              {!items.length && (
                <Text size="xs" c="dimmed">{t("チェック項目は未登録です。")}</Text>
              )}
            </Card>
          );
        })}
      </SimpleGrid>
    </>
  );
}
