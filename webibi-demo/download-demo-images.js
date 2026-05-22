#!/usr/bin/env node
/**
 * Webibi Demo Image Downloader
 * Run once: node download-demo-images.js
 * Downloads curated, high-quality images per niche into public/assets/
 *
 * Uses direct Unsplash photo IDs — these never 404, no API key needed.
 * Format: https://images.unsplash.com/photo-{ID}?w=1200&q=85&auto=format&fit=crop
 */

const https = require("https");
const fs = require("fs");
const path = require("path");

// ─── Curated photo IDs per niche ────────────────────────────────────────────
// Each array: [hero, section, gallery1, gallery2, gallery3, bg]
// All handpicked for quality, mood, and niche relevance
const NICHE_PHOTOS = {
  restaurant: [
    "1414235077428-338989a2e8c0", // cozy restaurant interior warm lights
    "1504674900247-0877df9cc836", // beautiful food plating
    "1555396273-367ea4eb4db5", // restaurant bar atmosphere
    "1565299624946-b28f40a0ae38", // pizza wood fired oven
    "1482049016688-2d3e1b311543", // breakfast table setup
    "1467003909585-2f8a72700288", // chef cooking
  ],
  salon: [
    "1562322140-8baeececf3df", // hair styling luxury/salon
    "1522337360788-8b13dee7a37e", // hair styling luxury
    "1596755389378-c31d21fd1273", // beauty treatment
    "1522337360788-8b13dee7a37e", // salon makeup/nails (reuse hair styling)
    "1544161515-4ab6ce6db874", // massage/spa stones towel
    "1540555700478-4be289fbecef", // hair color treatment
  ],
  gym: [
    "1534438327276-14e5300c3a48", // gym interior wide
    "1517836357463-d25dfeac3438", // weight training
    "1571019614242-c5c5dee9f50b", // workout training
    "1583454110551-21f2fa2afe61", // yoga fitness
    "1526506118085-60ce8714f8c5", // cycling spin class
    "1574680096145-d05b474e2155", // boxing training
  ],
  clinic: [
    "1576091160399-112ba8d25d1d", // modern clinic bright
    "1559757148-5c350d0d3c56", // doctor consultation
    "1612349317150-e413f6a5b16d", // medical professional
    "1629909613654-28e377c37b09", // clean medical room / lab
    "1551601651-bc60f254d532", // pharmacy consultation
    "1631815589968-fdb09a223b1e", // clinic waiting area
  ],
  events: [
    "1511795409834-ef04bbd61622", // elegant event venue
    "1469371670807-013ccf25f16a", // wedding decoration / party
    "1519741497674-611481863552", // party celebration lights / wedding
    "1533174072545-7a4b6ad7a6c3", // event crowd energy
    "1469371670807-013ccf25f16a", // corporate event / banquet (reuse wedding decoration)
    "1519671482749-fd09be7ccebf", // birthday celebration / dancing crowd
  ],
  default: [
    "1497366216548-37526070297c", // modern office space
    "1556761175-b413da4baf72", // professional meeting
    "1560179707-f14e90ef3623", // small business storefront
    "1497366811353-6870744d04b2", // workspace laptop
    "1542744173-8e7e53415bb0", // business team
    "1486406146926-c627a92ad1ab", // modern building
  ],
};

// ─── Photo roles ─────────────────────────────────────────────────────────────
const ROLES = ["hero", "section", "gallery1", "gallery2", "gallery3", "bg"];

// ─── Download helper ──────────────────────────────────────────────────────────
function downloadImage(url, dest) {
  return new Promise((resolve, reject) => {
    const request = (currentUrl, redirects = 0) => {
      if (redirects > 5) return reject(new Error("Too many redirects"));
      const proto = currentUrl.startsWith("https") ? https : require("http");
      proto
        .get(currentUrl, (res) => {
          if (res.statusCode === 301 || res.statusCode === 302) {
            return request(res.headers.location, redirects + 1);
          }
          if (res.statusCode !== 200) {
            return reject(
              new Error(`HTTP ${res.statusCode} for ${currentUrl}`)
            );
          }
          const file = fs.createWriteStream(dest);
          res.pipe(file);
          file.on("finish", () => {
            file.close();
            resolve();
          });
          file.on("error", reject);
        })
        .on("error", reject);
    };
    request(url);
  });
}

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  const baseDir = path.join(process.cwd(), "public", "assets");

  console.log("🖼️  Webibi Image Downloader\n");

  for (const [niche, photoIds] of Object.entries(NICHE_PHOTOS)) {
    const dir = path.join(baseDir, niche);
    fs.mkdirSync(dir, { recursive: true });

    console.log(`📁 Downloading ${niche} images...`);

    for (let i = 0; i < photoIds.length; i++) {
      const role = ROLES[i] || `extra${i}`;
      const filename = `${role}.jpg`;
      const dest = path.join(dir, filename);

      // Skip if already downloaded
      if (fs.existsSync(dest) && fs.statSync(dest).size > 10000) {
        console.log(`   ✅ ${filename} already exists, skipping`);
        continue;
      }

      // Different sizes per role for performance
      const sizeMap = {
        hero: "w=1400&h=900",
        section: "w=1200&h=700",
        gallery1: "w=800&h=600",
        gallery2: "w=800&h=600",
        gallery3: "w=800&h=600",
        bg: "w=1600&h=1000",
      };
      const size = sizeMap[role] || "w=1200&h=800";

      const url = `https://images.unsplash.com/photo-${photoIds[i]}?${size}&q=85&auto=format&fit=crop`;

      try {
        process.stdout.write(`   ⬇️  Downloading ${filename}...`);
        await downloadImage(url, dest);
        const kb = Math.round(fs.statSync(dest).size / 1024);
        console.log(` done (${kb}KB)`);
      } catch (err) {
        console.log(` ❌ Failed: ${err.message}`);
      }

      // Small delay to be polite to Unsplash
      await new Promise((r) => setTimeout(r, 300));
    }

    console.log(`   🔄 Creating index-shifted sets 1-5 for ${niche}...`);
    const targetRoles = ["hero", "section", "gallery1", "gallery2", "gallery3"];
    for (let k = 1; k <= 5; k++) {
      for (let j = 0; j < targetRoles.length; j++) {
        const destRole = targetRoles[j];
        // Shifting formula: source role is at index (j + k - 1) % 6
        const srcIndex = (j + k - 1) % 6;
        const srcRole = ROLES[srcIndex];
        const srcPath = path.join(dir, `${srcRole}.jpg`);
        const destPath = path.join(dir, `${destRole}-${k}.jpg`);
        try {
          if (fs.existsSync(srcPath)) {
            fs.copyFileSync(srcPath, destPath);
          } else {
            console.log(`      ⚠️  Source file ${srcRole}.jpg not found for shifting`);
          }
        } catch (copyErr) {
          console.log(`      ❌ Error copying to ${destRole}-${k}.jpg: ${copyErr.message}`);
        }
      }
    }
    console.log(`   ✅ Shifted sets created!`);

    console.log(`   ✨ ${niche} done!\n`);
  }

  generateManifest(baseDir);

  console.log("🎉 All images downloaded!");
  console.log("📄 Manifest written to public/assets/manifest.json");
}

function generateManifest(baseDir) {
  const manifest = {};
  for (const niche of Object.keys(NICHE_PHOTOS)) {
    manifest[niche] = {};
    for (const role of ROLES) {
      manifest[niche][role] = `/assets/${niche}/${role}.jpg`;
    }
  }

  const output = {
    generated: new Date().toISOString(),
    usage: "import manifest from '/public/assets/manifest.json'",
    helper: "getImage(industry, role) → '/assets/restaurant/hero.jpg'",
    images: manifest,
  };

  fs.writeFileSync(
    path.join(baseDir, "manifest.json"),
    JSON.stringify(output, null, 2)
  );
}

main().catch(console.error);
