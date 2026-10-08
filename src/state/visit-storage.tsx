import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
const NOTES_KEY = "factory-visit:notes:v1";
const CHECKS_KEY = "factory-visit:learning:v1";
function readRecord<T extends string | boolean>(
  key: string,
  type: "string" | "boolean",
): { value: Record<string, T>; error: string } {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return { value: {}, error: "" };
    const data: unknown = JSON.parse(raw);
    if (
      !data ||
      typeof data !== "object" ||
      Array.isArray(data) ||
      !Object.values(data).every((v) => typeof v === type)
    )
      throw new Error("invalid");
    return { value: data as Record<string, T>, error: "" };
  } catch {
    return {
      value: {},
      error:
        "保存データを読み込めませんでした。新しい入力は保存領域が利用できるまで、この画面内にのみ保持されます。",
    };
  }
}
function useRecord<T extends string | boolean>(
  key: string,
  type: "string" | "boolean",
) {
  const [initial] = useState(() => readRecord<T>(key, type));
  const [value, setValue] = useState(initial.value);
  const latest = useRef(value);
  const [error, setError] = useState(initial.error);
  const [dirty, setDirty] = useState(false);
  const [saved, setSaved] = useState(false);
  const [backedUp, setBackedUp] = useState(false);
  function save(next = latest.current) {
    try {
      localStorage.setItem(key, JSON.stringify(next));
      setError("");
      setDirty(false);
      setSaved(true);
    } catch {
      setError(
        "端末に保存できませんでした。空き容量・ブラウザ設定を確認し、保存を再試行してください。",
      );
      setDirty(true);
      setSaved(false);
    }
  }
  function change(id: string, text: T) {
    const next = { ...latest.current, [id]: text };
    latest.current = next;
    setValue(next);
    setBackedUp(false);
    save(next);
  }
  return {
    value,
    error,
    dirty,
    saved,
    backedUp,
    change,
    save: () => save(),
    backup: () => setBackedUp(true),
  };
}
type NotesStore = ReturnType<typeof useRecord<string>>;
type ChecksStore = ReturnType<typeof useRecord<boolean>>;
const StorageContext = createContext<{
  notes: NotesStore;
  checks: ChecksStore;
} | null>(null);
export function useStorage() {
  const state = useContext(StorageContext);
  if (!state) throw new Error("Storage provider required");
  return state;
}
export function VisitStorageProvider({ children }: { children: ReactNode }) {
  const notes = useRecord<string>(NOTES_KEY, "string");
  const checks = useRecord<boolean>(CHECKS_KEY, "boolean");
  const unsaved = (notes.dirty && !notes.backedUp) || checks.dirty;
  useEffect(() => {
    if (!unsaved) return;
    const warn = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [unsaved]);
  return (
    <StorageContext.Provider value={{ notes, checks }}>
      <div data-unsaved={unsaved}>{children}</div>
    </StorageContext.Provider>
  );
}
