# HailSpec

HailSpec is the NTX Hail estimator. Anyone can open it and price hail damage on a vehicle. There is no account and no login. Estimates, dent counts, and photos stay on the phone and work with no signal.

Pick a carrier, enter the vehicle, and tap each damaged panel on the vehicle diagram. For each panel, enter an exact count for Dime, Nickel, Quarter, and Half Dollar, plus Oversize and Double OS. The app maps those counts onto the existing price ranges. State Farm has the working price matrix. Other carriers stay at $0 until a matrix is added, and those panels should be written as conventional repair or remove-and-replace. Review the total, then send your name and phone, with an optional email, to NTX Hail.

The Media tab is a photo board with Panels, Vehicle, Interior, Wheel, and Misc. Each tile holds more than one photo. A filled tile shows the latest picture and a count. The camera button at the top right files a photo under Misc with no panel tag. Panel tiles open the dent counts for that panel.

Everything in progress is stored in the browser (IndexedDB), including photos. Refreshing, closing the app, or restarting the phone brings it back. The header shows **Saved on phone**, **Waiting for signal**, or **Sent**. **New estimate** keeps the current one in **Saved** and starts a blank customer, vehicle, and damage sheet. **Back to NTX Hail** returns to https://www.ntxhail.com.

**Print** and **Download PDF** include the exact dent wording and the photos, grouped by tab and tile. **Share / Export** downloads a zip of the estimate, a PDF, and the photos. That zip is how pictures leave the phone. The lead form cannot attach them. On a phone, share uses the share sheet when the browser allows it.

## Install and offline use

Open https://ntxhail.github.io/scope/ once while you have signal. The page installs a service worker that caches the app.

- iPhone Safari: tap Share, then Add to Home Screen.
- Android Chrome: tap Install when it appears, or use the browser menu and choose Add to Home screen or Install app.

After that, the home-screen icon opens HailSpec with no service. Photos you add, and the estimate, stay on the phone through a reload.

## Sending a scope

**Send to NTX Hail** queues the scope. With signal, HailSpec opens the public form. Check the consent boxes, submit the form there, then tap **Submitted**. The scope is marked **Sent** only after that. Close the form without submitting and it stays **Waiting for signal**. If you are offline, it stays queued and the form opens on its own when signal returns. A failed attempt is not marked sent.

Photos are not part of that form. Use **Share / Export** and send the zip once you have signal.

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

`npm test` checks the price matrix, exact dent counts, the carrier fallback, VIN decode, the report, saved estimates, sync status, the export zip, the PDF, and the prefilled form link. `npm run build` writes `app.js`. `npm run test:e2e` runs Playwright against the built page, including a photo that survives reload and a scope that waits offline and sends when signal returns.
