import { useEffect, useRef, useState } from "react";
import { MEDIA_TABS, layoutCells, tabLabel, tilesForTab } from "./media-catalog.js";
import { MAX_IMAGE_PHOTOS, MAX_VIDEOS, MAX_VIDEO_BYTES, compressImageFile } from "./compress.js";
import { panelDentTotal } from "./hail-logic.js";

function newPhotoId() {
  return `photo_${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
}

function CameraIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="1.8" aria-hidden="true">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff" aria-hidden="true">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function CarMark() {
  return (
    <svg viewBox="0 0 80 150" aria-hidden="true" style={{ width: "70%", height: "78%" }}>
      <rect x="18" y="16" width="44" height="118" rx="16" fill="#1e293b" stroke="#94a3b8" strokeWidth="2" />
      <path d="M24 40 H56 L52 68 H28 Z" fill="#0f172a" stroke="#cbd5e1" strokeWidth="1.4" />
      <rect x="26" y="74" width="28" height="28" rx="4" fill="#0b1220" stroke="#64748b" />
      <path d="M28 112 H52 L56 128 H24 Z" fill="#111827" stroke="#94a3b8" strokeWidth="1.2" />
      <rect x="8" y="36" width="8" height="16" rx="2" fill="#334155" />
      <rect x="64" y="36" width="8" height="16" rx="2" fill="#334155" />
      <rect x="8" y="96" width="8" height="16" rx="2" fill="#334155" />
      <rect x="64" y="96" width="8" height="16" rx="2" fill="#334155" />
    </svg>
  );
}

function useObjectUrl(blob) {
  const [url, setUrl] = useState("");
  useEffect(() => {
    if (!blob) {
      setUrl("");
      return undefined;
    }
    const next = URL.createObjectURL(blob);
    setUrl(next);
    return () => URL.revokeObjectURL(next);
  }, [blob]);
  return url;
}

export function MediaScreen({ photos, panelData, onChange, onEditPanel, onBack }) {
  const [tab, setTab] = useState("panels");
  const [sheet, setSheet] = useState(null);
  const [activeId, setActiveId] = useState("");
  const [error, setError] = useState("");
  const [quickOpen, setQuickOpen] = useState(false);
  const cameraRef = useRef(null);
  const galleryRef = useRef(null);
  const quickCameraRef = useRef(null);
  const quickGalleryRef = useRef(null);

  const tilePhotos = (tabId, tileId) => photos.filter((photo) => photo.tab === tabId && photo.tileId === tileId);
  const miscPhotos = photos.filter((photo) => photo.tab === "misc");

  const addFiles = async (target, fileList) => {
    const files = Array.from(fileList || []);
    if (!files.length || !target) return;
    setError("");
    const made = [];
    let images = photos.filter((photo) => photo.kind !== "video").length;
    let videos = photos.filter((photo) => photo.kind === "video").length;
    for (const file of files) {
      const video = Boolean(target.video) || String(file.type || "").startsWith("video/");
      if (video) {
        if (file.size > MAX_VIDEO_BYTES) {
          setError("That video is too large to keep on the phone.");
          continue;
        }
        if (videos >= MAX_VIDEOS) {
          setError("Video limit reached. Share/Export the ones you have, then remove one.");
          break;
        }
        videos += 1;
        made.push({
          id: newPhotoId(),
          tab: target.tab,
          tileId: target.tileId,
          tileLabel: target.tileLabel,
          tabLabel: target.tabLabel,
          note: "",
          kind: "video",
          name: file.name || "video",
          createdAt: new Date().toISOString(),
          blob: file,
          url: "",
          thumb: "",
        });
        continue;
      }
      if (images >= MAX_IMAGE_PHOTOS) {
        setError("Photo limit reached. Share/Export, then remove some.");
        break;
      }
      try {
        const compressed = await compressImageFile(file);
        images += 1;
        made.push({
          id: newPhotoId(),
          tab: target.tab,
          tileId: target.tileId,
          tileLabel: target.tileLabel,
          tabLabel: target.tabLabel,
          note: "",
          kind: "image",
          name: file.name || "photo",
          createdAt: new Date().toISOString(),
          blob: compressed.blob,
          url: "",
          thumb: compressed.thumb,
        });
      } catch (err) {
        setError("Could not read that photo. Try another.");
      }
    }
    if (made.length) {
      onChange([...photos, ...made]);
      setActiveId(made[made.length - 1].id);
    }
  };

  const closeSheet = () => {
    if (history.state?.hailspec === "sheet") history.back();
    else {
      setSheet(null);
      setQuickOpen(false);
    }
  };

  useEffect(() => {
    const onNav = (event) => {
      if (event.detail === "close-sheet") {
        setSheet(null);
        setQuickOpen(false);
      }
    };
    window.addEventListener("hailspec-nav", onNav);
    return () => window.removeEventListener("hailspec-nav", onNav);
  }, []);

  const openSheet = (target) => {
    setError("");
    setQuickOpen(false);
    const existing = target.tileId ? tilePhotos(target.tab, target.tileId) : [];
    setActiveId(existing.length ? existing[existing.length - 1].id : "");
    if (history.state?.hailspec !== "sheet") history.pushState({ hailspec: "sheet" }, "");
    setSheet(target);
  };

  const openQuick = () => {
    setError("");
    setSheet(null);
    if (history.state?.hailspec !== "sheet") history.pushState({ hailspec: "sheet" }, "");
    setQuickOpen(true);
  };

  const sheetPhotos = sheet && sheet.tileId ? tilePhotos(sheet.tab, sheet.tileId) : [];
  const active = sheetPhotos.find((photo) => photo.id === activeId) || sheetPhotos[sheetPhotos.length - 1] || null;

  return (
    <div>
      <button type="button" onClick={onBack} style={ui.back} aria-label="Back to estimate">Back</button>
      <div style={ui.toolbar}>
        <div style={ui.tabs} role="tablist" aria-label="Media">
          {MEDIA_TABS.map((item) => {
            const count = photos.filter((photo) => photo.tab === item.id).length;
            const selected = tab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={selected}
                onClick={() => { setTab(item.id); setSheet(null); }}
                style={{ ...ui.tab, ...(selected ? ui.tabOn : {}) }}
              >
                {item.label}{count > 0 ? ` ${count}` : ""}
              </button>
            );
          })}
        </div>
        <button type="button" aria-label="Add untagged photo" onClick={openQuick} style={ui.quick}>
          <CameraIcon />
          <span style={ui.plus}>+</span>
        </button>
      </div>
      {tab === "misc" ? (
        <MiscGrid
          photos={miscPhotos}
          onAdd={() => openSheet({ tab: "misc", tileId: "untagged", tileLabel: "Quick", tabLabel: "Misc", video: false })}
          onOpen={(photo) => {
            setActiveId(photo.id);
            openSheet({ tab: "misc", tileId: photo.tileId || "untagged", tileLabel: photo.tileLabel || "Quick", tabLabel: "Misc", video: photo.kind === "video" });
          }}
        />
      ) : (
        <TileGrid
          tab={tab}
          photos={photos}
          panelData={panelData}
          onOpen={openSheet}
        />
      )}
      {error && !sheet && !quickOpen && <p style={ui.error}>{error}</p>}
      {quickOpen && (
        <Sheet title="Quick photo" onClose={closeSheet}>
          <p style={ui.help}>Saved under Misc. No panel tag.</p>
          <div style={ui.actions}>
            <button type="button" style={ui.action} onClick={() => quickCameraRef.current?.click()}>Camera</button>
            <button type="button" style={ui.action} onClick={() => quickGalleryRef.current?.click()}>Gallery</button>
          </div>
          {error && <p style={ui.error}>{error}</p>}
          <input ref={quickCameraRef} type="file" accept="image/*" capture="environment" aria-label="Take untagged photo" style={ui.hidden} onChange={(event) => { addFiles({ tab: "misc", tileId: "untagged", tileLabel: "Quick", tabLabel: "Misc" }, event.target.files); event.target.value = ""; }} />
          <input ref={quickGalleryRef} type="file" accept="image/*" multiple aria-label="Choose untagged photos" data-purpose="quick-gallery" style={ui.hidden} onChange={(event) => { addFiles({ tab: "misc", tileId: "untagged", tileLabel: "Quick", tabLabel: "Misc" }, event.target.files); event.target.value = ""; }} />
        </Sheet>
      )}
      {sheet && (
        <Sheet title={sheet.tileLabel} onClose={closeSheet}>
          {sheet.panel && (
            <button type="button" style={ui.dentBtn} onClick={() => onEditPanel(sheet.panel)}>
              Dent count{panelDentTotal(panelData?.[sheet.panel]) > 0 ? ` · ${panelDentTotal(panelData[sheet.panel])}` : ""}
            </button>
          )}
          {active && <PhotoStage photo={active} />}
          {sheetPhotos.length > 0 && (
            <div style={ui.strip}>
              {sheetPhotos.map((photo) => (
                <button key={photo.id} type="button" onClick={() => setActiveId(photo.id)} style={{ ...ui.mini, ...(photo.id === active?.id ? ui.miniOn : {}) }} aria-label={`View ${sheet.tileLabel} photo`}>
                  {photo.kind === "video" ? <PlayIcon /> : <img src={photo.thumb || photo.url} alt="" style={ui.miniImg} />}
                </button>
              ))}
            </div>
          )}
          {active && (
            <>
              <label style={ui.noteLabel}>Note
                <textarea aria-label="Photo note" value={active.note || ""} rows={2} onChange={(event) => onChange(photos.map((photo) => photo.id === active.id ? { ...photo, note: event.target.value.slice(0, 500) } : photo))} style={ui.note} />
              </label>
              <button type="button" style={ui.delete} onClick={() => onChange(photos.filter((photo) => photo.id !== active.id))}>Delete photo</button>
            </>
          )}
          <div style={ui.actions}>
            <button type="button" style={ui.action} onClick={() => cameraRef.current?.click()}>{sheet.video ? "Record" : "Camera"}</button>
            <button type="button" style={ui.action} onClick={() => galleryRef.current?.click()}>Gallery</button>
          </div>
          {error && <p style={ui.error}>{error}</p>}
          <input ref={cameraRef} type="file" accept={sheet.video ? "video/*" : "image/*"} capture="environment" aria-label={sheet.video ? "Record video" : "Take photo"} style={ui.hidden} onChange={(event) => { addFiles(sheet, event.target.files); event.target.value = ""; }} />
          <input ref={galleryRef} data-purpose="gallery" type="file" accept={sheet.video ? "video/*" : "image/*"} multiple aria-label={sheet.video ? "Choose videos" : "Choose photos"} style={ui.hidden} onChange={(event) => { addFiles(sheet, event.target.files); event.target.value = ""; }} />
        </Sheet>
      )}
    </div>
  );
}

function TileGrid({ tab, photos, panelData, onOpen }) {
  const tiles = tilesForTab(tab);
  return (
    <div style={ui.board}>
      <div style={ui.car}><CarMark /></div>
      {tiles.map((tile) => {
        const items = photos.filter((photo) => photo.tab === tab && photo.tileId === tile.id);
        const latest = items[items.length - 1];
        const dents = tile.panel ? panelDentTotal(panelData?.[tile.panel]) : 0;
        const label = `${tile.label}, ${items.length === 0 ? "no photos" : `${items.length} photo${items.length === 1 ? "" : "s"}`}${dents ? `, ${dents} dents` : ""}`;
        return (
          <button
            key={tile.id}
            type="button"
            aria-label={label}
            onClick={() => onOpen({ tab, tileId: tile.id, tileLabel: tile.label, tabLabel: tabLabel(tab), video: Boolean(tile.video), panel: tile.panel || "" })}
            style={{ ...ui.tile, gridColumn: tile.col, gridRow: tile.row }}
          >
            {latest && latest.kind !== "video" && (latest.thumb || latest.url) ? (
              <img src={latest.thumb || latest.url} alt="" style={ui.tileImg} />
            ) : (
              <span style={ui.icon}>{tile.video || latest?.kind === "video" ? <PlayIcon /> : <CameraIcon />}</span>
            )}
            {items.length > 0 && <span style={ui.badge}>{items.length}</span>}
            {dents > 0 && <span style={ui.dent}>{dents}</span>}
            <span style={ui.bar}>{tile.label}</span>
          </button>
        );
      })}
    </div>
  );
}

function MiscGrid({ photos, onAdd, onOpen }) {
  const cells = layoutCells(photos.length + 1);
  return (
    <div style={ui.board}>
      <div style={ui.car}><CarMark /></div>
      <button type="button" aria-label="Add misc photo" onClick={onAdd} style={{ ...ui.tile, gridColumn: cells[0].col, gridRow: cells[0].row }}>
        <span style={ui.icon}><CameraIcon /></span>
        <span style={ui.bar}>Add</span>
      </button>
      {photos.map((photo, index) => {
        const cell = cells[index + 1];
        return (
          <button key={photo.id} type="button" aria-label={`${photo.tileLabel || "Photo"}, open`} onClick={() => onOpen(photo)} style={{ ...ui.tile, gridColumn: cell.col, gridRow: cell.row }}>
            {photo.kind === "video" || !(photo.thumb || photo.url) ? (
              <span style={ui.icon}><PlayIcon /></span>
            ) : (
              <img src={photo.thumb || photo.url} alt="" style={ui.tileImg} />
            )}
            <span style={ui.bar}>{photo.tileLabel || "Photo"}</span>
          </button>
        );
      })}
    </div>
  );
}

function PhotoStage({ photo }) {
  const objectUrl = useObjectUrl(photo.blob);
  const src = objectUrl || photo.thumb || photo.url;
  if (photo.kind === "video") {
    return src ? <video src={src} controls playsInline style={ui.stage} /> : <div style={ui.stage}>Video saved on this phone</div>;
  }
  return src ? <img src={src} alt="" style={ui.stage} /> : null;
}

function Sheet({ title, onClose, children }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);
  return (
    <div style={ui.overlay} role="dialog" aria-modal="true" aria-label={title} onClick={onClose}>
      <div style={ui.sheet} onClick={(event) => event.stopPropagation()}>
        <div style={ui.sheetHead}>
          <button type="button" onClick={onClose} style={ui.back} aria-label="Back to photos">Back</button>
          <div style={ui.sheetTitle}>{title}</div>
          <button type="button" onClick={onClose} style={ui.close} aria-label="Close">✕</button>
        </div>
        <div style={ui.sheetBody}>{children}</div>
      </div>
    </div>
  );
}

const ui = {
  back: {
    minHeight: 44, minWidth: 72, border: "none", borderRadius: 10, background: "#e2e8f0",
    color: "#0f172a", fontWeight: 800, fontSize: 16, padding: "8px 14px", cursor: "pointer", marginBottom: 8,
  },
  toolbar: { display: "flex", alignItems: "stretch", gap: 8, marginBottom: 10 },
  tabs: { display: "flex", flex: 1, gap: 4, overflowX: "auto", minWidth: 0 },
  tab: {
    flex: "1 0 auto", minHeight: 44, border: "none", borderRadius: 10, background: "#e2e8f0",
    color: "#334155", fontWeight: 800, fontSize: 11, letterSpacing: "0.4px", textTransform: "uppercase",
    padding: "8px 8px", cursor: "pointer",
  },
  tabOn: { background: "#0a1628", color: "#fff" },
  quick: {
    width: 52, minHeight: 44, border: "none", borderRadius: 12, background: "#0a1628", color: "#fff",
    display: "flex", alignItems: "center", justifyContent: "center", position: "relative", cursor: "pointer", flexShrink: 0,
  },
  plus: { position: "absolute", top: 4, right: 6, fontSize: 14, fontWeight: 900, color: "#93c5fd" },
  board: {
    display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: 8,
    background: "#0f172a", borderRadius: 16, padding: 10, position: "relative",
  },
  car: {
    gridColumn: 2, gridRow: "2 / span 2", display: "flex", alignItems: "center", justifyContent: "center",
    background: "#111827", borderRadius: 12, minHeight: 0, aspectRatio: "1 / 2",
  },
  tile: {
    position: "relative", aspectRatio: "1", border: "none", borderRadius: 10, overflow: "hidden",
    background: "#1f2937", padding: 0, cursor: "pointer", color: "#fff",
  },
  tileImg: { width: "100%", height: "100%", objectFit: "cover", display: "block" },
  icon: { position: "absolute", inset: "0 0 28px 0", display: "flex", alignItems: "center", justifyContent: "center" },
  bar: {
    position: "absolute", left: 0, right: 0, bottom: 0, minHeight: 28, background: "#000", color: "#fff",
    fontSize: 10, fontWeight: 800, lineHeight: 1.15, display: "flex", alignItems: "center", justifyContent: "center",
    textAlign: "center", padding: "4px 3px",
  },
  badge: {
    position: "absolute", top: 6, right: 6, minWidth: 22, height: 22, borderRadius: 999, background: "#dc2626",
    color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
  },
  dent: {
    position: "absolute", top: 6, left: 6, minWidth: 22, height: 22, borderRadius: 999, background: "#2563eb",
    color: "#fff", fontSize: 12, fontWeight: 800, display: "flex", alignItems: "center", justifyContent: "center", padding: "0 6px",
  },
  overlay: {
    position: "fixed", inset: 0, zIndex: 80, background: "rgba(15,23,42,0.55)",
    display: "flex", alignItems: "flex-end", justifyContent: "center",
  },
  sheet: {
    width: "100%", maxWidth: 480, maxHeight: "92vh", background: "#fff", borderRadius: "18px 18px 0 0",
    display: "flex", flexDirection: "column",
  },
  sheetHead: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 14px 8px" },
  sheetTitle: { fontWeight: 800, fontSize: 18 },
  sheetBody: { padding: "0 14px calc(16px + env(safe-area-inset-bottom))", overflowY: "auto" },
  close: { width: 44, height: 44, border: "none", borderRadius: 10, background: "#f1f5f9", fontSize: 18, cursor: "pointer" },
  help: { margin: "0 0 12px", color: "#334155", fontSize: 14 },
  actions: { display: "flex", gap: 8, margin: "8px 0 12px" },
  action: { flex: 1, minHeight: 52, border: "none", borderRadius: 12, background: "#2563eb", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" },
  dentBtn: { width: "100%", minHeight: 48, marginBottom: 10, borderRadius: 12, border: "1.5px solid #bfdbfe", background: "#eff6ff", color: "#1d4ed8", fontWeight: 800, fontSize: 16, cursor: "pointer" },
  stage: { width: "100%", maxHeight: 280, objectFit: "contain", background: "#0f172a", borderRadius: 12, marginBottom: 10 },
  strip: { display: "flex", gap: 8, overflowX: "auto", marginBottom: 10 },
  mini: { width: 72, height: 72, flexShrink: 0, borderRadius: 8, overflow: "hidden", border: "2px solid transparent", padding: 0, background: "#1f2937", cursor: "pointer" },
  miniOn: { borderColor: "#2563eb" },
  miniImg: { width: "100%", height: "100%", objectFit: "cover" },
  noteLabel: { display: "flex", flexDirection: "column", gap: 6, fontSize: 13, fontWeight: 700, color: "#334155" },
  note: { width: "100%", minHeight: 64, borderRadius: 10, border: "1.5px solid #e2e8f0", padding: 12, fontSize: 16, fontFamily: "inherit" },
  delete: { width: "100%", minHeight: 48, marginTop: 8, borderRadius: 12, border: "1px solid #fecaca", background: "#fef2f2", color: "#b91c1c", fontWeight: 800, fontSize: 16, cursor: "pointer" },
  error: { color: "#b91c1c", fontWeight: 700, fontSize: 14 },
  hidden: { display: "none" },
};
