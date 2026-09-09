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

The local database now includes nine sourced real products alongside its three existing entries. The storefront reads these records through the backend API. [Catalogue documentation](../database/README.md) covers source prices, stock initialization and repeatable imports.

```powershell
npm.cmd run dev
```

The default Vite proxy forwards `/api/*` to `http://127.0.0.1:8080/*`, removing the `/api` prefix. To change the destination, copy `.env.example` to `.env.local`, set `API_PROXY_TARGET`, and restart Vite. Port 5173 is intentionally fixed.

| Frontend capability                                            | Existing backend endpoint                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Catalogue, product details, search, category and stock filters | `GET /product/getAll`                                            |
| Order status lookup                                            | `GET /order/read/{orderId}`                                      |
| Shopping bag                                                   | Local browser storage; product IDs and quantities only           |
| Checkout                                                       | Local contact/address form and review; order submission disabled |

Product categories are identified from the existing subtype fields: `usageInstructions`, `hairConcern`, and `skinConcern`. Prices use South African rand. Search, sorting, and filters run on the fetched catalogue and remain in the URL. The API adapter validates prices, limits request duration, handles null order responses, and omits customer credentials from the frontend order model.

The bag enforces the available stock quantity, survives refreshes, and synchronizes between tabs. Removed or unavailable catalogue items remain visible for removal rather than silently disappearing. Contact and address drafts stay in page memory and are never sent or stored in browser storage.

## Current integration boundary

- Local database authentication and the product API were verified during the catalogue import. `GET /product/getAll` returns all twelve database products. Checkout and live order flows have not been reverified in this pass.
- The existing entity responses have circular relationships, and cart-item writes require an abstract `Product`. These must be resolved in a later backend pass before reliable checkout integration.
- The backend has no authentication/session flow or payment-provider integration. The frontend does not invent login, account access, payment success, shipping rates, or order confirmation. Its order lookup displays only the existing endpoint's order summary. Backend access control remains a prerequisite for public deployment.
- Ordering is visibly disabled. The checkout preview validates and reviews contact/address details without creating customer, cart, payment, or order records.

## Checks

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

The tests cover API shapes and failures, subtype mapping, invalid prices and IDs, saved-bag recovery, stock limits, filters, catalogue retry, checkout privacy, order lookup, navigation, backend failure and recovery, and empty database responses. They use a DOM test environment and mocked API responses; they do not substitute for browser layout or live backend verification.

The UI includes responsive layouts, keyboard focus styles, labelled form controls, reduced-motion support, loading states, empty states, broken-image fallbacks, and retry actions. Connected browser tools were unavailable during this pass, so visual verification in a browser remains outstanding.

## Production build

`npm.cmd run build` creates `dist/`. A static host must serve `index.html` for client routes such as `/shop` and `/products/1`. Configure a reverse proxy for `/api/*` that strips `/api`, or set `VITE_API_BASE_URL` to the backend origin before building and allow that frontend origin in the backend's existing CORS configuration.

`npm.cmd run preview` serves the production build locally on port 4173 with the API proxy. It requires the backend to load products, just like the development server.
