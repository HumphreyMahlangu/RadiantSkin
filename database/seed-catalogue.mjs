import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const root = fileURLToPath(new URL("../", import.meta.url));
const apply = process.argv.includes("--apply");
if (process.argv.slice(2).some((arg) => !["--apply", "--plan"].includes(arg)))
  throw new Error("Use --plan or --apply");
const catalogue = JSON.parse(
  fs.readFileSync(path.join(root, "database/catalogue.json"), "utf8"),
);
const decodeProperty = (value) =>
  value.replace(/\\u([0-9a-f]{4})|\\(.)/gi, (_, unicode, escaped) =>
    unicode
      ? String.fromCharCode(parseInt(unicode, 16))
      : ({ t: "\t", n: "\n", r: "\r", f: "\f" }[escaped] ?? escaped),
  );
const props = Object.fromEntries(
  fs
    .readFileSync(
      path.join(root, "src/main/resources/application.properties"),
      "utf8",
    )
    .split(/\r?\n/)
    .filter((line) => line.trim() && !/^\s*[#!]/.test(line))
    .map((line) => {
      const index = line.indexOf("=");
      if (index < 0)
        throw new Error("Expected key=value database configuration");
      return [
        line.slice(0, index).trim(),
        decodeProperty(line.slice(index + 1).trim()),
      ];
    }),
);
const setting = (environment, property) =>
  (process.env[environment] ?? props[property] ?? "").replace(
    /\$\{([^}:]+)(?::([^}]*))?\}/g,
    (_, name, fallback) => {
      if (process.env[name] === undefined && fallback === undefined)
        throw new Error(`Missing environment variable ${name}`);
      return process.env[name] ?? fallback;
    },
  );
const jdbc = setting("SPRING_DATASOURCE_URL", "spring.datasource.url");
if (!jdbc.startsWith("jdbc:mysql://"))
  throw new Error("Expected a MySQL JDBC URL");
const target = new URL(jdbc.slice(5));
if (
  !["localhost", "127.0.0.1", "[::1]"].includes(target.hostname) ||
  target.pathname !== "/radiant_skin_db"
)
  throw new Error(
    "This importer only targets the local radiant_skin_db database",
  );
const username = setting(
  "SPRING_DATASOURCE_USERNAME",
  "spring.datasource.username",
);
const password = setting(
  "SPRING_DATASOURCE_PASSWORD",
  "spring.datasource.password",
);
const mysql =
  process.env.MYSQL_BIN ||
  "C:/Program Files/MySQL/MySQL Server 8.0/bin/mysql.exe";

function query(sql) {
  const result = spawnSync(
    mysql,
    [
      "--host=" + target.hostname,
      "--port=" + (target.port || "3306"),
      "--user=" + username,
      "--database=radiant_skin_db",
      "--default-character-set=utf8mb4",
      "--batch",
      "--raw",
      "--skip-column-names",
      "--connect-timeout=5",
    ],
    {
      input: sql,
      encoding: "utf8",
      windowsHide: true,
      env: { ...process.env, MYSQL_PWD: password },
      maxBuffer: 8 * 1024 * 1024,
    },
  );
  if (result.status !== 0) {
    const error =
      result.stderr || result.error?.message || "Database operation failed";
    throw new Error(
      password ? error.replaceAll(password, "[redacted]") : error,
    );
  }
  return result.stdout.trim();
}

// SQL text values are encoded, so product names containing apostrophes cannot alter the query.
const sqlText = (value) =>
  `CONVERT(0x${Buffer.from(value, "utf8").toString("hex")} USING utf8mb4)`;
const identity = (product) =>
  JSON.stringify([
    product.category,
    product.brand.toLowerCase(),
    product.name.toLowerCase(),
    product.volumeMl,
  ]);
const identities = new Set();
for (const product of catalogue.products) {
  if (!["SKIN", "HAIR", "BODY"].includes(product.category))
    throw new Error("Invalid product category");
  for (const field of [
    "key",
    "brand",
    "name",
    "description",
    "details",
    "imageUrl",
  ]) {
    if (
      typeof product[field] !== "string" ||
      !product[field].trim() ||
      product[field].length > 255
    )
      throw new Error(`Invalid ${field} for ${product.key}`);
  }
  if (
    !/^[a-z0-9-]+$/.test(product.key) ||
    product.imageUrl !== `/images/products/${product.key}.jpg`
  )
    throw new Error("Unexpected image path");
  if (!/^\d{1,6}\.\d{2}$/.test(product.price) || Number(product.price) <= 0)
    throw new Error("Invalid price");
  if (
    !Number.isInteger(product.volumeMl) ||
    product.volumeMl <= 0 ||
    product.stockQuantity !== 0
  )
    throw new Error("Invalid volume or unverified stock quantity");
  if (!fs.existsSync(path.join(root, "frontend/public", product.imageUrl)))
    throw new Error(`Missing image for ${product.key}`);
  if (identities.has(identity(product)))
    throw new Error("Duplicate catalogue identity");
  identities.add(identity(product));
}

const columns = [
  "product_id",
  "product_type",
  "brand",
  "name",
  "description",
  "price",
  "stock_quantity",
  "image_url",
  "volume_ml",
  "usage_instructions",
  "hair_concern",
  "skin_concern",
];
const tableColumns = query("SHOW COLUMNS FROM product;")
  .split("\n")
  .map((line) => line.split("\t")[0]);
if (columns.some((column) => !tableColumns.includes(column)))
  throw new Error("Product schema differs from the expected existing schema");
const snapshotQuery = `SELECT COALESCE(JSON_ARRAYAGG(JSON_OBJECT(${columns.map((column) => `'${column}',${column}`).join(",")})),JSON_ARRAY()) FROM product;`;
const before = JSON.parse(query(snapshotQuery));
const existing = new Set(
  before.map((p) =>
    identity({
      category: p.product_type,
      brand: p.brand ?? "",
      name: p.name ?? "",
      volumeMl: p.volume_ml,
    }),
  ),
);
const additions = catalogue.products.filter((p) => !existing.has(identity(p)));
console.log(
  `Target: ${target.hostname}:${target.port || "3306"}/radiant_skin_db`,
);
console.log(
  `Existing products: ${before.length}. New catalogue products: ${additions.length}. Matching products skipped: ${catalogue.products.length - additions.length}.`,
);
for (const product of additions)
  console.log(
    `  ${product.category} | ${product.brand} ${product.name} | ${product.volumeMl} ml | R ${product.price} | stock 0`,
  );

if (!apply) {
  console.log(
    "Plan only. Run with --apply to insert missing products. Existing records are never updated or deleted.",
  );
} else if (additions.length === 0) {
  console.log("Catalogue already present. No database writes needed.");
} else {
  fs.mkdirSync(path.join(root, "target"), { recursive: true });
  const snapshot = path.join(
    root,
    "target",
    `products-before-import-${new Date().toISOString().replaceAll(/[:.]/g, "-")}.json`,
  );
  fs.writeFileSync(snapshot, JSON.stringify(before, null, 2) + "\n");
  const statements = additions.map((product) => {
    const fields = [
      product.category,
      product.brand,
      product.name,
      product.description,
    ].map(sqlText);
    fields.push(
      product.price,
      "0",
      sqlText(product.imageUrl),
      String(product.volumeMl),
    );
    for (const category of ["SKIN", "HAIR", "BODY"])
      fields.push(
        product.category === category ? sqlText(product.details) : "NULL",
      );
    return `INSERT INTO product (product_type,brand,name,description,price,stock_quantity,image_url,volume_ml,usage_instructions,hair_concern,skin_concern)
      SELECT ${fields.join(",")} WHERE NOT EXISTS (SELECT 1 FROM product WHERE product_type=${sqlText(product.category)} AND brand=${sqlText(product.brand)} AND name=${sqlText(product.name)} AND volume_ml=${product.volumeMl});
      SET @inserted = @inserted + ROW_COUNT();`;
  });
  const inserted =
    query(`SET SESSION sql_mode='STRICT_ALL_TABLES,NO_ENGINE_SUBSTITUTION';
    SET TRANSACTION ISOLATION LEVEL SERIALIZABLE;
    START TRANSACTION;
    SET @inserted=0;
    ${statements.join("\n")}
    COMMIT;
    SELECT @inserted;`);
  const after = JSON.parse(query(snapshotQuery));
  const byId = new Map(after.map((product) => [product.product_id, product]));
  if (
    before.some(
      (product) =>
        JSON.stringify(product) !==
        JSON.stringify(byId.get(product.product_id)),
    )
  )
    throw new Error(
      "An existing product changed during the import; inspect the saved snapshot",
    );
  for (const product of catalogue.products) {
    if (
      !after.some(
        (row) =>
          identity({
            category: row.product_type,
            brand: row.brand ?? "",
            name: row.name ?? "",
            volumeMl: row.volume_ml,
          }) === identity(product),
      )
    )
      throw new Error(`Missing imported product: ${product.key}`);
  }
  console.log(
    `Inserted ${inserted} products. Total: ${after.length}. All ${before.length} pre-existing products are unchanged.`,
  );
  console.log(`Product snapshot: ${path.relative(root, snapshot)}`);
}
