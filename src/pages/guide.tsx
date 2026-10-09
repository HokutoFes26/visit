import { t, usePreferences } from "@/state/preferences";
import { Card, PageTitle, SectionTitle } from "@/components/ui";
import { event, formatDate, guide } from "@/data";
import { Backpack, MapPin, Shirt } from "lucide-react";
export default function GuidePage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("見学ガイド")} />
      <Card className="guide-meeting">
        <span className="shortcut-icon blue">
          <MapPin />
        </span>
        <div>
          <span className="eyebrow">{t("集合場所")}</span>
          <h2>{t(event.meetingPlace)}</h2>
          <p>
            {t(formatDate(event.date))} · {t(event.meetingTime)}
            {t("集合")}
          </p>
          <p>{t(event.meetingNote)}</p>
        </div>
      </Card>
      <div className="detail-grid">
        {guide.sections.map((section) => (
          <Card key={section.title}>
            <SectionTitle title={t(section.title)} />
            <ul className="feature-list">
              {section.items.map((item) => (
                <li key={item}>{t(item)}</li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
      <div className="detail-grid">
        <Card>
          <SectionTitle title={t("持ち物リスト")} />
          <ul className="feature-list">
            {guide.belongings.map((item) => (
              <li key={item}>
                <Backpack size={18} />
                {t(item)}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionTitle title={t("服装について")} />
          <ul className="feature-list">
            {guide.clothing.map((item) => (
              <li key={item}>
                <Shirt size={18} />
                {t(item)}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <SectionTitle title={t("安全に見学するために")} />
        <ol className="rules">
          {guide.precautions.map((item) => (
            <li key={item}>{t(item)}</li>
          ))}
        </ol>
      </Card>
    </>
  );
}
