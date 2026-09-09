# RadiantSkin frontend

Customer storefront built with React, TypeScript, and Vite. All changes for this pass live in `frontend/`; the Spring backend is unchanged.

## Run the frontend preview

Use Node 24 and run these commands from `frontend/` (PowerShell):

```powershell
npm.cmd ci
npm.cmd run dev:demo
```

Open http://localhost:5173. Preview mode uses six clearly labelled sample products with illustrative stock photography and local SVG packaging. It never calls the backend, places orders, or takes payments. Its shopping bag is stored separately from the connected store's bag.

The visual design uses warm white, charcoal, terracotta accents, oversized sans-serif type, and editorial photography. The storefront, product pages, bag, checkout preview, and order lookup share the same responsive styles. Photographs are served locally; attribution and source links are in [image credits](public/images/CREDITS.md). Demo imagery is illustrative and should be replaced with actual product photography before publishing a real catalogue.

## Run against the existing backend

```powershell
npm.cmd run dev
```

The default Vite proxy forwards `/api/*` to `http://127.0.0.1:8080/*`, removing the `/api` prefix. To change the destination, copy `.env.example` to `.env.local`, set `API_PROXY_TARGET`, and restart Vite. Stop the other frontend process before switching modes; port 5173 is intentionally fixed.

| Frontend capability                                            | Existing backend endpoint                                        |
| -------------------------------------------------------------- | ---------------------------------------------------------------- |
| Catalogue, product details, search, category and stock filters | `GET /product/getAll`                                            |
| Order status lookup                                            | `GET /order/read/{orderId}`                                      |
| Shopping bag                                                   | Local browser storage; product IDs and quantities only           |
| Checkout                                                       | Local contact/address form and review; order submission disabled |

Product categories are identified from the existing subtype fields: `usageInstructions`, `hairConcern`, and `skinConcern`. Prices use South African rand. Search, sorting, and filters run on the fetched catalogue and remain in the URL. The API adapter validates prices, limits request duration, handles null order responses, and omits customer credentials from the frontend order model.

The bag enforces the available stock quantity, survives refreshes, and synchronizes between tabs. Removed or unavailable catalogue items remain visible for removal rather than silently disappearing. Contact and address drafts stay in page memory and are never sent or stored in browser storage.

## Current integration boundary

- Live backend connectivity has not been rechecked during this frontend styling pass. The earlier connection attempt failed at database authentication; backend configuration is outside this pass's scope.
- The existing entity responses have circular relationships, and cart-item writes require an abstract `Product`. These must be resolved in a later backend pass before reliable checkout integration.
- The backend has no authentication/session flow or payment-provider integration. The frontend does not invent login, account access, payment success, shipping rates, or order confirmation. Its order lookup displays only the existing endpoint's order summary. Backend access control remains a prerequisite for public deployment.
- Ordering is visibly disabled in both modes. The checkout preview validates and reviews contact/address details without creating customer, cart, payment, or order records.

## Checks

```powershell
npm.cmd run test
npm.cmd run lint
npm.cmd run build
```

The tests cover API shapes and failures, subtype mapping, invalid prices and IDs, saved-bag recovery, stock limits, filters, catalogue retry, checkout privacy, order lookup, navigation, and preview isolation. They use a DOM test environment and mocked API responses; they do not substitute for browser layout or live backend verification.

The UI includes responsive layouts, keyboard focus styles, labelled form controls, reduced-motion support, loading states, empty states, broken-image fallbacks, and retry actions. Connected browser tools were unavailable during this pass, so visual verification in a browser remains outstanding.

## Production build

`npm.cmd run build` creates `dist/`. A static host must serve `index.html` for client routes such as `/shop` and `/products/1`. Configure a reverse proxy for `/api/*` that strips `/api`, or set `VITE_API_BASE_URL` to the backend origin before building and allow that frontend origin in the backend's existing CORS configuration.

`npm.cmd run preview` serves the production build locally on port 4173 with the API proxy. Preview sample data is opt-in through `--mode demo`; normal production builds do not use sample products as a fallback.
