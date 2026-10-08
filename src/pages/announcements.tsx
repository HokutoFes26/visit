import { Card, PageTitle } from "@/components/ui";
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
            資料の掲載日：
            {a.publishedAt
              ? new Date(a.publishedAt).toLocaleDateString("ja-JP", {
                  timeZone: "Asia/Tokyo",
                })
              : "記載なし"}{" "}
            / サイト反映日：
            {new Date(a.updatedAt).toLocaleDateString("ja-JP", {
              timeZone: "Asia/Tokyo",
            })}
          </small>
        </Card>
      ))}
    </>
  );
}
