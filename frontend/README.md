# RadiantSkin frontend

Customer storefront built with React, TypeScript, and Vite. Product data comes exclusively from the Spring backend and its MySQL database.

## Run the storefront

Use Node 24 and run these commands from `frontend/` (PowerShell):

```powershell
npm.cmd ci
npm.cmd run dev
```

Open http://localhost:5173 with the backend running on port 8080. There is no sample catalogue, offline product cache, or demo mode. If the API is unavailable, the storefront shows an error instead of products. It rechecks on window focus, reconnection, and every 30 seconds; failed requests clear previously loaded products.

The visual design pairs Instrument Serif with Manrope, warm white, charcoal, terracotta accents, and editorial photography. The storefront, product pages, bag, checkout preview, and order lookup share the same responsive styles. Fonts and photographs are served locally; source and license details are in [font credits](public/fonts/CREDITS.md) and [image credits](public/images/CREDITS.md). Real product packshots are listed in [product image credits](public/images/products/CREDITS.md).

The homepage uses staggered headline entrances and a slow photograph reveal. Scroll reveals run once per element, including products loaded asynchronously. Sticky navigation, button feedback, product hover reveals, mobile menu entrances, and bag-count updates complete the motion system. All motion respects `prefers-reduced-motion`; content remains visible when observer APIs are unavailable, and keyboard focus exposes unrevealed content immediately. No scroll interception or continuous animation loop is used.

## Run against the existing backend

The storefront reads products through the backend API. A fresh database has no products; this repository does not currently include a catalogue import or seed script. See the [local setup guide](../README.md) for a safe database and API setup.

```powershell
npm.cmd run dev
```

The default Vite proxy forwards `/api/*` to `http://127.0.0.1:8080/*`, removing the `/api` prefix. To change the destination, copy `.env.example` to `.env.local`, set `API_PROXY_TARGET`, and restart Vite. Port 5173 is intentionally fixed.

| Frontend capability                                            | Existing backend endpoint                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Catalogue, product details, search, category and stock filters | `GET /product/getAll`                                            |
| Order status lookup                                            | `GET /order/read/{orderId}`                                      |
| Product reviews                                                | `GET /review/product/{productId}`                                |
| Submit a review as a registered customer                       | `POST /review/submit` with account email and password            |
| Shopping bag                                                   | Local browser storage; product IDs and quantities only           |
| Checkout                                                       | Local contact/address review and fictional demo payment; no real order |

Product categories are identified from the existing subtype fields: `usageInstructions`, `hairConcern`, and `skinConcern`. Prices use South African rand. Search, sorting, and filters run on the fetched catalogue and remain in the URL. The API adapter validates prices, limits request duration, handles null order responses, and omits customer credentials from the frontend order model.

The bag enforces the available stock quantity, survives refreshes, and synchronizes between tabs. Removed or unavailable catalogue items remain visible for removal rather than silently disappearing. Contact and address drafts stay in page memory and are never sent or stored in browser storage.

Customers can create an account from the storefront's **Create account** link. The form validates required details, shows duplicate-email and connection errors, and confirms success without storing the password in browser storage. Sign-in and account sessions are not yet connected to this storefront.

Product pages load reviews from the review API. Registered customers can submit a rating and a 3–240 character review after confirming their email and password. The review response contains only its rating, comment, date, and ID; the form clears the password after a response and does not put credentials in browser storage. The existing legacy review write routes and other customer/order routes still need access control before public deployment.

## Current integration boundary

- The product API can return an empty catalogue from a fresh database. Product counts in an existing local database depend on its current contents. Checkout and live order flows have not been reverified in this pass.
- The existing entity responses have circular relationships, and cart-item writes require an abstract `Product`. These must be resolved in a later backend pass before reliable checkout integration.
- The backend has no authenticated session flow or payment-provider integration. The frontend does not invent login, account access, real payment success, shipping rates, or a real order confirmation. Its order lookup displays only the existing endpoint's order summary. Backend access control remains a prerequisite for public deployment.
- Demo checkout validates contact and delivery details, then accepts only the fictional card values shown on the page. Approval and decline are simulated in the browser. Card details are not sent or stored, and no customer, cart, payment, or order records are created. The bag remains saved after a demo approval.

## Checks

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

The tests cover API shapes and failures, subtype mapping, invalid prices and IDs, saved-bag recovery, stock limits, filters, catalogue retry, review loading and posting, demo payment approval and decline, checkout privacy, order lookup, navigation, backend failure and recovery, and empty database responses. They use a DOM test environment and mocked API responses; they do not substitute for browser layout or live backend verification.

The UI includes responsive layouts, keyboard focus styles, labelled form controls, reduced-motion support, loading states, empty states, broken-image fallbacks, and retry actions. Connected browser tools were unavailable during this pass, so visual verification in a browser remains outstanding.

## Production build

`npm.cmd run build` creates `dist/`. A static host must serve `index.html` for client routes such as `/shop` and `/products/1`. Configure a reverse proxy for `/api/*` that strips `/api`, or set `VITE_API_BASE_URL` to the backend origin before building and allow that frontend origin in the backend's existing CORS configuration.

`npm.cmd run preview` serves the production build locally on port 4173 with the API proxy. It requires the backend to load products, just like the development server.
