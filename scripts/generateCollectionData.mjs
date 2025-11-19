import fs from "fs";
import path from "path";
import { generateFlowerName } from "./flowerNames.mjs";

const rootDir = path.resolve("public", "assets");
const outputFile = path.resolve("src", "data", "generatedBouquets.ts");

const allowedExtensions = new Set([
  ".jpg",
  ".jpeg",
  ".png",
  ".webp",
  ".JPG",
  ".JPEG",
  ".PNG",
  ".WEBP"
]);

const categoryMeta = {
  birthday: {
    label: "Birthday Signatures",
    description: "Handcrafted celebration blooms with shimmering accents.",
    basePrice: 189
  },
  butterfly: {
    label: "Butterfly Garden",
    description: "Airy garden florals inspired by butterfly wings.",
    basePrice: 205
  },
  gender: {
    label: "Gender Reveal",
    description: "Playful pastel arrangements for unforgettable reveals.",
    basePrice: 175
  },
  graduation: {
    label: "Graduation Honors",
    description: "Statement pieces to honor brilliant milestones.",
    basePrice: 165
  },
  "hand band": {
    label: "Luxury Handbands",
    description: "Wearable floral jewels crafted by couture artisans.",
    basePrice: 145
  },
  "heart shape": {
    label: "Heart Silhouettes",
    description: "Romantic heart-shaped arrangements with couture detailing.",
    basePrice: 215
  },
  "mother day": {
    label: "Mother's Day",
    description: "Tender blooms curated for graceful matriarchs.",
    basePrice: 179
  },
  pink: {
    label: "Pink Reverie",
    description: "Signature pink palettes with luminous gradients.",
    basePrice: 199
  },
  "red roses": {
    label: "Red Roses",
    description: "Opulent red rose statements with metallic finishes.",
    basePrice: 249
  },
  valentine: {
    label: "Valentine's Atelier",
    description: "Sensuous crimson compositions for remarkable romance.",
    basePrice: 229
  },
  "wedding % events": {
    label: "Wedding & Events",
    description: "Editorial arrangements tailored for grand celebrations.",
    basePrice: 289
  }
};

const formatName = (fileName) => {
  const base = fileName
    .replace(path.extname(fileName), "")
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!base) return "Signature Arrangement";

  return base.replace(/\b(\w)/g, (match) => match.toUpperCase());
};

const slugify = (value) => {
  return value
    .toLowerCase()
    .replace(/%/g, " percent ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/--+/g, "-");
};

const toDescription = (categoryKey, bouquetName) => {
  const meta = categoryMeta[categoryKey] ?? {
    description: "Luxurious blooms crafted by Bexy atelier artisans."
  };
  return `${meta.description} ${bouquetName}.`;
};

const ensureDirectory = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

const allowedFolders = new Set(Object.keys(categoryMeta));

const collectImages = () => {
  const entries = [];

  const walk = (dir) => {
    const dirEntries = fs.readdirSync(dir, { withFileTypes: true });

    dirEntries.forEach((entry) => {
      const entryPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(entryPath);
      } else if (allowedExtensions.has(path.extname(entry.name))) {
        const relative = path.relative(rootDir, entryPath).replace(/\\/g, "/");
        const [folder] = relative.split("/");
        if (allowedFolders.size && !allowedFolders.has(folder)) {
          return;
        }
        entries.push(relative);
      }
    });
  };

  walk(rootDir);
  return entries;
};

const buildBouquetData = (files) => {
  const data = [];
  const perCategoryIndex = {};

  files.forEach((relativePath) => {
    const [categoryFolder] = relativePath.split("/");
    const rawCategoryKey = categoryFolder || "luxury";
    const categoryKey = slugify(rawCategoryKey) || "luxury";
    const meta = categoryMeta[rawCategoryKey] ?? {
      label: formatName(rawCategoryKey),
      description: "Haute couture blooms tailored for special moments.",
      basePrice: 199
    };

    if (!perCategoryIndex[categoryKey]) {
      perCategoryIndex[categoryKey] = 0;
    }

    const index = perCategoryIndex[categoryKey]++;
    
    // Use category-specific flower names
    const flowerName = generateFlowerName(rawCategoryKey, index);
    const priceVariation = (index % 3) * 20;
    const price = meta.basePrice + priceVariation;
    const imagePath = encodeURI(`/assets/${relativePath}`);

    data.push({
      id: `${categoryKey}-${index + 1}`,
      name: flowerName,
      price,
      image: imagePath,
      description: toDescription(rawCategoryKey, flowerName),
      category: categoryKey,
      displayCategory: meta.label,
      featured: index === 0
    });
  });

  return data;
};

const writeOutput = (bouquets) => {
  ensureDirectory(outputFile);

  const categoriesMap = new Map();
  bouquets.forEach((item) => {
    if (!categoriesMap.has(item.category)) {
      categoriesMap.set(item.category, {
        id: item.category,
        name: item.displayCategory,
        count: 0
      });
    }
    categoriesMap.get(item.category).count += 1;
  });

  const categoriesArray = [
    {
      id: "all",
      name: "All Collections",
      count: bouquets.length
    },
    ...Array.from(categoriesMap.values())
  ];

  const fileContent = `/* AUTO-GENERATED FILE - DO NOT EDIT MANUALLY */
import type { Bouquet } from "@/types/bouquet";

export const generatedBouquets: Bouquet[] = ${JSON.stringify(bouquets, null, 2)};

export const generatedCategories = ${JSON.stringify(categoriesArray, null, 2)};
`;

  fs.writeFileSync(outputFile, fileContent, "utf-8");
  console.log(
    `✅ Generated ${bouquets.length} bouquet entries across ${categoriesArray.length} categories.`
  );
};

const main = () => {
  if (!fs.existsSync(rootDir)) {
    console.error(`Assets directory not found at ${rootDir}`);
    process.exit(1);
  }

  const files = collectImages();
  if (!files.length) {
    console.warn("No image assets found to generate data.");
    return;
  }

  const bouquets = buildBouquetData(files);
  writeOutput(bouquets);
};

main();

