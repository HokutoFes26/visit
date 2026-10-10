import { t, usePreferences } from "@/state/preferences";
import {
  Badge,
  Box,
  Button,
  Card,
  Grid,
  Group,
  SimpleGrid,
  Stack,
  Tabs,
  Text,
  ThemeIcon,
  Title,
  PageTitle
} from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { shortcuts } from "@/config/site";
import {
  announcements,
  companies,
  event,
  formatDate,
  formatTime,
  guide,
  schedule,
  scheduleState,
  timestamp,
  type Schedule,
} from "@/data";
import { useNow } from "@/hooks/useNow";
import {
  ArrowRight,
  ArrowUpRight,
  Building2,
  Bus,
  CalendarDays,
  ChevronRight,
  Clock3,
  Compass,
  Footprints,
  LayoutDashboard,
  MapPin,
  Navigation,
  ShieldCheck,
  Train,
  TrainFront,
} from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
  usePreferences();
  const now = useNow();
  const days = [...new Set(schedule.map((s) => s.date))];
  const [selectedDay, setSelectedDay] = useState(() => {
    const today = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Tokyo",
    }).format(new Date());
    return days.includes(today) ? today : days[0] || event.date;
  });

  const daySchedule = schedule.filter((s) => s.date === selectedDay);
  const current = schedule.find((s) => scheduleState(s, now) === "current");
  const next = schedule.find((s) => scheduleState(s, now) === "upcoming");
  const activeStep = current || next || daySchedule[0];

  function getStepIcon(item: Schedule) {
    if (item.transport === "新幹線" || item.id === "train") return TrainFront;
    if (item.transport === "電車") return Train;
    if (item.transport === "バス") return Bus;
    if (item.companyId) return Building2;
    if (item.id.includes("meet") || item.id.includes("arrival")) return MapPin;
    return Footprints;
  }

  const stops = daySchedule
    .filter((s) => s.location && !s.location.includes("東京都内"))
    .map((s) => s.location.split(" → ")[0]);
  const uniqueStops = [...new Set(stops)];


  const timelineNode = (
    <Card padding="lg" radius="lg" withBorder className="glass-card" style={{ height: "100%" }}>
      <Box mb="md">
        <Tabs
          value={selectedDay}
          onChange={(val) => val && setSelectedDay(val)}
          variant="pills"
          radius="xl"
          color="dark"
        >
          <Tabs.List
            style={{
              background: "var(--surface-secondary)",
              padding: 3,
              borderRadius: 8,
              border: "1px solid var(--border)",
              width: "fit-content",
              maxWidth: "100%",
            }}
          >
            {days.map((d, index) => (
              <Tabs.Tab
                key={d}
                value={d}
                style={{
                  fontWeight: 600,
                  fontSize: "0.8125rem",
                  padding: "6px 14px",
                  borderRadius: 6,
                }}
              >
                <span>Day {index + 1}</span>
                <span className="tab-date-suffix"> ({formatDate(d).replace("月", "/").replace("日", "")})</span>
              </Tabs.Tab>
            ))}
          </Tabs.List>
        </Tabs>
      </Box>

      <Group justify="space-between" align="center" mb="md" pb="xs" style={{ borderBottom: "1px solid var(--border)" }}>
        <Group gap="xs">
          <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
            <Navigation size={14} />
          </ThemeIcon>
          <Text size="sm" fw={700}>
            {t("ルート案内")}
          </Text>
        </Group>
        <Badge variant="light" color="blue" size="sm" radius="xl">
          {daySchedule.length} {t("スポット")}
        </Badge>
      </Group>

      {uniqueStops.length > 0 && (
        <Group
          gap="xs"
          mb="lg"
          p="xs"
          style={{
            background: "var(--surface-secondary)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            overflowX: "auto",
          }}
        >
          <Text size="xs" fw={700} c="dimmed" style={{ whiteSpace: "nowrap" }}>
            {t("経由:")}
          </Text>
          {uniqueStops.map((stop, i) => (
            <Group key={i} gap={4} style={{ whiteSpace: "nowrap" }}>
              <Badge variant="light" color="blue" size="xs" radius="xl">
                {t(stop)}
              </Badge>
              {i < uniqueStops.length - 1 && (
                <Text size="xs" c="dimmed">
                  →
                </Text>
              )}
            </Group>
          ))}
        </Group>
      )}

      <div className="google-transit-timeline">
        {daySchedule.map((item) => {
          const state = scheduleState(item, now);
          const company = companies.find((c) => c.id === item.companyId);
          const IconComponent = getStepIcon(item);

          return (
            <div className={`transit-item ${state}`} key={item.id}>
              <div className="transit-time">
                <span>{item.startTime ? formatTime(item.startTime) : t("未定")}</span>
                {item.endTime && (
                  <Text size="10px" c="dimmed" style={{ display: "block", marginTop: -2 }}>
                    {formatTime(item.endTime)}
                  </Text>
                )}
              </div>

              <div className="transit-node">
                <IconComponent size={14} />
              </div>

              <div className="transit-body">
                <Group gap="xs" align="center" mb={2}>
                  <Text size="sm" fw={700} style={{ color: "var(--foreground)" }}>
                    {t(item.title)}
                  </Text>
                  {state === "current" && (
                    <Badge
                      variant="light"
                      color="lime"
                      size="xs"
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
                          width: 5,
                          height: 5,
                          borderRadius: "50%",
                          backgroundColor: "var(--accent-neon)",
                          marginRight: 5,
                          boxShadow: "0 0 6px var(--accent-neon)",
                        }}
                      />
                      {t("現在の予定")}
                    </Badge>
                  )}
                </Group>

                {item.location && (
                  <Group gap={4} mb={4}>
                    <MapPin size={12} color="var(--muted)" />
                    <Text size="xs" c="dimmed">
                      {t(item.location)}
                    </Text>
                  </Group>
                )}

                {item.description && (
                  <Text size="xs" c="dimmed" mb={4}>
                    {t(item.description)}
                  </Text>
                )}

                {item.transport && (
                  <Badge
                    variant="light"
                    color="gray"
                    size="xs"
                    radius="xl"
                    mt={4}
                    leftSection={<Bus size={10} />}
                  >
                    {t(item.transport)}
                    {t(
                      item.travelMinutes > 0
                        ? t(" · 約{minutes}分", { minutes: item.travelMinutes })
                        : "",
                    )}
                  </Badge>
                )}

                {company && (
                  <Link
                    className="transit-company-card"
                    to={`/companies/${company.id}`}
                  >
                    <img
                      src={assetUrl(company.image)}
                      alt={t("仮イラスト（実際の訪問先とは異なります）")}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Text size="xs" fw={700} truncate>
                        {t(company.name)}
                      </Text>
                      <Text size="10px" c="dimmed">
                        {t("企業紹介を見る")}
                      </Text>
                    </div>
                    <ArrowUpRight size={14} color="var(--muted)" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <Box mt="md" pt="xs" style={{ borderTop: "1px solid var(--border)", textAlign: "right" }}>
        <Link
          to="/schedule"
          style={{
            fontSize: "0.8125rem",
            color: "var(--foreground)",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: 4,
          }}
        >
          {t("見学スケジュールを見る")}
          <ArrowRight size={14} />
        </Link>
      </Box>
    </Card>
  );

  const dashboardNode = (
    <Stack gap="md">
      <Card padding="lg" radius="lg" withBorder className="glass-card" style={{ backgroundColor: "var(--foreground)", color: "var(--surface)" }}>
        <Group justify="space-between" align="center" mb="xs">
          <Group gap="xs">
            <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
              <Clock3 size={14} />
            </ThemeIcon>
            <Title order={2} size="h4" fw={700}>
              {t("次のアクション")}
            </Title>
          </Group>
          <Link
            to="/schedule"
            style={{
              fontSize: "0.8125rem",
              color: "var(--border)",
              display: "inline-flex",
              alignItems: "center",
              gap: 4,
              fontWeight: 600,
            }}
          >
            {t("詳しく見る")}
            <ArrowUpRight size={14} />
          </Link>
        </Group>

        <div style={{ margin: "10px 0" }}>
          <Text size="xs" fw={700} c="dimmed" tt="uppercase" lts={1} mb={2}>
            {t(
              current
                ? "現在の予定"
                : next
                  ? "次の予定"
                  : "ステータス",
            )}
          </Text>
          <Group justify="space-between" align="baseline" wrap="wrap" gap="sm" mb={6}>
            <Title order={3} size="h3" fw={700} style={{ margin: 0 }}>
              {t(
                (current || next)?.title ||
                (now < timestamp(event.endDate, "00:00") + 86400000
                  ? "詳細はスケジュールを確認"
                  : "見学日程は終了しました"),
              )}
            </Title>
            {(current || next)?.startTime && (
              <Title
                order={2}
                size="h2"
                fw={700}
                style={{
                  whiteSpace: "nowrap",
                }}
              >
                {formatTime((current || next)!.startTime)}
                {(current || next)!.endTime && ` — ${formatTime((current || next)!.endTime)}`}
              </Title>
            )}
          </Group>
          <Group gap={4}>
            <MapPin size={14} color="var(--muted)" />
            <Text size="xs" c="dimmed">
              {t((current || next)?.location || event.meetingPlace)}
            </Text>
          </Group>
        </div>
      </Card>

      <SimpleGrid cols={{ base: 2, sm: 2 }} spacing={{ base: "xs", sm: "md" }}>
        <Card
          padding="sm"
          radius="lg"
          withBorder
          className="glass-card"
          style={{ display: "flex", flexDirection: "column", height: "100%", minWidth: 0 }}
        >
          <Group justify="space-between" align="center" mb="xs" wrap="nowrap">
            <Title
              order={2}
              size="h4"
              fw={700}
              style={{
                fontSize: "0.875rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t("お知らせ")}
            </Title>
            <Link
              to="/announcements"
              style={{
                color: "var(--foreground)",
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              aria-label={t("お知らせ")}
            >
              <ArrowUpRight size={14} />
            </Link>
          </Group>
          <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            {announcements
              .filter((a) => a.importance === "high")
              .map((a) => (
                <Link
                  className="announcement-mini"
                  to="/announcements"
                  key={a.id}
                  style={{
                    padding: "6px 8px",
                    background: "var(--surface-secondary)",
                    borderRadius: 8,
                    border: "1px solid var(--border)",
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    minWidth: 0,
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  <Badge
                    color="red"
                    variant="light"
                    size="xs"
                    radius="xl"
                    style={{ flexShrink: 0, padding: "0 4px", fontSize: "10px", height: 16 }}
                  >
                    {t("重要")}
                  </Badge>
                  <Text size="xs" fw={600} truncate style={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}>
                    {t(a.title)}
                  </Text>
                  <ArrowUpRight size={12} color="var(--muted)" style={{ flexShrink: 0 }} />
                </Link>
              ))}
          </Stack>
        </Card>

        <Card
          padding="sm"
          radius="lg"
          withBorder
          className="glass-card"
          style={{ display: "flex", flexDirection: "column", height: "100%", minWidth: 0 }}
        >
          <Group justify="space-between" align="center" mb="xs" wrap="nowrap">
            <Title
              order={2}
              size="h4"
              fw={700}
              style={{
                fontSize: "0.875rem",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {t("チェック")}
            </Title>
            <Link
              to="/guide"
              style={{
                color: "var(--foreground)",
                display: "inline-flex",
                alignItems: "center",
                flexShrink: 0,
              }}
              aria-label={t("チェック")}
            >
              <ArrowUpRight size={14} />
            </Link>
          </Group>
          <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
            <Link
              className="announcement-mini"
              to="/guide"
              style={{
                padding: "6px 8px",
                background: "var(--surface-secondary)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Badge
                color="gray"
                variant="light"
                size="xs"
                radius="xl"
                style={{ flexShrink: 0, padding: "0 4px", fontSize: "10px", height: 16 }}
              >
                {t("持ち物")}
              </Badge>
              <Text size="xs" fw={600} truncate style={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}>
                {t(guide.belongings[0])}
              </Text>
              <ArrowUpRight size={12} color="var(--muted)" style={{ flexShrink: 0 }} />
            </Link>
            <Link
              className="announcement-mini"
              to="/guide"
              style={{
                padding: "6px 8px",
                background: "var(--surface-secondary)",
                borderRadius: 8,
                border: "1px solid var(--border)",
                display: "flex",
                alignItems: "center",
                gap: 6,
                minWidth: 0,
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <Badge
                color="gray"
                variant="light"
                size="xs"
                radius="xl"
                style={{ flexShrink: 0, padding: "0 4px", fontSize: "10px", height: 16 }}
              >
                {t("服装")}
              </Badge>
              <Text size="xs" fw={600} truncate style={{ flex: 1, minWidth: 0, fontSize: "0.75rem" }}>
                {t(guide.clothing[0])}
              </Text>
              <ArrowUpRight size={12} color="var(--muted)" style={{ flexShrink: 0 }} />
            </Link>
          </Stack>
        </Card>
      </SimpleGrid>

      <Card padding="lg" radius="lg" withBorder className="glass-card">
        <Title order={2} size="h4" fw={700} mb="sm">
          {t("その他アクション")}
        </Title>
        <div className="shortcut-grid" style={{ gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {shortcuts.map(({ to, title, icon: Icon, color }) => (
            <Link
              to={to}
              className="shortcut"
              key={to}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "10px 12px",
                borderRadius: 12,
                background: "var(--surface-secondary)",
                border: "1px solid var(--border)",
                transition: "all 0.15s ease",
              }}
            >
              <span className={`shortcut-icon ${color}`} style={{ width: 32, height: 32, borderRadius: 8 }}>
                <Icon size={16} />
              </span>
              <span>
                <strong style={{ fontSize: "12px" }}>{t(title)}</strong>
              </span>
              <ChevronRight size={13} color="var(--muted)" />
            </Link>
          ))}
        </div>
      </Card>
    </Stack>
  );

  return (
    <div style={{ maxWidth: "100%", minWidth: 0, overflow: "hidden" }}>
      <PageTitle title={t("県外企業見学")} />

      <Box visibleFrom="md">
        <Grid gap="xl" align="flex-start">
          <Grid.Col span={7}>{timelineNode}</Grid.Col>
          <Grid.Col span={5}>{dashboardNode}</Grid.Col>
        </Grid>
      </Box>

      <Box hiddenFrom="md">
        {dashboardNode}
      </Box>
    </div>
  );
}
