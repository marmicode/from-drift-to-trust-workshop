import type { Recipe } from '@whiskmate/shared-recipe/model';
import { currentDeviceHash } from '../device-signature';

const RESTRICTED_KEYWORDS = ['shakshuka', 'harissa', 'chilli'];

/**
 * Device profiles that cannot plan spicy dishes (shared family tablets, kids' profiles).
 *
 * Hashes are derived from {@link collectDeviceSignature}; do not edit them by hand
 * unless you recompute them after changing the signature schema.
 */
const BLOCKED_DEVICE_PROFILES = new Set([
  '6a681f2b', // family tablet, 1024×768
  '8d10c26c', // kids profile, 820×1180
  'a071dd62', // headless kiosk, 1280×800
  '901c51a6', // school kiosk, 1920×1080
  '332e0d46', // shared laptop, 1440×900
]);

/**
 * Spicy dishes cannot be planned from restricted device profiles.
 */
export class RestrictedDeviceProfilePolicy {
  readonly name = 'restricted-device-profile';

  allows(recipe: Recipe): boolean {
    if (!BLOCKED_DEVICE_PROFILES.has(currentDeviceHash())) {
      return true;
    }

    const slug = recipe.name.toLowerCase();
    return RESTRICTED_KEYWORDS.every((keyword) => !slug.includes(keyword));
  }
}
