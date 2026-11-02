import { SetMetadata } from '@nestjs/common';

export const EXTENSION_HOST_CONTROLLER_KEY =
  'bigcapital:extension-host-controller';

/**
 * Marks a core controller mounted under `/ext/...` that serves multiple
 * extensions (for example, the generic report runner).
 *
 * Extension-owned controllers must use `@ExtensionController(...)` instead.
 */
export const ExtensionHostController = () =>
  SetMetadata(EXTENSION_HOST_CONTROLLER_KEY, true);
