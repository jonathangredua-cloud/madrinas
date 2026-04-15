// StatusPill — ready / preorder / shortage badge with icon

const CONFIGS = {
  ready: {
    label: "READY",
    bg: "rgba(16,185,129,0.12)",
    color: "#10b981",
    border: "rgba(16,185,129,0.3)",
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <path d="M3 8.5L6.5 12L13 4" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
  },
  preorder: {
    label: "PRE-ORDER",
    bg: "rgba(59,130,246,0.12)",
    color: "#60a5fa",
    border: "rgba(59,130,246,0.3)",
    icon: (
      <svg width="10" height="10" viewBox="0 0 14 14" fill="none">
        <circle cx="7" cy="7" r="5.5" stroke="currentColor" strokeWidth="1.5"/>
        <path d="M7 4V7.5L9.5 9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
      </svg>
    ),
  },
  shortage: {
    label: "SHORTAGE",
    bg: "rgba(239,68,68,0.12)",
    color: "#ef4444",
    border: "rgba(239,68,68,0.3)",
    icon: (
      <svg width="11" height="11" viewBox="0 0 16 16" fill="none">
        <path d="M8 1L15 14H1L8 1Z" stroke="currentColor" strokeWidth="1.5" fill="currentColor" fillOpacity="0.15"/>
        <path d="M8 6V9M8 11.5V11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
      </svg>
    ),
  },
};

export function StatusPill({ status }) {
  const cfg = CONFIGS[status] ?? {
    label: "—",
    bg: "transparent",
    color: "#64748b",
    border: "transparent",
    icon: null,
  };

  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: cfg.bg,
        color: cfg.color,
        padding: "3px 9px",
        borderRadius: 4,
        fontSize: 10,
        fontWeight: 800,
        border: `1px solid ${cfg.border}`,
        letterSpacing: "0.7px",
      }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}
