import { Card,SectionTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { shortcuts } from "@/config/site";
import {
announcements,
companies,
event,
formatDate,
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
ChevronRight,
Clock3,
MapPin,
ShieldCheck,
Shirt,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function Home() {
  const now = useNow();
  const current = schedule.find((s) => scheduleState(s, now) === "current");
  const next = schedule.find((s) => scheduleState(s, now) === "upcoming");
  return (
    <>
      <section className="hero">
        <img src={assetUrl("images/factory.svg")} alt="工場建物の仮イラスト" />
        <div className="hero-shade" />
        <div className="hero-content">
          <h1>工場見学</h1>
          <div className="hero-meta">
            <span>
              <CalendarDays size={17} />
              {event.date.slice(0, 4)}年 {formatDate(event.date)}
            </span>
            <span>
              <Building2 size={17} />
              {companies.length}つの企業を訪問
            </span>
          </div>
          <Link className="button hero-button" to="/schedule">
            見学スケジュールを見る
            <ArrowRight size={18} />
          </Link>
        </div>
        <span className="hero-caption">SAMPLE PROGRAM / 仮イメージ</span>
      </section>
      <div className="overview-grid">
        <Card className="now-card">
          <div className="card-kicker">
            <Clock3 size={17} /> スケジュール
          </div>
          <div className="current-plan">
            <div>
              <span className="eyebrow">
                {current ? "現在の予定" : next ? "次の予定" : "終了"}
              </span>
              <h2>
                {(current || next)?.title || "すべての予定が終了しました"}
              </h2>
              <p className="meta">
                <MapPin size={15} />
                {(current || next)?.location || ""}
              </p>
            </div>
            {(current || next) && (
              <div className="plan-time">
                <strong>{(current || next)!.startTime}</strong>
                <span>— {(current || next)!.endTime}</span>
              </div>
            )}
          </div>
          {(current || next)?.travelMinutes ? (
            <p className="meta">
              移動時間：約{(current || next)!.travelMinutes}分
            </p>
          ) : null}
          <div className="card-bottom">
            <span>
              {current
                ? next
                  ? `次：${next.startTime} ${next.title}`
                  : "本日の最後の予定です"
                : next
                  ? `${formatDate(next.date)}の予定です`
                  : ""}
            </span>
            <Link to="/schedule" aria-label="スケジュール詳細">
              <ArrowRight size={20} />
            </Link>
          </div>
        </Card>
        <Link to="/guide" className="meeting-card glass-card">
          <div className="card-kicker">
            <MapPin size={17} /> 集合場所 <ArrowUpRight size={18} />
          </div>
          <p>{event.meetingPlace}</p>
          <div className="meeting-time">
            <strong>{event.meetingTime}</strong>
            <span>
              集合<span>{event.arrivalNote}</span>
            </span>
          </div>
        </Link>
      </div>
      <div className="shortcut-grid">
        {shortcuts.map(({ to, title, icon: Icon, color }) => (
          <Link to={to} className="shortcut glass-card" key={to}>
            <span className={`shortcut-icon ${color}`}>
              <Icon size={23} />
            </span>
            <span>
              <strong>{title}</strong>
            </span>
            <ChevronRight size={16} />
          </Link>
        ))}
      </div>
      <div className="home-bottom">
        <Card>
          <SectionTitle title="出発前のチェック" to="/guide" />
          <div className="check-items">
            <div>
              <Backpack size={20} />
              <span>
                <strong>持ち物</strong>
                <small>{guide.belongings.slice(0, 2).join("・")}</small>
              </span>
            </div>
            <div>
              <Shirt size={20} />
              <span>
                <strong>服装</strong>
                <small>{guide.clothing[0]}</small>
              </span>
            </div>
          </div>
          <p className="quiet-note">
            <ShieldCheck size={15} />
            安全のため、現地スタッフの案内に従ってください。
          </p>
        </Card>
        <Card>
          <SectionTitle title="大切なお知らせ" to="/announcements" />
          {announcements
            .filter((a) => a.importance === "high")
            .map((a) => (
              <Link
                className="announcement-mini"
                to="/announcements"
                key={a.id}
              >
                <span className="badge">重要</span>
                <strong>{a.title}</strong>
                <ArrowUpRight size={17} />
              </Link>
            ))}
        </Card>
      </div>
    </>
  );
}
