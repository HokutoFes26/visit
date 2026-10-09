import { t, usePreferences } from "@/state/preferences";
import Timeline from "@/components/Timeline";
import { Card, EmptyState, PageTitle, SectionTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { companies, schedule } from "@/data";
import { useNow } from "@/hooks/useNow";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
export default function CompanyDetail() {
  usePreferences();
  const { id } = useParams();
  const c = companies.find((c) => c.id === id);
  const now = useNow();
  if (!c)
    return (
      <EmptyState>
        {t("企業が見つかりません。")}
        <Link to="/companies">{t("企業一覧へ戻る")}</Link>
      </EmptyState>
    );
  return (
    <>
      <Link className="back-link" to="/companies">
        {t("← 企業一覧")}
      </Link>
      <PageTitle eyebrow={t(c.industry)} title={t(c.name)} />
      <div className="detail-hero">
        <img src={assetUrl(c.image)} alt={t("企業ビルのイラスト")} />
        <span className="badge">
          {t("仮イラスト（実際の訪問先とは異なります）")}
        </span>
      </div>
      <div className="detail-grid">
        <Card>
          <SectionTitle title={t("企業について")} />
          <p>{t(c.description)}</p>
          <dl>
            <dt>{t("企業名")}</dt>
            <dd>{t(c.legalName)}</dd>
            <dt>{t("主な事業")}</dt>
            <dd>{t(c.business.join(" / ") || "資料に記載なし")}</dd>
            <dt>{t("製品・サービス")}</dt>
            <dd>{t(c.products.join(" / ") || "資料に記載なし")}</dd>
          </dl>
          <h3>{t("見学内容")}</h3>
          <p>{t(c.factory)}</p>
          {c.website && /^https?:\/\//.test(c.website) ? (
            <a
              className="text-link"
              href={c.website}
              target="_blank"
              rel="noreferrer"
            >
              {t("公式サイト（オンライン接続が必要）")}
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <p className="quiet-note">{t("公式Webサイトは未登録です。")}</p>
          )}
        </Card>
        <Card>
          <SectionTitle title={t("見学の注目ポイント")} />
          {!c.highlights.length && (
            <p>{t("事前学習で知りたいことを整理してください。")}</p>
          )}
          <ul className="feature-list">
            {c.highlights.map((h) => (
              <li key={h}>
                <Check size={18} />
                {t(h)}
              </li>
            ))}
          </ul>
          <details open>
            <summary>{t("事前に考えておきたい質問")}</summary>
            {!c.questions.length && (
              <p>{t("事業概要を調べ、質問を準備してください。")}</p>
            )}
            <ul>
              {c.questions.map((q) => (
                <li key={q}>{t(q)}</li>
              ))}
            </ul>
          </details>
          <Link className="button secondary" to={`/notes?company=${c.id}`}>
            {t("見学メモ")}
            <ArrowRight size={17} />
          </Link>
        </Card>
      </div>
      <SectionTitle title={t("関連スケジュール")} />
      <Timeline
        items={schedule.filter((s) => s.companyId === c.id)}
        now={now}
      />
    </>
  );
}
