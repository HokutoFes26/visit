import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { registerSW } from "virtual:pwa-register";

interface InstallPrompt extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}
const PwaContext = createContext({
  online: true,
  ready: false,
  checking: false,
  update: false,
  error: "",
  installable: false,
  check: async () => {},
  apply: () => {},
  install: async () => {},
  repair: async () => {},
});
export const usePwa = () => useContext(PwaContext);

export function PwaProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(navigator.onLine);
  const [ready, setReady] = useState(false);
  const [checking, setChecking] = useState(false);
  const [update, setUpdate] = useState(false);
  const [error, setError] = useState("");
  const [registration, setRegistration] = useState<ServiceWorkerRegistration>();
  const [prompt, setPrompt] = useState<InstallPrompt>();

  async function check() {
    const worker = navigator.serviceWorker?.controller;
    if (!worker) {
      setReady(false);
      return;
    }
    setChecking(true);
    const complete = await new Promise<boolean>((resolve) => {
      const channel = new MessageChannel();
      const finish = (value: boolean) => {
        clearTimeout(timer);
        channel.port1.close();
        resolve(value);
      };
      const timer = setTimeout(() => finish(false), 5000);
      channel.port1.onmessage = (e) => finish(e.data?.ready === true);
      try {
        worker.postMessage({ type: "CHECK_OFFLINE_READY" }, [channel.port2]);
      } catch {
        finish(false);
      }
    });
    setReady(complete);
    setChecking(false);
  }

  useEffect(() => {
    const onlineChanged = () => {
      setOnline(navigator.onLine);
      void check();
    };
    const installEvent = (event: Event) => {
      event.preventDefault();
      setPrompt(event as InstallPrompt);
    };
    const installed = () => setPrompt(undefined);
    window.addEventListener("online", onlineChanged);
    window.addEventListener("offline", onlineChanged);
    window.addEventListener("beforeinstallprompt", installEvent);
    window.addEventListener("appinstalled", installed);
    if (import.meta.env.PROD && "serviceWorker" in navigator) {
      registerSW({
        immediate: true,
        onNeedRefresh() {
          setUpdate(true);
        },
        onNeedReload() {
          // Another tab may activate the update; keep this tab's draft until consent.
          setUpdate(true);
        },
        onOfflineReady() {
          void check();
        },
        onRegisteredSW(_url, reg) {
          setRegistration(reg);
          void check();
        },
        onRegisterError() {
          setError(
            "オフラインの準備に失敗しました。オンラインで再読み込みしてください。",
          );
        },
      });
    }
    const controlled = () => {
      void check();
    };
    navigator.serviceWorker?.addEventListener("controllerchange", controlled);
    const visible = () => {
      if (!document.hidden) void check();
    };
    document.addEventListener("visibilitychange", visible);
    const timer = setInterval(() => {
      void check();
    }, 30000);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", onlineChanged);
      window.removeEventListener("offline", onlineChanged);
      window.removeEventListener("beforeinstallprompt", installEvent);
      window.removeEventListener("appinstalled", installed);
      navigator.serviceWorker?.removeEventListener(
        "controllerchange",
        controlled,
      );
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);

  useEffect(() => {
    if (!registration) return;
    const updateCheck = () => {
      if (navigator.onLine)
        registration
          .update()
          .catch(() =>
            setError(
              "更新を確認できませんでした。接続を確認して再試行してください。",
            ),
          );
    };
    window.addEventListener("online", updateCheck);
    const timer = setInterval(updateCheck, 60 * 60 * 1000);
    return () => {
      clearInterval(timer);
      window.removeEventListener("online", updateCheck);
    };
  }, [registration]);

  function apply() {
    // Drafts are persisted synchronously; failed saves must not be discarded.
    if (document.querySelector('[data-unsaved="true"]')) {
      setError(
        "未保存の入力があります。メモは保存または書き出し、チェック状態は保存を再試行してから更新してください。",
      );
      return;
    }
    if (!registration?.waiting) {
      location.reload();
      return;
    }
    navigator.serviceWorker.addEventListener(
      "controllerchange",
      () => location.reload(),
      { once: true },
    );
    registration.waiting.postMessage({ type: "SKIP_WAITING" });
  }
  async function install() {
    if (!prompt) return;
    try {
      await prompt.prompt();
      await prompt.userChoice;
      setPrompt(undefined);
    } catch {
      setError(
        "インストールできませんでした。ブラウザのメニューをご確認ください。",
      );
    }
  }
  return (
    <PwaContext.Provider
      value={{
        online,
        ready,
        checking,
        update,
        error,
        installable: !!prompt,
        check: async () => {
          setError("");
          await check();
          if (registration && navigator.onLine)
            try {
              await registration.update();
            } catch {
              setError("更新を確認できませんでした。");
            }
        },
        apply,
        install,
        repair: async () => {
          if (!navigator.onLine) {
            setError("オンラインに接続してから再準備してください。");
            return;
          }
          if (document.querySelector('[data-unsaved="true"]')) {
            setError(
              "未保存の入力があります。保存またはメモの書き出しを先に行ってください。",
            );
            return;
          }
          try {
            await registration?.unregister();
            location.reload();
          } catch {
            setError(
              "再準備できませんでした。ブラウザを閉じて開き直してください。",
            );
          }
        },
      }}
    >
      {children}
    </PwaContext.Provider>
  );
}

export function PwaStatus() {
  const pwa = usePwa();
  return (
    <div className="pwa-status">
      <span role="status">
        {!pwa.online ? "オフライン · " : ""}
        {import.meta.env.DEV
          ? "オフライン対応は本番プレビューで確認できます"
          : pwa.ready
            ? "オフライン準備完了"
            : "オフライン未準備"}
      </span>
      {pwa.update && (
        <div className="update-notice">
          <span>新しい情報があります。</span>
          <button className="button primary" onClick={pwa.apply}>
            更新を適用
          </button>
        </div>
      )}
      {pwa.error && (
        <p role="alert" className="error">
          {pwa.error}
        </p>
      )}
    </div>
  );
}

export function PwaSettings() {
  const pwa = usePwa();
  return (
    <>
      <h2>オフライン対応</h2>
      <PwaStatus />
      <p>
        初回はオンラインで開き、「オフライン準備完了」を確認してください。ブラウザのデータを削除すると再準備が必要です。外部サイトはオンライン接続が必要です。
      </p>
      <button
        className="button secondary"
        disabled={pwa.checking}
        onClick={() => void pwa.check()}
      >
        {pwa.checking ? "確認中…" : "キャッシュ・更新を確認"}
      </button>
      {!import.meta.env.DEV && !pwa.ready && (
        <button className="button secondary" onClick={() => void pwa.repair()}>
          オフラインを再準備
        </button>
      )}
      <h2>ホーム画面に追加</h2>
      {pwa.installable ? (
        <button className="button primary" onClick={() => void pwa.install()}>
          アプリをインストール
        </button>
      ) : (
        <p>
          対応ブラウザのメニューから「アプリをインストール」または「ホーム画面に追加」を選択してください。iPhoneではSafariの共有メニューをご利用ください。
        </p>
      )}
    </>
  );
}
