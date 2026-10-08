import {
  Bell,
  BookOpen,
  Building2,
  CalendarDays,
  StickyNote,
  Users,
} from "lucide-react";
export const shortcuts = [
  { to: "/schedule", title: "スケジュール", icon: CalendarDays, color: "blue" },
  { to: "/companies", title: "企業情報", icon: Building2, color: "cyan" },
  { to: "/seats", title: "座席案内", icon: Users, color: "violet" },
  { to: "/learning", title: "事前学習", icon: BookOpen, color: "amber" },
  { to: "/notes", title: "見学メモ", icon: StickyNote, color: "mint" },
  { to: "/announcements", title: "お知らせ", icon: Bell, color: "rose" },
];

import { Ellipsis, House } from "lucide-react";
export const desktopLinks = [
  { to: "/", label: "ホーム", icon: House },
  { to: "/schedule", label: "スケジュール", icon: CalendarDays },
  { to: "/companies", label: "企業情報", icon: Building2 },
  { to: "/guide", label: "見学ガイド", icon: BookOpen },
  { to: "/seats", label: "座席案内", icon: Users },
  { to: "/learning", label: "事前学習", icon: BookOpen },
  { to: "/notes", label: "見学メモ", icon: StickyNote },
  { to: "/more", label: "その他", icon: Ellipsis },
];
export const mobileLinks = [
  ...desktopLinks.slice(0, 3),
  { to: "/notes", label: "メモ", icon: StickyNote },
  { to: "/more", label: "その他", icon: Ellipsis },
];
