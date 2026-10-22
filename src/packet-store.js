import { PACKET_BUCKET, PACKET_KEY, PACKET_URL } from "./config.js";

export function storageConfigured() {
  return Boolean(PACKET_URL && PACKET_KEY && PACKET_BUCKET);
}

export function packetPageUrl(id) {
  const url = new URL(window.location.href);
  url.search = `?packet=${encodeURIComponent(id)}`;
  url.hash = "";
  return url.toString();
}

export function publicObjectUrl(path) {
  return `${PACKET_URL}/storage/v1/object/public/${PACKET_BUCKET}/${path}`;
}

async function putObject(path, body, contentType) {
  const response = await fetch(`${PACKET_URL}/storage/v1/object/${PACKET_BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: PACKET_KEY,
      Authorization: `Bearer ${PACKET_KEY}`,
      "Content-Type": contentType,
      "x-upsert": "false",
    },
    body,
  });
  if (response.ok) return;
  const text = await response.text();
  if ((response.status === 400 || response.status === 409) && /exist|duplicate/i.test(text)) return;
  throw new Error(text.slice(0, 160) || `Upload failed (${response.status})`);
}

export async function uploadPacket({ id, pdfBytes, files, manifest }) {
  if (!storageConfigured()) return { ok: false, error: "Photo storage is not configured." };
  if (typeof navigator !== "undefined" && navigator.onLine === false) return { ok: false, error: "offline" };
  try {
    await putObject(`${id}/estimate.pdf`, pdfBytes, "application/pdf");
    for (const file of files || []) {
      await putObject(`${id}/${file.path}`, file.bytes, file.contentType);
    }
    await putObject(`${id}/manifest.json`, JSON.stringify(manifest), "application/json");
    return { ok: true, id, url: packetPageUrl(id) };
  } catch (err) {
    return { ok: false, error: err?.message || "Upload failed." };
  }
}

export async function loadManifest(id) {
  const response = await fetch(publicObjectUrl(`${id}/manifest.json`), { cache: "no-store" });
  if (!response.ok) throw new Error("This download link is not ready yet.");
  return response.json();
}
