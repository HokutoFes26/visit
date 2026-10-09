import { Card, PageTitle } from "@/components/ui";
import {
  sightseeing,
  localize,
  spotMapUrl,
  spotDirectionsUrl,
} from "@/data/sightseeing";
import { usePwa } from "@/pwa";
import { t, usePreferences } from "@/state/preferences";
import {
  ArrowUpRight,
  Clock3,
  Compass,
  MapPin,
  Navigation,
  TrainFront,
  Wallet,
  WifiOff,
} from "lucide-react";
import { useRef, useState } from "react";
import { Link } from "react-router-dom";

export default function SightseeingPage() {
  const { language } = usePreferences();
  const { online } = usePwa();
  const text = (value: Parameters<typeof localize>[0]) =>
    localize(value, language);
  const spots = sightseeing.spots.filter((spot) => spot.enabled);
  const [areaId, setAreaId] = useState("all");
  const [selectedId, setSelectedId] = useState(spots[0]?.id || "");
  const [origin, setOrigin] = useState(sightseeing.origins[0]?.id || "tokyo");
  const mapPanel = useRef<HTMLDivElement>(null);
  const visible = spots.filter(
    (spot) => areaId === "all" || spot.areaId === areaId,
  );
  const selected = visible.find((spot) => spot.id === selectedId) || visible[0];
  const area = sightseeing.areas.find((item) => item.id === areaId);
  function filter(id: string) {
    setAreaId(id);
    setSelectedId(
      spots.find((spot) => id === "all" || spot.areaId === id)?.id || "",
    );
  }
  return (
    <>
      <PageTitle
        eyebrow="EXPLORE TOKYO"
        title={t("東京観光")}
        description={t(
          "東京駅・品川・浅草など、自由時間に行ってみたい場所を探そう。",
        )}
      />
      <div className="sightseeing-intro">
        <span className="shortcut-icon cyan">
          <Compass size={25} />
        </span>
        <div>
          <strong>{t("企業見学の合間に、東京を知る。")}</strong>
          <p>
            {t(
              "集合・見学・点呼を優先し、22:00以降は外出できません。滞在目安は提案で、移動時間は含みません。",
            )}
          </p>
        </div>
        <Link className="text-link" to="/schedule">
          {t("スケジュール")}
          <ArrowUpRight size={16} />
        </Link>
      </div>
      <div
        className="sightseeing-filters"
        role="group"
        aria-label={t("観光エリア")}
      >
        {[
          { id: "all", name: t("すべて") },
          ...sightseeing.areas.map((item) => ({
            id: item.id,
            name: text(item.name),
          })),
        ].map((item) => (
          <button
            type="button"
            key={item.id}
            aria-pressed={areaId === item.id}
            onClick={() => filter(item.id)}
          >
            {item.name}
            <span>
              {
                spots.filter(
                  (spot) => item.id === "all" || spot.areaId === item.id,
                ).length
              }
            </span>
          </button>
        ))}
      </div>
      <p className="sightseeing-area-note">
        {area
          ? text(area.description)
          : t(
              "スポットを選ぶと、地図のピンが切り替わります。地図は拡大・移動できます。",
            )}
      </p>
      {selected ? (
        <div className="sightseeing-layout">
          <div className="sightseeing-map-panel" ref={mapPanel}>
            <Card className="sightseeing-map-card">
              <div className="sightseeing-map-heading">
                <MapPin size={20} />
                <div>
                  <span className="eyebrow">{t("地図で場所を確認")}</span>
                  <h2 aria-live="polite">{text(selected.name)}</h2>
                </div>
              </div>
              {online ? (
                <iframe
                  key={selected.id}
                  className="sightseeing-map"
                  src={spotMapUrl(selected)}
                  title={t("{name}の周辺地図", { name: text(selected.name) })}
                  loading="lazy"
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : (
                <div className="sightseeing-map-offline" role="status">
                  <WifiOff size={30} />
                  <strong>
                    {t("地図の表示にはインターネット接続が必要です。")}
                  </strong>
                  <p>
                    {t(
                      "スポットの説明はオフラインでも読めます。接続すると地図が表示されます。",
                    )}
                  </p>
                </div>
              )}
              <div className="sightseeing-map-credit">
                <a
                  href="https://www.openstreetmap.org/copyright"
                  target="_blank"
                  rel="noreferrer"
                >
                  © OpenStreetMap contributors
                </a>
                <a
                  href={`https://www.openstreetmap.org/?mlat=${selected.latitude}&mlon=${selected.longitude}#map=16/${selected.latitude}/${selected.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t("大きな地図")}
                  <ArrowUpRight size={13} />
                </a>
              </div>
              <label className="field-label" htmlFor="sightseeing-origin">
                {t("経路の出発地")}
              </label>
              <select
                id="sightseeing-origin"
                value={origin}
                onChange={(event) => setOrigin(event.target.value)}
              >
                {sightseeing.origins.map((item) => (
                  <option key={item.id} value={item.id}>
                    {text(item.name)}
                  </option>
                ))}
              </select>
              <a
                className="button primary sightseeing-directions"
                href={spotDirectionsUrl(selected, origin)}
                target="_blank"
                rel="noreferrer"
              >
                <Navigation size={17} />
                {t("Googleマップで経路を確認")}
                <ArrowUpRight size={15} />
              </a>
              <p className="quiet-note">
                {t(
                  "地図・経路・公式サイトはオンラインで利用できます。地図のピンは訪問場所の目安です。",
                )}
              </p>
            </Card>
            <p className="sightseeing-checked">
              {t("情報確認日：{date}", { date: sightseeing.checkedAt })}
              <br />
              {t(
                "営業時間・料金・休館日は各公式サイトで最新情報を確認してください。",
              )}
            </p>
          </div>
          <div className="sightseeing-spots">
            {visible.map((spot) => (
              <Card
                key={spot.id}
                className={`sightseeing-spot ${selected.id === spot.id ? "is-selected" : ""}`}
              >
                <div className="sightseeing-spot-heading">
                  <span className="badge">
                    {text(
                      sightseeing.areas.find((item) => item.id === spot.areaId)
                        ?.name || "",
                    )}
                  </span>
                  <button
                    className="spot-map-button"
                    type="button"
                    aria-pressed={selected.id === spot.id}
                    aria-label={t("{name}を地図に表示", {
                      name: text(spot.name),
                    })}
                    onClick={() => {
                      setSelectedId(spot.id);
                      if (window.matchMedia("(max-width: 850px)").matches)
                        mapPanel.current?.scrollIntoView({
                          behavior: window.matchMedia(
                            "(prefers-reduced-motion: reduce)",
                          ).matches
                            ? "instant"
                            : "smooth",
                          block: "start",
                        });
                    }}
                  >
                    <MapPin size={15} />
                    {selected.id === spot.id
                      ? t("地図に表示中")
                      : t("地図に表示")}
                  </button>
                </div>
                <h2>{text(spot.name)}</h2>
                <p>{text(spot.description)}</p>
                <dl className="sightseeing-facts">
                  <div>
                    <dt>
                      <TrainFront size={16} />
                      {t("アクセス")}
                    </dt>
                    <dd>{text(spot.access)}</dd>
                  </div>
                  <div>
                    <dt>
                      <Clock3 size={16} />
                      {t("滞在目安")}
                    </dt>
                    <dd>{text(spot.duration)}</dd>
                  </div>
                  <div>
                    <dt>
                      <Wallet size={16} />
                      {t("費用")}
                    </dt>
                    <dd>{text(spot.cost)}</dd>
                  </div>
                </dl>
                <p className="sightseeing-spot-note">{text(spot.note)}</p>
                <div className="sightseeing-spot-links">
                  <a
                    className="text-link"
                    href={spot.website}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {t("公式サイト")}
                    <ArrowUpRight size={14} />
                  </a>
                  <a href={spot.sourceUrl} target="_blank" rel="noreferrer">
                    {t("情報の出典")}
                    <ArrowUpRight size={13} />
                  </a>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ) : (
        <Card>
          <p>{t("このエリアのスポットはまだ登録されていません。")}</p>
        </Card>
      )}
    </>
  );
}
