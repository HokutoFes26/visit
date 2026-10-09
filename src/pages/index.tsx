import { t, usePreferences } from "@/state/preferences";
import { Card, SectionTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { shortcuts } from "@/config/site";
import {
  announcements,
  companies,
  event,
  formatDate,
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
  ChevronRight,
  Clock3,
  MapPin,
  ShieldCheck,
  Shirt,
} from "lucide-react";
import { Link } from "react-router-dom";
export default function Home() {
  usePreferences();
  const now = useNow();
  const current = schedule.find((s) => scheduleState(s, now) === "current");
  const next = schedule.find((s) => scheduleState(s, now) === "upcoming");
  return (
    <>
      <section className="hero">
        <img
          src={assetUrl("images/company.svg")}
          alt={t("企業ビルのイラスト")}
        />
        <div className="hero-shade" />
        <div className="hero-content">
          <h1>{t("県外企業見学")}</h1>
          <div className="hero-meta">
            <span>
              <CalendarDays size={17} />
              {t("{year}年 {start}〜{end}", {
                year: event.date.slice(0, 4),
                start: formatDate(event.date),
                end: formatDate(event.endDate),
              })}
            </span>
            <span>
              <Building2 size={17} />
              {companies.length}
              {t("つの企業を訪問")}
            </span>
          </div>
          <Link className="button hero-button" to="/schedule">
            {t("見学スケジュールを見る")}
            <ArrowRight size={18} />
          </Link>
        </div>
        <span className="hero-caption">{t("建物は仮イラスト")}</span>
      </section>
      <div className="overview-grid">
        <Card className="now-card">
          <div className="card-kicker">
            <Clock3 size={17} />
            {t("スケジュール")}
          </div>
          <div className="current-plan">
            <div>
              <span className="eyebrow">
                {t(
                  current
                    ? "現在の予定"
                    : next
                      ? "次の予定"
                      : now < timestamp(event.endDate, "00:00") + 86400000
                        ? "時刻未定の予定あり"
                        : "終了",
                )}
              </span>
              <h2>
                {t(
                  (current || next)?.title ||
                    (now < timestamp(event.endDate, "00:00") + 86400000
                      ? "詳細はスケジュールを確認"
                      : "見学日程は終了しました"),
                )}
              </h2>
              <p className="meta">
                <MapPin size={15} />
                {t((current || next)?.location || "")}
              </p>
            </div>
            {(current || next) && (
              <div className="plan-time">
                <strong>{t((current || next)!.startTime)}</strong>
                {(current || next)!.endTime && (
                  <span>
                    — {t((current || next)!.endTime)}
                    {t((current || next)!.id === "train" ? "頃" : "")}
                  </span>
                )}
              </div>
            )}
          </div>
          {(current || next)?.travelMinutes ? (
            <p className="meta">
              {t("移動時間：約")}
              {t((current || next)!.travelMinutes)}
              {t("分")}
            </p>
          ) : null}
          <div className="card-bottom">
            <span>
              {t(
                current
                  ? next
                    ? t("次：{time} {title}", {
                        time: next.startTime || "",
                        title: t(next.title),
                      })
                    : "本日の最後の予定です"
                  : next
                    ? t("{date}の予定です", { date: formatDate(next.date) })
                    : "",
              )}
            </span>
            <Link to="/schedule" aria-label={t("スケジュール詳細")}>
              <ArrowRight size={20} />
            </Link>
          </div>
        </Card>
        <Link to="/guide" className="meeting-card glass-card">
          <div className="card-kicker">
            <MapPin size={17} />
            {t("集合場所")}
            <ArrowUpRight size={18} />
          </div>
          <p>{t(event.meetingPlace)}</p>
          <div className="meeting-time">
            <strong>{t(event.meetingTime)}</strong>
            <span>
              {t("集合")}
              <span>{t(event.arrivalNote)}</span>
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
              <strong>{t(title)}</strong>
            </span>
            <ChevronRight size={16} />
          </Link>
        ))}
      </div>
      <div className="home-bottom">
        <Card>
          <SectionTitle title={t("出発前のチェック")} to="/guide" />
          <div className="check-items">
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
          </div>
          <p className="quiet-note">
            <ShieldCheck size={15} />
            {t("安全のため、現地スタッフの案内に従ってください。")}
          </p>
        </Card>
        <Card>
          <SectionTitle title={t("大切なお知らせ")} to="/announcements" />
          {announcements
            .filter((a) => a.importance === "high")
            .map((a) => (
              <Link
                className="announcement-mini"
                to="/announcements"
                key={a.id}
              >
                <span className="badge">{t("重要")}</span>
                <strong>{t(a.title)}</strong>
                <ArrowUpRight size={17} />
              </Link>
            ))}
        </Card>
      </div>
    </>
  );
}
