import { t, usePreferences } from "@/state/preferences";
import Timeline from "@/components/Timeline";
import {
  Badge,
  Box,
  Collapse,
  Divider,
  Group,
  PageTitle,
  Stack,
  Text,
  UnstyledButton,
} from "@/components/ui";
import { event, formatDate, schedule } from "@/data";
import { useNow } from "@/hooks/useNow";
import { ChevronDown, Info, Navigation } from "lucide-react";
import { useState } from "react";
import "@/styles/schedule.css";

export function ScheduleContent({
  showTitle = true,
}: {
  showTitle?: boolean;
}) {
  usePreferences();
  const days = [...new Set(schedule.map((s) => s.date))];
  const [day, setDay] = useState(() => {
    const today = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Tokyo",
    }).format(new Date());
    return days.includes(today) ? today : days[0] || event.date;
  });
  const now = useNow();
  const [stopsOpened, setStopsOpened] = useState(false);

  const daySchedule = schedule.filter((s) => s.date === day);
  const stops = daySchedule
    .filter((s) => s.location && !s.location.includes("東京都内"))
    .map((s) => s.location.split(" → ")[0]);
  const uniqueStops = [...new Set(stops)];

  return (
    <div className="schedule-content">
      {showTitle && <PageTitle title={t("スケジュール")} />}
      <div className="day-tabs" aria-label={t("見学日")}>
        {days.map((d) => (
          <button
            key={d}
            className={day === d ? "selected" : ""}
            aria-pressed={day === d}
            aria-label={t(formatDate(d))}
            onClick={() => setDay(d)}
          >
            {t(formatDate(d).replace("月", "/").replace("日", ""))}
          </button>
        ))}
      </div>

      {uniqueStops.length > 0 && (
        <Box
          style={{
            background: "var(--surface-secondary)",
            borderRadius: 12,
            border: "1px solid var(--border)",
            overflow: "hidden",
            marginBottom: 16,
          }}
        >
          <UnstyledButton
            onClick={() => setStopsOpened((prev) => !prev)}
            aria-expanded={stopsOpened}
            style={{
              width: "100%",
              padding: "10px 14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              cursor: "pointer",
            }}
          >
            <Group gap="xs" align="center">
              <Navigation size={14} style={{ color: "var(--accent-neon)" }} />
              <Text size="sm" fw={600}>
                {t("経由地")} : {uniqueStops.length}
              </Text>
            </Group>
            <ChevronDown
              size={15}
              style={{
                color: "var(--text-sub-color)",
                transform: stopsOpened ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 200ms ease",
              }}
            />
          </UnstyledButton>

          <Collapse expanded={stopsOpened}>
            <Box px="md" pb="sm" pt={0}>
              <Divider mb="sm" style={{ borderColor: "var(--border)" }} />
              <Stack gap={6} align="flex-start">
                {uniqueStops.map((stop, i) => (
                  <Badge
                    key={i}
                    variant="light"
                    color="var(--accent)"
                    size="sm"
                    radius="xl"
                  >
                    {t(stop)}
                  </Badge>
                ))}
              </Stack>
            </Box>
          </Collapse>
        </Box>
      )}

      <Timeline items={daySchedule} now={now} />
    </div>
  );
}

export default function SchedulePage() {
  return <ScheduleContent showTitle={true} />;
}
