import { useState, useEffect, useCallback } from "react";
import { Routes, Route } from "react-router-dom";
import { supabase, hasSupabase } from "./lib/supabase";
import { upsertLocal } from "./utils/mergeLogic";
import Navbar from "./components/Navbar";
import MapPage from "./pages/MapPage";
import RecordsPage from "./pages/RecordsPage";
import DashboardPage from "./pages/DashboardPage";

const LS_KEY = "infra_init_assets_v1";
const loadLocal = () => {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
};
const saveLocal = (a) => localStorage.setItem(LS_KEY, JSON.stringify(a));

export default function App() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function load() {
      if (!hasSupabase) {
        setAssets(loadLocal());
        setLoading(false);
        return;
      }
      const { data, error } = await supabase
        .from("assets")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) setError(error.message);
      else setAssets(data || []);
      setLoading(false);
    }
    load();
  }, []);

  useEffect(() => {
    if (!hasSupabase) return;
    const ch = supabase
      .channel("assets-rt")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "assets" },
        (p) => {
          if (p.eventType === "INSERT") setAssets((prev) => [p.new, ...prev]);
          else if (p.eventType === "UPDATE")
            setAssets((prev) =>
              prev.map((a) => (a.id === p.new.id ? p.new : a)),
            );
          else if (p.eventType === "DELETE")
            setAssets((prev) => prev.filter((a) => a.id !== p.old.id));
        },
      )
      .subscribe();
    return () => supabase.removeChannel(ch);
  }, []);

  const handleSave = useCallback(async (incoming) => {
    if (!hasSupabase) {
      setAssets((prev) => {
        const next = upsertLocal(prev, incoming);
        saveLocal(next);
        return next;
      });
      return;
    }
    setAssets((prev) => upsertLocal(prev, incoming));
    const { id, ...fields } = incoming;
    if (id) {
      const { data, err } = await supabase
        .from("assets")
        .update(fields)
        .eq("id", id)
        .select()
        .single();
      if (!err) setAssets((prev) => prev.map((a) => (a.id === id ? data : a)));
    } else {
      const { data, err } = await supabase
        .from("assets")
        .upsert(fields, { onConflict: "lat,lng" })
        .select()
        .single();
      if (!err)
        setAssets((prev) => [data, ...prev.filter((a) => a.id !== data.id)]);
    }
  }, []);

  useEffect(() => {
    async function test() {
      const { data, error } = await supabase.from("assets").select("*");

      console.log("DATA:", data);
      console.log("ERROR:", error);
    }

    test();
  }, []);

  const handleDelete = useCallback(async (id) => {
    if (!hasSupabase) {
      setAssets((prev) => {
        const next = prev.filter((a) => a.id !== id);
        saveLocal(next);
        return next;
      });
      return;
    }
    setAssets((prev) => prev.filter((a) => a.id !== id));
    const { error } = await supabase.from("assets").delete().eq("id", id);
    if (error) {
      const { data } = await supabase
        .from("assets")
        .select("*")
        .order("created_at", { ascending: false });
      setAssets(data || []);
    }
  }, []);

  if (loading)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-bg text-txt2">
        <div className="w-8 h-8 rounded-full border-2 border-border border-t-accent animate-spin" />
        <p className="text-sm font-medium">Loading assets…</p>
      </div>
    );

  if (error)
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-3 bg-bg text-center px-6">
        <h2 className="text-xl font-extrabold text-crit">Connection Error</h2>
        <p className="text-txt2 text-sm">{error}</p>
        <p className="text-muted text-xs font-mono mt-1">
          Check VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env
        </p>
      </div>
    );

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-bg">
      <Navbar assets={assets} />
      <main className="flex-1 overflow-hidden relative">
        <Routes>
          <Route
            path="/"
            element={
              <MapPage
                assets={assets}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/records"
            element={
              <RecordsPage
                assets={assets}
                onSave={handleSave}
                onDelete={handleDelete}
              />
            }
          />
          <Route
            path="/dashboard"
            element={<DashboardPage assets={assets} />}
          />
        </Routes>
      </main>

      {!hasSupabase && (
        <div className="fixed bottom-4 right-4 z-[9000] bg-card border border-border rounded-xl px-4 py-3 text-[12px] text-txt2 max-w-[260px] leading-relaxed font-medium">
          <strong className="text-warn">⚠ Local mode</strong>
          <br />
          No Supabase connected. Add{" "}
          <code className="text-accent">VITE_SUPABASE_URL</code> +{" "}
          <code className="text-accent">VITE_SUPABASE_ANON_KEY</code> to{" "}
          <code>.env</code> to enable cloud sync.
        </div>
      )}
    </div>
  );
}
