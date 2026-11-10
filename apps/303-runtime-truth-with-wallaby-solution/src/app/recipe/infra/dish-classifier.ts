/**
 * Dishes recognised by their signature ingredients,
 * so that the same dish gets the same id whatever its name.
 *
 * Each signature ingredient has a weight: the more typical of the dish,
 * the heavier.
 */
const CANONICAL_DISHES: CanonicalDish[] = [
  {
    id: 'baba-ganoush',
    signature: { aubergine: 3, tahini: 2, garlic: 1, lemon: 1 },
  },
  { id: 'baklava', signature: { filo: 3, pistachios: 2, honey: 2, butter: 1 } },
  {
    id: 'basbousa',
    signature: { semolina: 3, coconut: 2, syrup: 2, yogurt: 1 },
  },
  { id: 'borek', signature: { filo: 3, feta: 2, spinach: 1, eggs: 1 } },
  { id: 'cilbir', signature: { eggs: 3, yogurt: 3, chilli: 2, garlic: 1 } },
  {
    id: 'chicken-musakhan',
    signature: { chicken: 3, sumac: 3, onions: 2, flatbread: 2 },
  },
  {
    id: 'chicken-tagine',
    signature: { chicken: 3, 'preserved lemon': 3, olives: 2, ginger: 1 },
  },
  {
    id: 'dolma',
    signature: { 'vine leaves': 3, rice: 2, dill: 1, lemon: 1 },
  },
  {
    id: 'falafel',
    signature: { chickpeas: 3, parsley: 2, coriander: 1, cumin: 1 },
  },
  {
    id: 'fattoush',
    signature: { flatbread: 3, sumac: 2, cucumber: 2, radish: 1 },
  },
  {
    id: 'fatteh',
    signature: { chickpeas: 2, yogurt: 2, flatbread: 2, 'pine nuts': 1 },
  },
  { id: 'freekeh-pilaf', signature: { freekeh: 3, onions: 1, stock: 1 } },
  {
    id: 'ful-medames',
    signature: { 'fava beans': 3, cumin: 1, garlic: 1, lemon: 1 },
  },
  {
    id: 'harira',
    signature: { lentils: 2, chickpeas: 2, tomatoes: 1, coriander: 1 },
  },
  {
    id: 'hummus',
    signature: { chickpeas: 3, tahini: 3, lemon: 1, garlic: 1 },
  },
  {
    id: 'imam-bayildi',
    signature: { aubergine: 3, tomatoes: 2, onions: 2, garlic: 1 },
  },
  {
    id: 'kibbeh',
    signature: { bulgur: 3, lamb: 3, onions: 1, allspice: 1 },
  },
  { id: 'kofte', signature: { lamb: 3, onions: 1, cumin: 1, parsley: 1 } },
  {
    id: 'kushari',
    signature: { lentils: 2, rice: 2, macaroni: 2, onions: 1 },
  },
  {
    id: 'labneh',
    signature: { yogurt: 3, salt: 1, 'olive oil': 1, zaatar: 1 },
  },
  {
    id: 'lahmacun',
    signature: { flatbread: 2, lamb: 3, peppers: 1, tomatoes: 1 },
  },
  {
    id: 'maqluba',
    signature: { rice: 2, aubergine: 2, cauliflower: 2, chicken: 1 },
  },
  {
    id: 'mansaf',
    signature: { lamb: 3, jameed: 3, rice: 2, almonds: 1 },
  },
  { id: 'menemen', signature: { eggs: 3, peppers: 2, onions: 2, butter: 1 } },
  {
    id: 'muhammara',
    signature: { peppers: 3, walnuts: 3, pomegranate: 1, breadcrumbs: 1 },
  },
  {
    id: 'mujadara',
    signature: { lentils: 3, rice: 2, onions: 2, cumin: 1 },
  },
  { id: 'msakhan', signature: { chicken: 2, sumac: 2, onions: 2 } },
  {
    id: 'pastilla',
    signature: { filo: 2, chicken: 2, almonds: 2, cinnamon: 1 },
  },
  {
    id: 'sabich',
    signature: { aubergine: 2, eggs: 2, flatbread: 2, tahini: 1 },
  },
  {
    id: 'shakshuka',
    signature: { eggs: 3, tomatoes: 2, peppers: 2, cumin: 1, paprika: 1 },
  },
  {
    id: 'shawarma',
    signature: { chicken: 2, garlic: 2, flatbread: 2, pickles: 1 },
  },
  {
    id: 'spanakopita',
    signature: { spinach: 3, feta: 3, filo: 2, dill: 1 },
  },
  {
    id: 'stuffed-peppers',
    signature: { peppers: 3, rice: 2, lamb: 1, tomatoes: 1 },
  },
  {
    id: 'tabbouleh',
    signature: { bulgur: 3, parsley: 3, mint: 1, tomatoes: 1 },
  },
  {
    id: 'tagine',
    signature: { lamb: 3, apricots: 2, cinnamon: 1, almonds: 1 },
  },
  {
    id: 'umm-ali',
    signature: { pastry: 2, milk: 2, nuts: 1, raisins: 1 },
  },
  {
    id: 'zaalouk',
    signature: { aubergine: 3, tomatoes: 3, paprika: 1, cumin: 1 },
  },
];

/**
 * Share of the signature weight an entry must cover to be recognised.
 */
const MATCH_THRESHOLD = 0.6;

export function findCanonicalDishId(
  ingredients: readonly string[],
): string | undefined {
  const names = ingredients.map((name) => name.trim().toLowerCase());

  let bestMatch: { id: string; score: number } | undefined;

  for (const dish of CANONICAL_DISHES) {
    const score = scoreDish(dish, names);
    if (score >= MATCH_THRESHOLD && score > (bestMatch?.score ?? 0)) {
      bestMatch = { id: dish.id, score };
    }
  }

  return bestMatch?.id;
}

function scoreDish(dish: CanonicalDish, names: readonly string[]): number {
  const weights = Object.entries(dish.signature);
  const totalWeight = weights.reduce((total, [, weight]) => total + weight, 0);
  const matchedWeight = weights
    .filter(([keyword]) => names.some((name) => name.includes(keyword)))
    .reduce((total, [, weight]) => total + weight, 0);

  return matchedWeight / totalWeight;
}

interface CanonicalDish {
  id: string;
  signature: Record<string, number>;
}
