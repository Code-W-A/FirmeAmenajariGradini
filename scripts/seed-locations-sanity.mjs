import fs from "node:fs";
import path from "node:path";
import { createClient } from "@sanity/client";
import { judeteFull } from "../data/judete-full.mjs";

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, "utf8");
  content.split(/\r?\n/).forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;

    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) return;

    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    if (!(key in process.env)) {
      process.env[key] = value;
    }
  });
}

function slugify(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 96);
}

function chunkArray(items, chunkSize) {
  const chunks = [];
  for (let index = 0; index < items.length; index += chunkSize) {
    chunks.push(items.slice(index, index + chunkSize));
  }
  return chunks;
}

function buildSeedDocs() {
  const countyDocs = [];
  const cityDocs = [];
  const countySlugSet = new Set();
  const citySlugSet = new Set();

  for (const county of judeteFull) {
    const countyName = county.judet?.trim();
    if (!countyName) continue;

    const countySlug = slugify(countyName);
    if (!countySlug) {
      throw new Error(`Invalid county slug for "${countyName}"`);
    }
    if (countySlugSet.has(countySlug)) {
      throw new Error(`Duplicate county slug "${countySlug}"`);
    }

    countySlugSet.add(countySlug);
    const countyId = `county.${countySlug}`;

    countyDocs.push({
      _id: countyId,
      _type: "county",
      name: countyName,
      slug: { _type: "slug", current: countySlug },
    });

    const localities = Array.isArray(county.localitati) ? county.localitati : [];
    for (const localityRaw of localities) {
      const localityName = String(localityRaw || "").trim();
      if (!localityName) continue;

      const citySlug = slugify(`${localityName}-${countyName}`);
      if (!citySlug) {
        throw new Error(
          `Invalid city slug for "${localityName}" in "${countyName}"`
        );
      }
      if (citySlugSet.has(citySlug)) {
        throw new Error(`Duplicate city slug "${citySlug}"`);
      }

      citySlugSet.add(citySlug);
      cityDocs.push({
        _id: `city.${citySlug}`,
        _type: "city",
        name: localityName,
        slug: { _type: "slug", current: citySlug },
        county: { _type: "reference", _ref: countyId },
      });
    }
  }

  return { countyDocs, cityDocs };
}

async function main() {
  loadEnvFile(path.resolve(".env.local"));
  loadEnvFile(path.resolve(".env"));

  const writeMode = process.argv.includes("--write");
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2025-05-08";
  const token =
    process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_READ_TOKEN;

  if (!projectId) {
    console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in env.");
    process.exit(1);
  }
  if (!token) {
    console.error(
      "Missing SANITY_API_WRITE_TOKEN (or SANITY_API_READ_TOKEN) in env."
    );
    process.exit(1);
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion,
    token,
    useCdn: false,
  });

  const { countyDocs, cityDocs } = buildSeedDocs();
  const allDocs = [...countyDocs, ...cityDocs];

  const [existingCounties, existingCities] = await Promise.all([
    client.fetch(
      `*[_type == "county"]{_id, name, "slug": slug.current}`
    ),
    client.fetch(
      `*[_type == "city"]{_id, name, "slug": slug.current, "countyRef": county._ref}`
    ),
  ]);

  const existingById = new Map([
    ...existingCounties.map((doc) => [doc._id, doc]),
    ...existingCities.map((doc) => [doc._id, doc]),
  ]);

  const toCreate = [];
  const toUpdate = [];
  const skipped = [];

  for (const doc of allDocs) {
    const current = existingById.get(doc._id);
    if (!current) {
      toCreate.push(doc);
      continue;
    }

    const currentCountyRef = current.countyRef || null;
    const nextCountyRef = doc.county?._ref || null;
    const changed =
      current.name !== doc.name ||
      current.slug !== doc.slug.current ||
      currentCountyRef !== nextCountyRef;

    if (changed) {
      toUpdate.push(doc);
    } else {
      skipped.push(doc);
    }
  }

  console.log(
    `Dataset: ${dataset} | writeMode: ${writeMode ? "ON" : "OFF (dry-run)"}`
  );
  console.log(
    `Planned docs: counties=${countyDocs.length}, cities=${cityDocs.length}, total=${allDocs.length}`
  );
  console.log(
    `Actions: create=${toCreate.length}, update=${toUpdate.length}, skip=${skipped.length}`
  );

  if (!writeMode) {
    console.log("Dry run complete. Re-run with --write to apply changes.");
    process.exit(0);
  }

  const docsToMutate = [...toCreate, ...toUpdate];
  const batches = chunkArray(docsToMutate, 75);
  let applied = 0;

  for (const [batchIndex, batch] of batches.entries()) {
    let tx = client.transaction();

    for (const doc of batch) {
      tx = tx.createIfNotExists({ _id: doc._id, _type: doc._type });
      tx = tx.patch(doc._id, {
        set: {
          name: doc.name,
          slug: doc.slug,
          ...(doc.county ? { county: doc.county } : {}),
        },
      });
    }

    await tx.commit();
    applied += batch.length;
    console.log(
      `Applied batch ${batchIndex + 1}/${batches.length} (${batch.length} docs)`
    );
  }

  console.log(`Seed complete. Applied ${applied} docs.`);
}

main().catch((error) => {
  console.error("Seed failed:", error);
  process.exit(1);
});
