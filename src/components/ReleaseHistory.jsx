// ReleaseHistory — footer strip showing today's release batches

export function ReleaseHistory({ history }) {
  if (history.length === 0) return null;

  return (
    <div
      style={{
        background: "#111827",
        borderTop: "1px solid rgba(255,255,255,0.06)",
        padding: "8px 24px",
      }}
    >
      <div
        style={{
          fontSize: 9,
          fontWeight: 800,
          color: "#475569",
          letterSpacing: "1.5px",
          marginBottom: 6,
        }}
      >
        RELEASE HISTORY
      </div>
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
        {history.map((r, i) => (
          <div
            key={i}
            style={{
              padding: "6px 12px",
              borderRadius: 6,
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.06)",
              fontSize: 10,
              color: "#94a3b8",
              whiteSpace: "nowrap",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "#fbbf24", fontWeight: 800 }}>{r.label}</span>
            <span style={{ margin: "0 6px", color: "#334155" }}>·</span>
            {r.count} order{r.count !== 1 ? "s" : ""}
            {r.waveGroup && (
              <span
                style={{
                  marginLeft: 6,
                  padding: "1px 5px",
                  borderRadius: 3,
                  background: "rgba(59,130,246,0.15)",
                  color: "#60a5fa",
                  fontSize: 9,
                  fontWeight: 700,
                }}
              >
                WAVE
              </span>
            )}
            <span style={{ margin: "0 6px", color: "#334155" }}>·</span>
            <span style={{ color: "#475569" }}>{r.ts}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
