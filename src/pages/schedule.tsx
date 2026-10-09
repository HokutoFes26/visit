import { t, usePreferences } from "@/state/preferences";
import Timeline from "@/components/Timeline";
import { PageTitle } from "@/components/ui";
import { event, formatDate, schedule } from "@/data";
import { useNow } from "@/hooks/useNow";
import { Info } from "lucide-react";
import { useState } from "react";
export default function SchedulePage() {
  usePreferences();
  const days = [...new Set(schedule.map((s) => s.date))];
  const [day, setDay] = useState(() => {
    const today = new Intl.DateTimeFormat("sv-SE", {
      timeZone: "Asia/Tokyo",
    }).format(new Date());
    return days.includes(today) ? today : days[0] || event.date;
  });
  const now = useNow();
  return (
    <>
      <PageTitle title={t("スケジュール")} />
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
      <p className="quiet-note">
        <Info size={16} />
        {t("現在の予定は端末の日時をもとに表示します。")}
      </p>
      <Timeline items={schedule.filter((s) => s.date === day)} now={now} />
    </>
  );
}
