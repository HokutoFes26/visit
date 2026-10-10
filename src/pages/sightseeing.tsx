import { Card, PageTitle, Badge, Button, Group, Text, Title, Box, NativeSelect, SimpleGrid } from "@/components/ui";
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
  MapPin,
  Navigation,
  TrainFront,
  Wallet,
  WifiOff,
} from "lucide-react";
import { useRef, useState } from "react";

export default function SightseeingPage() {
  usePreferences();
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
      <PageTitle title={t("東京の寄り道ガイド")}/>

      <Group
        className="sightseeing-filters"
        role="group"
        aria-label={t("観光エリア")}
        gap="xs"
        mb="sm"
      >
        {[
          { id: "all", name: t("すべて") },
          ...sightseeing.areas.map((item) => ({
            id: item.id,
            name: text(item.name),
          })),
        ].map((item) => {
          const count = spots.filter(
            (spot) => item.id === "all" || spot.areaId === item.id,
          ).length;
          return (
            <Button
              key={item.id}
              type="button"
              variant={areaId === item.id ? "filled" : "light"}
              size="sm"
              radius="xl"
              aria-pressed={areaId === item.id}
              onClick={() => filter(item.id)}
              rightSection={
                <Badge
                  size="xs"
                  variant={areaId === item.id ? "white" : "light"}
                  color="var(--accent)"
                  circle
                >
                  {count}
                </Badge>
              }
              styles={{
                root: {
                  fontWeight: 600,
                  transition: "all 0.15s ease",
                },
              }}
            >
              {item.name}
            </Button>
          );
        })}
      </Group>

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
              <NativeSelect
                id="sightseeing-origin"
                label={t("経路の出発地")}
                value={origin}
                onChange={(event) => setOrigin(event.currentTarget.value)}
                data={sightseeing.origins.map((item) => ({
                  value: item.id,
                  label: text(item.name),
                }))}
                radius="xl"
                size="md"
                mt="sm"
                styles={{
                  label: { fontWeight: 600, marginBottom: 6 },
                  input: {
                    textAlign: "center",
                    textAlignLast: "center",
                  },
                }}
              />
              <Button
                component="a"
                variant="filled"
                radius="xl"
                fullWidth
                size="md"
                href={spotDirectionsUrl(selected, origin)}
                target="_blank"
                rel="noreferrer"
                leftSection={<Navigation size={15} />}
                rightSection={<ArrowUpRight size={17} />}
                className="sightseeing-directions"
              >
                {t("Googleマップで経路を確認")}
              </Button>
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
                  <Badge variant="light" color="var(--accent-neon)" size="md" radius="xl" style={{ fontWeight: 600 }}>
                    {text(
                      sightseeing.areas.find((item) => item.id === spot.areaId)
                        ?.name || "",
                    )}
                  </Badge>
                  <Button
                    className="spot-map-button"
                    type="button"
                    variant={selected.id === spot.id ? "light" : "subtle"}
                    color={selected.id === spot.id ? "blue" : "gray"}
                    size="xs"
                    radius="xl"
                    aria-pressed={selected.id === spot.id}
                    aria-label={t("{name}を地図に表示", {
                      name: text(spot.name),
                    })}
                    leftSection={<MapPin size={14} color={selected.id === spot.id ? "var(--surface)" : "var(--accent-neon)"} />}
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
                    {selected.id === spot.id
                      ? t("地図で表示中")
                      : t("地図で表示")}
                  </Button>
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
          <Text c="dimmed">{t("このエリアのスポットはまだ登録されていません。")}</Text>
        </Card>
      )}
    </>
  );
}
