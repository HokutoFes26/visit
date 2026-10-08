import { Card,PageTitle } from "@/components/ui";
import { announcements } from "@/data";
export default function AnnouncementsPage() {
  return (
    <>
      <PageTitle title="お知らせ" />
      {announcements.map((a) => (
        <Card key={a.id}>
          <span className="badge">
            {a.importance === "high" ? "重要" : "ご案内"}
          </span>
          <h2>{a.title}</h2>
          <p>{a.body}</p>
          <small>
            掲載：
            {new Date(a.publishedAt).toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}{" "}
            / 更新：
            {new Date(a.updatedAt).toLocaleString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </small>
        </Card>
      ))}
    </>
  );
}
