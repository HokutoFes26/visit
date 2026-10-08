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
  return (
    <div className="timeline">
      {items.length === 0 ? (
        <p>この日の予定はまだ登録されていません。</p>
      ) : (
        items.map((item) => {
          const state = scheduleState(item, now);
          const company = companies.find((c) => c.id === item.companyId);
          return (
            <article className={`timeline-item ${state}`} key={item.id}>
              <div className="timeline-time">
                <strong>{item.startTime || "未定"}</strong>
                {item.endTime && (
                  <span>
                    {item.endTime}
                    {item.id === "train" ? "頃" : ""}
                  </span>
                )}
              </div>
              <div className="timeline-dot" />
              <div className="glass-card timeline-content">
                {state === "current" && (
                  <span className="badge blue">現在の予定</span>
                )}
                <h2>{item.title}</h2>
                {item.timeNote && <p className="quiet-note">{item.timeNote}</p>}
                <p className="meta">{item.date.slice(5).replace("-", "/")}</p>
                <p className="meta">
                  <MapPin size={15} />
                  {item.location}
                </p>
                <p>{item.description}</p>
                {item.transport && (
                  <span className="meta">
                    <Bus size={16} />
                    {item.transport}
                    {item.travelMinutes > 0
                      ? ` · 約${item.travelMinutes}分`
                      : ""}
                  </span>
                )}
                {company && (
                  <Link
                    className="company-inline"
                    to={`/companies/${company.id}`}
                  >
                    <img
                      src={assetUrl(company.image)}
                      alt="仮イラスト（実際の訪問先とは異なります）"
                    />
                    <span>
                      {company.name}
                      <small>企業紹介を見る</small>
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
