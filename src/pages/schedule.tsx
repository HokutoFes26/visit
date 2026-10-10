import { t, usePreferences } from "@/state/preferences";
import Timeline from "@/components/Timeline";
import { PageTitle } from "@/components/ui";
import { event, formatDate, schedule, scheduleState } from "@/data";
import { useNow } from "@/hooks/useNow";
import { Info } from "lucide-react";
import { useRef, useState } from "react";
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
  const gesture = useRef<{id: number; x: number; y: number; day: string} | null>(null);
  const suppressClick = useRef(false);
  return (
    <section className="schedule-swipe"
      onPointerDown={(e) => {
        suppressClick.current = false;
        if (e.pointerType !== "touch" || !e.isPrimary) return;
        gesture.current = {id:e.pointerId,x:e.clientX,y:e.clientY,day};
      }}
      onPointerMove={(e) => {
        const start = gesture.current;
        if (!start || start.id !== e.pointerId) return;
        const dx=e.clientX-start.x, dy=e.clientY-start.y;
        if (Math.abs(dy)>16 && Math.abs(dy)>Math.abs(dx)) {gesture.current=null;return;}
        if (Math.abs(dx)>16 && Math.abs(dx)>Math.abs(dy)*1.5) {
          suppressClick.current=true;
          e.currentTarget.setPointerCapture(e.pointerId);
        }
      }}
      onPointerUp={(e) => {
        const start=gesture.current;
        gesture.current=null;
        if (!start || start.id!==e.pointerId || start.day!==day) return;
        const dx=e.clientX-start.x, dy=e.clientY-start.y;
        if (Math.abs(dx)<48 || Math.abs(dx)<=Math.abs(dy)*1.5) return;
        suppressClick.current=true;
        const next=days.indexOf(day)+(dx<0?1:-1);
        if (next>=0 && next<days.length) {
          setDay(days[next]);
          requestAnimationFrame(()=>document.querySelector('.day-tabs')?.scrollIntoView({block:'start',behavior:'instant'}));
        }
      }}
      onPointerCancel={()=>{gesture.current=null;}}
      onClickCapture={(e)=>{
        if (suppressClick.current && e.detail!==0) {e.preventDefault();e.stopPropagation();}
        suppressClick.current=false;
      }}
    >
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
      {schedule.some((item) => scheduleState(item, now) === "current") && (
        <button
          className="button secondary jump-current"
          onClick={() => {
            const current = schedule.find(
              (item) => scheduleState(item, now) === "current",
            );
            if (current) setDay(current.date);
            requestAnimationFrame(() => {
              const target = document.querySelector<HTMLElement>(
                ".timeline-item.current",
              );
              target?.focus({ preventScroll: true });
              target?.scrollIntoView({ block: "center", behavior: "instant" });
            });
          }}
        >
          {t("現在の予定へ")}
        </button>
      )}
      <Timeline items={schedule.filter((s) => s.date === day)} now={now} />
    </section>
  );
}
