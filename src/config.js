// GoHighLevel form ID, or the full public embed URL.
// HailSpec opens this form. It does not POST to the form API (that endpoint
// requires reCAPTCHA). Never put an API token in this file.
export const GHL_FORM = "g99Lxl9E4vJX8OfrSWWt";

// NTX HAIL location. Not a secret — the public form already belongs to it.
export const GHL_LOCATION_ID = "o6DlmLuYCNFntSijxhMG";

// The summary textarea's DOM id. Query param ?estimate_summary= prefills it.
// ?SUhCo0uSQg2PrR3VPHp9= alone does not. HailSpec sends both, with the same text.
export const GHL_SUMMARY_FIELD_ID = "SUhCo0uSQg2PrR3VPHp9";

// Logical HailSpec value -> the query key that prefills the public form.
export const GHL_FIELDS = {
  full_name: "full_name",
  email: "email",
  phone: "phone",
  estimate_summary: "estimate_summary",
};
