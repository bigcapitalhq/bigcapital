/**
 * Core event names are the string constants exported by
 * `packages/server/src/common/events/events.ts`.
 *
 * The SDK intentionally types these as strings for now. A generated, typed
 * catalog can replace this in a later phase without breaking subscribers.
 */
export type CoreEventName = string;

/**
 * Events emitted by an extension must be namespaced:
 *
 *   ext:<extensionId>:<event>
 */
export type ExtensionEventName = `ext:${string}:${string}`;

export type ExtensionEventHandler<T = unknown> = (
  payload: T,
) => void | Promise<void>;

export interface ExtensionEventSubscriptionOptions {
  /**
   * Phase 1 only supports observation. Intercept hooks (pre-operation,
   * mutation, veto) are a later, trusted-only feature.
   */
  phase?: 'after';

  /**
   * Maximum time the host waits for the handler before logging a timeout.
   * Defaults to 5000ms.
   */
  timeoutMs?: number;
}

export interface ExtensionEventSubscription {
  dispose(): void;
}

export interface ExtensionEventBus {
  /**
   * Subscribe to a core event or to an extension-namespaced event.
   */
  on<T = unknown>(
    event: CoreEventName | ExtensionEventName,
    handler: ExtensionEventHandler<T>,
    options?: ExtensionEventSubscriptionOptions,
  ): ExtensionEventSubscription;

  /**
   * Emit an extension-namespaced event. Core event names are rejected.
   */
  emit<T = unknown>(event: ExtensionEventName, payload: T): Promise<void>;
}

export const EXTENSION_EVENT_NAME_PATTERN =
  /^ext:[a-z0-9][a-z0-9._-]*:[a-z0-9][a-z0-9._-]*$/;

/**
 * Determines whether the given event name is a valid extension event name.
 */
export function isExtensionEventName(
  event: string,
): event is ExtensionEventName {
  return EXTENSION_EVENT_NAME_PATTERN.test(event);
}
