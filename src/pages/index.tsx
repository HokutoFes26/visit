import { t, usePreferences } from "@/state/preferences";
import {
  Box,
  Card,
  Group,
  SectionTitle,
  Text,
  ThemeIcon,
  Title,
  PageTitle,
} from "@/components/ui";
import { shortcuts } from "@/config/site";
import {
  announcements,
  companies,
  event,
  formatDate,
  formatTime,
  timestamp,
  guide,
  schedule,
  scheduleState,
} from "@/data";
import { useNow } from "@/hooks/useNow";
import {
  ArrowRight,
  ArrowUpRight,
  Backpack,
  Building2,
  CalendarDays,
  Compass,
  Bell,
  Clock3,
  MapPin,
  ShieldCheck,
  Shirt,
} from "lucide-react";
import { Badge } from "@mantine/core";
import { Link } from "react-router-dom";
import { ScheduleContent } from "@/pages/schedule";
import "@/styles/home.css";
import "@/styles/schedule.css";

export default function Home() {
  usePreferences();
  const now = useNow();
  const current = schedule.find((s) => scheduleState(s, now) === "current");
  const next = schedule.find((s) => scheduleState(s, now) === "upcoming");

  const handleScheduleClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined" && window.innerWidth > 850) {
      const scheduleCol = document.getElementById("home-schedule-col");
      if (scheduleCol) {
        e.preventDefault();
        scheduleCol.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="home-layout">
      <div className="home-left-col">
        <PageTitle title={t("ホーム")} />
        <div
          style={{
            display: "flex",
            gap: 20,
            flexDirection: "column",
            marginBottom: 12,
          }}
        >
          <Box className="overview-grid">
            <Card
              padding="lg"
              radius="lg"
              withBorder
              className="now-card glass-card"
              style={{
                backgroundColor: "var(--foreground)",
                color: "var(--surface)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div>
                <Group justify="space-between" align="center" mb="xs">
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" color="gray" variant="light">
                      <Clock3 size={14} />
                    </ThemeIcon>
                    <Title order={2} size="h4" fw={700}>
                      {t("次のアクション")}
                    </Title>
                  </Group>
                </Group>

                <div style={{ margin: "10px 0" }}>
                  <Text
                    size="xs"
                    fw={700}
                    c="dimmed"
                    tt="uppercase"
                    lts={1}
                    mb={2}
                  >
                    {t(current ? "現在の予定" : next ? "次の予定" : "ステータス")}
                  </Text>
                  <Group
                    justify="space-between"
                    align="baseline"
                    wrap="wrap"
                    gap="sm"
                    mb={6}
                  >
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
                        {(current || next)!.endTime &&
                          ` — ${formatTime((current || next)!.endTime)}`}
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
              </div>

              <div
                style={{
                  paddingTop: 12,
                  borderTop: "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  fontSize: "12px",
                }}
              >
                <span style={{ opacity: 0.75 }}>
                  {t(
                    current
                      ? next
                        ? t("次：{time} {title}", {
                          time: formatTime(next.startTime) || "",
                          title: t(next.title),
                        })
                        : "本日の最後の予定"
                      : next
                        ? t("{date}の予定", { date: formatDate(next.date) })
                        : "",
                  )}
                </span>
                <Link
                  to="/schedule"
                  onClick={handleScheduleClick}
                  style={{
                    color: "inherit",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontWeight: 600,
                  }}
                  aria-label={t("スケジュール詳細")}
                >
                  <span>{t("詳細")}</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </Card>
          </Box>

          {announcements.some((a) => a.importance === "high") && (
            <Box
              component="section"
              className="priority-notices"
              aria-label={t("大切なお知らせ")}
            >
              <Box className="priority-label">
                <Bell size={18} />
                <strong>{t("大切なお知らせ")}</strong>
              </Box>
              {announcements
                .filter((a) => a.importance === "high")
                .map((a) => (
                  <Link to="/announcements" key={a.id}>
                    <Badge size="sm" radius="xl" c="var(--accent-neon)">
                      {t("重要")}
                    </Badge>
                    <span>{t(a.title)}</span>
                    <ArrowRight size={18} />
                  </Link>
                ))}
            </Box>
          )}

          <Box className="shortcut-grid">
            {shortcuts.map(({ to, title, icon: Icon, color }) => (
              <Link
                to={to}
                className="shortcut glass-card"
                key={to}
                onClick={to === "/schedule" ? handleScheduleClick : undefined}
              >
                <span className={`shortcut-icon ${color}`}>
                  <Icon size={23} />
                </span>
                <span>
                  <strong>{t(title)}</strong>
                </span>
                <ArrowUpRight size={18} />
              </Link>
            ))}
          </Box>

          <Card>
            <SectionTitle title={t("出発前のチェック")} to="/guide" />
            <Box className="check-items">
              <div>
                <Backpack size={20} />
                <span>
                  <strong>{t("持ち物")}</strong>
                  <small>{t(guide.belongings[0])}</small>
                </span>
              </div>
              <div>
                <Shirt size={20} />
                <span>
                  <strong>{t("服装")}</strong>
                  <small>{t(guide.clothing[0])}</small>
                </span>
              </div>
            </Box>
          </Card>
        </div>
      </div>

      <div className="home-right-col" id="home-schedule-col">
        <ScheduleContent showTitle={true} />
      </div>
    </div>
  );
}
