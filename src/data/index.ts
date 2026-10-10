import { getLanguage } from "@/state/preferences";
import type { Company, Schedule } from "@/types";
import { currentCourse, getCurrentCourse } from "./course";

import companyDataI from "./i/companies.json";
import eventDataI from "./i/event.json";
import learningDataI from "./i/learning.json";
import scheduleDataI from "./i/schedule.json";
import seatDataI from "./i/seats.json";
import announcementsI from "./i/announcements.json";
import guideI from "./i/guide.json";

import companyDataK from "./k/companies.json";
import eventDataK from "./k/event.json";
import learningDataK from "./k/learning.json";
import scheduleDataK from "./k/schedule.json";
import seatDataK from "./k/seats.json";
import announcementsK from "./k/announcements.json";
import guideK from "./k/guide.json";

export * from "./course";
export type { Company, Schedule } from "@/types";

const isK = currentCourse === "k";

const companyData = isK ? companyDataK : companyDataI;
const eventData = isK ? eventDataK : eventDataI;
const learningData = isK ? learningDataK : learningDataI;
const scheduleData = isK ? scheduleDataK : scheduleDataI;
const seatData = isK ? seatDataK : seatDataI;

export const announcements = isK ? announcementsK : announcementsI;
export const guide = isK ? guideK : guideI;
export const seats = seatData;
export const learning = learningData;

export const event = eventData;
export const companies: Company[] = companyData;
export const timestamp = (date: string, time: string | null) => {
  if (!time) return Date.parse(`${date}T00:00:00+09:00`);
  const normalized = time.length === 4 ? `0${time}` : time;
  return Date.parse(`${date}T${normalized}:00+09:00`);
};
export const validDate = (date: string) => {
  const parsed = new Date(`${date}T00:00:00Z`);
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(date) &&
    Number.isFinite(parsed.getTime()) &&
    parsed.toISOString().slice(0, 10) === date
  );
};
export const schedule: Schedule[] = [...scheduleData].sort(
  (a, b) => a.date.localeCompare(b.date) || a.order - b.order,
);
export const scheduleState = (item: Schedule, now: number) => {
  if (!item.startTime)
    return now >= timestamp(item.date, "00:00") + 86400000
      ? "past"
      : "unspecified";
  if (now < timestamp(item.date, item.startTime)) return "upcoming";
  if (item.endTime && now < timestamp(item.date, item.endTime))
    return "current";
  return "past";
};
export const formatDate = (date: string) =>
  new Intl.DateTimeFormat(getLanguage() === "ja" ? "ja-JP" : "en-US", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(new Date(`${date}T00:00:00+09:00`));
export const formatTime = (time: string | null | undefined): string => {
  if (!time) return "";
  return time.replace(/^0(?=\d:)/, "");
};
export function validateData(): string[] {
  const errors: string[] = [];
  if (!validDate(event.date)) errors.push("見学概要の日付を確認してください。");
  for (const list of [companies, schedule])
    if (new Set(list.map((i) => i.id)).size !== list.length)
      errors.push("データのIDが重複しています。");
  for (const c of companies)
    if (
      !c.id ||
      !c.name ||
      !Array.isArray(c.highlights) ||
      !Array.isArray(c.questions)
    )
      errors.push("企業情報の必須項目が不足しています。");
  for (const s of schedule) {
    const start = timestamp(s.date, s.startTime),
      end = timestamp(s.date, s.endTime);
    if (
      !s.id ||
      !s.title ||
      !validDate(s.date) ||
      !Number.isInteger(s.order) ||
      (s.startTime !== null &&
        !/^([01]?\d|2[0-3]):[0-5]\d$/.test(s.startTime)) ||
      (s.endTime !== null &&
        (!s.startTime ||
          !/^([01]?\d|2[0-3]):[0-5]\d$/.test(s.endTime) ||
          !(end > start)))
    )
      errors.push(`予定 ${s.id} の日時・必須項目を確認してください。`);
    if (s.companyId && !companies.some((c) => c.id === s.companyId))
      errors.push(`予定 ${s.id} の関連企業が見つかりません。`);
  }
  if (
    !Number.isInteger(seatData.rows) ||
    seatData.rows < 0 ||
    seatData.rows > 50 ||
    seatData.columns.length < 1 ||
    seatData.columns.length > 10 ||
    new Set(seatData.columns).size !== seatData.columns.length
  )
    errors.push("座席の行数・列設定を確認してください。");
  if (
    new Set(seatData.groups.map((g) => g.id)).size !== seatData.groups.length ||
    seatData.groups.some(
      (g) => !["blue", "mint", "violet", "gray"].includes(g.color),
    )
  )
    errors.push("座席グループのID・色を確認してください。");
  if (
    new Set(seatData.seats.map((s) => s.number)).size !==
      seatData.seats.length ||
    new Set(seatData.seats.map((s) => `${s.row}:${s.column}`)).size !==
      seatData.seats.length
  )
    errors.push("座席番号・配置が重複しています。");
  for (const seat of seatData.seats) {
    if (
      !Number.isInteger(seat.row) ||
      seat.row < 1 ||
      seat.row > seatData.rows ||
      seat.column === "aisle" ||
      !seatData.columns.includes(seat.column) ||
      !seatData.groups.some((g) => g.id === seat.groupId)
    )
      errors.push(`座席 ${seat.number} の配置・グループを確認してください。`);
  }
  if (
    new Set(learningData.map((l) => l.companyId)).size !== learningData.length
  )
    errors.push("学習データの企業IDが重複しています。");
  for (const learning of learningData) {
    if (
      !companies.some((c) => c.id === learning.companyId) ||
      new Set(learning.checklist.map((i) => i.id)).size !==
        learning.checklist.length ||
      learning.checklist.some((i) => !i.id || !i.text)
    )
      errors.push("学習データの企業ID・チェック項目を確認してください。");
  }
  return errors;
}
