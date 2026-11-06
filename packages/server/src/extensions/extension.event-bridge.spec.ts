import { parseExtensionManifest } from '@bigcapital/extension-sdk/manifest';
import { ExtensionEventBridge } from './extension.event-bridge';
import { ExtensionContributionRegistry } from './extension.registry';

type TestHandler = (payload: unknown) => void | Promise<void>;

class FakeEventEmitter {
  private readonly handlers = new Map<string, TestHandler[]>();

  on(event: string, handler: TestHandler): void {
    const handlers = this.handlers.get(event) ?? [];
    handlers.push(handler);
    this.handlers.set(event, handlers);
  }

  off(event: string, handler: TestHandler): void {
    const handlers = this.handlers.get(event) ?? [];
    this.handlers.set(
      event,
      handlers.filter((item) => item !== handler),
    );
  }

  async emitAsync(event: string, payload: unknown): Promise<void> {
    const handlers = this.handlers.get(event) ?? [];

    for (const handler of handlers) {
      await handler(payload);
    }
  }

  getHandlerCount(event: string): number {
    return (this.handlers.get(event) ?? []).length;
  }
}

const buildRegistry = () => {
  const registry = new ExtensionContributionRegistry();
  registry.registerManifest(
    parseExtensionManifest({
      id: 'acme.reports',
      name: 'Acme Reports',
      version: '1.0.0',
      trust: 'partner',
      capabilities: ['events.subscribe'],
    }),
  );

  return registry;
};

const buildBridge = (
  registry: ExtensionContributionRegistry,
  options: {
    enabled?: boolean;
    organizationId?: string | null;
  } = {},
) => {
  const enabled = options.enabled ?? true;
  const organizationId =
    options.organizationId === null
      ? undefined
      : (options.organizationId ?? 'org-1');

  const emitter = new FakeEventEmitter();
  const manager = {
    isEnabled: jest.fn().mockResolvedValue(enabled),
  };
  const cls = {
    get: jest.fn().mockReturnValue(organizationId),
  };

  const bridge = new ExtensionEventBridge(
    emitter as any,
    registry,
    manager as any,
    cls as any,
    {},
  );

  return { bridge, emitter, manager };
};

describe('ExtensionEventBridge', () => {
  it('invokes enabled extension handlers', async () => {
    const registry = buildRegistry();
    const handler = jest.fn().mockResolvedValue(undefined);
    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      handler,
    );

    const { bridge, emitter } = buildBridge(registry);
    bridge.wire();

    await emitter.emitAsync('onSaleInvoiceCreated', { id: 1 });

    expect(handler).toHaveBeenCalledWith({ id: 1 });
  });

  it('skips handlers when the extension is disabled for the tenant', async () => {
    const registry = buildRegistry();
    const handler = jest.fn().mockResolvedValue(undefined);
    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      handler,
    );

    const { bridge, emitter, manager } = buildBridge(registry, {
      enabled: false,
    });
    bridge.wire();

    await emitter.emitAsync('onSaleInvoiceCreated', { id: 1 });

    expect(manager.isEnabled).toHaveBeenCalledWith('acme.reports', 'org-1');
    expect(handler).not.toHaveBeenCalled();
  });

  it('runs handlers for system events without a tenant context', async () => {
    const registry = buildRegistry();
    const handler = jest.fn().mockResolvedValue(undefined);
    registry.registerEventSubscriber(
      'acme.reports',
      'onOrganizationBuilt',
      handler,
    );

    const { bridge, emitter, manager } = buildBridge(registry, {
      enabled: false,
      organizationId: null,
    });
    bridge.wire();

    await emitter.emitAsync('onOrganizationBuilt', { id: 1 });

    expect(manager.isEnabled).not.toHaveBeenCalled();
    expect(handler).toHaveBeenCalled();
  });

  it('isolates handler errors from the emitter', async () => {
    const registry = buildRegistry();
    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      async () => {
        throw new Error('handler failed');
      },
    );

    const { bridge, emitter } = buildBridge(registry);
    bridge.wire();

    await expect(
      emitter.emitAsync('onSaleInvoiceCreated', { id: 1 }),
    ).resolves.toBeUndefined();
  });

  it('wires subscribers registered after the first wire call', async () => {
    const registry = buildRegistry();
    const firstHandler = jest.fn().mockResolvedValue(undefined);
    const secondHandler = jest.fn().mockResolvedValue(undefined);

    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      firstHandler,
    );

    const { bridge, emitter } = buildBridge(registry);
    bridge.wire();

    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      secondHandler,
    );
    bridge.wire();

    await emitter.emitAsync('onSaleInvoiceCreated', { id: 1 });

    expect(firstHandler).toHaveBeenCalledTimes(1);
    expect(secondHandler).toHaveBeenCalledTimes(1);
  });

  it('unwires subscribers on dispose', async () => {
    const registry = buildRegistry();
    registry.registerEventSubscriber(
      'acme.reports',
      'onSaleInvoiceCreated',
      async () => {},
    );

    const { bridge, emitter } = buildBridge(registry);
    bridge.wire();

    expect(emitter.getHandlerCount('onSaleInvoiceCreated')).toBe(1);

    bridge.dispose();

    expect(emitter.getHandlerCount('onSaleInvoiceCreated')).toBe(0);
  });
});
