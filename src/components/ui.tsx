import { t, usePreferences } from "@/state/preferences";
import { ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
export function Card({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  usePreferences();
  return <section className={`glass-card ${className}`}>{children}</section>;
}
export function PageTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
}) {
  usePreferences();
  return (
    <div className="page-title">
      {eyebrow && <span className="eyebrow">{t(eyebrow)}</span>}
      <h1>{t(title)}</h1>
      {description && <p>{t(description)}</p>}
    </div>
  );
}
export function SectionTitle({
  title,
  to,
  link = "詳しく見る",
}: {
  title: string;
  to?: string;
  link?: string;
}) {
  usePreferences();
  return (
    <div className="section-title">
      <h2>{t(title)}</h2>
      {to && (
        <Link to={to}>
          {t(link)}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  usePreferences();
  return (
    <Card>
      <p>{children}</p>
    </Card>
  );
}
