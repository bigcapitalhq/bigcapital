import type { ApprovalPolicy } from '@bigcapital/extension-sdk/bridges';
import { ApprovalRegistry } from './approval.registry';

describe('ApprovalRegistry', () => {
  it('defaults to allow when no policy is registered', async () => {
    const registry = new ApprovalRegistry();
    const policy = registry.getActive();

    await expect(
      policy.evaluate({
        organizationId: 'org-1',
        entity: 'bill',
        action: 'publish',
        payload: {},
      }),
    ).resolves.toEqual({ type: 'allow' });
  });

  it('selects the configured provider key and falls back to the first policy', async () => {
    const registry = new ApprovalRegistry();
    const first: ApprovalPolicy = {
      key: 'first',
      evaluate: async () => ({ type: 'allow' }),
    };
    const second: ApprovalPolicy = {
      key: 'second',
      evaluate: async () => ({
        type: 'deny',
        reason: 'no',
      }),
    };

    registry.register('acme.approvals', first);
    registry.register('acme.approvals', second);

    expect(registry.getActive('ext:acme.approvals:second')).toBe(second);
    expect(registry.getActive()).toBe(first);
    expect(registry.getActive('missing')).toBe(first);
  });

  it('removes policies by owner', () => {
    const registry = new ApprovalRegistry();

    registry.register('acme.approvals', {
      key: 'first',
      evaluate: async () => ({ type: 'allow' }),
    });

    expect(registry.removeByOwner('acme.approvals')).toBe(1);
    expect(registry.getPolicies()).toHaveLength(0);
  });
});
