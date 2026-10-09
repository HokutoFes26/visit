import { t, usePreferences } from "@/state/preferences";
import { Card, PageTitle } from "@/components/ui";
import { companies } from "@/data";
import { useStorage } from "@/state/visit-storage";
import { Download, Save } from "lucide-react";
import { useSearchParams } from "react-router-dom";
export default function NotesPage() {
  usePreferences();
  const { notes } = useStorage();
  const [params, setParams] = useSearchParams();
  const company =
    companies.find((c) => c.id === params.get("company")) || companies[0];
  function download() {
    const text = Object.entries(notes.value)
      .map(
        ([id, value]) =>
          `【${t(companies.find((c) => c.id === id)?.name || id)}】\n${value}`,
      )
      .join("\n\n");
    const url = URL.createObjectURL(
      new Blob(["\uFEFF" + (text || t("メモはありません。"))], {
        type: "text/plain;charset=utf-8",
      }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = t("見学メモ.txt");
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 10000);
    notes.backup();
  }
  return (
    <>
      <PageTitle title={t("見学メモ")} />
      <Card>
        <p>
          {t(
            "メモはこの端末に保存されます。端末間で同期されず、ブラウザデータの削除で消えることがあります。共有端末では他の人も閲覧できます。",
          )}
        </p>
        {company ? (
          <>
            <label className="field-label" htmlFor="note-company">
              {t("企業")}
            </label>
            <select
              id="note-company"
              value={company.id}
              onChange={(e) => setParams({ company: e.target.value })}
            >
              {companies.map((c) => (
                <option key={c.id} value={c.id}>
                  {t(c.name)}
                </option>
              ))}
            </select>
            <label className="field-label" htmlFor="note-text">
              {t("{name}のメモ", { name: t(company.name) })}
            </label>
            <textarea
              id="note-text"
              value={notes.value[company.id] || ""}
              onChange={(e) => notes.change(company.id, e.target.value)}
              placeholder={t("メモを入力")}
              rows={12}
            />
            <p role="status">
              {t(
                notes.dirty
                  ? "未保存（画面内に保持）"
                  : notes.saved
                    ? "端末に保存済み"
                    : "入力すると自動保存します",
              )}
            </p>
          </>
        ) : (
          <p>{t("企業情報が登録されていません。")}</p>
        )}
        {notes.error && (
          <p className="error" role="alert">
            {t(notes.error)}
          </p>
        )}
        <div className="action-row">
          {notes.error && (
            <button className="button secondary" onClick={notes.save}>
              <Save size={17} />
              {t("保存を再試行")}
            </button>
          )}
          <button className="button primary" onClick={download}>
            <Download size={17} />
            {t("すべてのメモを書き出す")}
          </button>
        </div>
      </Card>
    </>
  );
}
