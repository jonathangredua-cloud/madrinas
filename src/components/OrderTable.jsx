// OrderTable — sortable, filterable, selectable order grid

import { useState, useMemo } from "react";
import { FulfillmentBar } from "./FulfillmentBar.jsx";
import { StatusPill } from "./StatusPill.jsx";
import { LineDetail } from "./LineDetail.jsx";

const MAX_SELECTION = 200;

function SortIcon({ field, sortField, sortDir }) {
  if (sortField !== field) return null;
  return sortDir === "asc" ? (
    <svg width="10" height="10" viewBox="0 0 12 12">
      <path d="M6 2L10 8H2Z" fill="currentColor" />
    </svg>
  ) : (
    <svg width="10" height="10" viewBox="0 0 12 12">
      <path d="M6 10L2 4H10Z" fill="currentColor" />
    </svg>
  );
}

function Chevron({ open }) {
  return (
    <svg
      width="14"
      height="14"
      viewBox="0 0 14 14"
      fill="none"
      style={{ transition: "transform 0.2s", transform: open ? "rotate(90deg)" : "rotate(0)" }}
    >
      <path d="M5 3L9 7L5 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function OrderTable({ orders, analysis, selected, onSelectionChange, onSelectReady }) {
  const [expanded, setExpanded] = useState(null);
  const [sortField, setSortField] = useState("id");
  const [sortDir, setSortDir] = useState("asc");
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  function sort(field) {
    if (sortField === field) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else { setSortField(field); setSortDir("asc"); }
  }

  const displayed = useMemo(() => {
    let list = [...orders];
    if (query) {
      const ql = query.toLowerCase();
      list = list.filter(
        (o) =>
          o.id.toLowerCase().includes(ql) ||
          o.cust.name.toLowerCase().includes(ql) ||
          o.cust.ref.toLowerCase().includes(ql) ||
          o.lines.some((l) => l.itemCode.toLowerCase().includes(ql))
      );
    }
    if (filter !== "all") list = list.filter((o) => analysis[o.id]?.status === filter);
    list.sort((a, b) => {
      let va, vb;
      switch (sortField) {
        case "weight":   va = a.totalWeight;        vb = b.totalWeight;        break;
        case "items":    va = a.lines.length;        vb = b.lines.length;       break;
        case "fulfill":  va = analysis[a.id]?.pct ?? 0; vb = analysis[b.id]?.pct ?? 0; break;
        case "customer": va = a.cust.name;           vb = b.cust.name;          break;
        case "status":   va = analysis[a.id]?.status ?? ""; vb = analysis[b.id]?.status ?? ""; break;
        default:         va = a.docEntry;            vb = b.docEntry;
      }
      if (typeof va === "string") return sortDir === "asc" ? va.localeCompare(vb) : vb.localeCompare(va);
      return sortDir === "asc" ? va - vb : vb - va;
    });
    return list;
  }, [orders, query, filter, sortField, sortDir, analysis]);

  function toggle(id) {
    onSelectionChange((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else if (next.size < MAX_SELECTION) next.add(id);
      return next;
    });
  }

  const thBase = {
    padding: "10px 12px",
    borderBottom: "2px solid rgba(255,255,255,0.05)",
    position: "sticky",
    top: 0,
    zIndex: 5,
    fontWeight: 800,
    fontSize: 10,
    letterSpacing: "1.2px",
    textTransform: "uppercase",
    whiteSpace: "nowrap",
    transition: "all 0.15s",
  };

  function TH({ field, label, width, align }) {
    const active = sortField === field;
    return (
      <th
        onClick={() => sort(field)}
        style={{
          ...thBase,
          width,
          minWidth: width,
          textAlign: align ?? "left",
          cursor: "pointer",
          userSelect: "none",
          background: active ? "rgba(251,191,36,0.06)" : "#111827",
          borderBottom: active ? "2px solid #fbbf24" : "2px solid rgba(255,255,255,0.05)",
          color: active ? "#fbbf24" : "#64748b",
        }}
      >
        <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
          {label}
          <SortIcon field={field} sortField={sortField} sortDir={sortDir} />
        </span>
      </th>
    );
  }

  const staticTH = (label, width) => (
    <th style={{ ...thBase, width, background: "#111827", color: "#64748b" }}>{label}</th>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Toolbar */}
      <div
        style={{
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 10,
          borderBottom: "1px solid rgba(255,255,255,0.05)",
          background: "rgba(255,255,255,0.015)",
          flexWrap: "wrap",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
          <div style={{ position: "relative", flex: "0 1 260px" }}>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search orders, items…"
              style={{
                width: "100%",
                padding: "7px 12px 7px 30px",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: 5,
                color: "#e2e8f0",
                fontSize: 12,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(251,191,36,0.35)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.08)")}
            />
            <span
              style={{
                position: "absolute",
                left: 9,
                top: "50%",
                transform: "translateY(-50%)",
                color: "#475569",
                fontSize: 13,
              }}
            >
              ⌕
            </span>
          </div>

          {["all", "ready", "shortage", "preorder"].map((f) => {
            const active = filter === f;
            const color =
              f === "ready" ? "#10b981" :
              f === "shortage" ? "#ef4444" :
              f === "preorder" ? "#60a5fa" : "#fbbf24";
            return (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "6px 12px",
                  borderRadius: 5,
                  border: `1px solid ${active ? color + "55" : "rgba(255,255,255,0.06)"}`,
                  background: active ? color + "14" : "transparent",
                  color: active ? color : "#475569",
                  fontSize: 10,
                  fontWeight: 800,
                  fontFamily: "inherit",
                  cursor: "pointer",
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                  transition: "all 0.15s",
                }}
              >
                {f === "all" ? "All" : f === "preorder" ? "Pre-Order" : f[0].toUpperCase() + f.slice(1)}
              </button>
            );
          })}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {selected.size > 0 && (
            <span
              style={{
                fontSize: 11,
                color: "#fbbf24",
                fontWeight: 800,
                padding: "5px 10px",
                borderRadius: 5,
                background: "rgba(251,191,36,0.1)",
                border: "1px solid rgba(251,191,36,0.2)",
              }}
            >
              {selected.size}/{MAX_SELECTION}
            </span>
          )}
          <button
            onClick={onSelectReady}
            style={{
              padding: "7px 12px",
              borderRadius: 5,
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94a3b8",
              fontSize: 10,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Select Ready
          </button>
          {selected.size > 0 && (
            <button
              onClick={() => onSelectionChange(new Set())}
              style={{
                padding: "7px 12px",
                borderRadius: 5,
                background: "transparent",
                border: "1px solid rgba(239,68,68,0.25)",
                color: "#ef4444",
                fontSize: 10,
                fontWeight: 700,
                fontFamily: "inherit",
                cursor: "pointer",
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Table */}
      <div style={{ flex: 1, overflow: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                style={{ ...thBase, width: 40, textAlign: "center", background: "#111827" }}
                onClick={() => {}}
              >
                <input
                  type="checkbox"
                  checked={selected.size > 0}
                  onChange={(e) => (e.target.checked ? onSelectReady() : onSelectionChange(new Set()))}
                  style={{ accentColor: "#fbbf24", width: 14, height: 14, cursor: "pointer" }}
                />
              </th>
              <th style={{ ...thBase, width: 32, background: "#111827" }} />
              <TH field="status" label="Status" width="100px" align="center" />
              <TH field="id" label="SO #" width="80px" />
              {staticTH("CUSTOMER", "170px")}
              <TH field="fulfill" label="Fulfillment %" width="180px" />
              <TH field="weight" label="Weight" width="90px" align="right" />
              <TH field="items" label="Lines" width="58px" align="center" />
              {staticTH("REF / SHIP-TO", undefined)}
              {staticTH("SHIP DATE", "80px")}
            </tr>
          </thead>
          <tbody>
            {displayed.map((order, idx) => {
              const a = analysis[order.id];
              const status = a?.status ?? "shortage";
              const pct = a?.pct ?? 0;
              const isSel = selected.has(order.id);
              const isExp = expanded === order.id;
              const canSel = status === "ready" || status === "preorder";
              const isDNF = order.cust.ref.startsWith("DO-NOT-FULFILL");
              const rowBg = isSel
                ? "rgba(251,191,36,0.07)"
                : isExp
                ? "rgba(255,255,255,0.025)"
                : idx % 2 === 0
                ? "transparent"
                : "rgba(255,255,255,0.012)";

              return (
                <>
                  <tr
                    key={order.id}
                    style={{
                      background: rowBg,
                      borderLeft: isSel
                        ? "3px solid #fbbf24"
                        : isExp
                        ? "3px solid rgba(251,191,36,0.3)"
                        : "3px solid transparent",
                      opacity: isDNF ? 0.4 : 1,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!isSel && !isExp) e.currentTarget.style.background = "rgba(255,255,255,0.025)";
                    }}
                    onMouseLeave={(e) => {
                      if (!isSel && !isExp) e.currentTarget.style.background = rowBg;
                    }}
                  >
                    <td
                      style={{ padding: "7px 6px", textAlign: "center" }}
                      onClick={(e) => { e.stopPropagation(); if (canSel) toggle(order.id); }}
                    >
                      <input
                        type="checkbox"
                        checked={isSel}
                        disabled={!canSel}
                        readOnly
                        style={{
                          accentColor: "#fbbf24",
                          width: 14,
                          height: 14,
                          cursor: canSel ? "pointer" : "not-allowed",
                          opacity: canSel ? 1 : 0.25,
                        }}
                      />
                    </td>
                    <td
                      style={{ padding: "7px 4px", color: "#475569" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      <Chevron open={isExp} />
                    </td>
                    <td
                      style={{ padding: "7px 12px", textAlign: "center" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      <StatusPill status={status} />
                    </td>
                    <td
                      style={{ padding: "7px 12px", fontWeight: 800, color: "#fbbf24", fontSize: 12 }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      {order.id}
                    </td>
                    <td
                      style={{ padding: "7px 12px" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      <div style={{ fontWeight: 600, color: "#e2e8f0", fontSize: 12, lineHeight: 1.3 }}>
                        {order.cust.name}
                      </div>
                      <div style={{ fontSize: 10, color: "#475569" }}>{order.cust.code}</div>
                    </td>
                    <td
                      style={{ padding: "7px 12px" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      <FulfillmentBar pct={pct} status={status} />
                    </td>
                    <td
                      style={{
                        padding: "7px 12px",
                        textAlign: "right",
                        fontWeight: 800,
                        fontSize: 13,
                        fontVariantNumeric: "tabular-nums",
                        color: order.totalWeight > 10 ? "#f59e0b" : "#e2e8f0",
                      }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      {order.totalWeight.toFixed(1)}
                      <span style={{ fontSize: 9, color: "#475569", marginLeft: 2 }}>lb</span>
                    </td>
                    <td
                      style={{ padding: "7px 12px", textAlign: "center", fontWeight: 700, color: "#64748b" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      {order.lines.length}
                    </td>
                    <td
                      style={{ padding: "7px 12px" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      <div
                        style={{
                          fontSize: 11,
                          fontWeight: isDNF ? 800 : 500,
                          color: isDNF ? "#ef4444" : "#94a3b8",
                        }}
                      >
                        {order.cust.ref || "—"}
                      </div>
                      <div
                        style={{
                          fontSize: 10,
                          color: "#334155",
                          marginTop: 1,
                          maxWidth: 260,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {order.cust.addr}
                      </div>
                    </td>
                    <td
                      style={{ padding: "7px 12px", fontSize: 11, color: "#64748b" }}
                      onClick={() => setExpanded(isExp ? null : order.id)}
                    >
                      {order.shipDate}
                    </td>
                  </tr>

                  {isExp && (
                    <tr key={`${order.id}-detail`}>
                      <td
                        colSpan={10}
                        style={{
                          padding: 0,
                          background: "#0f1318",
                          borderBottom: "2px solid rgba(251,191,36,0.12)",
                        }}
                      >
                        <LineDetail
                          lineDetails={a?.ld ?? []}
                          totalWeight={order.totalWeight}
                          orderPct={pct}
                          orderStatus={status}
                        />
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>

        {displayed.length === 0 && (
          <div style={{ padding: 60, textAlign: "center", color: "#334155", fontSize: 13 }}>
            No orders match the current filters.
          </div>
        )}
      </div>
    </div>
  );
}
