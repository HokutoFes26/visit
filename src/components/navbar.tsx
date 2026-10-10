import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import { desktopLinks, mobileLinks } from "@/config/site";
import { ActionIcon, Badge, Button, Group, Stack, Text, Box } from "@mantine/core";
import { Bell, Building2, LogOut, Settings } from "lucide-react";
import { Link, NavLink, useLocation } from "react-router-dom";

export function Sidebar({ logout }: { logout: () => void }) {
  usePreferences();
  return (
    <aside className="sidebar">
      <Link to="/" className="brand">
        <span className="brand-icon">
          <Building2 size={20} />
        </span>
        <span>
          COMPANY<span className="brand-sub">VISIT GUIDE</span>
        </span>
      </Link>
      <nav aria-label={t("メインナビゲーション")}>
        {desktopLinks.map(({ to, label, icon: Icon }) => (
          <NavLink key={to} to={to} end={to === "/"}>
            <Icon size={18} />
            {t(label)}
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <Button
          variant="subtle"
          color="gray"
          leftSection={<LogOut size={16} />}
          onClick={logout}
          fullWidth
          justify="flex-start"
          size="sm"
        >
          {t("ログアウト")}
        </Button>
        <small>{t("発表概要版 · v0.2")}</small>
      </div>
    </aside>
  );
}

export function Navbar() {
  usePreferences();
  return (
    <>
      <header className="header" style={{ height: 60, padding: "0 16px" }}>
        <Group gap="sm" align="center">
          <Box
            style={{
              width: 28,
              height: 28,
              borderRadius: 6,
              background: "var(--foreground, #000000)",
              color: "var(--surface, #ffffff)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Building2 size={16}/>
          </Box>
        </Group>

        <Group gap={6} align="center" className="header-actions">
          <DisplayControls />
          <Link
            to="/announcements"
            aria-label={t("お知らせ")}
            className="header-action-btn notification"
          >
            <Bell size={16} />
            <i />
          </Link>
          <Link
            to="/settings"
            aria-label={t("設定")}
            className="header-action-btn"
          >
            <Settings size={16} />
          </Link>
        </Group>
      </header>
    </>
  );
}

export function BottomNavigation() {
  usePreferences();
  const { pathname } = useLocation();

  const tabCount = mobileLinks.length;
  const SIDE_PADDING = 3.5;
  const availableWidth = 100 - SIDE_PADDING * 2;
  const slotWidth = availableWidth / tabCount;
  const indicatorWidth = 25;

  const activeIndex = mobileLinks.findIndex(({ to }) => {
    if (to === "/") return pathname === "/";
    if (to === "/more") {
      return [
        "/more",
        "/guide",
        "/seats",
        "/learning",
        "/announcements",
        "/settings",
      ].includes(pathname);
    }
    return pathname.startsWith(to);
  });

  const currentIndex = activeIndex === -1 ? 0 : activeIndex;
  const activeCenter = SIDE_PADDING + (currentIndex + 0.5) * slotWidth;

  return (
    <nav className="bottom-nav" aria-label={t("モバイルナビゲーション")}>
      <div className="footerRef">
        <div
          className="navIndicator"
          style={{
            width: `${indicatorWidth}%`,
            left: `${activeCenter}%`,
            transform: "translateX(-50%)",
          }}
        />

        <div
          className="navWrapper"
          style={{
            padding: `0 ${SIDE_PADDING}%`,
          }}
        >
          {mobileLinks.map(({ to, label, icon: Icon }, index) => {
            const isActive = index === currentIndex;

            return (
              <NavLink
                key={to}
                to={to}
                end={to === "/"}
                className={`navTabBtn ${isActive ? "active" : "inactive"}`}
                style={{ width: `${100 / tabCount}%` }}
              >
                <Icon
                  size={20}
                  className="navIcon"
                  strokeWidth={isActive ? 2.4 : 1.7}
                  style={{
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                  }}
                />
                <span className="navLabel">
                  {t(label)}
                </span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
