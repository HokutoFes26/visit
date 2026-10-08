import { desktopLinks, mobileLinks } from "@/config/site";
import { Bell, Factory, LogOut, Settings } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";
export function Sidebar({ logout }: { logout: () => void }) {
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-icon">
          <Factory />
        </span>
        <span>
          FACTORY<span className="brand-sub">VISIT GUIDE</span>
        </span>
      </Link>
      <nav aria-label="メインナビゲーション">
        {desktopLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon size={20} />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <button className="logout" onClick={logout}>
          <LogOut size={18} />
          ログアウト
        </button>
        <small>発表概要版 · v0.2</small>
      </div>
    </aside>
  );
}
export function Navbar() {
  return (
    <header className="header">
      <div>
        <span className="header-mark">
          <Factory size={19} />
        </span>
        工場見学 <span className="header-sub">電子パンフレット</span>
      </div>
      <div className="header-actions">
        <span className="sample-pill">概要版</span>
        <Link
          className="icon-button notification"
          to="/announcements"
          aria-label="お知らせ"
        >
          <Bell size={20} />
          <i />
        </Link>
        <Link className="icon-button" to="/settings" aria-label="設定">
          <Settings size={20} />
        </Link>
      </div>
    </header>
  );
}
export function BottomNavigation() {
  const { pathname } = useLocation();
  return (
    <nav className="bottom-nav" aria-label="モバイルナビゲーション">
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
          <span>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}
