import { useState, useCallback, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import {
  ADDONS, PANEL_LABELS, RI_OPERATIONS, DENT_SIZES, DENT_SIZE_LABELS,
  DEFAULT_LABOR_RATE, CARRIERS, carrierHasMatrix, getMaxCount, quotePanel,
  VEHICLE_YEARS, VEHICLE_DATA, VEHICLE_MAKES, decodeVIN,
  activePanels, grandTotalOf, maxDentCount,
  buildEstimateSummary, ESTIMATE_DISCLAIMER, validateLead, parseGhlForm,
  buildGhlEmbedUrl, reportDocument, buildEstimatePdf, estimatePdfName,
  blankVehicle, estimateHasWork, createEstimateId, parseDraft, parseSavedEstimates,
  archiveEstimate, openSavedEstimate, estimateTitle,
  DRAFT_STORAGE_KEY, SAVED_STORAGE_KEY,
} from "./hail-logic.js";
import { GHL_FORM, GHL_SUMMARY_FIELD_ID } from "./config.js";

const PANEL_SHORT = {
  HOOD: "Hood", ROOF: "Roof", TRUNK: "Trunk",
  LFF: "L Fender", RFF: "R Fender", LFD: "L Door", RFD: "R Door",
  LRD: "LR Door", RRD: "RR Door", LQ: "L Quarter", RQ: "R Quarter",
  LRAIL: "L Rail", RRAIL: "R Rail",
};

function CarSilhouette({ panelData, selectedPanel, onSelectPanel }) {
  const panelPaths = {
    HOOD:  { d: "M155,45 C155,30 185,15 210,12 C235,15 265,30 265,45 L265,115 C265,120 260,125 255,125 L165,125 C160,125 155,120 155,115 Z", cx: 210, cy: 70 },
    LFF:   { d: "M100,35 L150,20 L150,125 L100,110 Z", cx: 120, cy: 72 },
    RFF:   { d: "M270,20 L320,35 L320,110 L270,125 Z", cx: 300, cy: 72 },
    LFD:   { d: "M95,118 L148,128 L148,250 L95,240 Z", cx: 118, cy: 184 },
    RFD:   { d: "M272,128 L325,118 L325,240 L272,250 Z", cx: 302, cy: 184 },
    LRAIL: { d: "M148,140 L175,140 L175,310 L148,310 Z", cx: 162, cy: 225 },
    RRAIL: { d: "M245,140 L272,140 L272,310 L245,310 Z", cx: 258, cy: 225 },
    ROOF:  { d: "M175,130 L245,130 L250,145 L250,300 L245,315 L175,315 L170,300 L170,145 Z", cx: 210, cy: 222 },
    LRD:   { d: "M95,248 L148,258 L148,370 L95,355 Z", cx: 118, cy: 310 },
    RRD:   { d: "M272,258 L325,248 L325,355 L272,370 Z", cx: 302, cy: 310 },
    LQ:    { d: "M100,362 L150,375 L150,430 L120,440 L100,430 Z", cx: 122, cy: 400 },
    RQ:    { d: "M270,375 L320,362 L320,430 L300,440 L270,430 Z", cx: 298, cy: 400 },
    TRUNK: { d: "M155,400 L265,400 L265,445 C265,460 255,470 240,475 L180,475 C165,470 155,460 155,445 Z", cx: 210, cy: 438 },
  };

  const getHeat = (panel) => {
    const d = panelData[panel];
    if (!d || !d.count || d.count <= 0) return 0;
    const max = getMaxCount(panel);
    return Math.min(d.count / (max || 50), 1);
  };

  const getColor = (panel) => {
    const d = panelData[panel];
    if (d && d.rrEnabled)   return "rgba(220,38,38,0.5)";
    if (d && d.convEnabled) return "rgba(249,115,22,0.5)";
    const heat = getHeat(panel);
    if (heat <= 0)    return "rgba(241,245,249,0.9)";
    if (heat < 0.25)  return "rgba(37,99,235,0.25)";
    if (heat < 0.5)   return "rgba(59,130,246,0.4)";
    if (heat < 0.75)  return "rgba(249,115,22,0.5)";
    return "rgba(220,38,38,0.6)";
  };

  return (
    <svg viewBox="60 0 300 490" role="group" aria-label="Vehicle panels" style={{ width: "100%", maxWidth: 360, margin: "0 auto", display: "block" }}>
      <path d="M130,15 C160,5 260,5 290,15 L325,35 C340,60 340,80 335,110 L335,430 C335,455 320,475 290,480 L240,488 C225,490 195,490 180,488 L130,480 C100,475 85,455 85,430 L85,110 C80,80 80,60 95,35 Z"
        fill="none" stroke="#cbd5e1" strokeWidth="3.5" />
      <path d="M155,125 L265,125 L272,140 L272,150 L148,150 L148,140 Z" fill="rgba(219,234,254,0.6)" stroke="#bfdbfe" strokeWidth="1" />
      <path d="M155,375 L265,375 L268,390 L152,390 Z" fill="rgba(219,234,254,0.6)" stroke="#bfdbfe" strokeWidth="1" />
      {Object.entries(panelPaths).map(([key, { d, cx, cy }]) => {
        const isSelected = selectedPanel === key;
        const hasData = panelData[key] && (panelData[key].count > 0 || panelData[key].rrEnabled || panelData[key].convEnabled);
        const short = PANEL_SHORT[key] || key;
        const words = short.split(" ");
        const choose = () => onSelectPanel(key);
        return (
          <g key={key} role="button" tabIndex={0} aria-label={`Edit ${PANEL_LABELS[key]}`}
            onClick={choose}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") { event.preventDefault(); choose(); }
            }}
            style={{ cursor: "pointer" }}>
            <path d={d}
              fill={getColor(key)}
              stroke={isSelected ? "#2563eb" : hasData ? "#1d4ed8" : "#94a3b8"}
              strokeWidth={isSelected ? 3 : 1.6}
            />
            {hasData && (
              <>
                <circle cx={cx} cy={cy} r={14} fill="rgba(15,23,42,0.85)" />
                <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="central"
                  fill={panelData[key].rrEnabled ? "#ef4444" : panelData[key].convEnabled ? "#f97316" : "#ffffff"}
                  fontSize={panelData[key].rrEnabled ? "8" : panelData[key].convEnabled ? "7" : "11"}
                  fontWeight="700" fontFamily="monospace" style={{ pointerEvents: "none" }}>
                  {panelData[key].rrEnabled ? "R&R" : panelData[key].convEnabled ? "CONV" : panelData[key].count}
                </text>
              </>
            )}
            {!hasData && words.map((word, index) => (
              <text key={word} x={cx} y={words.length > 1 ? cy - 5 + index * 11 : cy} textAnchor="middle" dominantBaseline="central"
                fill="#475569" fontSize="9" fontWeight="700" fontFamily="sans-serif"
                style={{ pointerEvents: "none" }}>
                {word}
              </text>
            ))}
          </g>
        );
      })}
    </svg>
  );
}


function PanelEditor({ panel, data, onSave, onClose, onDelete, carrierId }) {
  const [selectedRange, setSelectedRange] = useState(data?.selectedRange || null);
  const [size, setSize] = useState(data?.size || "DIME");
  const [addons, setAddons] = useState(data?.addons || []);
  const [osDentCount, setOsDentCount] = useState(data?.osDentCount || 0);
  const [doubleOsCount, setDoubleOsCount] = useState(data?.doubleOsCount || 0);
  const [rrEnabled, setRrEnabled] = useState(data?.rrEnabled || false);
  const [rrHours, setRrHours] = useState(data?.rrHours ?? 0);
  const [convEnabled, setConvEnabled] = useState(data?.convEnabled || false);
  const [convHours, setConvHours] = useState(data?.convHours ?? 0);
  const [riEnabled, setRiEnabled] = useState(data?.riEnabled || false);
  const [laborRate, setLaborRate] = useState(data?.laborRate ?? DEFAULT_LABOR_RATE);

  const defaultOps = (RI_OPERATIONS[panel] || []);
  const initTimes = () => {
    const saved = data?.riTimes || {};
    const t = {};
    defaultOps.forEach(op => { t[op.id] = saved[op.id] ?? op.time; });
    return t;
  };
  const [riTimes, setRiTimes] = useState(initTimes);
  const [riIncluded, setRiIncluded] = useState(() => {
    if (data?.riIncluded) return data.riIncluded;
    const inc = {};
    defaultOps.forEach(op => { inc[op.id] = true; });
    return inc;
  });
  const [riRr, setRiRr] = useState(() => {
    if (data?.riRr) return data.riRr;
    const rr = {};
    defaultOps.forEach(op => { rr[op.id] = false; });
    return rr;
  });

  const updateRiTime = (id, delta) => {
    setRiTimes(prev => ({ ...prev, [id]: Math.max(0, parseFloat((prev[id] + delta).toFixed(1))) }));
  };
  const toggleRiOp = (id) => setRiIncluded(prev => ({ ...prev, [id]: !prev[id] }));
  const toggleRiRr = (id) => setRiRr(prev => ({ ...prev, [id]: !prev[id] }));

  const quote = quotePanel({
    panel, carrierId, selectedRange, size, addons, osDentCount, doubleOsCount,
    rrEnabled, rrHours, convEnabled, convHours, riEnabled, laborRate, riTimes, riIncluded,
  });
  const rows = quote.rows;
  const availableRanges = rows;
  const selectedRangeIdx = selectedRange ? availableRanges.findIndex(r => r.range === selectedRange) : -1;
  const toggleAddon = (name) => setAddons(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  const selectedRow = quote.selectedRow;
  const basePrice = quote.basePrice;
  const count = quote.count;
  const addonBreakdown = quote.addonBreakdown;
  const addonTotal = quote.addonTotal;
  const nonPdr = quote.nonPdr;
  const rrCost = quote.rrCost;
  const convCost = quote.convCost;
  const riTotalHours = quote.riTotalHours;
  const riTotalCost = quote.riTotalCost;
  const totalPrice = quote.totalPrice;

  const S = styles;

  return (
    <div style={S.modalOverlay} onClick={onClose}>
      <div style={S.modalContent} onClick={e => e.stopPropagation()}>
        <div style={S.modalHeader}>
          <div>
            <div style={S.modalTitle}>{PANEL_LABELS[panel]}</div>
            <div style={S.modalSubtitle}>{panel} • {availableRanges.length} damage ranges</div>
          </div>
          <button onClick={onClose} style={S.closeBtn}>✕</button>
        </div>

        <div style={S.modalBody}>
          {/* Repair Mode Toggles */}
          <div style={S.repairToggles}>
            <button onClick={() => { setRrEnabled(v => !v); if (!rrEnabled) setConvEnabled(false); }}
              style={{ ...S.repairToggleBtn, ...(rrEnabled ? S.repairToggleBtnRR : {}) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
                <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
              </svg>
              <span>R&R</span>
            </button>
            <button onClick={() => { setConvEnabled(v => !v); if (!convEnabled) setRrEnabled(false); }}
              style={{ ...S.repairToggleBtn, ...(convEnabled ? S.repairToggleBtnConv : {}) }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
              </svg>
              <span>Conventional</span>
            </button>
          </div>

          {!nonPdr && (
            <>
              <label style={S.fieldLabel}>DENT COUNT RANGE</label>
              <div style={S.rangeNavRow}>
                <button style={{ ...S.rangeArrow, opacity: selectedRangeIdx > 0 ? 1 : 0.25 }}
                  onClick={() => { if (selectedRangeIdx > 0) setSelectedRange(availableRanges[selectedRangeIdx - 1].range); }}
                  disabled={selectedRangeIdx <= 0}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
                </button>
                <div style={{ ...S.rangeDisplay, ...(selectedRow && selectedRow[size] === 0 ? S.rangeDisplayInvalid : {}) }}>
                  {selectedRange ? (
                    <>
                      <div style={{ ...S.rangeDisplayCount, ...(selectedRow && selectedRow[size] === 0 ? { color: "#ef4444" } : {}) }}>{selectedRange}</div>
                      <div style={{ ...S.rangeDisplayLabel, ...(selectedRow && selectedRow[size] === 0 ? { color: "#b91c1c" } : {}) }}>dents</div>
                    </>
                  ) : (
                    <div style={S.rangeDisplayPlaceholder}>Select range</div>
                  )}
                </div>
                <button style={{ ...S.rangeArrow, opacity: selectedRangeIdx < availableRanges.length - 1 ? 1 : 0.25 }}
                  onClick={() => { if (selectedRangeIdx < availableRanges.length - 1) setSelectedRange(availableRanges[selectedRangeIdx + 1].range); }}
                  disabled={selectedRangeIdx >= availableRanges.length - 1}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
                </button>
              </div>
              <div style={S.rangeSteps}>
                {availableRanges.map((r, i) => {
                  const isActive = selectedRange === r.range;
                  const isPast = i < selectedRangeIdx;
                  const isInvalid = r[size] === 0;
                  return (
                    <button key={r.range} type="button" aria-label={`${r.range} dents`} onClick={() => setSelectedRange(r.range)}
                      style={{ ...S.rangeStep, ...(isActive ? S.rangeStepActive : {}), ...(isPast && !isInvalid ? S.rangeStepPast : {}) }}>
                      <div style={{
                        ...S.rangeStepDot,
                        ...(isActive && !isInvalid ? { background: "#2563eb", borderColor: "#2563eb", boxShadow: "0 0 8px rgba(37,99,235,0.5)", transform: "scale(1.3)" } : {}),
                        ...(isActive && isInvalid ? { background: "#ef4444", borderColor: "#ef4444", boxShadow: "0 0 8px rgba(239,68,68,0.5)", transform: "scale(1.3)" } : {}),
                        ...(isPast && !isInvalid ? { background: "rgba(37,99,235,0.4)", borderColor: "rgba(37,99,235,0.5)" } : {}),
                        ...(isInvalid && !isActive ? { background: "rgba(239,68,68,0.3)", borderColor: "rgba(239,68,68,0.4)" } : {}),
                      }} />
                      {i < availableRanges.length - 1 && (
                        <div style={{ position: "absolute", top: 9, left: "55%", right: "-45%", height: 2,
                          background: isPast ? "rgba(37,99,235,0.35)" : "rgba(148,163,184,0.15)", zIndex: 0 }} />
                      )}
                      <div style={{ ...S.rangeStepText,
                        ...(isActive && !isInvalid ? { color: "#3b82f6" } : {}),
                        ...(isActive && isInvalid ? { color: "#ef4444" } : {}),
                        ...(isInvalid && !isActive ? { color: "#ef4444", opacity: 0.6 } : {}),
                      }}>{r.range}</div>
                    </button>
                  );
                })}
              </div>

              <label style={{ ...S.fieldLabel, marginTop: 22 }}>DENT SIZE</label>
              <div style={S.sizeGrid}>
                {DENT_SIZES.map(s => {
                  const hasAnyPrice = rows.some(r => r[s] > 0);
                  const isAvailable = selectedRow ? selectedRow[s] > 0 : hasAnyPrice;
                  const priceForSize = selectedRow ? selectedRow[s] : 0;
                  const isSelectedInvalid = size === s && selectedRow && selectedRow[s] === 0;
                  return (
                    <button key={s} onClick={() => hasAnyPrice && setSize(s)}
                      style={{
                        ...S.sizeBtn,
                        ...(size === s && isAvailable ? S.sizeBtnActive : {}),
                        ...(isSelectedInvalid ? S.sizeBtnRed : {}),
                        ...(!hasAnyPrice ? S.sizeBtnDisabled : {}),
                        ...(!isAvailable && hasAnyPrice && size !== s ? S.sizeBtnWarn : {}),
                      }}>
                      <div>{DENT_SIZE_LABELS[s]}</div>
                      {selectedRow && isAvailable && <div style={{ fontSize: 11, marginTop: 2, opacity: 0.7 }}>${priceForSize}</div>}
                      {selectedRow && !isAvailable && <div style={{ fontSize: 9, marginTop: 2, color: "#ef4444", fontWeight: 600 }}>R&R</div>}
                      {!selectedRow && !hasAnyPrice && <div style={{ fontSize: 10, marginTop: 2, opacity: 0.5 }}>N/A</div>}
                    </button>
                  );
                })}
              </div>

              {selectedRange && basePrice === 0 && selectedRow && (
                <div style={S.rrWarning}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
                    <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                  </svg>
                  <div>
                    <div style={S.rrWarningTitle}>Conventional or R&R Recommended</div>
                    <div style={S.rrWarningText}>Exceeds PDR matrix for this panel at this size.</div>
                  </div>
                </div>
              )}

              {selectedRange && basePrice > 0 && <div style={S.priceTag}>Base: ${basePrice.toLocaleString()}</div>}

              <label style={S.fieldLabel}>ADD-ONS</label>
              <div style={S.addonGrid}>
                {ADDONS.map(a => {
                  const isActive = addons.includes(a.name);
                  const isDollarQty = a.name === "Oversized Dent" || a.name === "Double OS Dents";
                  const showStepper = isDollarQty && isActive;
                  return (
                    <div key={a.name} style={{ marginBottom: 6 }}>
                      <button onClick={() => toggleAddon(a.name)}
                        style={{ ...S.addonBtn, ...(isActive ? S.addonBtnActive : {}) }}>
                        <span style={S.addonName}>{a.name}</span>
                        <span style={{ ...S.addonVal, ...(isActive ? S.addonValActive : {}) }}>
                          {a.type === "dollar" ? `$${a.value}/ea` : `+${(a.value * 100)}%`}
                        </span>
                      </button>
                      {showStepper && (
                        <div style={S.osDentRow}>
                          <span style={S.osDentLabel}>{a.name === "Oversized Dent" ? "OS Dents" : "Dbl OS"} Qty:</span>
                          <div style={S.osStepper}>
                            <button style={S.osStepBtn} onClick={e => { e.stopPropagation(); if (a.name === "Oversized Dent") setOsDentCount(c => Math.max(0, c-1)); else setDoubleOsCount(c => Math.max(0, c-1)); }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                            <div style={S.osStepValue}>{a.name === "Oversized Dent" ? osDentCount : doubleOsCount}</div>
                            <button style={S.osStepBtn} onClick={e => { e.stopPropagation(); if (a.name === "Oversized Dent") setOsDentCount(c => c+1); else setDoubleOsCount(c => c+1); }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                            </button>
                          </div>
                          <span style={S.osStepTotal}>${((a.name === "Oversized Dent" ? osDentCount : doubleOsCount) * a.value).toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* R&R panel */}
          {rrEnabled && (
            <div style={S.rrPanel}>
              <div style={S.rrPanelHeader}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round">
                  <polyline points="17 1 21 5 17 9"/><path d="M3 11V9a4 4 0 014-4h14"/>
                  <polyline points="7 23 3 19 7 15"/><path d="M21 13v2a4 4 0 01-4 4H3"/>
                </svg>
                <div><div style={S.rrPanelTitle}>Remove & Replace</div><div style={S.rrPanelSub}>Full panel replacement</div></div>
              </div>
              <div style={S.rrRow}>
                <span style={S.rrRowLabel}>Labor Rate</span>
                <div style={S.osStepper}>
                  <button style={S.osStepBtn} onClick={() => setLaborRate(r => Math.max(0, parseFloat((r-1).toFixed(2))))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <div style={S.rrRateValue}>${laborRate.toFixed(2)}</div>
                  <button style={S.osStepBtn} onClick={() => setLaborRate(r => parseFloat((r+1).toFixed(2)))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <span style={S.rrUnit}>/hr</span>
              </div>
              <div style={S.rrRow}>
                <span style={S.rrRowLabel}>Labor Hours</span>
                <div style={S.osStepper}>
                  <button style={S.osStepBtn} onClick={() => setRrHours(h => Math.max(0, parseFloat((h-1).toFixed(1))))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <div style={S.rrHoursValue}>{rrHours.toFixed(1)}</div>
                  <button style={S.osStepBtn} onClick={() => setRrHours(h => parseFloat((h+1).toFixed(1)))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <span style={S.rrUnit}>hrs</span>
              </div>
              {rrCost > 0 && <div style={S.rrSubtotal}><span>R&R Total ({rrHours.toFixed(1)} hrs × ${laborRate.toFixed(2)})</span><span style={S.rrSubtotalVal}>${rrCost.toFixed(2)}</span></div>}
            </div>
          )}

          {/* Conventional panel */}
          {convEnabled && (
            <div style={{ ...S.rrPanel, background: "rgba(249,115,22,0.05)", borderColor: "rgba(249,115,22,0.15)" }}>
              <div style={{ ...S.rrPanelHeader, borderColor: "rgba(249,115,22,0.1)" }}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round">
                  <path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/>
                </svg>
                <div><div style={{ ...S.rrPanelTitle, color: "#f97316" }}>Conventional Repair</div><div style={S.rrPanelSub}>Body work repair</div></div>
              </div>
              <div style={S.rrRow}>
                <span style={S.rrRowLabel}>Labor Rate</span>
                <div style={S.osStepper}>
                  <button style={S.osStepBtn} onClick={() => setLaborRate(r => Math.max(0, parseFloat((r-1).toFixed(2))))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <div style={{ ...S.rrRateValue, color: "#f97316" }}>${laborRate.toFixed(2)}</div>
                  <button style={S.osStepBtn} onClick={() => setLaborRate(r => parseFloat((r+1).toFixed(2)))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <span style={S.rrUnit}>/hr</span>
              </div>
              <div style={S.rrRow}>
                <span style={S.rrRowLabel}>Labor Hours</span>
                <div style={S.osStepper}>
                  <button style={S.osStepBtn} onClick={() => setConvHours(h => Math.max(0, parseFloat((h-1).toFixed(1))))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                  <div style={S.rrHoursValue}>{convHours.toFixed(1)}</div>
                  <button style={S.osStepBtn} onClick={() => setConvHours(h => parseFloat((h+1).toFixed(1)))}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  </button>
                </div>
                <span style={S.rrUnit}>hrs</span>
              </div>
              {convCost > 0 && <div style={{ ...S.rrSubtotal, borderColor: "rgba(249,115,22,0.12)" }}><span>Conv. Total ({convHours.toFixed(1)} hrs × ${laborRate.toFixed(2)})</span><span style={{ ...S.rrSubtotalVal, color: "#f97316" }}>${convCost.toFixed(2)}</span></div>}
            </div>
          )}

          {/* R&I Operations */}
          {defaultOps.length > 0 && (
            <>
              <label style={S.fieldLabel}>R&I OPERATIONS</label>
              <button onClick={() => setRiEnabled(v => !v)}
                style={{ ...S.addonBtn, ...(riEnabled ? S.riToggleActive : {}), marginBottom: 10 }}>
                <span style={S.addonName}>R&I — Remove & Install</span>
                <span style={{ ...S.addonVal, ...(riEnabled ? S.addonValActive : {}) }}>{riEnabled ? "ON" : "OFF"}</span>
              </button>
              {riEnabled && (
                <div style={S.riSection}>
                  <div style={S.riLaborRow}>
                    <span style={S.riLaborLabel}>Labor Rate</span>
                    <div style={S.osStepper}>
                      <button style={S.osStepBtn} onClick={() => setLaborRate(r => Math.max(0, parseFloat((r-0.1).toFixed(2))))}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                      <div style={S.riLaborValue}>${laborRate.toFixed(2)}</div>
                      <button style={S.osStepBtn} onClick={() => setLaborRate(r => parseFloat((r+0.1).toFixed(2)))}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                      </button>
                    </div>
                    <span style={S.riLaborUnit}>/hr</span>
                  </div>
                  <div style={S.riOpList}>
                    {defaultOps.map(op => {
                      const included = riIncluded[op.id] !== false;
                      const isRr = riRr[op.id] || false;
                      const time = riTimes[op.id] ?? op.time;
                      return (
                        <div key={op.id} style={S.riOpCard}>
                          <div style={S.riOpTopRow}>
                            <button onClick={() => toggleRiOp(op.id)}
                              style={{ ...S.riOpToggleBtn, ...(included ? (isRr ? S.riOpToggleBtnRr : S.riOpToggleBtnOn) : {}) }}>
                              <div style={{ ...S.riOpCheck, ...(included ? (isRr ? S.riOpCheckRr : S.riOpCheckOn) : {}) }}>
                                {included && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>}
                              </div>
                              <span style={{ ...S.riOpLabel, ...(included ? {} : S.riOpLabelOff) }}>{op.name}</span>
                              {!included && <span style={S.riOpExcTag}>EXCL</span>}
                            </button>
                            {op.rrOption && included && (
                              <button onClick={() => toggleRiRr(op.id)}
                                style={{ ...S.riRrBtn, ...(isRr ? S.riRrBtnActive : {}) }}>
                                {isRr ? "R&R ✓" : "R&R"}
                              </button>
                            )}
                          </div>
                          {included && (
                            <div style={S.riOpBottomRow}>
                              <div style={S.riOpTimeControls}>
                                <button style={S.riTimeBtn} onClick={() => updateRiTime(op.id, -0.1)}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                                <span style={S.riTimeVal}>{time.toFixed(1)} hrs</span>
                                <button style={S.riTimeBtn} onClick={() => updateRiTime(op.id, 0.1)}>
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                                </button>
                              </div>
                              <span style={{ ...S.riOpCost, ...(isRr ? { color: "#ef4444" } : {}) }}>${(time * laborRate).toFixed(2)}</span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <div style={S.riSubtotal}>
                    <span>R&I Total ({riTotalHours.toFixed(1)} hrs × ${laborRate.toFixed(2)})</span>
                    <span style={S.riSubtotalVal}>${riTotalCost.toFixed(2)}</span>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Summary */}
          {((selectedRange && basePrice > 0 && !nonPdr) || (nonPdr && (rrCost > 0 || convCost > 0 || (riEnabled && riTotalCost > 0)))) && (
            <div style={S.summaryBox}>
              {!nonPdr && <div style={S.summaryRow}><span>Base ({selectedRange} {DENT_SIZE_LABELS[size].toLowerCase()} dents)</span><span>${basePrice.toLocaleString()}</span></div>}
              {!nonPdr && addonBreakdown.filter(a => a.amount > 0).map(a => (
                <div key={a.name} style={S.summaryRow}><span>{a.name}</span><span>+${a.amount.toLocaleString()}</span></div>
              ))}
              {rrEnabled && rrCost > 0 && <div style={S.summaryRow}><span>R&R ({rrHours.toFixed(1)} hrs)</span><span>${rrCost.toFixed(2)}</span></div>}
              {convEnabled && convCost > 0 && <div style={S.summaryRow}><span>Conv. ({convHours.toFixed(1)} hrs)</span><span>${convCost.toFixed(2)}</span></div>}
              {riEnabled && riTotalCost > 0 && <div style={S.summaryRow}><span>R&I ({riTotalHours.toFixed(1)} hrs)</span><span>+${riTotalCost.toFixed(2)}</span></div>}
              <div style={S.summaryTotal}><span>Panel Total</span><span>${totalPrice.toLocaleString()}</span></div>
            </div>
          )}
        </div>

        <div style={S.modalFooter}>
          {data && (data.count > 0 || data.rrEnabled || data.convEnabled) && (
            <button onClick={() => { onDelete(panel); onClose(); }} style={S.deleteBtn}>Remove</button>
          )}
          <button
            onClick={() => { onSave(panel, { count: nonPdr ? 0 : count, selectedRange: nonPdr ? null : selectedRange, size, addons: nonPdr ? [] : addons, osDentCount, doubleOsCount, rrEnabled, rrHours, rrCost, convEnabled, convHours, convCost, basePrice: nonPdr ? 0 : basePrice, addonTotal: nonPdr ? 0 : addonTotal, riEnabled, laborRate, riTimes, riIncluded, riRr, riTotalHours, riTotalCost, totalPrice }); onClose(); }}
            style={S.saveBtn}
            disabled={!nonPdr && (!selectedRange || basePrice <= 0)}>
            {rrEnabled ? (totalPrice > 0 ? `Save R&R — $${totalPrice.toLocaleString()}` : "Save R&R")
              : convEnabled ? (totalPrice > 0 ? `Save Conv. — $${totalPrice.toLocaleString()}` : "Save Conv.")
              : !selectedRange ? "Select a damage range"
              : basePrice <= 0 ? "Select a valid size"
              : `Save — $${totalPrice.toLocaleString()}`}
          </button>
        </div>
      </div>
    </div>
  );
}


function CameraCapture({ photos, setPhotos }) {
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const handleCapture = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => setPhotos(prev => [...prev, { url: ev.target.result, name: file.name, date: new Date().toLocaleString() }]);
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };
  return (
    <div>
      {/* Camera input — opens device camera directly */}
      <input ref={cameraRef} type="file" accept="image/*" capture="environment" onChange={handleCapture} style={{ display: "none" }} />
      {/* Gallery input — opens photo library for multi-select */}
      <input ref={galleryRef} type="file" accept="image/*" multiple onChange={handleCapture} style={{ display: "none" }} />
      <div style={{ display: "flex", gap: 8 }}>
        <button onClick={() => cameraRef.current.click()} style={{ ...styles.cameraBtn, flex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
            <circle cx="12" cy="13" r="4"/>
          </svg>
          <span>Camera</span>
        </button>
        <button onClick={() => galleryRef.current.click()} style={{ ...styles.cameraBtn, flex: 1 }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>
            <polyline points="21 15 16 10 5 21"/>
          </svg>
          <span>Gallery</span>
        </button>
      </div>
      {photos.length > 0 && (
        <div style={styles.photoStrip}>
          {photos.map((p, i) => (
            <div key={i} style={styles.photoThumb}>
              <img src={p.url} alt={p.name} style={styles.photoImg} />
              <button onClick={() => setPhotos(prev => prev.filter((_, j) => j !== i))} style={styles.photoRemove}>✕</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


function SearchSelect({ items, value, onChange, placeholder }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const filtered = query ? items.filter(i => i.toLowerCase().includes(query.toLowerCase())) : items;
  return (
    <div style={styles.ssWrap}>
      <input type="text" value={open ? query : value} placeholder={placeholder}
        onFocus={() => { setOpen(true); setQuery(""); }}
        onChange={e => { setQuery(e.target.value); if (!open) setOpen(true); }}
        style={{ ...styles.ssInput, ...(value && !open ? styles.ssInputFilled : {}) }} />
      {value && !open && <button style={styles.ssClear} onClick={() => onChange("")}>✕</button>}
      {open && (
        <div style={styles.ssDropdown}>
          {filtered.map(item => (
            <button key={item} onClick={() => { onChange(item); setQuery(""); setOpen(false); }}
              style={{ ...styles.ssOption, ...(value === item ? styles.ssOptionActive : {}) }}>{item}</button>
          ))}
          {filtered.length === 0 && <div style={styles.ssEmpty}>No matches</div>}
        </div>
      )}
      {open && <div style={styles.ssBackdrop} onClick={() => { setOpen(false); setQuery(""); }} />}
    </div>
  );
}


function VehicleForm({ vehicleInfo, setVehicleInfo, onClose }) {
  const models = vehicleInfo.make ? (VEHICLE_DATA[vehicleInfo.make] || []) : [];
  const [vinStatus, setVinStatus] = useState(null);
  const setField = (k, v) => setVehicleInfo(prev => { const next = { ...prev, [k]: v }; if (k === "make" && v !== prev.make) next.model = ""; return next; });

  const handleVinChange = (e) => {
    const raw = e.target.value.toUpperCase().replace(/[^A-HJ-NPR-Z0-9]/g, "").slice(0, 17);
    setField("vin", raw);
    if (raw.length === 17) {
      const decoded = decodeVIN(raw);
      if (decoded && (decoded.year || decoded.make)) {
        setVehicleInfo(prev => {
          const next = { ...prev, vin: raw };
          if (decoded.year) next.year = decoded.year;
          if (decoded.make) { const m = VEHICLE_MAKES.find(x => x.toLowerCase() === decoded.make.toLowerCase()); if (m) { next.make = m; if (prev.make !== m) next.model = ""; } }
          return next;
        });
        setVinStatus("decoded");
      } else { setVinStatus("partial"); }
    } else { setVinStatus(null); }
  };

  return (
    <div style={styles.vehicleForm}>
      <div style={styles.vehicleFormTitle}>Vehicle / Claim Info</div>
      <div style={styles.vfGrid}>
        <div style={styles.vfField}><label style={styles.vfLabel}>Owner Name</label><input value={vehicleInfo.owner} onChange={e => setField("owner", e.target.value)} style={styles.vfInput} placeholder="Owner Name" /></div>
        <div style={styles.vfField}><label style={styles.vfLabel}>Claim #</label><input value={vehicleInfo.claim} onChange={e => setField("claim", e.target.value)} style={styles.vfInput} placeholder="Claim #" /></div>
      </div>
      <div style={{ marginTop: 10, marginBottom: 10 }}>
        <label style={styles.vfLabel}>VIN</label>
        <div style={styles.vinRow}>
          <input value={vehicleInfo.vin} onChange={handleVinChange}
            style={{ ...styles.vfInput, ...styles.vinInput, ...(vinStatus === "decoded" ? styles.vinInputDecoded : {}) }}
            placeholder="Enter 17-character VIN" maxLength={17} autoCapitalize="characters" autoCorrect="off" spellCheck={false} />
          <div style={styles.vinCounter}>{vehicleInfo.vin.length}/17</div>
        </div>
        {vinStatus === "decoded" && <div style={styles.vinSuccess}><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg> VIN decoded — year & make auto-filled</div>}
        {vinStatus === "partial" && <div style={styles.vinWarn}>VIN recognized but make not in database — fill manually</div>}
      </div>
      <div style={styles.vfGrid}>
        <div style={styles.vfField}><label style={styles.vfLabel}>Year</label>
          <select value={vehicleInfo.year} onChange={e => setField("year", e.target.value)} style={styles.vfSelect}>
            <option value="">Year</option>
            {VEHICLE_YEARS.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div style={styles.vfField}><label style={styles.vfLabel}>Make</label><SearchSelect items={VEHICLE_MAKES} value={vehicleInfo.make} onChange={v => setField("make", v)} placeholder="Search make..." /></div>
      </div>
      <div style={{ ...styles.vfGrid, gridTemplateColumns: "1fr", marginTop: 10 }}>
        <div style={styles.vfField}><label style={styles.vfLabel}>Model</label>
          {vehicleInfo.make
            ? <SearchSelect items={models} value={vehicleInfo.model} onChange={v => setField("model", v)} placeholder="Search model..." />
            : <input style={{ ...styles.vfInput, opacity: 0.4 }} placeholder="Select make first" disabled />}
        </div>
      </div>
      <button onClick={onClose} style={styles.vfDone}>Done</button>
    </div>
  );
}


const EMPTY_VEHICLE = blankVehicle();

function LeadCapture({ summary, onFormClosed }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState({});
  const [embedUrl, setEmbedUrl] = useState("");
  const configured = Boolean(parseGhlForm(GHL_FORM).formId);

  useEffect(() => {
    if (!embedUrl) return undefined;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [embedUrl]);

  const handleSubmit = (event) => {
    event.preventDefault();
    const lead = { name, phone, email, notes };
    const nextErrors = validateLead(lead);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    if (!configured) {
      setErrors({ form: "This estimate is ready. Lead delivery is not connected yet — download it and NTX Hail can take it from there." });
      return;
    }
    const url = buildGhlEmbedUrl({
      formValue: GHL_FORM,
      lead,
      summary,
      summaryFieldId: GHL_SUMMARY_FIELD_ID,
    });
    if (!url) {
      setErrors({ form: "Could not open the form. Download the estimate and try again." });
      return;
    }
    setEmbedUrl(url);
  };

  const S = styles;
  return (
    <>
      <form onSubmit={handleSubmit} style={S.leadCard}>
        <div style={S.sectionLabel}>Send this estimate</div>
        <p style={S.leadIntro}>Name and phone so NTX Hail can follow up. Email is optional. The estimate above is included. On the next screen, check the consent boxes and submit the form. No account needed.</p>
        <label style={S.leadLabel}>Name
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" style={S.leadInput} />
        </label>
        {errors.name && <div style={S.leadError}>{errors.name}</div>}
        <label style={S.leadLabel}>Phone
          <input value={phone} onChange={(e) => setPhone(e.target.value)} autoComplete="tel" inputMode="tel" type="tel" style={S.leadInput} />
        </label>
        {errors.phone && <div style={S.leadError}>{errors.phone}</div>}
        <label style={S.leadLabel}>Email <span style={S.optional}>(optional)</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" inputMode="email" type="email" style={S.leadInput} />
        </label>
        {errors.email && <div style={S.leadError}>{errors.email}</div>}
        <label style={S.leadLabel}>Notes <span style={S.optional}>(optional)</span>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ ...S.leadInput, minHeight: 88, resize: "vertical" }} />
        </label>
        <div style={S.summaryPreview}>{summary}</div>
        <button type="submit" style={{ ...S.saveBtn, width: "100%", minHeight: 48 }}>Send to NTX Hail</button>
        {errors.form && <div style={S.leadError}>{errors.form}</div>}
        <p style={S.disclaimer}>{ESTIMATE_DISCLAIMER}</p>
      </form>
      {embedUrl && (
        <div style={S.ghlOverlay} role="dialog" aria-modal="true" aria-label="NTX Hail estimate form">
          <div style={S.ghlBar}>
            <div style={{ minWidth: 0 }}>
              <div style={S.ghlTitle}>Send to NTX Hail</div>
              <p style={S.ghlHint}>Check the consent boxes, then submit the form.</p>
            </div>
            <button type="button" onClick={() => { setEmbedUrl(""); onFormClosed?.(); }} style={S.ghlClose}>Close</button>
          </div>
          <iframe title="NTX Hail estimate form" src={embedUrl} style={S.ghlFrame} />
        </div>
      )}
    </>
  );
}

function HailEstimator() {
  const [view, setView] = useState("estimate");
  const [selectedPanel, setSelectedPanel] = useState(null);
  const [panelData, setPanelData] = useState({});
  const [photos, setPhotos] = useState([]);
  const [vehicleInfo, setVehicleInfo] = useState(EMPTY_VEHICLE);
  const [showVehicleForm, setShowVehicleForm] = useState(false);
  const [emailTo, setEmailTo] = useState("");
  const [showEmailDone, setShowEmailDone] = useState(false);
  const [zipLoading, setZipLoading] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const [saveStatus, setSaveStatus] = useState("idle");
  const [carrierId, setCarrierId] = useState("state_farm");
  const [estimateId, setEstimateId] = useState("");
  const [savedEstimates, setSavedEstimates] = useState([]);
  const [showSaved, setShowSaved] = useState(false);
  const [exportNote, setExportNote] = useState("");
  const [finishedNote, setFinishedNote] = useState("");
  const draftRef = useRef(null);
  const activeCarrier = CARRIERS.find((c) => c.id === carrierId) || CARRIERS[0];
  draftRef.current = estimateId
    ? { id: estimateId, updatedAt: new Date().toISOString(), vehicleInfo, panelData, carrierId, photos }
    : null;

  const persistDraft = useCallback((draft) => {
    if (!draft?.id) return;
    const write = (value) => localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(value));
    try {
      write(draft);
      setSaveStatus("saved");
    } catch (err) {
      try {
        write({ ...draft, photos: [] });
        setSaveStatus("saved");
      } catch (again) {
        console.error("[HailSpec] Could not save the draft", again);
        setSaveStatus("error");
      }
    }
  }, []);

  useEffect(() => {
    try {
      const draft = parseDraft(localStorage.getItem(DRAFT_STORAGE_KEY));
      if (draft) {
        setEstimateId(draft.id);
        setVehicleInfo(draft.vehicleInfo);
        setPanelData(draft.panelData);
        setCarrierId(draft.carrierId);
        setPhotos(draft.photos);
      } else {
        setEstimateId(createEstimateId());
      }
      setSavedEstimates(parseSavedEstimates(localStorage.getItem(SAVED_STORAGE_KEY)));
    } catch (err) {
      console.error("[HailSpec] Could not read the saved draft", err);
      setEstimateId(createEstimateId());
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated || !estimateId) return undefined;
    setSaveStatus("saving");
    const timer = setTimeout(() => persistDraft(draftRef.current), 200);
    return () => clearTimeout(timer);
  }, [hydrated, estimateId, vehicleInfo, panelData, carrierId, photos, persistDraft]);

  useEffect(() => {
    if (!hydrated) return undefined;
    const flush = () => persistDraft(draftRef.current);
    window.addEventListener("pagehide", flush);
    const onHide = () => {
      if (document.visibilityState === "hidden") flush();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => {
      window.removeEventListener("pagehide", flush);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [hydrated, persistDraft]);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedEstimates));
    } catch (err) {
      console.error("[HailSpec] Could not save the estimate list", err);
    }
  }, [hydrated, savedEstimates]);

  const handleSavePanel = useCallback((panel, data) => setPanelData((prev) => ({ ...prev, [panel]: data })), []);
  const handleDeletePanel = useCallback((panel) => setPanelData((prev) => {
    const next = { ...prev };
    delete next[panel];
    return next;
  }), []);

  const currentEstimate = { id: estimateId, vehicleInfo, panelData, carrierId, photos };

  const startBlankEstimate = () => {
    setPanelData({});
    setVehicleInfo(blankVehicle());
    setCarrierId("state_farm");
    setPhotos([]);
    setView("estimate");
    setSelectedPanel(null);
    setShowVehicleForm(false);
    setShowSaved(false);
    setExportNote("");
    setFinishedNote("");
    setEmailTo("");
    setEstimateId(createEstimateId());
  };

  const handleNewEstimate = () => {
    if (estimateHasWork(currentEstimate)) {
      const ok = window.confirm("Start a new estimate? This one stays in Saved estimates.");
      if (!ok) return;
      setSavedEstimates((list) => archiveEstimate(list, currentEstimate));
    }
    startBlankEstimate();
  };

  const handleOpenSaved = (id) => {
    const result = openSavedEstimate(savedEstimates, currentEstimate, id);
    if (!result.estimate) return;
    setSavedEstimates(result.saved);
    setEstimateId(result.estimate.id);
    setVehicleInfo(result.estimate.vehicleInfo);
    setPanelData(result.estimate.panelData);
    setCarrierId(result.estimate.carrierId);
    setPhotos(result.estimate.photos);
    setView("estimate");
    setSelectedPanel(null);
    setShowSaved(false);
    setFinishedNote("");
  };

  const handleRemoveSaved = (id) => {
    setSavedEstimates((list) => list.filter((item) => item.id !== id));
  };

  const handleCarrier = (nextId) => {
    if (nextId === carrierId) return;
    const carrier = CARRIERS.find((item) => item.id === nextId);
    if (activePanels(panelData).length > 0) {
      const ok = window.confirm(`Switch to ${carrier?.label || "this carrier"}? Panels on this estimate will be cleared.`);
      if (!ok) return;
    }
    setCarrierId(nextId);
    setPanelData({});
  };

  const panels = activePanels(panelData);
  const grandTotal = grandTotalOf(panelData);
  const totalDents = maxDentCount(panelData);
  const summary = buildEstimateSummary({
    vehicleInfo,
    panelData,
    carrierLabel: activeCarrier.label,
    grandTotal,
  });

  const handleDownloadReport = async () => {
    setExportNote("");
    try {
      const bytes = buildEstimatePdf({
        vehicleInfo,
        panelData,
        carrierLabel: activeCarrier.label,
        grandTotal,
        photos,
      });
      const filename = estimatePdfName(vehicleInfo);
      const blob = new Blob([bytes], { type: "application/pdf" });
      const file = new File([blob], filename, { type: "application/pdf" });
      const touch = navigator.maxTouchPoints > 0;
      if (touch && typeof navigator.canShare === "function" && navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({ files: [file], title: "NTX Hail estimate" });
          setExportNote("Use the share sheet to save the PDF.");
          return;
        } catch (err) {
          if (err && err.name === "AbortError") return;
        }
      }
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.rel = "noopener";
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 2500);
      setExportNote("PDF downloaded.");
    } catch (err) {
      console.error("[HailSpec] PDF download failed", err);
      setExportNote("Could not create the PDF. Use Print, then save it as a PDF.");
    }
  };

  const handlePrint = () => {
    setExportNote("");
    window.print();
  };

  const handleEmail = () => {
    const vehicle = [vehicleInfo.year, vehicleInfo.make, vehicleInfo.model].filter(Boolean).join(" ") || "Vehicle";
    const subject = encodeURIComponent(`Hail Damage Estimate — ${vehicle} — $${grandTotal.toLocaleString("en-US")}`);
    const body = encodeURIComponent(`${summary}\n\n— NTX Hail`);
    window.location.href = `mailto:${emailTo}?subject=${subject}&body=${body}`;
    setShowEmailDone(true);
    setTimeout(() => setShowEmailDone(false), 3000);
  };

  const handleDownloadPhotosZip = async () => {
    if (!photos.length || zipLoading) return;
    setZipLoading(true);
    try {
      if (!window.JSZip) {
        await new Promise((resolve, reject) => {
          const script = document.createElement("script");
          script.src = "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js";
          script.onload = resolve;
          script.onerror = reject;
          document.head.appendChild(script);
        });
      }
      const zip = new window.JSZip();
      const vehicle = [vehicleInfo.year, vehicleInfo.make, vehicleInfo.model].filter(Boolean).join("_") || "Vehicle";
      const folder = zip.folder(`NTXHail_Photos_${vehicle}`);
      photos.forEach((photo, index) => {
        const [header, base64] = String(photo.url || "").split(",");
        if (!base64) return;
        const ext = (header.match(/data:image\/(\w+)/) || [])[1] || "jpg";
        const safeName = `${index + 1}_${(photo.name || `photo.${ext}`).replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        folder.file(safeName, base64, { base64: true });
      });
      const blob = await zip.generateAsync({ type: "blob", compression: "DEFLATE", compressionOptions: { level: 6 } });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `NTXHail_Photos_${vehicle}.zip`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("[HailSpec] Zip download failed:", err);
    }
    setZipLoading(false);
  };

  const S = styles;
  const vehicleLabel = [vehicleInfo.year, vehicleInfo.make, vehicleInfo.model].filter(Boolean).join(" ");
  const report = reportDocument({ vehicleInfo, panelData, carrierLabel: activeCarrier.label, grandTotal });
  const saveLabel = saveStatus === "error" ? "Not saved" : saveStatus === "saved" ? "Saved on this phone" : saveStatus === "saving" ? "Saving" : "by NTX Hail";

  if (!hydrated) {
    return (
      <div style={S.app} className="app-screen" role="status">
        <header style={S.header}><div style={S.logoText}>HAILSPEC</div></header>
        <p style={{ padding: 24, color: "#334155", fontSize: 16 }}>Loading your estimate…</p>
      </div>
    );
  }

  return (
    <>
    <div style={S.app} className="app-screen">
      <header style={S.header}>
        <div style={S.headerLeft}>
          <div style={S.logo}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <rect width="28" height="28" rx="5" fill="#0a1628"/>
              <text x="4" y="19" fontFamily="sans-serif" fontWeight="900" fontSize="13" fill="white">NTX</text>
              <polygon points="20,6 24,14 20,22 16,14" fill="#dc2626"/>
            </svg>
            <div style={{ minWidth: 0 }}>
              <div style={S.logoText}>HAILSPEC</div>
              <div style={S.logoSub}>{saveLabel}</div>
            </div>
          </div>
        </div>
        <a href="https://www.ntxhail.com" style={S.siteLink}>Back to NTX Hail</a>
      </header>
      <div style={S.accentBar}/>
      <div style={S.actionRow}>
        <button type="button" onClick={handleNewEstimate} style={S.newEstimateBtn}>New estimate</button>
        <button type="button" onClick={() => setShowSaved(true)} style={S.savedBtn} aria-haspopup="dialog">
          Saved{savedEstimates.length > 0 ? ` ${savedEstimates.length}` : ""}
        </button>
      </div>

      {(vehicleInfo.owner || vehicleInfo.year || vehicleInfo.make) && !showVehicleForm && (
        <button type="button" onClick={() => setShowVehicleForm(true)} style={S.customerBar}>
          <div style={S.customerBarLeft}>
            <div style={S.customerBarText}>
              <span style={S.customerBarName}>{vehicleInfo.owner || "No owner"}</span>
              <span style={S.customerBarVehicle}>{vehicleLabel || "No vehicle"}{vehicleInfo.claim ? ` • #${vehicleInfo.claim}` : ""}</span>
            </div>
          </div>
          <span style={{ ...S.carrierPill, color: activeCarrier.color, background: activeCarrier.color + "18", borderColor: activeCarrier.color + "33" }}>{activeCarrier.label}</span>
        </button>
      )}

      {showVehicleForm && <VehicleForm vehicleInfo={vehicleInfo} setVehicleInfo={setVehicleInfo} onClose={() => setShowVehicleForm(false)} />}

      <div style={S.carrierBar}>
        <div style={S.carrierBarLabel}>CARRIER</div>
        <div style={S.carrierScroll}>
          {CARRIERS.map((carrier) => {
            const isActive = carrierId === carrier.id;
            const hasMatrix = carrierHasMatrix(carrier.id);
            return (
              <button key={carrier.id} type="button" onClick={() => handleCarrier(carrier.id)}
                style={{ ...S.carrierChip, ...(isActive ? { background: carrier.color, color: "#fff", borderColor: carrier.color } : {}), ...(!hasMatrix && !isActive ? { opacity: 0.7 } : {}) }}>
                {carrier.label}
              </button>
            );
          })}
        </div>
      </div>

      {carrierId !== "state_farm" && !carrierHasMatrix(carrierId) && (
        <div style={S.carrierStubBanner}>
          <span><strong>{activeCarrier.label}</strong> does not have a price matrix yet. PDR prices stay at $0 and the panel should be written as conventional or R&R.</span>
        </div>
      )}

      <div style={S.tabs}>
        <button type="button" onClick={() => setView("estimate")} style={{ ...S.tab, ...(view === "estimate" ? S.tabActive : {}) }}>Estimate</button>
        <button type="button" onClick={() => setView("review")} style={{ ...S.tab, ...(view === "review" ? S.tabActive : {}) }}>
          Review{panels.length > 0 && <span style={S.badge}>{panels.length}</span>}
        </button>
      </div>

      {view === "estimate" && (
        <div style={S.body}>
          <div style={S.statsStrip}>
            <div style={S.stat}><div style={S.statVal}>{panels.length}</div><div style={S.statLabel}>Panels</div></div>
            <div style={S.stat}><div style={S.statVal}>{totalDents}</div><div style={S.statLabel}>Max dents</div></div>
            <div style={S.stat}><div style={{ ...S.statVal, color: "#2563eb" }}>${grandTotal.toLocaleString("en-US")}</div><div style={S.statLabel}>Total</div></div>
          </div>
          <p style={S.disclaimer}>{ESTIMATE_DISCLAIMER}</p>
          <div style={S.carSection}>
            <div style={S.sectionHead}>
              <div style={{ ...S.sectionLabel, marginBottom: 0 }}>Tap a panel</div>
              <button type="button" onClick={() => setShowVehicleForm((open) => !open)} style={S.inlineBtn}>Vehicle</button>
            </div>
            <CarSilhouette panelData={panelData} selectedPanel={selectedPanel} onSelectPanel={setSelectedPanel} />
            <p style={S.tapHint}>{panels.length ? "Tap a panel again to change it." : "Tap a panel on the vehicle to add damage."}</p>
            <div style={S.legend}>
              {[["None", "#f1f5f9"], ["Low", "rgba(37,99,235,0.35)"], ["Med", "rgba(59,130,246,0.5)"], ["High", "rgba(249,115,22,0.55)"], ["Severe", "rgba(220,38,38,0.65)"]].map(([label, color]) => (
                <div key={label} style={S.legendItem}><div style={{ ...S.legendDot, background: color, border: "1px solid #e2e8f0" }} /><span>{label}</span></div>
              ))}
            </div>
          </div>
          <div style={S.section}><div style={S.sectionLabel}>Photos</div><CameraCapture photos={photos} setPhotos={setPhotos} /></div>
          {panels.length > 0 && (
            <div style={S.section}>
              <div style={S.sectionLabel}>Damage log</div>
              {panels.map(([key, data]) => (
                <button key={key} type="button" onClick={() => setSelectedPanel(key)} style={S.logItem}>
                  <div style={{ minWidth: 0 }}>
                    <div style={S.logPanel}>{PANEL_LABELS[key]}</div>
                    <div style={S.logMeta}>{data.rrEnabled ? "R&R — Remove & Replace" : data.convEnabled ? "Conventional Repair" : `${data.selectedRange || data.count} ${(DENT_SIZE_LABELS[data.size] || "").toLowerCase()} dents${(data.addons || []).length > 0 ? " • add-on" : ""}`}{data.riEnabled ? " • R&I" : ""}</div>
                  </div>
                  <div style={S.logPrice}>${Number(data.totalPrice || 0).toLocaleString("en-US")}</div>
                </button>
              ))}
              <button type="button" onClick={() => setView("review")} style={{ ...S.saveBtn, width: "100%", marginTop: 8 }}>Review and send</button>
            </div>
          )}
        </div>
      )}

      {view === "review" && (
        <div style={S.body}>
          {panels.length === 0 ? (
            <div style={S.emptyState}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>No panels yet</div>
              <div style={{ color: "#64748b", fontSize: 14 }}>Add damage on the Estimate tab, then come back to send it.</div>
              <button type="button" onClick={() => setView("estimate")} style={{ ...S.saveBtn, marginTop: 16 }}>Back to estimate</button>
            </div>
          ) : (
            <>
              <div style={S.reviewCard}>
                <div style={S.reviewHeader}>
                  <div style={{ minWidth: 0, flex: "1 1 160px" }}>
                    <div style={S.reviewTitle}>Estimate summary</div>
                    <div style={S.reviewMeta}>{vehicleLabel || "No vehicle info"}{vehicleInfo.claim ? ` • #${vehicleInfo.claim}` : ""}</div>
                    <div style={{ ...S.carrierPill, color: activeCarrier.color, background: activeCarrier.color + "15", borderColor: activeCarrier.color + "30", marginTop: 6 }}>{activeCarrier.label}</div>
                  </div>
                  <div style={S.grandTotal}>${grandTotal.toLocaleString("en-US")}</div>
                </div>
                <div>
                  {panels.map(([key, data]) => {
                    const nonPdr = data.rrEnabled || data.convEnabled;
                    const mode = data.rrEnabled ? "R&R" : data.convEnabled ? "Conventional" : `${data.selectedRange || data.count} ${(DENT_SIZE_LABELS[data.size] || "").toLowerCase()}`;
                    return (
                      <div key={key} style={S.reviewItem}>
                        <div style={S.reviewItemTop}>
                          <span style={S.reviewItemName}>{PANEL_LABELS[key]}</span>
                          <span style={S.reviewItemPrice}>${Number(data.totalPrice || 0).toLocaleString("en-US")}</span>
                        </div>
                        <div style={S.reviewItemMeta}>{mode}{data.riEnabled ? ` • R&I $${Number(data.riTotalCost || 0).toFixed(0)}` : ""}</div>
                      </div>
                    );
                  })}
                  <div style={S.rtTotal}>
                    <span>Grand total</span>
                    <span>${grandTotal.toLocaleString("en-US")}</span>
                  </div>
                </div>
              </div>
              <p style={S.disclaimer}>Max dents adds the top of each dent range. It is not an exact dent count. {ESTIMATE_DISCLAIMER}</p>
              {finishedNote && <p style={S.leadOk}>{finishedNote}</p>}
              <LeadCapture summary={summary} onFormClosed={() => setFinishedNote("The form is open for you to submit. This estimate stays saved on this phone.")} />
              <div style={S.section}>
                <div style={S.sectionLabel}>Export</div>
                <div style={S.exportStack}>
                  <button type="button" onClick={handlePrint} style={S.exportBtn}>Print</button>
                  <button type="button" onClick={handleDownloadReport} style={S.exportBtn}>Download PDF</button>
                </div>
                {exportNote && <p style={S.leadOk}>{exportNote}</p>}
                <label style={S.leadLabel}>Email the summary
                  <input type="email" placeholder="recipient@email.com" value={emailTo} onChange={(e) => setEmailTo(e.target.value)} autoComplete="email" style={S.leadInput} />
                </label>
                <button type="button" onClick={handleEmail} disabled={!emailTo} style={{ ...S.exportBtn, opacity: emailTo ? 1 : 0.45 }}>Email</button>
                {showEmailDone && <div style={S.leadOk}>Your mail app opened. Review it there before you send.</div>}
              </div>
              <div style={S.nextCard}>
                <div style={S.sectionLabel}>Another vehicle</div>
                <p style={S.leadIntro}>Keep this estimate in Saved, then start a blank one for the next car.</p>
                <button type="button" onClick={handleNewEstimate} style={{ ...S.newEstimateBtn, width: "100%" }}>New estimate</button>
              </div>
              {photos.length > 0 && (
                <div style={S.section}>
                  <div style={S.sectionHead}>
                    <div style={{ ...S.sectionLabel, marginBottom: 0 }}>Photos ({photos.length})</div>
                    <button type="button" onClick={handleDownloadPhotosZip} disabled={zipLoading} style={S.inlineBtn}>{zipLoading ? "Zipping…" : "Download ZIP"}</button>
                  </div>
                  <div style={S.photoGrid}>{photos.map((photo, index) => <img key={index} src={photo.url} alt="" style={S.reviewPhoto} />)}</div>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {selectedPanel && (
        <PanelEditor panel={selectedPanel} data={panelData[selectedPanel]} carrierId={carrierId} onSave={handleSavePanel} onDelete={handleDeletePanel} onClose={() => setSelectedPanel(null)} />
      )}
      {showSaved && (
        <div style={S.modalOverlay} role="dialog" aria-modal="true" aria-label="Saved estimates" onClick={() => setShowSaved(false)}>
          <div style={S.modalContent} onClick={(event) => event.stopPropagation()}>
            <div style={S.modalHeader}>
              <div>
                <div style={S.modalTitle}>Saved estimates</div>
                <div style={S.modalSubtitle}>Stored on this phone</div>
              </div>
              <button type="button" onClick={() => setShowSaved(false)} style={S.closeBtn} aria-label="Close saved estimates">✕</button>
            </div>
            <div style={S.modalBody}>
              {savedEstimates.length === 0 ? (
                <div style={S.emptyState}>
                  <div style={{ fontWeight: 700, marginBottom: 6 }}>No saved estimates yet</div>
                  <div>Starting a new estimate keeps the one you were writing.</div>
                </div>
              ) : savedEstimates.map((item) => {
                const when = new Date(item.updatedAt);
                const date = Number.isNaN(when.getTime()) ? "" : when.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                const total = grandTotalOf(item.panelData);
                const count = activePanels(item.panelData).length;
                return (
                  <div key={item.id} style={S.savedRow}>
                    <button type="button" onClick={() => handleOpenSaved(item.id)} style={S.savedOpen}>
                      <span style={S.logPanel}>{estimateTitle(item)}</span>
                      <span style={S.logMeta}>{count} panel{count === 1 ? "" : "s"} · ${total.toLocaleString("en-US")}{date ? ` · ${date}` : ""}</span>
                    </button>
                    <button type="button" onClick={() => handleRemoveSaved(item.id)} style={S.savedRemove}>Remove</button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
    <article className="print-sheet" aria-hidden="true">
      <header className="print-header">
        <div className="print-brand">NTX HAIL</div>
        <div className="print-kicker">HailSpec estimate</div>
        <p>{report.carrier} · {report.date}</p>
      </header>
      <dl className="print-meta">
        <div><dt>Owner</dt><dd>{report.owner}</dd></div>
        <div><dt>Vehicle</dt><dd>{report.vehicle}</dd></div>
        <div><dt>VIN</dt><dd>{report.vin}</dd></div>
        <div><dt>Claim #</dt><dd>{report.claim}</dd></div>
      </dl>
      <table>
        <thead><tr><th>Panel</th><th>Damage</th><th>Price</th></tr></thead>
        <tbody>
          {report.panels.length === 0 ? (
            <tr><td colSpan={3}>No panels estimated.</td></tr>
          ) : report.panels.map((panel) => (
            <tr key={panel.name}>
              <td>{panel.name}</td>
              <td>{panel.detail}</td>
              <td className="amt">${panel.amount.toLocaleString("en-US")}</td>
            </tr>
          ))}
          <tr className="print-total">
            <td colSpan={2}>Grand total</td>
            <td className="amt">${report.grandTotal.toLocaleString("en-US")}</td>
          </tr>
        </tbody>
      </table>
      <p className="print-disclaimer">{report.disclaimer}</p>
      {photos.some((photo) => typeof photo?.url === "string" && photo.url.startsWith("data:image/")) && (
        <div className="print-photos">
          {photos.filter((photo) => typeof photo?.url === "string" && photo.url.startsWith("data:image/")).map((photo, index) => (
            <img key={index} src={photo.url} alt="" />
          ))}
        </div>
      )}
      <p className="print-footer">Generated by HailSpec. ntxhail.com</p>
    </article>
    </>
  );
}

const styles = {
  app: {
    fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif",
    background: "#f8fafc",
    color: "#0f172a",
    minHeight: "100vh",
    width: "100%",
    maxWidth: 480,
    margin: "0 auto",
    position: "relative",
    overflowX: "hidden",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap",
    padding: "12px 16px",
    gap: 8,
    minHeight: 64,
    background: "#0a1628",
    borderBottom: "none",
    position: "sticky", top: 0, zIndex: 50,
    boxShadow: "0 2px 12px rgba(10,22,40,0.18)",
  },
  accentBar: {
    height: 3,
    background: "linear-gradient(90deg, #2563eb 0%, #3b82f6 50%, #dc2626 100%)",
  },
  headerLeft: { display: "flex", alignItems: "center", gap: 12 },
  logo: { display: "flex", alignItems: "center", gap: 10 },
  logoText: { fontWeight: 900, fontSize: 17, letterSpacing: "1.5px", color: "#ffffff", lineHeight: 1 },
  logoSub: { fontSize: 12, color: "#93c5fd", fontWeight: 700, letterSpacing: "0.2px", marginTop: 2 },
  siteLink: { minHeight: 44, display: "inline-flex", alignItems: "center", color: "#dbeafe", fontWeight: 700, fontSize: 14, textDecoration: "none", padding: "8px 2px", flexShrink: 0 },
  actionRow: { display: "flex", gap: 8, padding: "10px 16px", background: "#ffffff", borderBottom: "1px solid #e2e8f0" },
  newEstimateBtn: { flex: 1.4, minHeight: 48, background: "#2563eb", border: "none", borderRadius: 10, padding: "12px 14px", color: "#ffffff", fontSize: 16, fontWeight: 800, cursor: "pointer" },
  savedBtn: { flex: 1, minHeight: 48, background: "#f8fafc", border: "1.5px solid #cbd5e1", borderRadius: 10, padding: "12px 14px", color: "#0f172a", fontSize: 16, fontWeight: 800, cursor: "pointer" },
  tapHint: { margin: "8px 0 0", textAlign: "center", color: "#334155", fontSize: 14, fontWeight: 600, lineHeight: 1.4 },
  nextCard: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 14, padding: 16, marginBottom: 16 },
  savedRow: { display: "flex", alignItems: "stretch", gap: 8, marginBottom: 8 },
  savedOpen: { flex: 1, minHeight: 56, textAlign: "left", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 12, padding: "12px 14px", cursor: "pointer", color: "#0f172a", display: "flex", flexDirection: "column", gap: 4 },
  savedRemove: { minWidth: 44, minHeight: 56, padding: "8px 12px", borderRadius: 12, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", fontWeight: 700, cursor: "pointer" },
  headerBadge: {
    fontSize: 10, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.5px",
    background: "rgba(255,255,255,0.08)", padding: "3px 8px", borderRadius: 4,
    border: "1px solid rgba(255,255,255,0.12)",
  },
  vehicleBtn: {
    background: "rgba(255,255,255,0.1)", border: "1.5px solid rgba(255,255,255,0.2)", borderRadius: 10,
    minHeight: 44, padding: "10px 16px", color: "#ffffff", cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 15, fontWeight: 700,
  },
  customerBar: {
    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
    background: "#ffffff", border: "none",
    borderBottom: "1px solid #e2e8f0", padding: "12px 16px",
    minHeight: 56,
    gap: 8,
    flexWrap: "wrap",
    cursor: "pointer", textAlign: "left",
  },
  customerBarLeft: { display: "flex", alignItems: "center", gap: 10, flex: 1, minWidth: 0 },
  customerBarText: { display: "flex", flexDirection: "column", gap: 1, minWidth: 0 },
  customerBarName: { fontSize: 13, fontWeight: 700, color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  customerBarVehicle: { fontSize: 11, color: "#64748b", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" },
  vehicleForm: {
    background: "#ffffff", padding: "20px", borderBottom: "1px solid #e2e8f0",
    maxHeight: "80vh", overflowY: "auto",
    boxShadow: "0 4px 16px rgba(0,0,0,0.06)",
  },
  vehicleFormTitle: { fontWeight: 700, fontSize: 15, marginBottom: 14, color: "#0f172a" },
  vfGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 },
  vfField: {},
  vfLabel: { display: "block", fontSize: 10, fontWeight: 700, color: "#64748b", letterSpacing: "0.5px", marginBottom: 4, textTransform: "uppercase" },
  vfInput: {
    width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8,
    minHeight: 48, padding: "12px 14px", color: "#0f172a", fontSize: 16, outline: "none",
  },
  vfSelect: {
    width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8,
    minHeight: 48, padding: "12px 14px", color: "#0f172a", fontSize: 16, outline: "none", appearance: "auto",
  },
  vfDone: {
    marginTop: 14, background: "#2563eb", color: "#ffffff", border: "none", borderRadius: 8,
    minHeight: 48, padding: "12px 24px", fontWeight: 700, fontSize: 16, cursor: "pointer", width: "100%",
    boxShadow: "0 2px 8px rgba(37,99,235,0.3)",
  },
  tabs: { display: "flex", background: "#ffffff", borderBottom: "1px solid #e2e8f0" },
  tab: {
    flex: 1, minHeight: 48, padding: "14px 8px", background: "none", border: "none", borderBottom: "2px solid transparent",
    color: "#64748b", fontSize: 14, fontWeight: 600, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
  },
  tabActive: { color: "#2563eb", borderBottomColor: "#2563eb" },
  badge: {
    background: "#2563eb", color: "#fff", fontSize: 11, fontWeight: 800,
    borderRadius: 10, padding: "1px 7px",
  },
  body: { padding: "16px 16px 80px" },
  statsStrip: { display: "flex", gap: 8, marginBottom: 16 },
  stat: {
    flex: 1, background: "#ffffff", borderRadius: 12, padding: "14px 12px", textAlign: "center",
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
  },
  statVal: { fontSize: 18, fontWeight: 800, color: "#0f172a", letterSpacing: "-0.5px", overflow: "hidden", textOverflow: "ellipsis" },
  statLabel: { fontSize: 10, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.5px", textTransform: "uppercase", marginTop: 2 },
  carSection: {
    background: "#ffffff", borderRadius: 14, padding: "16px 12px 12px", marginBottom: 16,
    border: "1px solid #e2e8f0",
    boxShadow: "0 1px 6px rgba(0,0,0,0.06)",
  },
  sectionLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 12 },
  legend: { display: "flex", justifyContent: "center", gap: 8, marginTop: 8, flexWrap: "wrap" },
  legendItem: { display: "flex", alignItems: "center", gap: 4, fontSize: 10, color: "#94a3b8" },
  legendDot: { width: 10, height: 10, borderRadius: 3 },
  section: { marginBottom: 20 },
  cameraBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%",
    background: "#ffffff", border: "1.5px dashed #cbd5e1",
    borderRadius: 12, minHeight: 48, padding: "12px 16px", color: "#334155", fontSize: 15, fontWeight: 700, cursor: "pointer",
  },
  photoStrip: { display: "flex", gap: 8, marginTop: 10, overflowX: "auto", paddingBottom: 4 },
  photoThumb: { position: "relative", flexShrink: 0, width: 96, height: 96, borderRadius: 8, overflow: "hidden" },
  photoImg: { width: "100%", height: "100%", objectFit: "cover" },
  photoRemove: {
    position: "absolute", top: 2, right: 2, background: "rgba(0,0,0,0.55)", border: "none",
    borderRadius: "50%", width: 44, height: 44, color: "#fff", fontSize: 16, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  logItem: {
    display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%",
    background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: 12,
    minHeight: 48, padding: "12px 14px", marginBottom: 8, cursor: "pointer", textAlign: "left", color: "#0f172a", gap: 8,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  logPanel: { fontWeight: 700, fontSize: 14, color: "#0f172a" },
  logMeta: { fontSize: 13, color: "#64748b", marginTop: 2, overflowWrap: "anywhere" },
  logPrice: { fontWeight: 800, fontSize: 16, color: "#2563eb" },
  // Modal
  modalOverlay: {
    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
    background: "rgba(15,23,42,0.5)", backdropFilter: "blur(6px)",
    zIndex: 100, display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  modalContent: {
    background: "#ffffff", borderRadius: "20px 20px 0 0", width: "100%", maxWidth: "min(480px, 100%)", minWidth: 0, overflow: "hidden",
    maxHeight: "92vh", display: "flex", flexDirection: "column",
    borderTop: "3px solid #2563eb",
    boxShadow: "0 -4px 32px rgba(0,0,0,0.12)",
  },
  modalHeader: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "20px 20px 16px", borderBottom: "1px solid #f1f5f9",
  },
  modalTitle: { fontWeight: 800, fontSize: 18, color: "#0f172a" },
  modalSubtitle: { fontSize: 12, color: "#94a3b8", marginTop: 2 },
  closeBtn: {
    background: "#f1f5f9", border: "none", borderRadius: 8,
    width: 44, height: 44, color: "#64748b", fontSize: 18, cursor: "pointer",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  modalBody: { padding: "16px", overflowY: "auto", overflowX: "hidden", flex: 1, minWidth: 0, background: "#ffffff" },
  repairToggles: { display: "flex", gap: 8, marginBottom: 16 },
  repairToggleBtn: {
    flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
    background: "#f8fafc", border: "1.5px solid #e2e8f0",
    borderRadius: 10, minHeight: 48, padding: "12px 10px", color: "#64748b", fontSize: 14, fontWeight: 700,
    cursor: "pointer",
  },
  repairToggleBtnRR: {
    background: "rgba(220,38,38,0.06)", border: "1.5px solid rgba(220,38,38,0.4)", color: "#dc2626",
  },
  repairToggleBtnConv: {
    background: "rgba(249,115,22,0.06)", border: "1.5px solid rgba(249,115,22,0.4)", color: "#f97316",
  },
  rrPanel: {
    background: "#fff5f5", border: "1px solid #fecaca",
    borderRadius: 14, padding: 16, marginBottom: 18,
  },
  rrPanelHeader: {
    display: "flex", alignItems: "center", gap: 12, marginBottom: 14,
    paddingBottom: 12, borderBottom: "1px solid #fecaca",
  },
  rrPanelTitle: { fontSize: 14, fontWeight: 700, color: "#dc2626" },
  rrPanelSub: { fontSize: 11, color: "#94a3b8", marginTop: 1 },
  rrRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 10 },
  rrRowLabel: { fontSize: 13, fontWeight: 600, color: "#334155", flex: 1 },
  rrRateValue: { width: 68, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#dc2626", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", lineHeight: "44px" },
  rrHoursValue: { width: 52, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#0f172a", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", lineHeight: "38px" },
  rrUnit: { fontSize: 12, color: "#94a3b8", fontWeight: 500, width: 28 },
  rrSubtotal: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4, paddingTop: 10, borderTop: "1px solid #fecaca", fontSize: 13, fontWeight: 600, color: "#64748b" },
  rrSubtotalVal: { fontSize: 16, fontWeight: 800, color: "#dc2626" },
  rrWarning: {
    display: "flex", gap: 12, alignItems: "flex-start",
    background: "#fef2f2", border: "1px solid #fecaca",
    borderRadius: 12, padding: "14px 16px", marginTop: 14,
  },
  rrWarningTitle: { fontSize: 13, fontWeight: 700, color: "#dc2626", marginBottom: 3 },
  rrWarningText: { fontSize: 12, color: "#ef4444", lineHeight: 1.5 },
  fieldLabel: { display: "block", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", textTransform: "uppercase", marginBottom: 8, marginTop: 18 },
  rangeNavRow: { display: "flex", alignItems: "center", gap: 12, marginBottom: 12 },
  rangeArrow: {
    background: "#f1f5f9", border: "1px solid #e2e8f0",
    borderRadius: 12, width: 48, height: 48, color: "#334155",
    cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  rangeDisplay: {
    flex: 1, background: "#eff6ff", border: "1.5px solid #bfdbfe",
    borderRadius: 14, padding: "14px 16px", textAlign: "center",
    minHeight: 58, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
  },
  rangeDisplayInvalid: { background: "#fef2f2", border: "1.5px solid #fecaca" },
  rangeDisplayCount: { fontSize: 24, fontWeight: 800, color: "#1d4ed8", letterSpacing: "-0.5px", lineHeight: 1 },
  rangeDisplayLabel: { fontSize: 11, fontWeight: 600, color: "#3b82f6", textTransform: "uppercase", letterSpacing: "0.5px", marginTop: 2 },
  rangeDisplayPlaceholder: { fontSize: 15, fontWeight: 600, color: "#94a3b8" },
  rangeSteps: { display: "flex", gap: 0, alignItems: "flex-start", overflowX: "hidden", maxWidth: "100%", width: "100%", paddingBottom: 4 },
  rangeStep: { flex: 1, minWidth: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6, padding: "4px 2px", cursor: "pointer", background: "none", border: "none", color: "#94a3b8", position: "relative" },
  rangeStepActive: { color: "#2563eb" },
  rangeStepPast: { color: "#93c5fd" },
  rangeStepDot: { width: 12, height: 12, borderRadius: "50%", background: "#e2e8f0", border: "2px solid #cbd5e1", transition: "all 0.2s" },
  rangeStepText: { fontSize: 9, fontWeight: 700, letterSpacing: "0.2px", whiteSpace: "nowrap" },
  priceTag: { fontSize: 13, fontWeight: 600, color: "#16a34a", marginTop: 8 },
  sizeGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  sizeBtn: {
    background: "#f8fafc", border: "1.5px solid #e2e8f0",
    borderRadius: 8, padding: "10px", color: "#64748b", fontSize: 13, fontWeight: 600,
    cursor: "pointer", textAlign: "center",
  },
  sizeBtnActive: { background: "#eff6ff", border: "1.5px solid #3b82f6", color: "#2563eb" },
  sizeBtnDisabled: { opacity: 0.35, cursor: "not-allowed" },
  sizeBtnRed: { background: "#fef2f2", border: "1.5px solid #fca5a5", color: "#dc2626" },
  sizeBtnWarn: { borderColor: "#fca5a5" },
  addonGrid: {},
  addonBtn: {
    display: "flex", alignItems: "center", gap: 10, width: "100%",
    background: "#f8fafc", border: "1.5px solid #e2e8f0",
    borderRadius: 10, padding: "12px 14px", color: "#64748b", fontSize: 14, fontWeight: 500,
    cursor: "pointer", textAlign: "left",
  },
  addonBtnActive: { background: "#eff6ff", border: "1.5px solid #3b82f6", color: "#2563eb" },
  addonName: { flex: 1 },
  addonVal: { fontSize: 12, fontWeight: 600, opacity: 0.6, whiteSpace: "nowrap" },
  addonValActive: { opacity: 1, color: "#2563eb" },
  osDentRow: { display: "flex", alignItems: "center", gap: 10, padding: "10px 12px 6px 38px" },
  osDentLabel: { fontSize: 12, color: "#64748b", fontWeight: 600, whiteSpace: "nowrap" },
  osStepper: {
    display: "flex", alignItems: "center", background: "#f8fafc",
    border: "1.5px solid #e2e8f0", borderRadius: 10, overflow: "hidden",
  },
  osStepBtn: {
    background: "none", border: "none", color: "#334155", width: 44, height: 44,
    display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
  },
  osStepValue: { width: 40, textAlign: "center", fontSize: 16, fontWeight: 800, color: "#0f172a", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", lineHeight: "38px" },
  osStepTotal: { fontSize: 13, fontWeight: 700, color: "#2563eb", marginLeft: "auto", whiteSpace: "nowrap" },
  riToggleActive: { background: "#eff6ff", border: "1.5px solid #3b82f6", color: "#2563eb" },
  riSection: { background: "#f0f9ff", border: "1px solid #bae6fd", borderRadius: 12, padding: 14, marginBottom: 4 },
  riLaborRow: { display: "flex", alignItems: "center", gap: 10, marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid #bae6fd" },
  riLaborLabel: { fontSize: 13, fontWeight: 600, color: "#64748b", flex: 1 },
  riLaborValue: { width: 68, textAlign: "center", fontSize: 14, fontWeight: 800, color: "#2563eb", borderLeft: "1px solid #e2e8f0", borderRight: "1px solid #e2e8f0", lineHeight: "38px" },
  riLaborUnit: { fontSize: 12, color: "#94a3b8", fontWeight: 500 },
  riOpList: { display: "flex", flexDirection: "column", gap: 8 },
  riOpCard: { background: "#ffffff", borderRadius: 10, border: "1px solid #e2e8f0", overflow: "hidden" },
  riOpTopRow: { display: "flex", alignItems: "stretch" },
  riOpToggleBtn: { flex: 1, display: "flex", alignItems: "center", gap: 10, padding: "12px 12px", background: "none", border: "none", cursor: "pointer", textAlign: "left", minHeight: 44 },
  riOpToggleBtnOn: { background: "#f0f9ff" },
  riOpToggleBtnRr: { background: "#fff5f5" },
  riOpCheck: { width: 22, height: 22, borderRadius: 6, flexShrink: 0, border: "2px solid #cbd5e1", display: "flex", alignItems: "center", justifyContent: "center", color: "transparent" },
  riOpCheckOn: { background: "#eff6ff", borderColor: "#3b82f6", color: "#2563eb" },
  riOpCheckRr: { background: "#fef2f2", borderColor: "#ef4444", color: "#dc2626" },
  riOpLabel: { fontSize: 14, fontWeight: 600, color: "#0f172a", flex: 1 },
  riOpLabelOff: { opacity: 0.4, textDecoration: "line-through", color: "#94a3b8" },
  riOpExcTag: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px" },
  riRrBtn: { padding: "0 14px", fontSize: 11, fontWeight: 800, background: "#f8fafc", border: "none", borderLeft: "1px solid #e2e8f0", color: "#94a3b8", cursor: "pointer", whiteSpace: "nowrap", minWidth: 56, textAlign: "center" },
  riRrBtnActive: { background: "#fef2f2", color: "#dc2626", borderLeft: "1px solid #fecaca" },
  riOpBottomRow: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "6px 12px 10px", borderTop: "1px solid #f1f5f9" },
  riOpTimeControls: { display: "flex", alignItems: "center", gap: 6 },
  riTimeBtn: { background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: 6, width: 44, height: 44, color: "#64748b", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", flexShrink: 0 },
  riTimeVal: { minWidth: 50, textAlign: "center", fontSize: 13, fontWeight: 700, color: "#0f172a" },
  riOpCost: { fontSize: 12, fontWeight: 700, color: "#2563eb", width: 52, textAlign: "right" },
  riSubtotal: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 12, paddingTop: 10, borderTop: "1px solid #bae6fd", fontSize: 13, fontWeight: 600, color: "#64748b" },
  riSubtotalVal: { fontSize: 16, fontWeight: 800, color: "#2563eb" },
  summaryBox: { background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 12, padding: 16, marginTop: 20 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#64748b", marginBottom: 6 },
  summaryTotal: { display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 800, color: "#2563eb", borderTop: "1px solid #bfdbfe", paddingTop: 10, marginTop: 8 },
  modalFooter: { display: "flex", gap: 10, padding: "12px 16px calc(12px + env(safe-area-inset-bottom))", borderTop: "1px solid #f1f5f9", background: "#ffffff" },
  deleteBtn: { background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "12px 16px", color: "#dc2626", fontSize: 14, fontWeight: 600, cursor: "pointer" },
  saveBtn: { flex: 1, minHeight: 48, background: "#2563eb", border: "none", borderRadius: 10, padding: "14px", color: "#ffffff", fontSize: 16, fontWeight: 800, cursor: "pointer" },
  // Review
  emptyState: { textAlign: "center", padding: "60px 20px", color: "#94a3b8" },
  reviewCard: { background: "#ffffff", borderRadius: 14, border: "1px solid #e2e8f0", overflow: "hidden", marginBottom: 20, boxShadow: "0 1px 6px rgba(0,0,0,0.06)" },
  reviewHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, flexWrap: "wrap", padding: "16px 16px 12px" },
  reviewTitle: { fontWeight: 800, fontSize: 16, color: "#0f172a" },
  reviewMeta: { fontSize: 12, color: "#64748b", marginTop: 2 },
  grandTotal: { fontSize: 22, fontWeight: 800, color: "#2563eb", letterSpacing: "-0.5px" },
  reviewTable: {},
  rtHead: { display: "flex", padding: "10px 18px", background: "#f8fafc", fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "0.5px", textTransform: "uppercase", borderBottom: "1px solid #e2e8f0" },
  rtRow: { display: "flex", padding: "12px 18px", borderBottom: "1px solid #f1f5f9", fontSize: 14, color: "#0f172a" },
  rtTotal: { display: "flex", justifyContent: "space-between", gap: 12, padding: "14px 16px", background: "#eff6ff", fontSize: 16, fontWeight: 800, color: "#2563eb" },
  exportBtn: {
    display: "flex", alignItems: "center", justifyContent: "center", gap: 10, width: "100%",
    background: "#ffffff", border: "1.5px solid #e2e8f0",
    borderRadius: 12, minHeight: 48, padding: "12px 16px", color: "#334155", fontSize: 16, fontWeight: 700, cursor: "pointer", marginBottom: 0,
    boxShadow: "0 1px 4px rgba(0,0,0,0.05)",
  },
  emailRow: { display: "flex", gap: 8 },
  emailInput: { flex: 1, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, minHeight: 48, padding: "12px 14px", color: "#0f172a", fontSize: 16, outline: "none" },
  emailBtn: { display: "flex", alignItems: "center", gap: 6, background: "#2563eb", border: "none", borderRadius: 10, minHeight: 48, padding: "12px 16px", color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer" },
  emailSuccess: { fontSize: 13, color: "#16a34a", marginTop: 8, fontWeight: 600 },
  photoGrid: { display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 },
  reviewPhoto: { width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 8, border: "1px solid #e2e8f0" },
  // SearchSelect
  ssWrap: { position: "relative" },
  ssInput: { width: "100%", background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 8, minHeight: 48, padding: "12px 14px", color: "#0f172a", fontSize: 16, outline: "none" },
  ssInputFilled: { color: "#2563eb", fontWeight: 600 },
  ssClear: { position: "absolute", right: 8, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#94a3b8", fontSize: 12, cursor: "pointer", padding: "2px 4px" },
  ssDropdown: { position: "absolute", top: "100%", left: 0, right: 0, zIndex: 50, background: "#ffffff", border: "1.5px solid #e2e8f0", borderRadius: 10, maxHeight: 180, overflowY: "auto", marginTop: 4, boxShadow: "0 8px 24px rgba(0,0,0,0.12)", WebkitOverflowScrolling: "touch" },
  ssOption: { display: "block", width: "100%", background: "none", border: "none", borderRadius: 4, minHeight: 44, padding: "12px 14px", color: "#334155", fontSize: 16, textAlign: "left", cursor: "pointer" },
  ssOptionActive: { background: "#eff6ff", color: "#2563eb", fontWeight: 700 },
  ssEmpty: { padding: "12px", color: "#94a3b8", fontSize: 13, textAlign: "center" },
  ssBackdrop: { position: "fixed", top: 0, left: 0, right: 0, bottom: 0, zIndex: 40 },
  // VIN
  vinRow: { position: "relative" },
  vinInput: { fontFamily: "monospace", letterSpacing: "1.5px", fontSize: 15, textTransform: "uppercase", paddingRight: 50 },
  vinInputDecoded: { borderColor: "#86efac", background: "#f0fdf4" },
  vinCounter: { position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)", fontSize: 11, color: "#94a3b8", fontWeight: 600 },
  vinSuccess: { display: "flex", alignItems: "center", gap: 6, marginTop: 6, fontSize: 12, color: "#16a34a", fontWeight: 600 },
  vinWarn: { marginTop: 6, fontSize: 12, color: "#d97706", fontWeight: 500 },
  // Carrier selector
  carrierBar: { background: "#ffffff", borderBottom: "1px solid #e2e8f0", padding: "10px 16px 10px", display: "flex", alignItems: "center", gap: 8, minWidth: 0 },
  carrierBarLabel: { fontSize: 10, fontWeight: 700, color: "#94a3b8", letterSpacing: "1px", whiteSpace: "nowrap" },
  carrierScroll: { display: "flex", flexWrap: "wrap", gap: 8, flex: 1, minWidth: 0, maxWidth: "100%" },
  carrierChip: { flexShrink: 0, minHeight: 44, padding: "10px 14px", borderRadius: 22, border: "1.5px solid #e2e8f0", background: "#f8fafc", color: "#334155", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" },
  carrierStubBanner: { display: "flex", alignItems: "flex-start", gap: 8, background: "#fffbeb", borderBottom: "1px solid #fde68a", padding: "10px 16px", fontSize: 12, color: "#92400e" },
  carrierPill: { display: "inline-block", fontSize: 12, fontWeight: 700, padding: "4px 8px", borderRadius: 6, border: "1px solid transparent", maxWidth: "100%" },
  sectionHead: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 12 },
  inlineBtn: { minHeight: 44, fontSize: 14, fontWeight: 700, color: "#1d4ed8", background: "#eff6ff", border: "1px solid #bfdbfe", borderRadius: 10, padding: "10px 14px", cursor: "pointer" },
  panelPicker: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 },
  panelPickerBtn: { minHeight: 48, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, textAlign: "left", padding: "10px 12px", borderRadius: 12, border: "1px solid #e2e8f0", background: "#fff", cursor: "pointer", color: "#0f172a" },
  panelPickerBtnOn: { borderColor: "#93c5fd", background: "#eff6ff" },
  panelPickerName: { fontSize: 13, fontWeight: 700, lineHeight: 1.25, minWidth: 0 },
  panelPickerPrice: { fontSize: 12, fontWeight: 800, color: "#2563eb", flexShrink: 0 },
  disclaimer: { fontSize: 12, lineHeight: 1.45, color: "#475569", margin: "0 0 14px" },
  leadCard: { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 16, marginBottom: 16 },
  leadIntro: { fontSize: 14, lineHeight: 1.45, color: "#334155", margin: "0 0 12px" },
  leadLabel: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#334155", marginBottom: 10 },
  leadInput: { width: "100%", boxSizing: "border-box", minHeight: 48, background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: 10, padding: "12px 14px", color: "#0f172a", fontSize: 16, outline: "none", fontFamily: "inherit" },
  leadError: { color: "#b91c1c", fontSize: 13, fontWeight: 600, margin: "-4px 0 10px" },
  leadOk: { color: "#15803d", fontSize: 14, fontWeight: 700, marginTop: 10 },
  optional: { fontWeight: 500, color: "#94a3b8" },
  summaryPreview: { whiteSpace: "pre-wrap", overflowWrap: "anywhere", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: 12, fontSize: 12, lineHeight: 1.45, color: "#334155", margin: "4px 0 12px", maxHeight: 180, overflowY: "auto" },
  ghlOverlay: { position: "fixed", top: 0, right: 0, bottom: 0, left: 0, zIndex: 200, background: "#ffffff", display: "flex", flexDirection: "column", paddingTop: "env(safe-area-inset-top)", overflow: "hidden" },
  ghlBar: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, padding: "10px 12px", borderBottom: "1px solid #e2e8f0", flexShrink: 0, background: "#ffffff" },
  ghlTitle: { fontSize: 16, fontWeight: 800, color: "#0f172a" },
  ghlHint: { fontSize: 13, lineHeight: 1.35, color: "#475569", margin: "2px 0 0" },
  ghlClose: { minWidth: 44, minHeight: 44, padding: "10px 14px", borderRadius: 10, border: "1px solid #e2e8f0", background: "#f8fafc", color: "#0f172a", fontSize: 15, fontWeight: 700, cursor: "pointer", flexShrink: 0 },
  ghlFrame: { flex: 1, width: "100%", border: "none", background: "#ffffff" },
  exportStack: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 },
  reviewItem: { padding: "12px 16px", borderBottom: "1px solid #f1f5f9" },
  reviewItemTop: { display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" },
  reviewItemName: { fontWeight: 700, fontSize: 15, minWidth: 0, overflowWrap: "anywhere" },
  reviewItemPrice: { fontWeight: 800, color: "#2563eb", flexShrink: 0 },
  reviewItemMeta: { fontSize: 13, color: "#64748b", marginTop: 2, overflowWrap: "anywhere" },
};

    

const root = createRoot(document.getElementById("root"));
root.render(<HailEstimator />);
