import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import { desktopLinks, mobileLinks } from "@/config/site";
import { Bell, Building2, LogOut, Settings } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
export function Sidebar({ logout }: { logout: () => void }) {
  usePreferences();
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-icon">
          <Building2 />
        </span>
        <span>
          COMPANY<span className="brand-sub">VISIT GUIDE</span>
        </span>
      </Link>
      <nav aria-label={t("メインナビゲーション")}>
        {desktopLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon size={20} />
            {t(label)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="logout" onClick={logout}>
          <LogOut size={18} />
          {t("ログアウト")}
        </button>
        <small>{t("発表概要版 · v0.2")}</small>
      </div>
    </aside>
  );
}
export function Navbar() {
  usePreferences();
  return (
    <header className="header">
      <div>
        <span className="header-mark">
          <Building2 size={19} />
        </span>
        {t("県外企業見学")}
        <span className="header-sub">{t("電子パンフレット")}</span>
      </div>
      <div className="header-actions">
        <DisplayControls />
        <span className="sample-pill">{t("概要版")}</span>
        <Link
          className="icon-button notification"
          to="/announcements"
          aria-label={t("お知らせ")}
        >
          <Bell size={20} />
          <i />
        </Link>
        <Link className="icon-button" to="/settings" aria-label={t("設定")}>
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
}
export function BottomNavigation() {
  usePreferences();
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav" aria-label={t("モバイルナビゲーション")}>
      {mobileLinks.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={({ isActive }) =>
            isActive ||
            (to === "/more" &&
              [
                "/guide",
                "/seats",
                "/learning",
                "/announcements",
                "/settings",
              ].includes(pathname))
              ? "active"
              : ""
          }
        >
          <Icon size={20} />
          <span>{t(label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
