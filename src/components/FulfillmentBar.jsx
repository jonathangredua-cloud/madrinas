// FulfillmentBar — status-aware fulfillment progress bar

export function FulfillmentBar({ pct, status, sm = false }) {
  const h = sm ? 6 : 10;
  const color =
    status === "ready"    ? "#10b981" :
    status === "preorder" ? "#3b82f6" :
    pct >= 50             ? "#f59e0b" : "#ef4444";

  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: sm ? 60 : 140 }}>
      <div
        style={{
          flex: 1,
          height: h,
          borderRadius: h / 2,
          background: "rgba(255,255,255,0.06)",
          overflow: "hidden",
          minWidth: sm ? 40 : 80,
        }}
      >
        <div
          style={{
            width: `${pct}%`,
            height: "100%",
            borderRadius: h / 2,
            background: color,
            transition: "width 0.3s",
            boxShadow: pct === 100 ? `0 0 8px ${color}44` : "none",
          }}
        />
      </div>
      <span
        style={{
          fontSize: sm ? 10 : 13,
          fontWeight: 900,
          color,
          fontVariantNumeric: "tabular-nums",
          minWidth: sm ? 28 : 38,
          textAlign: "right",
        }}
      >
        {pct}%
      </span>
    </div>
  );
}
