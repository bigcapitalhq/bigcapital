import { extensionRegistry, type RegisteredSlot } from '../registry';
import type { ExtensionSlotName } from './slot.types';

/**
 * Retrieves the enabled contributions registered for a slot, ordered by
 * `order` and then `id`.
 */
export function getSlotContributions(
  name: ExtensionSlotName,
  enabledIds: ReadonlySet<string>,
): RegisteredSlot[] {
  return extensionRegistry
    .getSlots(enabledIds)
    .filter((slot) => slot.slot === name);
}
