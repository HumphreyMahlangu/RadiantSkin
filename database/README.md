# Real product catalogue

`catalogue.json` contains nine real products sold in South Africa: three skin-care, three body-care, and three hair-care products. Names, pack sizes, initial ZAR prices and packshots were checked against the linked Clicks product listings on 9 September 2026. Descriptions are short paraphrases. Source pages and original image URLs are retained per product.

Prices are the displayed single-item reference prices, excluding member-only and multi-buy discounts. They are editable starting prices for this store, not a live retailer feed. All new stock quantities start at **zero** because supplier availability does not establish RadiantSkin's inventory. No retailer reviews, ratings, customer data or stock counts are imported.

## Import into the local database

From the repository root, with Node 24 and MySQL 8 installed:

```powershell
node database/seed-catalogue.mjs --plan
node database/seed-catalogue.mjs --apply
```

The default is a read-only plan. `--apply` inserts missing rows into the existing `product` table in one transaction. It preserves existing rows, prices, inventory, orders and customer records. Matching uses product type, brand, name and volume; repeat runs skip matches. It does not create tables or modify backend application code.

Credentials are read from the existing Spring `application.properties` file, with `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME` and `SPRING_DATASOURCE_PASSWORD` environment overrides supported. No credentials are embedded in the script or passed on the command line. The importer is restricted to `radiant_skin_db` on localhost. Set `MYSQL_BIN` if the MySQL client is installed elsewhere.

Before inserting, the script validates fields and image files and saves a product-only snapshot under ignored `target/products-before-import-*.json`. After insertion it verifies that every previous product is unchanged and every catalogue identity exists. A failed SQL statement stops the client and rolls back uncommitted inserts.

The initial import added nine rows to the three existing products, leaving twelve total. A second apply run made no writes.

Verification also stopped and restarted the backend: the frontend proxy returned HTTP 502 while it was stopped, then HTTP 200 with all twelve persisted products after restart. The nine new records normalized correctly through the frontend adapter and all nine packshots were served. The temporary backend process was stopped after verification so it can be started normally from the IDE.

## View in the storefront

Start the backend using your normal IDE run action, then start the frontend in connected mode:

```powershell
cd frontend
npm.cmd run dev
```

Open `http://127.0.0.1:5173/shop`. The existing `/api/product/getAll` proxy reads the database catalogue. There is no demo catalogue or product fallback. If the backend is unavailable, the frontend shows an error; it does not load this seed JSON or manufacture product records.

Packshots are served from `frontend/public/images/products/`; the database stores these local URL paths. Keep those assets with the frontend deployment. The packshot style uses `object-fit: contain` so product labels and packaging are not cropped.

To retrieve source photographs again:

```powershell
node database/fetch-catalogue-images.mjs
```

This requires network access and `curl.exe`. Existing local images and source-page caches under `target/` are reused. Product images remain the property of their respective owners; source attribution is in `frontend/public/images/products/CREDITS.md`.
