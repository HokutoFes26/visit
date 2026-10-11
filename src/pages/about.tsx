import { t, usePreferences } from "@/state/preferences";
import { PageTitle } from "@/components/ui";
import {
  CalendarDays,
  FileText,
  Pencil,
  RefreshCw,
  Route,
  ShieldCheck,
  Smartphone,
  WifiOff,
} from "lucide-react";
import "@/styles/about.css";

export default function AboutPage() {
  usePreferences();

  return (
    <div className="about-page">
      <PageTitle title={t("アプリの使い方・仕組み")} />
      <p className="about-lead">
        {t(
          "見学を快適に進めるためのアプリの使い方と、電波がない場所でも動く仕組みやメモの保存について説明します。",
        )}
      </p>

      <section className="about-section">
        <h2>{t("アプリの使い方")}</h2>

        <div className="about-block">
          <div className="about-block-icon">
            <Smartphone size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("ホーム画面に追加して使う（おすすめ）")}</h3>
            <p>
              {t(
                "ブラウザから「ホーム画面に追加」すると、スマホアプリのように全画面で起動でき、オフライン時も素早く開けます。メモを書く前に追加しておくのがおすすめです。",
              )}
            </p>
            <ul>
              <li>
                <strong>iPhone (Safari):</strong>{" "}
                {t(
                  "画面下の中央にある「共有ボタン（四角から上矢印のアイコン）」を押し、メニューから「ホーム画面に追加」を選択",
                )}
              </li>
              <li>
                <strong>Android (Chrome):</strong>{" "}
                {t(
                  "右上のメニューボタン（︙）から「アプリをインストール」または「ホーム画面に追加」を選択",
                )}
              </li>
            </ul>
          </div>
        </div>

        <div className="about-block">
          <div className="about-block-icon">
            <CalendarDays size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("スケジュールと経由地の確認")}</h3>
            <p>
              {t(
                "「スケジュール」画面では、日付ごとの行程や集合時間、訪問先、移動手段を確認できます。画面上の「経由地」をタップすると、その日の立ち寄り先一覧をまとめて見ることができます。",
              )}
            </p>
          </div>
        </div>

        <div className="about-block">
          <div className="about-block-icon">
            <Pencil size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("企業メモと事前学習のチェック")}</h3>
            <p>
              {t(
                "「企業情報」から各企業を開くと、ページ下部にメモ入力欄があります。見学中の気づきや質問内容を自由にメモでき、入力した文字は自動で保存されます。",
              )}
            </p>
            <p>
              {t(
                "「事前学習」画面では、持ち物や準備事項のチェックリストを管理できます。チェックした項目は自動で保存されます。",
              )}
            </p>
          </div>
        </div>

        <div className="about-block">
          <div className="about-block-icon">
            <Route size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("学科（コース）の切り替え")}</h3>
            <p>
              {t(
                "電子情報（3日間）と国際ビジネス（4日間）で表示内容が分かれています。「設定」画面からいつでも切り替えられます。",
              )}
            </p>
          </div>
        </div>
      </section>

      <section className="about-section">
        <h2>{t("アプリの仕組み・知っておくこと")}</h2>

        <div className="about-block">
          <div className="about-block-icon">
            <WifiOff size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("電波がつながらない場所でも動く理由")}</h3>
            <p>
              {t(
                "このアプリは、オンラインで一度開くと見学データが自動的にお使いのスマホ本体に保存されます。電波が届かない場所（オフライン）でもスケジュールや企業メモを確認できます。",
              )}
            </p>
            <div className="about-note">
              {t(
                "初回利用時や出発前に、オンラインの状態で一度アプリを開き、「設定」画面で「オフライン準備完了」になっていることを確認してください。",
              )}
            </div>
          </div>
        </div>

        <div className="about-block">
          <div className="about-block-icon">
            <ShieldCheck size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("メモの保存場所と大切な注意点")}</h3>
            <p>
              {t(
                "入力したメモやチェックリストの内容は、外部のサーバーには一切送信されず、お使いのスマホ（ブラウザ）の中にだけ保存されます。",
              )}
            </p>
            <div className="about-note">
              <strong>{t("【メモ利用時の注意点】")}</strong>
              <ul style={{ margin: "6px 0 0 0", paddingLeft: "18px" }}>
                <li>
                  {t(
                    "別の端末とは同期されません：PC等で入力したメモは自分のスマホには引き継がれません。見学当日に持参するスマホで入力してください。",
                  )}
                </li>
                <li>
                  {t(
                    "iPhoneの注意点：Safariでメモを書いた後に「ホーム画面に追加」を行うと、データが引き継がれず消えたように見える場合があります。必ず「ホーム画面に追加」した後にメモを入力してください。",
                  )}
                </li>
                <li>
                  {t(
                    "履歴消去に注意：ブラウザの「閲覧履歴やCookie・サイトデータの全消去」を行うと、保存されたメモも消去されます。",
                  )}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="about-block">
          <div className="about-block-icon">
            <RefreshCw size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("「新しい情報があります」と表示されたら")}</h3>
            <p>
              {t(
                "スケジュールの変更などが配信されると、画面上部に「新しい情報があります」という案内が出ます。「更新を適用」を押すと最新の内容に切り替わります。",
              )}
            </p>
            <p>
              {t(
                "メモの編集中に勝手に画面が再読み込みされて文章が消えないよう、自動更新は行わず手動でボタンを押して切り替える安全な仕組みになっています。",
              )}
            </p>
          </div>
        </div>

        <div className="about-block">
          <div className="about-block-icon">
            <FileText size={22} />
          </div>
          <div className="about-block-content">
            <h3>{t("配布資料について")}</h3>
            <p>
              {t(
                "部屋割りや座席表などの資料には個人情報が含まれるため、アプリ内では直接表示しません。「見学ガイド」画面のリンクからログイン状態のTeamsで確認してください。",
              )}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
