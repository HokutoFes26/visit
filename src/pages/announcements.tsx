import { getLanguage, t, usePreferences } from "@/state/preferences";
import { Card, PageTitle } from "@/components/ui";
import { announcements } from "@/data";
export default function AnnouncementsPage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("お知らせ")} />
      {announcements.map((a) => (
        <Card key={a.id}>
          <span className="badge">
            {t(a.importance === "high" ? "重要" : "ご案内")}
          </span>
          <h2>{t(a.title)}</h2>
          <p>{t(a.body)}</p>
          <small>
            {t("資料の掲載日：")}
            {t(
              a.publishedAt
                ? new Date(a.publishedAt).toLocaleDateString(
                    getLanguage() === "ja" ? "ja-JP" : "en-US",
                    {
                      timeZone: "Asia/Tokyo",
                    },
                  )
                : "記載なし",
            )}
            {t(" ")}
            {t("/ サイト反映日：")}
            {t(
              new Date(a.updatedAt).toLocaleDateString(
                getLanguage() === "ja" ? "ja-JP" : "en-US",
                {
                  timeZone: "Asia/Tokyo",
                },
              ),
            )}
          </small>
        </Card>
      ))}
    </>
  );
}
