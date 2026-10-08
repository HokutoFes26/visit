import { validateData } from "@/data";
import Layout from "@/layouts/default";
import AnnouncementsPage from "@/pages/announcements";
import CompaniesPage from "@/pages/companies";
import CompanyDetail from "@/pages/company-detail";
import GuidePage from "@/pages/guide";
import Home from "@/pages/index";
import LearningPage from "@/pages/learning";
import Login from "@/pages/login";
import MorePage from "@/pages/more";
import NotesPage from "@/pages/notes";
import SchedulePage from "@/pages/schedule";
import SeatsPage from "@/pages/seats";
import SettingsPage from "@/pages/settings";
import { useState } from "react";
import { Navigate,Route,Routes } from "react-router-dom";
const AUTH_KEY = "factory-visit:gate:v1";
export default function App() {
  const [authenticated, setAuthenticated] = useState(() => {
    try {
      return sessionStorage.getItem(AUTH_KEY) === "open";
    } catch {
      return false;
    }
  });
  const [storageWarning, setStorageWarning] = useState("");
  const errors = validateData();
  function login() {
    try {
      sessionStorage.setItem(AUTH_KEY, "open");
    } catch {
      setStorageWarning(
        "このブラウザではログイン状態を保存できません。再読み込みすると再入力が必要です。",
      );
    }
    setAuthenticated(true);
  }
  function logout() {
    try {
      sessionStorage.removeItem(AUTH_KEY);
    } catch {
      setStorageWarning(
        "保存領域にアクセスできません。共有端末ではブラウザを閉じてください。",
      );
    }
    setAuthenticated(false);
  }
  if (errors.length)
    return (
      <div className="error-screen" role="alert">
        <h1>データの設定を確認してください</h1>
        {errors.map((e, i) => (
          <p key={i}>{e}</p>
        ))}
      </div>
    );
  if (!authenticated) return <Login onLogin={login} />;
  return (
    <>
      {storageWarning && (
        <div className="storage-warning" role="alert">
          {storageWarning}
        </div>
      )}
      <Routes>
        <Route element={<Layout logout={logout} />}>
          <Route index element={<Home />} />
          <Route path="schedule" element={<SchedulePage />} />
          <Route path="companies" element={<CompaniesPage />} />
          <Route path="companies/:id" element={<CompanyDetail />} />
          <Route path="guide" element={<GuidePage />} />
          <Route path="announcements" element={<AnnouncementsPage />} />
          <Route path="seats" element={<SeatsPage />} />
          <Route path="learning" element={<LearningPage />} />
          <Route path="notes" element={<NotesPage />} />
          <Route path="more" element={<MorePage />} />
          <Route path="settings" element={<SettingsPage logout={logout} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </>
  );
}
