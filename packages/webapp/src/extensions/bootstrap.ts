import { webExtensions } from './generated/plugins.generated';
import { extensionRegistry } from './registry';

/**
 * Registers every extension compiled into the webapp bundle.
 *
 * Imported for its side effect once from `src/index.tsx` before React renders.
 */
extensionRegistry.registerAll(webExtensions);

export { extensionRegistry };
