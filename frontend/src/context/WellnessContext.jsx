import { createContext, useContext, useMemo, useState } from "react";

const WellnessContext = createContext(null);

const PROFILE_KEY = "wellmind-profile";
const HISTORY_KEY = "wellmind-history";

function loadJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

export function WellnessProvider({ children }) {
  const [profile, setProfile] = useState(() =>
    loadJson(PROFILE_KEY, { name: "WellMind User", age: "", gender: "", occupation: "" })
  );
  const [history, setHistory] = useState(() => loadJson(HISTORY_KEY, []));
  const [latestResult, setLatestResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const saveResult = (result, recommendations) => {
    const entry = {
      id: crypto.randomUUID(),
      date: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      category: result.category,
      score: result.wellnessScore,
      recommendation: recommendations[0]?.title ?? "Review dashboard",
      result,
    };
    setLatestResult({ ...result, recommendations });
    setHistory((prev) => {
      const next = [entry, ...prev].slice(0, 20);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(next));
      return next;
    });
  };

  const updateProfile = (patch) => {
    setProfile((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
      return next;
    });
  };

  const value = useMemo(
    () => ({
      profile,
      updateProfile,
      history,
      latestResult,
      saveResult,
      loading,
      setLoading,
    }),
    [profile, history, latestResult, loading]
  );

  return <WellnessContext.Provider value={value}>{children}</WellnessContext.Provider>;
}

export function useWellness() {
  const ctx = useContext(WellnessContext);
  if (!ctx) throw new Error("useWellness must be used within WellnessProvider");
  return ctx;
}
