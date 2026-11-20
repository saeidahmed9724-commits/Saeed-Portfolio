import test from "node:test";
import assert from "node:assert/strict";
import {
  slugify,
  getCategoryLabel,
  validateImageMeta,
  sanitizeStorageFilename,
  validateContactInput,
  filterWorksByCategory,
  sortWorks,
  getAdjacentWorksFromList,
  parseToolsList,
  swapWorkOrder,
} from "./portfolioLogic";

test("slugify normalizes titles cleanly", () => {
  assert.equal(
    slugify("Brazilian Haircare Launch Carousel!"),
    "brazilian-haircare-launch-carousel"
  );
  assert.equal(slugify("  Q4   Meta -- Ad Pack  "), "q4-meta-ad-pack");
  assert.equal(slugify("@@@"), "");
});

test("getCategoryLabel returns human-readable labels", () => {
  assert.equal(getCategoryLabel("carousels"), "Carousels");
  assert.equal(getCategoryLabel("ad-creatives"), "Ad Creatives");
  assert.equal(getCategoryLabel("brand-content"), "Brand Content");
});

test("validateImageMeta rejects unsupported types and oversized files", () => {
  assert.equal(
    validateImageMeta({ name: "slide.png", type: "image/png", size: 2048 }),
    null
  );
  assert.match(
    validateImageMeta({
      name: "doc.pdf",
      type: "application/pdf",
      size: 1024,
    }) ?? "",
    /unsupported format/i
  );
  assert.match(
    validateImageMeta({
      name: "huge.jpg",
      type: "image/jpeg",
      size: 11 * 1024 * 1024,
    }) ?? "",
    /exceeds the 10MB limit/i
  );
});

test("sanitizeStorageFilename strips unsafe characters", () => {
  assert.equal(
    sanitizeStorageFilename("Hero Slide #1 (Final).PNG", "abc123"),
    "abc123-hero-slide-1-final.png"
  );
});

test("validateContactInput validates required fields and returns sanitized values", () => {
  const invalid = validateContactInput({
    name: "A",
    email: "not-an-email",
    message: "Short",
  });
  assert.equal(invalid.valid, false);
  assert.ok(invalid.errors.name);
  assert.ok(invalid.errors.email);
  assert.ok(invalid.errors.message);

  const valid = validateContactInput({
    name: "  Camila Ferreira ",
    email: " camila@botanicabrasil.com ",
    message: "We need an 8-slide launch carousel for next month.",
  });
  assert.equal(valid.valid, true);
  assert.deepEqual(valid.sanitized, {
    name: "Camila Ferreira",
    email: "camila@botanicabrasil.com",
    message: "We need an 8-slide launch carousel for next month.",
  });
});

test("filterWorksByCategory filters accurately", () => {
  const works = [
    { id: "1", category: "carousels" as const },
    { id: "2", category: "ad-creatives" as const },
    { id: "3", category: "brand-content" as const },
  ];
  assert.equal(filterWorksByCategory(works, "all").length, 3);
  assert.deepEqual(
    filterWorksByCategory(works, "ad-creatives").map((w) => w.id),
    ["2"]
  );
});

test("sortWorks orders by sort_order asc then created_at desc", () => {
  const sorted = sortWorks([
    { id: "a", sort_order: 2, created_at: "2026-01-01T00:00:00Z" },
    { id: "b", sort_order: 1, created_at: "2025-12-01T00:00:00Z" },
    { id: "c", sort_order: 1, created_at: "2026-02-01T00:00:00Z" },
  ]);
  assert.deepEqual(
    sorted.map((item) => item.id),
    ["c", "b", "a"]
  );
});

test("getAdjacentWorksFromList wraps around cleanly", () => {
  const list = [{ slug: "first" }, { slug: "second" }, { slug: "third" }];
  assert.deepEqual(getAdjacentWorksFromList(list, "first"), {
    previous: { slug: "third" },
    next: { slug: "second" },
  });
  assert.deepEqual(getAdjacentWorksFromList(list, "third"), {
    previous: { slug: "second" },
    next: { slug: "first" },
  });
  assert.deepEqual(getAdjacentWorksFromList([{ slug: "only" }], "only"), {
    previous: null,
    next: null,
  });
});

test("parseToolsList trims and drops blanks", () => {
  assert.deepEqual(parseToolsList(" Photoshop,  Figma , , Illustrator "), [
    "Photoshop",
    "Figma",
    "Illustrator",
  ]);
});

test("swapWorkOrder swaps sort orders and rejects out-of-bounds moves", () => {
  const items = [
    { id: "1", sort_order: 1 },
    { id: "2", sort_order: 2 },
    { id: "3", sort_order: 3 },
  ];
  assert.equal(swapWorkOrder(items, 0, -1), null);
  assert.equal(swapWorkOrder(items, 2, 1), null);

  const result = swapWorkOrder(items, 0, 1);
  assert.ok(result);
  assert.deepEqual(
    result.updated.map((w) => [w.id, w.sort_order]),
    [
      ["2", 1],
      ["1", 2],
      ["3", 3],
    ]
  );
});
