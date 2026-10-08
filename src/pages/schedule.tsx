import Timeline from "@/components/Timeline";
import { PageTitle } from "@/components/ui";
import { event,formatDate,schedule } from "@/data";
import { useNow } from "@/hooks/useNow";
import { Info } from "lucide-react";
import { useState } from "react";
export default function SchedulePage() {
  const days = [...new Set(schedule.map((s) => s.date))];
  const [day, setDay] = useState(days[0] || event.date);
  const now = useNow();
  return (
    <>
      <PageTitle title="スケジュール" />
      <div className="day-tabs" aria-label="見学日">
        {days.map((d) => (
          <button
            key={d}
            className={day === d ? "selected" : ""}
            aria-pressed={day === d}
            onClick={() => setDay(d)}
          >
            {formatDate(d)}
          </button>
        ))}
      </div>
      <p className="quiet-note">
        <Info size={16} />
        現在の予定は端末の日時をもとに表示します。
      </p>
      <Timeline items={schedule.filter((s) => s.date === day)} now={now} />
    </>
  );
}
