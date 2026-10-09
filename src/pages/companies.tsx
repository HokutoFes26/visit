import { t, usePreferences } from "@/state/preferences";
import { EmptyState, PageTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { companies } from "@/data";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function CompaniesPage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("企業情報")} />
      <div className="company-grid">
        {companies.map((c, i) => (
          <Link
            className="glass-card company-card"
            key={c.id}
            to={`/companies/${c.id}`}
          >
            <div className={`company-image tone-${i}`}>
              <img src={assetUrl(c.image)} alt={t("企業ビルのイラスト")} />
              <span className="badge">VISIT 0{t(i + 1)}</span>
            </div>
            <div className="company-body">
              <span className="eyebrow">{t(c.industry)}</span>
              <h2>
                {t(c.name)}
                <ArrowUpRight size={22} />
              </h2>
              <p>{t(c.description)}</p>
              <span className="text-link">
                {t("企業を詳しく見る")}
                <ArrowRight size={18} />
              </span>
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
