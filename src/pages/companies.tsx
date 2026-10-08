import { EmptyState, PageTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { companies } from "@/data";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function CompaniesPage() {
  return (
    <>
      <PageTitle title="企業情報" />
      <div className="company-grid">
        {companies.map((c, i) => (
          <Link
            className="glass-card company-card"
            key={c.id}
            to={`/companies/${c.id}`}
          >
            <div className={`company-image tone-${i}`}>
              <img src={assetUrl(c.image)} alt={`${c.name}の仮イメージ`} />
              <span className="badge">VISIT 0{i + 1}</span>
            </div>
            <div className="company-body">
              <span className="eyebrow">{c.industry}</span>
              <h2>
                {c.name}
                <ArrowUpRight size={22} />
              </h2>
              <p>{c.description}</p>
              <span className="text-link">
                企業を詳しく見る
                <ArrowRight size={18} />
              </span>
            </div>
          </Link>
        ))}
      </div>
      {companies.length === 0 && (
        <EmptyState>企業情報はまだ登録されていません。</EmptyState>
      )}
    </>
  );
}
