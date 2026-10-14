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
  buildLeadFormData,
  submitGhlLead,
  validateLead,
  parseGhlForm,
  ESTIMATE_DISCLAIMER,
  carrierHasMatrix,
  GHL_SUBMIT_URL,
} from "../src/hail-logic.js";
import { GHL_FIELDS, GHL_LOCATION_ID } from "../src/config.js";

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

test("lead payload posts only mapped fields and never a token", async () => {
  const summary = "Carrier: State Farm\nGrand total: $175";
  const fieldMap = { ...GHL_FIELDS, notes: "" };
  const built = buildLeadFormData({
    formValue: "https://api.leadconnectorhq.com/widget/form/FormId123",
    locationId: GHL_LOCATION_ID,
    summary,
    fieldMap,
    lead: {
      name: "Ada Lovelace",
      phone: "2145550100",
      email: "ada@example.com",
      notes: "Driver side is worse",
      carrierLabel: "State Farm",
      grandTotal: 175,
      panelCount: 1,
      vehicleInfo: { year: "2020", make: "Toyota", model: "Camry", vin: "4T1BF1FK5HU123456", claim: "CLM1" },
    },
  });
  assert.equal(built.formId, "FormId123");
  assert.equal(built.submitUrl, GHL_SUBMIT_URL);
  assert.equal(built.formData.full_name, "Ada Lovelace");
  assert.equal(built.formData.email, "ada@example.com");
  assert.equal(built.formData.phone, "2145550100");
  assert.match(built.formData.estimate_summary, /Driver side is worse/);
  assert.match(built.formData.estimate_summary, /Grand total: \$175/);
  assert.equal(built.formData.vehicle, undefined);
  assert.equal(JSON.stringify(built).toLowerCase().includes("bearer"), false);
  assert.equal(JSON.stringify(built).toLowerCase().includes("token"), false);
  assert.equal(built.formData.locationId, "o6DlmLuYCNFntSijxhMG");

  let called = false;
  const skipped = await submitGhlLead({ formValue: "", locationId: GHL_LOCATION_ID, lead: {}, summary: "", fieldMap }, () => {
    called = true;
  });
  assert.equal(skipped.reason, "unconfigured");
  assert.equal(called, false);

  let recorded = null;
  const result = await submitGhlLead({
    formValue: "FormId123",
    locationId: GHL_LOCATION_ID,
    lead: { name: "Ada Lovelace", phone: "2145550100", email: "ada@example.com" },
    summary,
    fieldMap,
  }, async (url, init) => {
    recorded = { url, init };
    assert.equal(init.headers, undefined);
    const posted = JSON.parse(init.body.get("formData"));
    assert.equal(posted.formId, "FormId123");
    assert.equal(posted.email, "ada@example.com");
    return { ok: true, status: 200, text: async () => "{\"ok\":true}" };
  });
  assert.equal(result.ok, true);
  assert.equal(recorded.url, GHL_SUBMIT_URL);
});

test("lead validation messages do not repeat the phone number", () => {
  const errors = validateLead({ name: "", phone: "123", email: "not-an-email" });
  assert.equal(errors.phone.includes("123"), false);
  assert.match(errors.phone, /10 digits/);
  assert.deepEqual(validateLead({ name: "Ada", phone: "(214) 555-0100", email: "ada@example.com" }), {});
});

test("a form id and an embed URL parse to the same form", () => {
  assert.equal(parseGhlForm("AbC123").formId, "AbC123");
  assert.equal(parseGhlForm("https://link.msgsndr.com/widget/form/AbC123").embedUrl.includes("AbC123"), true);
  assert.equal(parseGhlForm("").formId, "");
});

test("the page and source do not show a phone number or a login gate", () => {
  const files = ["index.html", "src/app.jsx", "src/config.js", "src/hail-logic.js"];
  const phone = /(?:\+?1[-.\s]?)?\(?\d{3}\)?[-.\s]\d{3}[-.\s]\d{4}/;
  const banned = [/sign in/i, /create account/i, /supabase/i, /deductible waived/i, /cash rebate/i, /waive your deductible/i];
  for (const file of files) {
    const text = fs.readFileSync(file, "utf8");
    assert.equal(phone.test(text), false, file);
    for (const pattern of banned) assert.equal(pattern.test(text), false, `${file} ${pattern}`);
  }
  const page = fs.readFileSync("index.html", "utf8");
  assert.equal(page.includes("app.js"), true);
  assert.equal(page.includes("babel"), false);
});
