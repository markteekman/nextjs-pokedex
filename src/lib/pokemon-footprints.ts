// These IDs have fully transparent placeholders in the bundled 1–649 assets.
// Update this availability metadata when replacing or extending that asset set.
const POKEMON_WITHOUT_FOOTPRINTS = new Set([
  11, 14, 23, 24, 41, 50, 51, 70, 71, 72, 73, 74, 86, 87, 88, 89, 90, 91, 92,
  93, 95, 100, 101, 102, 109, 110, 116, 117, 118, 119, 124, 129, 130, 131, 132,
  147, 148, 169, 170, 171, 182, 191, 200, 201, 204, 205, 206, 208, 211, 218,
  219, 223, 226, 230, 247, 266, 268, 284, 316, 317, 318, 319, 320, 321, 325,
  336, 337, 338, 339, 340, 347, 349, 350, 351, 353, 355, 358, 362, 363, 364,
  365, 366, 367, 368, 369, 370, 384, 412, 413, 415, 416, 425, 426, 429, 436,
  437, 442, 455, 456, 457, 458, 462, 477, 478, 479, 488, 489, 490, 497, 527,
  535, 541, 544, 546, 548, 550, 561, 562, 563, 564, 577, 578, 579, 582, 583,
  584, 589, 590, 591, 592, 593, 594, 597, 599, 600, 601, 602, 603, 604, 607,
  608, 609, 615, 617, 618, 635, 637, 641, 642, 645,
]);

export function getPokemonFootprintUrl(id: number): string | null {
  if (id < 1 || id > 649 || POKEMON_WITHOUT_FOOTPRINTS.has(id)) return null;
  return `/footprint-assets/${id}.png`;
}
