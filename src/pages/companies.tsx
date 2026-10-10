import { t, usePreferences } from "@/state/preferences";
import { EmptyState, PageTitle, Text, Title } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { companies } from "@/data";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import "@/styles/companies.css";

export default function CompaniesPage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("企業情報")} />
      <div className="company-grid">
        {companies.map((c) => (
          <Link className="company-card" key={c.id} to={`/companies/${c.id}`}>
            <div className="company-card-banner">
              <img
                src={assetUrl(c.image)}
                alt={t("企業ビルのイラスト")}
                className="company-card-bg-image"
              />
              <img
                src={assetUrl(c.image)}
                alt=""
                aria-hidden="true"
                className="company-card-bg-image company-card-bg-blur"
              />
              <div className="company-card-overlay" />
              <div className="company-card-content">
                <div className="company-card-industry">{t(c.industry)}</div>
                <Title order={2} size="h3" className="company-card-title">
                  {t(c.name)}
                </Title>
                <Text size="sm" lineClamp={2} className="company-card-desc">
                  {t(c.description)}
                </Text>
                <div className="company-card-cta">
                  <span>{t("企業を詳しく見る")}</span>
                  <ArrowRight size={15} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {companies.length === 0 && (
        <EmptyState>{t("企業情報はまだ登録されていません。")}</EmptyState>
      )}
    </>
  );
}
