// ReleaseModal — confirmation dialog with wave group toggle and robot pipeline preview

import { useState } from "react";

export function ReleaseModal({ eligibleCount, blockedCount, onConfirm, onCancel }) {
  const [waveGroup, setWaveGroup] = useState(false);

  const pipelineSteps = ["Portal Release", "Proposal", "Pick List", waveGroup ? "Wave" : null].filter(Boolean);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 100,
        background: "rgba(0,0,0,0.7)",
        backdropFilter: "blur(4px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
      onClick={onCancel}
    >
      <div
        style={{
          background: "#1e293b",
          border: "1px solid rgba(251,191,36,0.25)",
          borderRadius: 10,
          padding: 28,
          maxWidth: 480,
          width: "92%",
          boxShadow: "0 20px 50px rgba(0,0,0,0.5)",
          fontFamily: "inherit",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ fontSize: 13, fontWeight: 900, color: "#fbbf24", letterSpacing: "1px", marginBottom: 18 }}>
          GENERATE PICK LISTS
        </div>

        {/* Eligible */}
        <div
          style={{
            background: "rgba(16,185,129,0.1)",
            border: "1px solid rgba(16,185,129,0.25)",
            borderRadius: 6,
            padding: 14,
            marginBottom: 10,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#10b981", fontSize: 12 }}>Eligible orders</span>
          <span style={{ color: "#10b981", fontSize: 22, fontWeight: 900 }}>{eligibleCount}</span>
        </div>

        {/* Blocked */}
        {blockedCount > 0 && (
          <div
            style={{
              background: "rgba(239,68,68,0.1)",
              border: "1px solid rgba(239,68,68,0.25)",
              borderRadius: 6,
              padding: 14,
              marginBottom: 10,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ color: "#ef4444", fontSize: 12 }}>Blocked (shortage)</span>
            <span style={{ color: "#ef4444", fontSize: 22, fontWeight: 900 }}>{blockedCount}</span>
          </div>
        )}

        {/* Wave group toggle */}
        <div
          style={{
            background: "rgba(59,130,246,0.06)",
            border: "1px solid rgba(59,130,246,0.15)",
            borderRadius: 8,
            padding: "14px 16px",
            marginTop: 14,
            marginBottom: 6,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ flex: 1, marginRight: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 800, color: "#e2e8f0", marginBottom: 3 }}>
                Group into Wave
              </div>
              <div style={{ fontSize: 10, color: "#64748b", lineHeight: 1.5 }}>
                {waveGroup
                  ? "Pick lists will be consolidated by customer + ship-to. One combined pick run on the scanner."
                  : "Each order gets its own pick list. Standard individual picking."}
              </div>
            </div>
            <button
              onClick={() => setWaveGroup((v) => !v)}
              style={{
                width: 48,
                height: 26,
                borderRadius: 13,
                border: "none",
                cursor: "pointer",
                position: "relative",
                background: waveGroup ? "#3b82f6" : "rgba(255,255,255,0.12)",
                transition: "background 0.2s",
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: 10,
                  background: "#fff",
                  position: "absolute",
                  top: 3,
                  left: waveGroup ? 25 : 3,
                  transition: "left 0.2s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.3)",
                }}
              />
            </button>
          </div>
          {waveGroup && (
            <div
              style={{
                marginTop: 10,
                padding: "8px 10px",
                background: "rgba(59,130,246,0.08)",
                borderRadius: 5,
                fontSize: 10,
                color: "#93c5fd",
                lineHeight: 1.6,
              }}
            >
              <strong>When to use:</strong> Multiple orders pulling the same SKU(s) — one trip through
              the aisle instead of picking each order individually. Robot groups pick lists by customer +
              ship-to address. Packing still happens per order.
            </div>
          )}
        </div>

        {/* Robot pipeline preview */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            marginTop: 12,
            marginBottom: 16,
            padding: "8px 0",
          }}
        >
          {pipelineSteps.map((step, i) => {
            const isFirst = i === 0;
            const isLast = i === pipelineSteps.length - 1;
            const color = isFirst ? "#fbbf24" : isLast && waveGroup ? "#60a5fa" : "#10b981";
            const bg = isFirst
              ? "rgba(251,191,36,0.1)"
              : isLast && waveGroup
              ? "rgba(59,130,246,0.1)"
              : "rgba(16,185,129,0.1)";
            const border = isFirst
              ? "rgba(251,191,36,0.2)"
              : isLast && waveGroup
              ? "rgba(59,130,246,0.2)"
              : "rgba(16,185,129,0.2)";
            return (
              <>
                <span
                  key={step}
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    color,
                    padding: "3px 8px",
                    borderRadius: 4,
                    background: bg,
                    border: `1px solid ${border}`,
                  }}
                >
                  {step}
                </span>
                {i < pipelineSteps.length - 1 && (
                  <span style={{ color: "#334155", fontSize: 12 }}>→</span>
                )}
              </>
            );
          })}
        </div>

        <p style={{ fontSize: 11, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 20px" }}>
          {blockedCount > 0 ? `${blockedCount} order(s) blocked. ` : ""}
          Robot chain: Proposal → Pick List{waveGroup ? " → Wave" : ""}. Results on scanner within 60s.
        </p>

        <div style={{ display: "flex", gap: 8, justifyContent: "flex-end" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "9px 18px",
              borderRadius: 5,
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#94a3b8",
              fontSize: 11,
              fontWeight: 700,
              fontFamily: "inherit",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm({ waveGroup })}
            style={{
              padding: "9px 20px",
              borderRadius: 5,
              background: "linear-gradient(135deg,#fbbf24,#f59e0b)",
              border: "none",
              color: "#0b0e13",
              fontSize: 11,
              fontWeight: 900,
              fontFamily: "inherit",
              cursor: "pointer",
              boxShadow: "0 0 16px rgba(251,191,36,0.3)",
            }}
          >
            Confirm — {eligibleCount} Pick List{eligibleCount !== 1 ? "s" : ""}
            {waveGroup ? " (Wave)" : ""}
          </button>
        </div>
      </div>
    </div>
  );
}
