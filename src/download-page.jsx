import { useEffect, useState } from "react";
import { buildZip } from "./hail-logic.js";
import { loadManifest, publicObjectUrl } from "./packet-store.js";

function saveBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.rel = "noopener";
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2500);
}

export function DownloadPage({ packetId }) {
  const [manifest, setManifest] = useState(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let cancel = false;
    loadManifest(packetId)
      .then((data) => { if (!cancel) setManifest(data); })
      .catch((err) => { if (!cancel) setError(err?.message || "Could not open this estimate."); });
    return () => { cancel = true; };
  }, [packetId]);

  const photos = Array.isArray(manifest?.photos) ? manifest.photos : [];
  const groups = [];
  const seen = new Map();
  for (const photo of photos) {
    const key = `${photo.tab || "Photos"}\n${photo.tile || "Photo"}`;
    if (!seen.has(key)) {
      const group = { tab: photo.tab || "Photos", tile: photo.tile || "Photo", photos: [] };
      seen.set(key, group);
      groups.push(group);
    }
    seen.get(key).photos.push(photo);
  }

  const downloadAll = async () => {
    if (busy || !manifest) return;
    setBusy(true);
    setError("");
    try {
      const files = [];
      const pdf = await fetch(publicObjectUrl(`${packetId}/estimate.pdf`));
      if (pdf.ok) files.push({ name: "estimate.pdf", data: new Uint8Array(await pdf.arrayBuffer()) });
      for (const photo of photos) {
        const response = await fetch(publicObjectUrl(`${packetId}/${photo.path}`));
        if (!response.ok) continue;
        const safe = String(photo.path || "photo").replace(/[^a-zA-Z0-9._/-]+/g, "_");
        files.push({ name: safe, data: new Uint8Array(await response.arrayBuffer()) });
      }
      saveBlob(new Blob([buildZip(files)], { type: "application/zip" }), "HailSpec_packet.zip");
    } catch (err) {
      setError("Could not build the zip. Try the individual downloads.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main style={styles.page}>
      <header style={styles.header}>
        <div style={styles.brand}>NTX HAIL</div>
        <h1 style={styles.title}>Estimate download</h1>
        <p style={styles.sub}>{manifest?.vehicle || "Vehicle photos and PDF"}</p>
      </header>
      {error && <p style={styles.error}>{error}</p>}
      {!manifest && !error && <p style={styles.sub}>Loading the estimate…</p>}
      {manifest && (
        <>
          <div style={styles.actions}>
            <button type="button" onClick={downloadAll} disabled={busy} style={styles.primary}>{busy ? "Building zip…" : "Download all (zip)"}</button>
            <a style={styles.secondary} href={publicObjectUrl(`${packetId}/estimate.pdf`)} download="estimate.pdf">Download PDF</a>
          </div>
          {groups.map((group) => (
            <section key={`${group.tab}-${group.tile}`} style={styles.group}>
              <h2 style={styles.tab}>{group.tab}</h2>
              <h3 style={styles.tile}>{group.tile} ({group.photos.length})</h3>
              <div style={styles.grid}>
                {group.photos.map((photo) => {
                  const href = publicObjectUrl(`${packetId}/${photo.path}`);
                  const filename = String(photo.path || "photo").split("/").pop();
                  return (
                    <figure key={photo.path} style={styles.card}>
                      {photo.kind === "video" ? (
                        <video src={href} controls playsInline style={styles.media} />
                      ) : (
                        <img src={href} alt="" style={styles.media} />
                      )}
                      {photo.note ? <figcaption style={styles.note}>{photo.note}</figcaption> : null}
                      <a href={href} download={filename} style={styles.link}>Download</a>
                    </figure>
                  );
                })}
              </div>
            </section>
          ))}
          {photos.length === 0 && <p style={styles.sub}>No photos on this estimate. The PDF is still available.</p>}
        </>
      )}
    </main>
  );
}

const styles = {
  page: { fontFamily: "system-ui, sans-serif", background: "#f8fafc", color: "#0f172a", minHeight: "100vh", padding: "20px 16px 48px", maxWidth: 720, margin: "0 auto" },
  header: { marginBottom: 16 },
  brand: { fontWeight: 900, letterSpacing: "1px" },
  title: { fontSize: 28, margin: "6px 0" },
  sub: { color: "#334155", fontSize: 16, margin: 0 },
  actions: { display: "flex", gap: 8, flexWrap: "wrap", margin: "16px 0" },
  primary: { minHeight: 52, padding: "0 16px", border: "none", borderRadius: 12, background: "#0a1628", color: "#fff", fontWeight: 800, fontSize: 16, cursor: "pointer" },
  secondary: { minHeight: 52, display: "inline-flex", alignItems: "center", padding: "0 16px", borderRadius: 12, background: "#e2e8f0", color: "#0f172a", fontWeight: 800, textDecoration: "none" },
  group: { marginTop: 18 },
  tab: { fontSize: 13, letterSpacing: "0.8px", textTransform: "uppercase", margin: "0 0 4px" },
  tile: { fontSize: 18, margin: "0 0 8px" },
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 10 },
  card: { margin: 0, background: "#fff", borderRadius: 12, overflow: "hidden", border: "1px solid #e2e8f0" },
  media: { width: "100%", height: 120, objectFit: "cover", background: "#0f172a", display: "block" },
  note: { fontSize: 13, padding: "8px 8px 0" },
  link: { display: "block", padding: 10, fontWeight: 800, color: "#1d4ed8" },
  error: { color: "#b91c1c", fontWeight: 700 },
};
