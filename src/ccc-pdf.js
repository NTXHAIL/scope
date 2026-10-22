// Letter-size black-and-white estimate PDF. No phone number and no email.

function asciiPdf(value) {
  return String(value ?? "")
    .replace(/[—–]/g, "-")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/…/g, "...")
    .replace(/[^\x20-\x7E]/g, "");
}

function pdfEscape(value) {
  return asciiPdf(value).replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function money(value) {
  return Number(value || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function jpegSize(bytes) {
  if (!bytes || bytes.length < 4 || bytes[0] !== 0xff || bytes[1] !== 0xd8) return null;
  let offset = 2;
  while (offset + 8 < bytes.length) {
    if (bytes[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = bytes[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = (bytes[offset + 2] << 8) + bytes[offset + 3];
    if (marker >= 0xc0 && marker <= 0xc2) {
      return {
        height: (bytes[offset + 5] << 8) + bytes[offset + 6],
        width: (bytes[offset + 7] << 8) + bytes[offset + 8],
      };
    }
    if (!length) break;
    offset += 2 + length;
  }
  return null;
}

function dataUrlBytes(src) {
  const text = String(src || "");
  const comma = text.indexOf(",");
  if (!text.startsWith("data:image/jpeg") || comma < 0) return null;
  const binary = atob(text.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function photosForPdf(photos) {
  const ready = [];
  for (const photo of photos || []) {
    if (photo?.kind === "video") continue;
    const bytes = dataUrlBytes(photo?.thumb || photo?.url || "");
    const size = bytes ? jpegSize(bytes) : null;
    if (!bytes || !size?.width || !size?.height) continue;
    ready.push({
      tab: photo.tabLabel || "Photos",
      tile: photo.tileLabel || "Photo",
      note: photo.note || "",
      bytes,
      width: size.width,
      height: size.height,
    });
    if (ready.length >= 24) break;
  }
  return ready;
}

function textOp(font, size, x, y, value) {
  const clean = asciiPdf(value);
  if (!clean) return "";
  return `BT /${font} ${size} Tf 1 0 0 1 ${x.toFixed(2)} ${y.toFixed(2)} Tm (${pdfEscape(clean)}) Tj ET`;
}

function rule(y) {
  return `0.6 w 36 ${y.toFixed(2)} m 576 ${y.toFixed(2)} l S`;
}

function layoutPages(doc) {
  const pages = [];
  let commands = [];
  let y = 760;
  const bottom = 48;

  const pushPage = () => {
    pages.push(commands.filter(Boolean));
    commands = [];
    y = 742;
    commands.push(textOp("F3", 8, 36, y, `Customer: ${doc.customer || ""}    ${doc.vehicle || ""} ${doc.trim || ""}`.trim()));
    y -= 14;
    commands.push(rule(y + 4));
    y -= 8;
  };

  const need = (height) => {
    if (y - height < bottom) pushPage();
  };

  const line = (font, size, x, value, gap = size + 4) => {
    need(gap);
    const op = textOp(font, size, x, y, value);
    if (op) commands.push(op);
    y -= gap;
  };

  const shop = doc.shop || {};
  line("F2", 13, 36, shop.web || "WWW.NTXHAIL.COM", 16);
  line("F1", 10, 36, shop.legal || "", 13);
  line("F1", 10, 36, `Federal ID ${shop.federalId || ""}`, 13);
  line("F1", 10, 36, shop.address || "", 16);
  line("F2", 16, 36, doc.title || "Preliminary Estimate", 22);
  line("F3", 9, 36, `Customer: ${doc.customer || ""}`, 12);
  line("F3", 9, 36, `Written By: ${doc.writtenBy || ""}`, 12);
  line("F3", 9, 36, doc.dateTime || "", 14);
  line("F3", 9, 36, `Insured: ${doc.insured || ""}    Policy #: ${doc.policy || ""}    Claim #: ${doc.claim || ""}`, 12);
  line("F3", 9, 36, `Type of Loss: ${doc.typeOfLoss || ""}    Date of Loss: ${doc.lossDate || ""}    Point of Impact: ${doc.pointOfImpact || ""}`, 16);
  need(36);
  commands.push(textOp("F4", 8, 36, y, "OWNER"));
  commands.push(textOp("F4", 8, 220, y, "INSPECTION LOCATION"));
  commands.push(textOp("F4", 8, 400, y, "INSURANCE COMPANY"));
  y -= 12;
  commands.push(textOp("F3", 9, 36, y, doc.owner || ""));
  commands.push(textOp("F3", 9, 220, y, doc.inspectionLocation || ""));
  commands.push(textOp("F3", 9, 400, y, doc.carrier || ""));
  y -= 16;
  line("F2", 11, 36, "VEHICLE", 14);
  line("F3", 9, 36, [doc.vehicle, doc.trim].filter(Boolean).join(" "), 12);
  line("F3", 9, 36, `VIN: ${doc.vin || ""}    Mileage: ${doc.mileage || ""}    License: ${doc.license || ""}    State: ${doc.plateState || ""}    Color: ${doc.color || ""}`, 16);
  need(16);
  commands.push(rule(y));
  y -= 12;
  commands.push(textOp("F4", 8, 36, y, "LINE"));
  commands.push(textOp("F4", 8, 72, y, "OPER"));
  commands.push(textOp("F4", 8, 112, y, "DESCRIPTION"));
  commands.push(textOp("F4", 8, 330, y, "QTY"));
  commands.push(textOp("F4", 8, 380, y, "EXTENDED $"));
  commands.push(textOp("F4", 8, 460, y, "LABOR"));
  commands.push(textOp("F4", 8, 520, y, "PAINT"));
  y -= 6;
  commands.push(rule(y));
  y -= 12;

  const placeMoney = (right, value) => {
    if (!value) return;
    const text = money(value);
    const width = text.length * 8 * 0.6;
    commands.push(textOp("F3", 8, right - width, y, text));
  };

  const groups = doc.lines || [];
  if (!groups.length) line("F3", 9, 36, "No panels estimated.", 14);
  for (const group of groups) {
    need(28);
    commands.push(textOp("F4", 9, 36, y, group.group));
    y -= 13;
    for (const row of group.rows) {
      need(row.note ? 26 : 14);
      commands.push(textOp("F3", 8, 36, y, String(row.line)));
      commands.push(textOp("F3", 8, 72, y, row.oper || ""));
      commands.push(textOp("F3", 8, 112, y, String(row.description || "").slice(0, 42)));
      commands.push(textOp("F3", 8, 330, y, String(row.qty || "")));
      placeMoney(450, row.extended);
      placeMoney(510, row.labor);
      placeMoney(570, row.paint);
      y -= 11;
      if (row.note) {
        commands.push(textOp("F3", 8, 112, y, `Note: ${row.note}`));
        y -= 12;
      }
    }
  }

  need(20);
  y -= 4;
  commands.push(rule(y + 8));
  commands.push(textOp("F4", 8, 36, y, "SUBTOTALS"));
  placeMoney(450, (doc.totals && doc.totals.pdr) || 0);
  placeMoney(510, (doc.totals && doc.totals.bodyLabor) || 0);
  y -= 18;
  line("F2", 11, 36, "NOTES", 14);
  line("F3", 9, 36, `Prior Damage Notes: ${doc.priorNotes || ""}`, 16);
  line("F2", 11, 36, "ESTIMATE TOTALS", 14);
  need(16);
  commands.push(textOp("F4", 8, 36, y, "CATEGORY"));
  commands.push(textOp("F4", 8, 180, y, "BASIS"));
  commands.push(textOp("F4", 8, 280, y, "RATE"));
  commands.push(textOp("F4", 8, 400, y, "COST $"));
  y -= 12;
  const totals = doc.totals || {};
  const totalRows = [
    ["Parts", "", "", totals.parts],
    ["Body Labor", "", "", totals.bodyLabor],
    ["Paint Labor", "", "", totals.paintLabor],
    ["PDR", "", "", totals.pdr],
    ["Other Charges", "", "", totals.other],
    ["Subtotal", "", "", totals.subtotal],
    ["Sales Tax", "", "", totals.tax],
    ["Grand Total", "", "", totals.grand],
  ];
  for (const [name, basis, rate, cost] of totalRows) {
    need(12);
    const font = name === "Grand Total" ? "F4" : "F3";
    commands.push(textOp(font, 9, 36, y, name));
    commands.push(textOp("F3", 9, 180, y, basis));
    commands.push(textOp("F3", 9, 280, y, rate));
    const costText = money(cost);
    commands.push(textOp(font, 9, 470 - costText.length * 5.4, y, costText));
    y -= 12;
  }

  pages.push(commands.filter(Boolean));

  const images = photosForPdf(doc.photos);
  if (images.length) {
    commands = [];
    y = 742;
    commands.push(textOp("F3", 8, 36, y, `Customer: ${doc.customer || ""}    ${doc.vehicle || ""}`.trim()));
    y -= 16;
    commands.push(textOp("F2", 12, 36, y, "PHOTO APPENDIX"));
    y -= 18;
    let column = 0;
    for (const image of images) {
      if (column === 0 && y < 210) {
        pages.push(commands.filter(Boolean));
        commands = [];
        y = 742;
        commands.push(textOp("F2", 12, 36, y, "PHOTO APPENDIX"));
        y -= 18;
      }
      const x = 36 + column * 270;
      commands.push(textOp("F4", 8, x, y, `${image.tab} / ${image.tile}`.slice(0, 40)));
      const drawY = y - 150;
      const scale = Math.min(240 / image.width, 130 / image.height);
      const w = image.width * scale;
      const h = image.height * scale;
      const imageName = `Im${pages.length}x${column}`;
      commands.push(`q ${w.toFixed(2)} 0 0 ${h.toFixed(2)} ${x.toFixed(2)} ${drawY.toFixed(2)} cm /${imageName} Do Q`);
      image.drawName = imageName;
      if (image.note) commands.push(textOp("F3", 8, x, drawY - 12, image.note.slice(0, 42)));
      column += 1;
      if (column > 1) {
        column = 0;
        y -= 180;
      }
    }
    pages.push(commands.filter(Boolean));
    return { pages, images };
  }
  return { pages, images: [] };
}

function concatBytes(parts) {
  const size = parts.reduce((sum, part) => sum + part.length, 0);
  const out = new Uint8Array(size);
  let offset = 0;
  for (const part of parts) {
    out.set(part, offset);
    offset += part.length;
  }
  return out;
}

function encode(value) {
  return new TextEncoder().encode(value);
}

export function renderCccPdf(doc) {
  const laid = layoutPages(doc || {});
  const total = laid.pages.length || 1;
  const pageBodies = (laid.pages.length ? laid.pages : [[textOp("F2", 14, 36, 740, "Preliminary Estimate")]]).map((commands, index) => {
    const footer = [
      textOp("F3", 8, 36, 28, doc?.dateTime || ""),
      textOp("F3", 8, 470, 28, `Page ${index + 1} of ${total}`),
    ].filter(Boolean);
    return [...commands, ...footer].join("\n");
  });

  const objects = [];
  const add = (body) => {
    objects.push(body);
    return objects.length;
  };
  add("<< /Type /Catalog /Pages 2 0 R >>");
  add("<< /Type /Pages /Kids [] /Count 0 >>");
  const font = (name) => add(`<< /Type /Font /Subtype /Type1 /BaseFont /${name} >>`);
  const helvetica = font("Helvetica");
  const helveticaBold = font("Helvetica-Bold");
  const courier = font("Courier");
  const courierBold = font("Courier-Bold");

  const imageIds = new Map();
  for (const image of laid.images) {
    const id = add({
      dict: `<< /Type /Image /Subtype /Image /Width ${image.width} /Height ${image.height} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${image.bytes.length} >>`,
      bytes: image.bytes,
    });
    imageIds.set(image.drawName, id);
  }

  const kids = [];
  pageBodies.forEach((stream, index) => {
    const contentId = add({ dict: `<< /Length ${encode(stream.endsWith("\n") ? stream : `${stream}\n`).length} >>`, text: stream.endsWith("\n") ? stream : `${stream}\n` });
    const used = laid.images.filter((image) => image.drawName && image.drawName.startsWith(`Im${index}x`));
    const xobjects = used.map((image) => `/${image.drawName} ${imageIds.get(image.drawName)} 0 R`).join(" ");
    const resources = `<< /Font << /F1 ${helvetica} 0 R /F2 ${helveticaBold} 0 R /F3 ${courier} 0 R /F4 ${courierBold} 0 R >>${xobjects ? ` /XObject << ${xobjects} >>` : ""} >>`;
    const pageId = add(`<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents ${contentId} 0 R /Resources ${resources} >>`);
    kids.push(`${pageId} 0 R`);
  });
  objects[1] = `<< /Type /Pages /Kids [${kids.join(" ")}] /Count ${kids.length} >>`;

  const chunks = [encode("%PDF-1.4\n")];
  const offsets = [0];
  for (let id = 1; id <= objects.length; id += 1) {
    offsets[id] = chunks.reduce((sum, part) => sum + part.length, 0);
    const obj = objects[id - 1];
    if (obj && obj.bytes) {
      chunks.push(encode(`${id} 0 obj\n${obj.dict}\nstream\n`));
      chunks.push(obj.bytes);
      chunks.push(encode("\nendstream\nendobj\n"));
    } else if (obj && obj.text != null) {
      chunks.push(encode(`${id} 0 obj\n${obj.dict}\nstream\n${obj.text}endstream\nendobj\n`));
    } else {
      chunks.push(encode(`${id} 0 obj\n${obj}\nendobj\n`));
    }
  }
  const xrefStart = chunks.reduce((sum, part) => sum + part.length, 0);
  let xref = `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let id = 1; id <= objects.length; id += 1) xref += `${String(offsets[id]).padStart(10, "0")} 00000 n \n`;
  chunks.push(encode(`${xref}trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF\n`));
  return concatBytes(chunks);
}
