// Paste the new GoHighLevel form ID, or the full form embed URL.
// This is the only value required to connect lead capture.
// Never put an API token or private integration token in this file.
export const GHL_FORM = "";

// NTX HAIL location. Not a secret — it only routes the public form.
export const GHL_LOCATION_ID = "o6DlmLuYCNFntSijxhMG";

// Logical HailSpec value -> the field name or id on the GoHighLevel form.
// A blank value is not posted. GoHighLevel rejects the submission if a key
// is sent that the form does not have, so leave a key blank until that field exists.
export const GHL_FIELDS = {
  full_name: "full_name",
  email: "email",
  phone: "phone",
  estimate_summary: "estimate_summary",
  notes: "",
  vehicle: "",
  vin: "",
  claim_number: "",
  carrier: "",
  grand_total: "",
  panel_count: "",
  opportunity_name: "",
};
