import { event } from "@/data";
import {
ArrowRight,
Eye,
EyeOff,
Factory,
LockKeyhole,
ShieldCheck,
} from "lucide-react";
import { useState,type FormEvent } from "react";
const password = import.meta.env.VITE_VISIT_PASSWORD || "factory2026";
export default function Login({ onLogin }: { onLogin: () => void }) {
  const [value, setValue] = useState("");
  const [visible, setVisible] = useState(false);
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
      <div className="login-art" />
      <div className="login-intro">
        <h1>工場見学</h1>
        <span className="badge">架空の見学プログラム · サンプル版</span>
      </div>
      <form onSubmit={submit} className="glass-card login-panel">
        <span className="brand-icon">
          <Factory size={30} />
        </span>
        <h2>ログイン</h2>
        <label htmlFor="password">見学用パスワード</label>
        <div className="password-field">
          <LockKeyhole size={19} />
          <input
            id="password"
            type={visible ? "text" : "password"}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            required
            autoComplete="current-password"
            aria-describedby={error ? "login-error" : undefined}
            aria-invalid={!!error}
          />
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "パスワードを隠す" : "パスワードを表示"}
          >
            {visible ? <EyeOff size={20} /> : <Eye size={20} />}
          </button>
        </div>
        {error && (
          <p id="login-error" role="alert" className="error">
            {error}
          </p>
        )}
        <button className="button primary" type="submit">
          見学ガイドをひらく
          <ArrowRight size={19} />
        </button>
        {!import.meta.env.VITE_VISIT_PASSWORD && (
          <small className="demo-password">{event.passwordHint}</small>
        )}
        <div className="login-disclaimer">
          <ShieldCheck size={18} />
          <small>
            簡易的な閲覧ゲートです。個人情報・機密情報を保護する認証ではありません。
          </small>
        </div>
      </form>
    </div>
  );
}
