import { t, usePreferences } from "@/state/preferences";
import { assetUrl } from "@/config/assets";
import { ArrowUpRight, Bus, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { companies, scheduleState, type Schedule } from "../data";
export default function Timeline({
  items,
  now,
}: {
  items: Schedule[];
  now: number;
}) {
  usePreferences();
  return (
    <div className="timeline">
      {items.length === 0 ? (
        <p>{t("この日の予定はまだ登録されていません。")}</p>
      ) : (
        items.map((item) => {
          const state = scheduleState(item, now);
          const company = companies.find((c) => c.id === item.companyId);
          return (
            <article
              className={`timeline-item ${state}`}
              key={item.id}
              tabIndex={-1}
            >
              <div className="timeline-time">
                <strong>{t(item.startTime || "未定")}</strong>
                {item.endTime && (
                  <span>
                    {t(item.endTime)}
                    {t(item.id === "train" ? "頃" : "")}
                  </span>
                )}
              </div>
              <div className="timeline-dot" />
              <div className="glass-card timeline-content">
                {state === "current" && (
                  <span className="badge blue">{t("現在の予定")}</span>
                )}
                <h2>{t(item.title)}</h2>
                {item.timeNote && (
                  <p className="quiet-note">{t(item.timeNote)}</p>
                )}
                <p className="meta">
                  {t(item.date.slice(5).replace("-", "/"))}
                </p>
                <p className="meta">
                  <MapPin size={15} />
                  {t(item.location)}
                </p>
                <p>{t(item.description)}</p>
                {item.transport && (
                  <span className="meta">
                    <Bus size={16} />
                    {t(item.transport)}
                    {t(
                      item.travelMinutes > 0
                        ? t(" · 約{minutes}分", { minutes: item.travelMinutes })
                        : "",
                    )}
                  </span>
                )}
                {company && (
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
                    <ArrowUpRight size={20} />
                  </Link>
                )}
              </div>
            </article>
          );
        })
      )}
    </div>
  );
}
