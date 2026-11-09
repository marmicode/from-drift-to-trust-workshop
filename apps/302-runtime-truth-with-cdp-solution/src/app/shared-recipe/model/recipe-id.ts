/**
 * Short, URL-friendly id derived from the recipe name.
 */
export function createRecipeId(name: string): string {
  return `rec_${hashName(slugify(name)).slice(0, RECIPE_ID_LENGTH)}`;
}

const RECIPE_ID_LENGTH = 4;

function hashName(name: string): string {
  let hash = 2_166_136_261;

  for (let index = 0; index < name.length; index++) {
    hash ^= name.charCodeAt(index);
    hash = Math.imul(hash, 16_777_619);
  }

  return (hash >>> 0).toString(16).padStart(8, '0');
}

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
