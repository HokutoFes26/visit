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
  return (
    <div className="page-title">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1>{title}</h1>
      {description && <p>{description}</p>}
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
  return (
    <div className="section-title">
      <h2>{title}</h2>
      {to && (
        <Link to={to}>
          {link}
          <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
export function EmptyState({ children }: { children: ReactNode }) {
  return (
    <Card>
      <p>{children}</p>
    </Card>
  );
}
