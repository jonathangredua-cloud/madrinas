// Madrinas Order Fulfillment Portal
// Warehouse dashboard for SAP B1 + Produmex WMS

import { useState, useMemo, useCallback, useEffect } from "react";
import { getOrders, releaseOrders, getReleaseHistory } from "../services/api.js";
import { INV } from "../data/inventory.js";
import {
  calcFulfill,
  buildSnapshots,
  calcStats,
  buildBaseSnap,
} from "../engine/fulfillment.js";
import { OrderTable } from "../components/OrderTable.jsx";
import { ReleaseModal } from "../components/ReleaseModal.jsx";
import { ReleaseHistory } from "../components/ReleaseHistory.jsx";

const MAX_SELECTION = 200;
const F = "'JetBrains Mono','Fira Code','SF Mono','Cascadia Code',monospace";

const baseSnap = buildBaseSnap(INV);

export default function MadrinasFulfillmentPortal() {
  const [orders, setOrders] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [releaseHistory, setReleaseHistory] = useState([]);

  // ── Data loading ──────────────────────────────────────────────────────────
  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [ordersRes, historyRes] = await Promise.all([getOrders(), getReleaseHistory()]);
      if (ordersRes.ok) setOrders(ordersRes.data);
      if (historyRes.ok) setReleaseHistory(historyRes.data);
    } catch {
      setError("Failed to load orders. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // ── Depletion snapshots (only for selected orders, in selection order) ────
  const dSnaps = useMemo(
    () => buildSnapshots(orders, selected, baseSnap),
    [orders, selected]
  );

  // ── Per-order analysis ────────────────────────────────────────────────────
  const analysis = useMemo(() => {
    const m = {};
    for (const o of orders) {
      const snap = selected.has(o.id) && dSnaps[o.id] ? dSnaps[o.id] : baseSnap;
      m[o.id] = calcFulfill(o, snap);
    }
    return m;
  }, [orders, selected, dSnaps]);

  const stats = useMemo(() => calcStats(orders, analysis), [orders, analysis]);

  // ── Selection helpers ─────────────────────────────────────────────────────
  function selectReady() {
    const ids = orders
      .filter((o) => {
        const s = analysis[o.id]?.status;
        return s === "ready" || s === "preorder";
      })
      .slice(0, MAX_SELECTION)
      .map((o) => o.id);
    setSelected(new Set(ids));
  }

  // ── Release flow ──────────────────────────────────────────────────────────
  const eligibleIds = useMemo(
    () =>
      [...selected].filter((id) => {
        const s = analysis[id]?.status;
        return s === "ready" || s === "preorder";
      }),
    [selected, analysis]
  );
  const blockedCount = selected.size - eligibleIds.length;

  async function handleConfirmRelease({ waveGroup }) {
    setModalOpen(false);
    const res = await releaseOrders({
      docNums: eligibleIds,
      releasedBy: "WH_SUPERVISOR",
      waveGroup,
    });
    if (res.ok) {
      setSelected(new Set());
      await load();
    } else {
      setError(res.error ?? "Release failed.");
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0b0e13",
        color: "#e2e8f0",
        fontFamily: F,
        fontSize: 13,
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* ── Header ────────────────────────────────────────────────────────── */}
      <header
        style={{
          background: "#111827",
          borderBottom: "1px solid rgba(251,191,36,0.2)",
          padding: "12px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 8,
              background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#0b0e13",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 6L9 2L16 6V12L9 16L2 12V6Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
              <path d="M9 8V16M2 6L9 8L16 6" stroke="currentColor" strokeWidth="1.2" opacity="0.5" />
            </svg>
          </div>
          <div>
            <div style={{ fontSize: 15, fontWeight: 900, color: "#fbbf24", letterSpacing: "2px" }}>
              MADRINAS · ORDER FULFILLMENT
            </div>
            <div style={{ fontSize: 10, color: "#475569" }}>
              Produmex WMS · Robot: Proposal → Pick List → Wave · Warehouse MFG
            </div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, fontSize: 11, color: "#64748b" }}>
          {releaseHistory.length > 0 && (
            <span
              style={{
                padding: "5px 10px",
                borderRadius: 5,
                background: "rgba(16,185,129,0.08)",
                border: "1px solid rgba(16,185,129,0.15)",
                color: "#10b981",
                fontWeight: 700,
                fontSize: 10,
              }}
            >
              {releaseHistory.length} release{releaseHistory.length !== 1 ? "s" : ""} today
            </span>
          )}
          <span
            style={{
              padding: "5px 12px",
              borderRadius: 5,
              background: "rgba(251,191,36,0.08)",
              border: "1px solid rgba(251,191,36,0.15)",
              color: "#fbbf24",
              fontWeight: 700,
            }}
          >
            WH: MFG
          </span>
          <span>
            {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
          </span>
        </div>
      </header>

      {/* ── Stats row ─────────────────────────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 1,
          background: "rgba(255,255,255,0.03)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        {[
          { label: "TOTAL ORDERS", value: stats.total,    color: "#e2e8f0",  bg: "transparent" },
          { label: "READY",         value: stats.ready,    color: "#10b981",  bg: "#10b98108" },
          { label: "SHORTAGE",      value: stats.shortage, color: "#ef4444",  bg: "#ef444408" },
          { label: "PRE-ORDER",     value: stats.preorder, color: "#60a5fa",  bg: "#60a5fa08" },
        ].map((s) => (
          <div
            key={s.label}
            style={{
              padding: "12px 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: s.bg,
            }}
          >
            <span style={{ fontSize: 9, letterSpacing: "1.5px", color: "#475569", fontWeight: 800 }}>
              {s.label}
            </span>
            <span
              style={{
                fontSize: 24,
                fontWeight: 900,
                color: s.color,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {s.value}
            </span>
          </div>
        ))}
      </div>

      {/* ── Release button bar ─────────────────────────────────────────────── */}
      <div
        style={{
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.01)",
        }}
      >
        {error && (
          <span style={{ flex: 1, fontSize: 11, color: "#fca5a5" }}>{error}</span>
        )}
        <button
          onClick={load}
          disabled={loading}
          style={{
            padding: "7px 14px",
            borderRadius: 5,
            background: "transparent",
            border: "1px solid rgba(255,255,255,0.08)",
            color: "#6b7280",
            fontSize: 10,
            fontWeight: 700,
            fontFamily: "inherit",
            cursor: loading ? "not-allowed" : "pointer",
          }}
        >
          {loading ? "Loading…" : "Refresh"}
        </button>
        <button
          onClick={() => setModalOpen(true)}
          disabled={selected.size === 0}
          style={{
            padding: "7px 18px",
            borderRadius: 5,
            border: "none",
            background:
              selected.size > 0 ? "linear-gradient(135deg,#fbbf24,#f59e0b)" : "rgba(255,255,255,0.04)",
            color: selected.size > 0 ? "#0b0e13" : "#334155",
            fontSize: 11,
            fontWeight: 900,
            fontFamily: "inherit",
            cursor: selected.size > 0 ? "pointer" : "not-allowed",
            letterSpacing: "0.8px",
            boxShadow: selected.size > 0 ? "0 0 16px rgba(251,191,36,0.25)" : "none",
          }}
        >
          GENERATE PICK LISTS
          {selected.size > 0 ? ` (${selected.size})` : ""}
        </button>
      </div>

      {/* ── Table ─────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        {loading ? (
          <div style={{ padding: 60, textAlign: "center", color: "#334155", fontSize: 13 }}>
            Loading orders…
          </div>
        ) : (
          <OrderTable
            orders={orders}
            analysis={analysis}
            selected={selected}
            onSelectionChange={setSelected}
            onSelectReady={selectReady}
          />
        )}
      </div>

      {/* ── Release modal ──────────────────────────────────────────────────── */}
      {modalOpen && (
        <ReleaseModal
          eligibleCount={eligibleIds.length}
          blockedCount={blockedCount}
          onConfirm={handleConfirmRelease}
          onCancel={() => setModalOpen(false)}
        />
      )}

      {/* ── Release history footer ─────────────────────────────────────────── */}
      <ReleaseHistory history={releaseHistory} />

      {/* ── Footer ────────────────────────────────────────────────────────── */}
      <div
        style={{
          background: "#111827",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          padding: "7px 24px",
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10,
          color: "#334155",
        }}
      >
        <span>Madrinas Fulfillment Portal v3 · Innormax · SAP B1 + Produmex WMS + ShipWise</span>
        <span>Cap: {MAX_SELECTION} · Robot: Proposal → PL → Wave</span>
      </div>
    </div>
  );
}
