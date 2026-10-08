import { Card,PageTitle } from "@/components/ui";
import seats from "@/data/seats.json";
export default function SeatsPage() {
  return (
    <>
      <PageTitle
        title="座席案内"
        description="座席番号・グループは仮の配置です。"
      />
      <Card>
        <div className="seat-legend">
          {seats.groups.map((group) => (
            <span className={`seat-group group-${group.color}`} key={group.id}>
              {group.label}
            </span>
          ))}
        </div>
        <div className="bus">
          <div className="bus-front">
            <span>前方</span>
            <span>運転席</span>
          </div>
          <div
            className="seat-grid"
            style={{
              gridTemplateColumns: seats.columns
                .map((col) => (col === "aisle" ? ".55fr" : "1fr"))
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
                      {index === 0 ? "通路" : ""}
                    </span>
                  );
                const seat = seats.seats.find(
                  (s) => s.row === index + 1 && s.column === column,
                );
                const group = seats.groups.find((g) => g.id === seat?.groupId);
                return seat ? (
                  <div
                    className={`seat group-${group?.color || "blue"}`}
                    key={seat.number}
                    aria-label={`座席${seat.number}、${group?.label || "未割当"}`}
                  >
                    <strong>{seat.number}</strong>
                    <small>{group?.label || "未割当"}</small>
                  </div>
                ) : (
                  <span key={`${index}-${col}`} />
                );
              }),
            )}
          </div>
        </div>
        <p className="quiet-note">氏名は掲載していません。</p>
      </Card>
    </>
  );
}
