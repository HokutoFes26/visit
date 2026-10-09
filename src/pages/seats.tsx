import { t, usePreferences } from "@/state/preferences";
import { Card, PageTitle, SectionTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import seats from "@/data/seats.json";

export default function SeatsPage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("座席案内")} description={t(seats.description)} />
      <Card>
        <SectionTitle title={t(seats.title)} />
        <div className="seat-legend">
          {seats.groups.map((group) => (
            <span className={`seat-group group-${group.color}`} key={group.id}>
              {t(group.label)}
            </span>
          ))}
        </div>
        <div className="bus train">
          <div className="bus-front">
            <span>{t("↑ 進行方向・1号車（トイレ）")}</span>
            <span>{t("2号車")}</span>
          </div>
          <div
            className="seat-grid"
            style={{
              gridTemplateColumns: seats.columns
                .map((c) => (c === "aisle" ? ".4fr" : "1fr"))
                .join(" "),
            }}
          >
            {Array.from({ length: seats.rows }, (_, index) =>
              seats.columns.map((column, col) => {
                if (column === "aisle")
                  return (
                    <span
                      className="aisle"
                      key={`${index}-${col}`}
                      aria-hidden="true"
                    >
                      {t(index === 0 ? "通路" : "")}
                    </span>
                  );
                const seat = seats.seats.find(
                  (s) => s.row === index + 1 && s.column === column,
                );
                if (!seat) return <span key={`${index}-${col}`} />;
                const group = seats.groups.find((g) => g.id === seat.groupId);
                const short =
                  seat.groupId === "participant"
                    ? "未割当"
                    : seat.groupId === "unavailable"
                      ? "×"
                      : group?.label;
                return (
                  <div
                    className={`seat group-${group?.color || "gray"}`}
                    key={seat.number}
                    aria-label={t("座席{number}、{group}", {
                      number: seat.number,
                      group: t(group?.label || ""),
                    })}
                  >
                    <strong>{t(seat.number)}</strong>
                    <small>{t(short)}</small>
                  </div>
                );
              }),
            )}
          </div>
        </div>
        <ul>
          {seats.notes.map((note) => (
            <li key={note}>{t(note)}</li>
          ))}
        </ul>
        <details>
          <summary>{t("配布資料の座席図を確認")}</summary>
          <a
            href={assetUrl("images/train-seats.png")}
            target="_blank"
            rel="noreferrer"
          >
            <img
              src={assetUrl("images/train-seats.png")}
              alt={t(
                "配布資料の新幹線2号車座席図。水色39席、教員席8D・8E・9D、荷物置き1D・1E。東京駅乗車時の開扉側矢印と1号車トイレへの方向を記載",
              )}
            />
            {t("原図を拡大表示")}
          </a>
        </details>
      </Card>
      <Card className="group-plan">
        <SectionTitle title={t("グループ分け（未定）")} />
        {seats.groupPlan.map((plan) => (
          <p key={plan.size}>
            {t("{size}人 × {count}グループ", {
              size: plan.size,
              count: plan.count,
            })}
          </p>
        ))}
        <p>{t("班長も決めます。NEC見学と移動時の点呼に使用します。")}</p>
        <p className="quiet-note">
          {t("個人名・班の割り当ては掲載していません。")}
        </p>
      </Card>
    </>
  );
}
