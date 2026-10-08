import { Card,PageTitle,SectionTitle } from "@/components/ui";
import { event,formatDate,guide } from "@/data";
import { Backpack,MapPin,Shirt } from "lucide-react";
export default function GuidePage() {
  return (
    <>
      <PageTitle title="見学ガイド" />
      <Card className="guide-meeting">
        <span className="shortcut-icon blue">
          <MapPin />
        </span>
        <div>
          <span className="eyebrow">集合場所</span>
          <h2>{event.meetingPlace}</h2>
          <p>
            {formatDate(event.date)} · {event.meetingTime} 集合
          </p>
          <p>{event.meetingNote}</p>
        </div>
      </Card>
      <div className="detail-grid">
        <Card>
          <SectionTitle title="持ち物リスト" />
          <ul className="feature-list">
            {guide.belongings.map((t) => (
              <li key={t}>
                <Backpack size={18} />
                {t}
              </li>
            ))}
          </ul>
        </Card>
        <Card>
          <SectionTitle title="服装について" />
          <ul className="feature-list">
            {guide.clothing.map((t) => (
              <li key={t}>
                <Shirt size={18} />
                {t}
              </li>
            ))}
          </ul>
        </Card>
      </div>
      <Card>
        <SectionTitle title="安全に見学するために" />
        <ol className="rules">
          {guide.precautions.map((t) => (
            <li key={t}>{t}</li>
          ))}
        </ol>
      </Card>
    </>
  );
}
