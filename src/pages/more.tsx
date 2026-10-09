import { t, usePreferences } from "@/state/preferences";
import { PageTitle } from "@/components/ui";
import { shortcuts } from "@/config/site";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
export default function MorePage() {
  usePreferences();
  return (
    <>
      <PageTitle title={t("その他")} />
      <div className="shortcut-grid">
        {[
          { to: "/guide", title: "集合・持ち物・注意事項" },
          { to: "/sightseeing", title: "東京観光" },
          ...shortcuts.slice(2),
          { to: "/settings", title: "設定" },
        ].map((s) => (
          <Link className="glass-card more-link" key={s.to} to={s.to}>
            {t(s.title)}
            <ChevronRight size={18} />
          </Link>
        ))}
      </div>
    </>
  );
}
