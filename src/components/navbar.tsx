import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import { desktopLinks, mobileLinks } from "@/config/site";
import { Bell, Building2, LogOut, Settings } from "lucide-react";
import { useRef, type CSSProperties } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const gesture = useRef<{
    id: number;
    x: number;
    y: number;
    path: string;
  } | null>(null);
  const suppressClick = useRef(false);
  const activeIndex = Math.max(
    0,
    mobileLinks.findIndex(({ to }) =>
      to === "/"
        ? pathname === "/"
        : to === "/more"
          ? [
              "/more",
              "/guide",
              "/seats",
              "/learning",
              "/announcements",
              "/settings",
            ].includes(pathname)
          : pathname === to || pathname.startsWith(to + "/"),
    ),
  );
  return (
    <nav
      className="bottom-nav"
      style={{ "--active-tab": activeIndex, "--tab-count": mobileLinks.length } as CSSProperties}
      aria-label={t("モバイルナビゲーション")}
      onPointerDown={(event) => {
        suppressClick.current = false;
        if (event.pointerType !== "touch" || !event.isPrimary) return;
        gesture.current = {
          id: event.pointerId,
          x: event.clientX,
          y: event.clientY,
          path: pathname,
        };
      }}
      onPointerMove={(event) => {
        const start = gesture.current;
        if (!start || start.id !== event.pointerId) return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dy) > 16 && Math.abs(dy) > Math.abs(dx)) {
          gesture.current = null;
          return;
        }
        if (Math.abs(dx) >= 16 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          suppressClick.current = true;
          event.currentTarget.setPointerCapture(event.pointerId);
        }
      }}
      onPointerUp={(event) => {
        const start = gesture.current;
        gesture.current = null;
        if (!start || start.id !== event.pointerId || start.path !== pathname)
          return;
        const dx = event.clientX - start.x;
        const dy = event.clientY - start.y;
        if (Math.abs(dx) < 48 || Math.abs(dx) <= Math.abs(dy) * 1.5) return;
        suppressClick.current = true;
        const next = activeIndex + (dx < 0 ? 1 : -1);
        if (next >= 0 && next < mobileLinks.length)
          navigate(mobileLinks[next].to);
      }}
      onPointerCancel={() => {
        gesture.current = null;
      }}
      onClickCapture={(event) => {
        if (suppressClick.current && event.detail !== 0) {
          event.preventDefault();
          event.stopPropagation();
        }
        suppressClick.current = false;
      }}
    >
      <span className="tab-indicator" aria-hidden="true" />
      {mobileLinks.map(({ to, label, icon: Icon }, index) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          className={index === activeIndex ? "active" : ""}
          aria-current={index === activeIndex ? "page" : undefined}
        >
          <Icon size={20} />
          <span>{t(label)}</span>
        </NavLink>
      ))}
    </nav>
  );
}
