# HailSpec

HailSpec is the NTX Hail estimator. Anyone can open it and price hail damage on a vehicle. There is no account and no login. The estimate in progress is saved on the phone.

Pick a carrier, enter the vehicle, tap each damaged panel, and set the dent range and size. State Farm has the working price matrix. Other carriers stay at $0 until a matrix is added, and those panels should be written as conventional repair or remove-and-replace. Review the total, then send your name and phone, with an optional email, to NTX Hail.

The estimate is repair pricing only. It is not a promise to waive a deductible, pay a rebate, or cover any part of an insurance claim.

## Hosting

This repo is published with **GitHub Pages** from the `main` branch, root folder:

https://ntxhail.github.io/scope/

GitHub Pages serves the committed `index.html` and `app.js`. It cannot store secrets and it cannot run a serverless function. That is fine for this app, because the GoHighLevel form is public: the form ID is not a token.

Do not add a GoHighLevel API token, private integration token, or any other secret to this repo. HailSpec does not call the form submit API. That endpoint requires reCAPTCHA, so the app opens the public form and the person submits it there.

If a later version needs a private token, move that call to a host with environment variables (Vercel is the straightforward option) and keep the token on the server. The public form path does not need that.

## Lead form

The live form is in the NTX HAIL location `o6DlmLuYCNFntSijxhMG`:

- Form ID: `g99Lxl9E4vJX8OfrSWWt` (`GHL_FORM` in `src/config.js`)
- Public URL: https://api.leadconnectorhq.com/widget/form/g99Lxl9E4vJX8OfrSWWt
- Pipeline: **Hail Estimates**
- Stage: **New Estimate**

**Send to NTX Hail** opens that form full screen. Name and phone are required in HailSpec. Email is optional. The form is prefilled from the page address:

| Query key | What it fills |
| --- | --- |
| `full_name` | Name |
| `phone` | Phone |
| `email` | Email, when one was entered |
| `estimate_summary` | Notes, vehicle, VIN, claim number, carrier, panels, grand total, and the disclaimer |

The summary textarea id is `SUhCo0uSQg2PrR3VPHp9`. The `estimate_summary` query key fills it. The id alone does not, so HailSpec sends both keys with the same text. A very long estimate is shortened to about 1,500 characters by dropping extra panel lines and keeping the total.

The person checks the consent boxes on the GoHighLevel form and submits it there. HailSpec never posts the lead itself.

After changing `src/config.js`, run `npm run build` and commit `app.js` with the source. GitHub Pages serves the built file.

## Scripts

```bash
npm install
npm test
npm run build
```

`npm test` checks the price matrix, the carrier fallback, VIN decode, the report, and the prefilled form link. `npm run build` writes `app.js`.
