import { Card,EmptyState,PageTitle } from "@/components/ui";
import { companies } from "@/data";
import learning from "@/data/learning.json";
import { useStorage } from "@/state/visit-storage";
import { Link } from "react-router-dom";
export default function LearningPage() {
  const { checks } = useStorage();
  return (
    <>
      <PageTitle title="事前学習" />
      {checks.error && (
        <Card>
          <p className="error" role="alert">
            {checks.error}
          </p>
          <button className="button secondary" onClick={checks.save}>
            保存を再試行
          </button>
        </Card>
      )}
      <p role="status">
        チェック状態はこの端末に
        {checks.dirty ? "保存できていません。" : "保存されます。"}
      </p>
      {companies.length === 0 && (
        <EmptyState>企業情報が登録されていません。</EmptyState>
      )}
      <div className="learning-grid">
        {companies.map((company) => {
          const content = learning.find((l) => l.companyId === company.id);
          const items = content?.checklist || [];
          const count = items.filter(
            (item) => checks.value[`${company.id}:${item.id}`],
          ).length;
          return (
            <Card key={company.id}>
              <h2>
                <Link to={`/companies/${company.id}`}>{company.name}</Link>
              </h2>
              <h3>事前に知っておきたいこと</h3>
              {content?.basics.length ? (
                <ul>
                  {content.basics.map((text, i) => (
                    <li key={i}>{text}</li>
                  ))}
                </ul>
              ) : (
                <p>未登録</p>
              )}
              <h3>見学の注目ポイント</h3>
              <ul>
                {company.highlights.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
              <h3>事前質問例</h3>
              <ul>
                {company.questions.map((text, i) => (
                  <li key={i}>{text}</li>
                ))}
              </ul>
              <h3>
                学習チェックリスト{" "}
                <small>
                  {count} / {items.length}
                </small>
              </h3>
              <div className="checklist">
                {items.map((item) => (
                  <label key={item.id}>
                    <input
                      type="checkbox"
                      checked={!!checks.value[`${company.id}:${item.id}`]}
                      onChange={(e) =>
                        checks.change(
                          `${company.id}:${item.id}`,
                          e.target.checked,
                        )
                      }
                    />
                    <span>{item.text}</span>
                  </label>
                ))}
              </div>
              {!items.length && <p>チェック項目は未登録です。</p>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
