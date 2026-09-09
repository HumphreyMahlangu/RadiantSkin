import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const cataloguePath = path.join(root, "database/catalogue.json");
const catalogue = JSON.parse(fs.readFileSync(cataloguePath, "utf8"));
const imageDirectory = path.join(root, "frontend/public/images/products");
fs.mkdirSync(imageDirectory, { recursive: true });
fs.mkdirSync(path.join(root, "target"), { recursive: true });

function download(url) {
  return execFileSync(
    "curl.exe",
    [
      "--silent",
      "--show-error",
      "--fail",
      "--location",
      "--retry",
      "2",
      "--max-time",
      "40",
      url,
    ],
    { maxBuffer: 10 * 1024 * 1024, windowsHide: true },
  );
}

for (const product of catalogue.products) {
  const source = new URL(product.sourceUrl);
  if (source.hostname !== "clicks.co.za" || !/^[a-z0-9-]+$/.test(product.key))
    throw new Error("Unexpected catalogue source or key");
  const id = source.pathname.split("/").at(-1);
  const cache = path.join(root, `target/catalogue-source-${id}.html`);
  const html = fs.existsSync(cache)
    ? fs.readFileSync(cache, "utf8")
    : download(source.href).toString("utf8");
  fs.writeFileSync(cache, html);
  const tag = html.match(
    /<img\b[^>]*class="[^"]*productImagePrimaryLink[^"]*"[^>]*>/i,
  )?.[0];
  const src = tag?.match(/\bsrc="([^"]+)"/)?.[1]?.replaceAll("&amp;", "&");
  if (!src) throw new Error(`No product image found for ${product.key}`);
  const imageUrl = new URL(src, source);
  if (imageUrl.hostname !== "clicks.co.za")
    throw new Error("Unexpected image host");
  const destination = path.join(imageDirectory, `${product.key}.jpg`);
  const bytes = fs.existsSync(destination)
    ? fs.readFileSync(destination)
    : download(imageUrl.href);
  if (
    bytes[0] !== 255 ||
    bytes[1] !== 216 ||
    bytes.at(-2) !== 255 ||
    bytes.at(-1) !== 217
  )
    throw new Error(`Incomplete or unexpected JPEG: ${product.key}`);
  fs.writeFileSync(destination, bytes);
  product.sourceImageUrl = imageUrl.href;
  console.log(`${product.brand}: ${product.name} (${bytes.length} bytes)`);
}

fs.writeFileSync(cataloguePath, JSON.stringify(catalogue, null, 2) + "\n");
const credits =
  "# Catalogue product photographs\n\nProduct packshots sourced from the linked retailer listings on " +
  catalogue.verifiedOn +
  ". Brands and product images belong to their respective owners; their inclusion identifies catalogue items and does not imply a retailer or brand partnership.\n\n| Local file | Product source |\n| --- | --- |\n" +
  catalogue.products
    .map((p) => `| ${p.key}.jpg | [${p.brand} ${p.name}](${p.sourceUrl}) |`)
    .join("\n") +
  "\n";
fs.writeFileSync(path.join(imageDirectory, "CREDITS.md"), credits);
