import data from "./sightseeing.json";
export type LocalizedText = string | { ja: string; en?: string };
export interface SightseeingArea {
  id: string;
  name: LocalizedText;
  description: LocalizedText;
}
export interface SightseeingSpot {
  id: string;
  areaId: string;
  enabled: boolean;
  name: LocalizedText;
  description: LocalizedText;
  access: LocalizedText;
  cost: LocalizedText;
  duration: LocalizedText;
  note: LocalizedText;
  latitude: number;
  longitude: number;
  website: string;
  sourceUrl: string;
}
export const sightseeing: {
  checkedAt: string;
  areas: SightseeingArea[];
  spots: SightseeingSpot[];
  origins: { id: string; name: LocalizedText; query: string }[];
} = data;
export function localize(value: LocalizedText, language: "ja" | "en") {
  return typeof value === "string" ? value : value[language] || value.ja;
}
export function spotMapUrl(spot: SightseeingSpot) {
  const bbox = [
    spot.longitude - 0.008,
    spot.latitude - 0.006,
    spot.longitude + 0.008,
    spot.latitude + 0.006,
  ].join(",");
  return `https://www.openstreetmap.org/export/embed.html?${new URLSearchParams({ bbox, layer: "mapnik", marker: `${spot.latitude},${spot.longitude}` })}`;
}
export function spotDirectionsUrl(spot: SightseeingSpot, origin: string) {
  const departure =
    sightseeing.origins.find((item) => item.id === origin) ||
    sightseeing.origins[0];
  return `https://www.google.com/maps/dir/?${new URLSearchParams({ api: "1", origin: departure.query, destination: `${spot.latitude},${spot.longitude}`, travelmode: "transit" })}`;
}
