import assert from "node:assert/strict";
import fs from "node:fs";
import test from "node:test";
import {
  lookupPrice,
  quotePanel,
  decodeVIN,
  escapeHtml,
  generateReportHTML,
  buildEstimateSummary,
  fitSummaryForUrl,
  buildGhlEmbedUrl,
  buildEstimatePdf,
  reportDocument,
  archiveEstimate,
  openSavedEstimate,
  parseDraft,
  estimateHasWork,
  estimatePdfName,
  validateLead,
  parseGhlForm,
  ESTIMATE_DISCLAIMER,
  carrierHasMatrix,
  GHL_SUMMARY_LIMIT,
} from "../src/hail-logic.js";
import { GHL_FORM, GHL_SUMMARY_FIELD_ID } from "../src/config.js";

test("State Farm hood prices come from the matrix", () => {
  assert.equal(lookupPrice("HOOD", 3, "DIME", "state_farm"), 80);
  assert.equal(lookupPrice("HOOD", 10, "NICKEL", "state_farm"), 175);
  assert.equal(lookupPrice("HOOD", 120, "QUARTER", "state_farm"), 0);
});

test("carriers without a matrix do not inherit State Farm prices", () => {
  assert.equal(carrierHasMatrix("allstate"), false);
  assert.equal(lookupPrice("HOOD", 3, "DIME", "allstate"), 0);
  assert.equal(lookupPrice("ROOF", 10, "HALF", "geico"), 0);
  const quote = quotePanel({
    panel: "HOOD",
    carrierId: "allstate",
    selectedRange: "1 - 5",
    size: "DIME",
  });
  assert.equal(quote.basePrice, 0);
  assert.equal(quote.totalPrice, 0);
});

test("percent add-ons are applied to the State Farm base price", () => {
  const quote = quotePanel({
    panel: "HOOD",
    carrierId: "state_farm",
    selectedRange: "6 - 15",
    size: "NICKEL",
    addons: ["Aluminum"],
  });
  assert.equal(quote.basePrice, 175);
  assert.equal(quote.addonTotal, 44);
  assert.equal(quote.totalPrice, 219);
});

test("R&I hours are included when the operation is selected", () => {
  const quote = quotePanel({
    panel: "HOOD",
    carrierId: "state_farm",
    selectedRange: "1 - 5",
    size: "DIME",
    riEnabled: true,
    laborRate: 60,
    riIncluded: { hood: true },
    riTimes: { hood: 1.2 },
  });
  assert.equal(quote.basePrice, 80);
  assert.equal(quote.riTotalCost, 72);
  assert.equal(quote.totalPrice, 152);
});

test("VIN decode reads make and model year", () => {
  const decoded = decodeVIN("4T1BF1FK5HU123456");
  assert.deepEqual(decoded, { year: "2017", make: "Toyota" });
  assert.equal(decodeVIN("SHORT"), null);
});

test("downloaded report escapes vehicle text and keeps the disclaimer", () => {
  const html = generateReportHTML(
    { owner: '<script>alert("x")</script>', year: "2020", make: "Toyota", model: "Camry", vin: "4T1BF1FK5HU123456", claim: "A&B" },
    {
      HOOD: {
        count: 15,
        selectedRange: "6 - 15",
        size: "NICKEL",
        basePrice: 175,
        totalPrice: 175,
        addons: [],
      },
    },
    [{ url: "javascript:alert(1)", name: "bad" }],
    175,
    "State Farm",
  );
  assert.equal(html.includes("<script>alert"), false);
  assert.ok(html.includes("&lt;script&gt;"));
  assert.ok(html.includes("A&amp;B"));
  assert.ok(html.includes(ESTIMATE_DISCLAIMER));
  assert.equal(html.includes("javascript:alert"), false);
  assert.equal(/deductible waived/i.test(html), false);
  assert.equal(/cash rebate/i.test(html), false);
});

test("estimate summary includes the result and no waiver promise", () => {
  const summary = buildEstimateSummary({
    vehicleInfo: { year: "2020", make: "Toyota", model: "Camry" },
    panelData: { HOOD: { count: 15, selectedRange: "6 - 15", size: "NICKEL", totalPrice: 175 } },
    carrierLabel: "State Farm",
    grandTotal: 175,
  });
  assert.match(summary, /Hood: 6 - 15 nickel dents — \$175/);
  assert.match(summary, /Grand total: \$175/);
  assert.ok(summary.includes(ESTIMATE_DISCLAIMER));
  assert.equal(/waive your deductible/i.test(summary), false);
});

test("email is optional and a bad email still fails", () => {
  assert.deepEqual(validateLead({ name: "Ada", phone: "2145550100", email: "" }), {});
  const errors = validateLead({ name: "", phone: "123", email: "not-an-email" });
  assert.ok(errors.name);
  assert.equal(errors.phone.includes("123"), false);
  assert.match(errors.phone, /10 digits/);
  assert.ok(errors.email);
  assert.deepEqual(validateLead({ name: "Ada", phone: "2145550100", email: "ada@example.com" }), {});
});

test("a short summary is left as written", () => {
  const text = "Hood: 6 - 15 nickel dents — $175\n\nGrand total: $175\n" + ESTIMATE_DISCLAIMER;
  assert.equal(fitSummaryForUrl(text), text.trim());
});

test("a huge summary drops extra panels and stays within the URL limit", () => {
  const panels = Array.from({ length: 40 }, (_, index) => `Panel ${index}: 6 - 15 nickel dents — $${100 + index}`);
  const summary = [
    "Carrier: State Farm",
    "Vehicle: 2020 Toyota Camry",
    ...panels,
    "",
    "Grand total: $9999",
    ESTIMATE_DISCLAIMER,
  ].join("\n");
  const fitted = fitSummaryForUrl(summary, GHL_SUMMARY_LIMIT);
  assert.ok(fitted.length <= GHL_SUMMARY_LIMIT);
  assert.match(fitted, /Panel 0:/);
  assert.match(fitted, /more panel/);
  assert.match(fitted, /Grand total: \$9999/);
  assert.ok(fitted.includes(ESTIMATE_DISCLAIMER));
  assert.equal(fitted.includes("Panel 39:"), false);
});

test("the embed URL prefills the public form and does not post", () => {
  const summary = "Carrier: State Farm\nHood: 6 - 15 nickel dents — $175\n\nGrand total: $175";
  const url = buildGhlEmbedUrl({
    formValue: GHL_FORM,
    summaryFieldId: GHL_SUMMARY_FIELD_ID,
    summary,
    lead: {
      name: "Ada Lovelace",
      phone: "2145550100",
      email: "",
      notes: "Driver side is worse",
    },
  });
  const parsed = new URL(url);
  assert.equal(parsed.origin + parsed.pathname, "https://api.leadconnectorhq.com/widget/form/g99Lxl9E4vJX8OfrSWWt");
  assert.equal(parsed.searchParams.get("full_name"), "Ada Lovelace");
  assert.equal(parsed.searchParams.get("phone"), "2145550100");
  assert.equal(parsed.searchParams.has("email"), false);
  const summaryParam = parsed.searchParams.get("estimate_summary");
  assert.match(summaryParam, /Driver side is worse/);
  assert.match(summaryParam, /Grand total: \$175/);
  assert.equal(summaryParam, parsed.searchParams.get(GHL_SUMMARY_FIELD_ID));
  assert.equal(url.includes("forms/submit"), false);
  assert.equal(url.toLowerCase().includes("bearer"), false);
  assert.equal(buildGhlEmbedUrl({ formValue: "" }), "");
  assert.equal(GHL_FORM, "g99Lxl9E4vJX8OfrSWWt");
  assert.equal(GHL_SUMMARY_FIELD_ID, "SUhCo0uSQg2PrR3VPHp9");
});

test("a form id and the public embed URL parse to the same form", () => {
  assert.equal(parseGhlForm("AbC123").formId, "AbC123");
  assert.equal(parseGhlForm("https://link.msgsndr.com/widget/form/AbC123").embedUrl.includes("AbC123"), true);
  assert.equal(parseGhlForm("").formId, "");
  const live = parseGhlForm("https://api.leadconnectorhq.com/widget/form/g99Lxl9E4vJX8OfrSWWt");
  assert.equal(live.formId, "g99Lxl9E4vJX8OfrSWWt");
  assert.equal(live.embedUrl, "https://api.leadconnectorhq.com/widget/form/g99Lxl9E4vJX8OfrSWWt");
});

test("a new estimate keeps the previous one in the saved list", () => {
  const current = {
    id: "est_current",
    vehicleInfo: { year: "2020", make: "Toyota", model: "Camry", owner: "Ada", vin: "", claim: "" },
    panelData: { HOOD: { count: 5, selectedRange: "1 - 5", size: "DIME", totalPrice: 80 } },
    carrierId: "state_farm",
    photos: [],
  };
  assert.equal(estimateHasWork(current), true);
  assert.equal(estimateHasWork({ vehicleInfo: { year: "", make: "", model: "", owner: "", vin: "", claim: "" }, panelData: {} }), false);
  const saved = archiveEstimate([], current);
  assert.equal(saved.length, 1);
  assert.equal(saved[0].id, "est_current");
  assert.equal(saved[0].panelData.HOOD.totalPrice, 80);
  const untouched = archiveEstimate(saved, { id: "est_blank", vehicleInfo: { owner: "" }, panelData: {} });
  assert.equal(untouched.length, 1);
  const swapped = openSavedEstimate(saved, { id: "est_other", vehicleInfo: { owner: "Bea" }, panelData: {}, carrierId: "state_farm" }, "est_current");
  assert.equal(swapped.estimate.vehicleInfo.make, "Toyota");
  assert.equal(swapped.saved.some((item) => item.vehicleInfo.owner === "Bea"), true);
  assert.equal(swapped.saved.some((item) => item.id === "est_current"), false);
  const restored = parseDraft(JSON.stringify(current));
  assert.equal(restored.id, "est_current");
  assert.equal(estimatePdfName(current.vehicleInfo), "NTXHail_Estimate_2020_Toyota_Camry.pdf");
});

test("the downloaded estimate is a real PDF with the panel total", () => {
  const when = new Date("2026-10-15T12:00:00Z");
  const input = {
    vehicleInfo: { year: "2020", make: "Toyota", model: "Camry", owner: "Ada", vin: "4T1BF1FK5HU123456", claim: "CLM1" },
    panelData: { HOOD: { count: 5, selectedRange: "1 - 5", size: "DIME", totalPrice: 80 } },
    carrierLabel: "State Farm",
    grandTotal: 80,
  };
  const doc = reportDocument(input, when);
  assert.equal(doc.panels[0].name, "Hood");
  assert.match(doc.panels[0].detail, /1 - 5 dime dents/);
  const bytes = buildEstimatePdf(input, when);
  const text = new TextDecoder().decode(bytes);
  assert.equal(text.startsWith("%PDF-1.4"), true);
  assert.equal(text.trimEnd().endsWith("%%EOF"), true);
  assert.match(text, /Hood: 1 - 5 dime dents - \$80/);
  assert.match(text, /Grand total: \$80/);
  assert.match(text, /repair estimate only/);
  assert.equal(/waive your deductible/i.test(text), false);
  assert.equal(text.includes("startxref"), true);
});

test("the page and source do not show a phone number or a login gate", () => {
  const files = ["index.html", "src/app.jsx", "src/config.js", "src/hail-logic.js"];
  const phone = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/;
  const banned = [/sign in/i, /create account/i, /supabase/i, /deductible waived/i, /cash rebate/i, /waive your deductible/i];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    assert.equal(phone.test(text), false, file);
    for (const pattern of banned) assert.equal(pattern.test(text), false, `${file} ${pattern}`);
    assert.equal(text.includes("forms/submit"), false, file);
    assert.equal(text.includes("backend.leadconnectorhq.com"), false, file);
  }
  const page = fs.readFileSync("index.html", "utf8");
  assert.equal(page.includes("app.js"), true);
  assert.equal(page.includes("babel"), false);
  assert.match(page, /@media print/);
  const app = fs.readFileSync("src/app.jsx", "utf8");
  assert.equal(app.includes("Or pick a panel"), false);
  assert.equal(app.includes("https://www.ntxhail.com"), true);
  assert.equal(app.includes("window.print"), true);
  assert.equal(app.includes("application/pdf"), true);
});
