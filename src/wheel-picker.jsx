import { useEffect, useRef } from "react";

export function WheelPicker({ label, options, value, onChange }) {
  const scroller = useRef(null);
  useEffect(() => {
    const selected = scroller.current?.querySelector("[aria-selected='true']");
    if (selected && typeof selected.scrollIntoView === "function") {
      selected.scrollIntoView({ block: "center" });
    }
  }, [value, options]);

  return (
    <div style={styles.wrap}>
      <div style={styles.label}>{label}</div>
      <div ref={scroller} role="listbox" aria-label={label} style={styles.list}>
        {options.map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id || "none"}
              type="button"
              role="option"
              aria-selected={selected}
              onClick={() => onChange(option.id)}
              style={{ ...styles.option, ...(selected ? styles.selected : {}) }}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}

const styles = {
  wrap: { margin: "0 0 12px" },
  label: { fontSize: 12, fontWeight: 800, letterSpacing: "0.6px", textTransform: "uppercase", color: "#64748b", marginBottom: 6 },
  list: {
    height: 148,
    overflowY: "auto",
    scrollSnapType: "y mandatory",
    border: "1.5px solid #cbd5e1",
    borderRadius: 14,
    background: "#ffffff",
    WebkitOverflowScrolling: "touch",
  },
  option: {
    display: "block",
    width: "100%",
    minHeight: 48,
    scrollSnapAlign: "center",
    border: "none",
    borderBottom: "1px solid #f1f5f9",
    background: "transparent",
    color: "#0f172a",
    fontWeight: 700,
    fontSize: 17,
    cursor: "pointer",
    padding: "12px 14px",
    textAlign: "left",
  },
  selected: { background: "#0a1628", color: "#ffffff" },
};
