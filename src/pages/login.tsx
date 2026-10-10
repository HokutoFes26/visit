import { DisplayControls } from "@/components/display-controls";
import { t, usePreferences } from "@/state/preferences";
import { event } from "@/data";
import { Badge, Box, Button, PasswordInput, Text, Title } from "@mantine/core";
import { ArrowRight, Building2, LockKeyhole, ShieldCheck } from "lucide-react";
import { useState, type FormEvent } from "react";
import "@/styles/display-controls.css";
import "@/styles/login.css";

const password = import.meta.env.VITE_VISIT_PASSWORD || "factory2026";

export default function Login({ onLogin }: { onLogin: () => void }) {
  usePreferences();
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function submit(e: FormEvent) {
    e.preventDefault();
    if (value !== password) {
      setError("パスワードが違います。もう一度ご確認ください。");
      return;
    }
    onLogin();
  }

  return (
    <div className="login-screen">
      <div className="login-controls">
        <DisplayControls />
      </div>
      <div className="login-intro">
        <h1>{t("県外企業見学")}</h1>
      </div>
      <form onSubmit={submit} className="glass-card login-panel">
        <span className="brand-icon">
          <Building2 size={24} />
        </span>
        <h2>{t("ログイン")}</h2>
        <PasswordInput
          id="password"
          label={t("見学用パスワード")}
          leftSection={<LockKeyhole size={18} />}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          required
          autoComplete="current-password"
          radius="xl"
          size="lg"
          visibilityToggleButtonProps={{
            "aria-label": t("パスワードを表示"),
          }}
          aria-describedby={error ? "login-error" : undefined}
          aria-invalid={!!error}
          styles={{
            input: {
              background: "var(--surface-secondary)",
              borderColor: error
                ? "var(--mantine-color-red-filled)"
                : "var(--border)",
            },
            label: { fontWeight: 600, marginBottom: 12, fontSize: "0.875rem" },
          }}
        />
        {error && (
          <p id="login-error" role="alert" className="error">
            {t(error)}
          </p>
        )}
        <Button
          type="submit"
          variant="filled"
          color="var(--foreground)"
          radius="xl"
          fullWidth
          size="lg"
          mt="lg"
          rightSection={<ArrowRight size={18} />}
        >
          <Text fw={700} c="var(--surface)">
            {t("見学ガイドをひらく")}
            </Text>
        </Button>
        {!import.meta.env.VITE_VISIT_PASSWORD && (
          <small className="demo-password">{t(event.passwordHint)}</small>
        )}
        <div className="login-disclaimer">
          <ShieldCheck size={18} />
          <small>
            {t(
              "簡易的な閲覧ゲートです。個人情報・機密情報を保護する認証ではありません。",
            )}
          </small>
        </div>
      </form>
    </div>
  );
}
