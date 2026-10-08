import Timeline from "@/components/Timeline";
import { Card, EmptyState, PageTitle, SectionTitle } from "@/components/ui";
import { assetUrl } from "@/config/assets";
import { companies, schedule } from "@/data";
import { useNow } from "@/hooks/useNow";
import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { Link, useParams } from "react-router-dom";
export default function CompanyDetail() {
  const { id } = useParams();
  const c = companies.find((c) => c.id === id);
  const now = useNow();
  if (!c)
    return (
      <EmptyState>
        企業が見つかりません。<Link to="/companies">企業一覧へ戻る</Link>
      </EmptyState>
    );
  return (
    <>
      <Link className="back-link" to="/companies">
        ← 企業一覧
      </Link>
      <PageTitle eyebrow={c.industry} title={c.name} />
      <div className="detail-hero">
        <img src={assetUrl(c.image)} alt="工場の仮イメージ" />
        <span className="badge">仮イラスト（実際の訪問先とは異なります）</span>
      </div>
      <div className="detail-grid">
        <Card>
          <SectionTitle title="企業について" />
          <p>{c.description}</p>
          <dl>
            <dt>企業名</dt>
            <dd>{c.legalName}</dd>
            <dt>主な事業</dt>
            <dd>{c.business.join(" / ") || "資料に記載なし"}</dd>
            <dt>製品・サービス</dt>
            <dd>{c.products.join(" / ") || "資料に記載なし"}</dd>
          </dl>
          <h3>見学内容</h3>
          <p>{c.factory}</p>
          {c.website && /^https?:\/\//.test(c.website) ? (
            <a
              className="text-link"
              href={c.website}
              target="_blank"
              rel="noreferrer"
            >
              公式サイト（オンライン接続が必要）
              <ArrowUpRight size={16} />
            </a>
          ) : (
            <p className="quiet-note">公式Webサイトは未登録です。</p>
          )}
        </Card>
        <Card>
          <SectionTitle title="見学の注目ポイント" />
          {!c.highlights.length && (
            <p>事前学習で知りたいことを整理してください。</p>
          )}
          <ul className="feature-list">
            {c.highlights.map((h) => (
              <li key={h}>
                <Check size={18} />
                {h}
              </li>
            ))}
          </ul>
          <details open>
            <summary>事前に考えておきたい質問</summary>
            {!c.questions.length && (
              <p>事業概要を調べ、質問を準備してください。</p>
            )}
            <ul>
              {c.questions.map((q) => (
                <li key={q}>{q}</li>
              ))}
            </ul>
          </details>
          <Link className="button secondary" to={`/notes?company=${c.id}`}>
            見学メモ
            <ArrowRight size={17} />
          </Link>
        </Card>
      </div>
      <SectionTitle title="関連スケジュール" />
      <Timeline
        items={schedule.filter((s) => s.companyId === c.id)}
        now={now}
      />
    </>
  );
}
