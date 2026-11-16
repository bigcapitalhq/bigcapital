import { SetMetadata } from '@nestjs/common';

export const SKIP_SERIALIZE = 'SKIP_SERIALIZE';

/**
 * Skips the global camelCase <-> snake_case serialization for a route or
 * controller.
 *
 * The AI assistant endpoints speak the AI SDK UI message protocol, whose
 * message parts (toolCallId, providerMetadata, etc.) must keep their exact
 * camelCase shape. Applying the global serializer to those payloads would
 * corrupt tool parts and break conversation hydration.
 */
export const SkipSerialize = () => SetMetadata(SKIP_SERIALIZE, true);
