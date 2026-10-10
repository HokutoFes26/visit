import { t, usePreferences } from "@/state/preferences";
import { assetUrl } from "@/config/assets";
import { Badge, Card, Group, Stack, Text, Title, Box } from "@mantine/core";
import { ArrowUpRight, Bus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { companies, formatTime, scheduleState, type Schedule } from "../data";

export default function Timeline({
  items,
  now,
  showCompany = true,
}: {
  items: Schedule[];
  now: number;
  showCompany?: boolean;
}) {
  usePreferences();
  return (
    <div className="timeline">
      {items.length === 0 ? (
        <Text c="dimmed">{t("この日の予定はまだ登録されていません。")}</Text>
      ) : (
        items.map((item) => {
          const state = scheduleState(item, now);
          const company = companies.find((c) => c.id === item.companyId);
          return (
            <article className={`timeline-item ${state}`} key={item.id}>
              <div className="timeline-time">
                <strong>{item.startTime ? formatTime(item.startTime) : t("未定")}</strong>
                {item.endTime && (
                  <span>
                    {formatTime(item.endTime)}
                    {t(item.id === "train" ? "頃" : "")}
                  </span>
                )}
              </div>
              <div className="timeline-dot" />
              <Card padding="lg" radius={0} withBorder={false} className="timeline-content">
                {state === "current" && (
                  <Box mb="xs">
                    <Badge
                      color="lime"
                      variant="light"
                      size="sm"
                      radius="xl"
                      style={{
                        fontWeight: 700,
                        backgroundColor: "var(--accent-bg)",
                        color: "var(--accent)",
                        borderColor: "var(--accent-border)",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: 6,
                          height: 6,
                          borderRadius: "50%",
                          backgroundColor: "var(--accent-neon)",
                          marginRight: 6,
                          boxShadow: "0 0 6px var(--accent-neon)",
                        }}
                      />
                      {t("現在の予定")}
                    </Badge>
                  </Box>
                )}
                <Title order={3} size="h4" mb={4}>
                  {t(item.title)}
                </Title>
                {item.timeNote && (
                  <p className="quiet-note">{t(item.timeNote)}</p>
                )}
                <Group gap={6} mb="xs">
                  <MapPin size={14} color="var(--accent-neon)" />
                  <Text size="xs" c="dimmed">
                    {t(item.location)}
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" mb="sm">
                  {t(item.description)}
                </Text>
                {item.transport && (
                  <Box mb="xs">
                    <Badge
                      color="gray"
                      variant="light"
                      size="md"
                      radius="xl"
                      style={{ fontWeight: 600 }}
                      leftSection={<Bus size={12} />}
                    >
                      {t(item.transport)}
                      {t(
                        item.travelMinutes > 0
                          ? t(" · 約{minutes}分", { minutes: item.travelMinutes })
                          : "",
                      )}
                    </Badge>
                  </Box>
                )}
                {showCompany && company && (
                  <Link
                    className="company-inline"
                    to={`/companies/${company.id}`}
                  >
                    <img
                      src={assetUrl(company.image)}
                      alt={t("仮イラスト（実際の訪問先とは異なります）")}
                    />
                    <span>
                      {t(company.name)}
                      <small>{t("企業紹介を見る")}</small>
                    </span>
                    <ArrowUpRight size={18} />
                  </Link>
                )}
              </Card>
            </article>
          );
        })
      )}
    </div>
  );
}
