// LineDetail — expandable per-line breakdown inside an order row

import { FulfillmentBar } from "./FulfillmentBar.jsx";

const COL = "120px 1fr 70px 90px 100px 70px";

export function LineDetail({ lineDetails, totalWeight, orderPct, orderStatus }) {
  return (
    <div style={{ padding: "14px 20px 14px 80px" }}>
      {/* Header */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: COL,
          gap: 0,
          padding: "0 0 8px 0",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          marginBottom: 4,
        }}
      >
        {["ITEM CODE", "ITEM DESCRIPTION", "QTY", "FREE STOCK", "FULFILLMENT", "WEIGHT"].map((h) => (
          <div
            key={h}
            style={{
              fontSize: 9,
              fontWeight: 800,
              color: "#475569",
              letterSpacing: "1.2px",
              padding: "0 8px",
            }}
          >
            {h}
          </div>
        ))}
      </div>

      {/* Lines */}
      {lineDetails.map((ld, i) => (
        <div
          key={i}
          style={{
            display: "grid",
            gridTemplateColumns: COL,
            gap: 0,
            padding: "8px 0",
            borderBottom: "1px solid rgba(255,255,255,0.025)",
            background: !ld.ok && !ld.pre ? "rgba(239,68,68,0.04)" : "transparent",
            alignItems: "center",
          }}
        >
          <div style={{ padding: "0 8px", fontWeight: 800, fontSize: 12, color: "#fbbf24" }}>
            {ld.itemCode}
          </div>
          <div style={{ padding: "0 8px" }}>
            <span style={{ color: "#e2e8f0", fontSize: 12 }}>{ld.name}</span>
            {ld.pre && (
              <span
                style={{
                  marginLeft: 8,
                  fontSize: 8,
                  color: "#60a5fa",
                  background: "rgba(59,130,246,0.15)",
                  padding: "2px 6px",
                  borderRadius: 3,
                  fontWeight: 800,
                  verticalAlign: "middle",
                }}
              >
                PRE-ORDER
              </span>
            )}
          </div>
          <div
            style={{
              padding: "0 8px",
              textAlign: "center",
              fontWeight: 800,
              fontSize: 13,
              color: "#e2e8f0",
            }}
          >
            {ld.qty}
          </div>
          <div
            style={{
              padding: "0 8px",
              textAlign: "center",
              fontWeight: 700,
              fontSize: 12,
              color: ld.stock === 0 ? "#ef4444" : ld.stock < ld.qty ? "#f59e0b" : "#10b981",
            }}
          >
            {ld.stock.toLocaleString()}
          </div>
          <div style={{ padding: "0 8px" }}>
            <FulfillmentBar
              pct={ld.pct}
              status={ld.ok ? "ready" : ld.pre ? "preorder" : "shortage"}
              sm
            />
          </div>
          <div style={{ padding: "0 8px", textAlign: "right", fontSize: 11, color: "#64748b" }}>
            {(ld.w * ld.qty).toFixed(1)} lb
          </div>
        </div>
      ))}

      {/* Footer */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 10,
          padding: "8px 8px 0 8px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ fontSize: 10, color: "#475569" }}>
          {lineDetails.length} line{lineDetails.length !== 1 ? "s" : ""} · Total: {totalWeight.toFixed(1)} lb
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "#475569", fontWeight: 700 }}>ORDER FULFILLMENT:</span>
          <FulfillmentBar pct={orderPct} status={orderStatus} />
        </div>
      </div>
    </div>
  );
}
