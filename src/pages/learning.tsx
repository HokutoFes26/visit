import { t, usePreferences } from "@/state/preferences";
import { Card, EmptyState, PageTitle } from "@/components/ui";
import { companies, guide } from "@/data";
import learning from "@/data/learning.json";
import { useStorage } from "@/state/visit-storage";
import { Link } from "react-router-dom";
export default function LearningPage() {
  usePreferences();
  const { checks } = useStorage();
  return (
    <>
      <PageTitle title={t("事前学習")} />
      <Card className="preparation">
        <h2>{t("当日までの準備")}</h2>
        <ul>
          {guide.sections
            .find((s) => s.title === "当日までの準備")
            ?.items.map((item) => (
              <li key={item}>{t(item)}</li>
            ))}
        </ul>
      </Card>
      {checks.error && (
        <Card>
          <p className="error" role="alert">
            {t(checks.error)}
          </p>
          <button className="button secondary" onClick={checks.save}>
            {t("保存を再試行")}
          </button>
        </Card>
      )}
      <p role="status">
        {t("チェック状態はこの端末に")}
        {t(checks.dirty ? "保存できていません。" : "保存されます。")}
      </p>
      {companies.length === 0 && (
        <EmptyState>{t("企業情報が登録されていません。")}</EmptyState>
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
                <Link to={`/companies/${company.id}`}>{t(company.name)}</Link>
              </h2>
              <h3>{t("事前に知っておきたいこと")}</h3>
              {content?.basics.length ? (
                <ul>
                  {content.basics.map((text, i) => (
                    <li key={i}>{t(text)}</li>
                  ))}
                </ul>
              ) : (
                <p>{t("未登録")}</p>
              )}
              <h3>{t("見学の注目ポイント")}</h3>
              {!company.highlights.length && (
                <p>{t("知りたいことを事前に整理してください。")}</p>
              )}
              <ul>
                {company.highlights.map((text, i) => (
                  <li key={i}>{t(text)}</li>
                ))}
              </ul>
              <h3>{t("事前質問例")}</h3>
              {!company.questions.length && (
                <p>
                  {t(
                    "資料に具体例はありません。事業概要を調べて質問を準備してください。",
                  )}
                </p>
              )}
              <ul>
                {company.questions.map((text, i) => (
                  <li key={i}>{t(text)}</li>
                ))}
              </ul>
              <h3>
                {t("学習チェックリスト")}
                {t(" ")}
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
                    <span>{t(item.text)}</span>
                  </label>
                ))}
              </div>
              {!items.length && <p>{t("チェック項目は未登録です。")}</p>}
            </Card>
          );
        })}
      </div>
    </>
  );
}
