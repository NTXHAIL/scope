# HailSpec

HailSpec is the NTX Hail estimator. Anyone can open it and price hail damage on a vehicle. There is no account and no login. The estimate in progress is saved on the phone.

Pick a carrier, enter the vehicle, tap each damaged panel, and set the dent range and size. State Farm has the working price matrix. Other carriers stay at $0 until a matrix is added, and those panels should be written as conventional repair or remove-and-replace. Review the total, then send your name, phone, email, and the estimate to NTX Hail.

The estimate is repair pricing only. It is not a promise to waive a deductible, pay a rebate, or cover any part of an insurance claim.

## Hosting

This repo is published with **GitHub Pages** from the `main` branch, root folder:

https://ntxhail.github.io/scope/

GitHub Pages serves the committed `index.html` and `app.js`. It cannot store secrets and it cannot run a serverless function. That is fine for this app, because the GoHighLevel form is public: the form ID is not a token.

Do not add a GoHighLevel API token, private integration token, or any other secret to this repo. The browser posts the lead to GoHighLevel's public form endpoint.

If a later version needs a private token, move that call to a host with environment variables (Vercel is the straightforward option) and keep the token on the server. The public form path does not need that.

## Lead form

Create a **new** form in the NTX HAIL location `o6DlmLuYCNFntSijxhMG`. Then paste either the form ID or the full embed URL into `GHL_FORM` in `src/config.js` and rebuild.

The form should create a **contact** and an **opportunity**:

- Pipeline: **Hail Estimates**
- Stage: **New Estimate**

Add these fields, using these exact keys:

| Key | What HailSpec sends |
| --- | --- |
| `full_name` | Name |
| `email` | Email |
| `phone` | Phone |
| `estimate_summary` | Notes (when there is no separate notes field), vehicle, VIN, claim number, carrier, each panel, grand total, and the disclaimer |

Optional keys are listed in `GHL_FIELDS`. They are blank on purpose. GoHighLevel rejects the whole submission if HailSpec sends a key the form does not have. Fill a key in only after that field exists on the form. If a custom field is given a random id instead of the name above, paste that id into `GHL_FIELDS`.

After changing `src/config.js`, run `npm run build` and commit `app.js` with the source. GitHub Pages serves the built file.

## Scripts

```bash
npm install
npm test
npm run build
```

`npm test` checks the price matrix, the carrier fallback, VIN decode, the report, and the lead payload. `npm run build` writes `app.js`.
