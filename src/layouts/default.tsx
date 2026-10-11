import { t, usePreferences } from "@/state/preferences";
import { BottomNavigation, Navbar, Sidebar } from "@/components/navbar";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";

export default function Layout({ logout }: { logout: () => void }) {
  usePreferences();
  const { pathname } = useLocation();
  const main = useRef<HTMLElement>(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    main.current?.focus({ preventScroll: true });
  }, [pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#main"
        onClick={(e) => {
          e.preventDefault();
          main.current?.focus();
          main.current?.scrollIntoView();
        }}
      >
        {t("本文へ移動")}
      </a>
      <Sidebar logout={logout} />
      <div className="workspace">
        <Navbar />
        <main id="main" tabIndex={-1} ref={main}>
          <Outlet />
        </main>
        <footer>
          COMPANY VISIT GUIDE{t(" ")}
          <span>
            {t("発表概要に基づく案内です。")}
            {t(" ")}
            <Link to="/guide">
              {t("見学ガイド")}
              <ArrowUpRight size={12} />
            </Link>
          </span>
        </footer>
      </div>
      <BottomNavigation />
    </>
  );
}
