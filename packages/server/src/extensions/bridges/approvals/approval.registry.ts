import { Injectable } from '@nestjs/common';
import type {
  ApprovalContext,
  ApprovalDecision,
  ApprovalPolicy,
} from '@bigcapital/extension-sdk/bridges';
import {
  BridgeRegistry,
  type RegisteredBridgeProvider,
} from '../bridge.registry';

/**
 * Default policy keeps current behavior: no approvals required.
 */
const ALLOW_ALL_POLICY: ApprovalPolicy = {
  key: 'allow',
  evaluate: async (_context: ApprovalContext): Promise<ApprovalDecision> => ({
    type: 'allow',
  }),
};

@Injectable()
export class ApprovalRegistry {
  private readonly registry = new BridgeRegistry<ApprovalPolicy>();

  register(owner: string, policy: ApprovalPolicy) {
    return this.registry.register(owner, policy);
  }

  getPolicies(): RegisteredBridgeProvider<ApprovalPolicy>[] {
    return this.registry.getEntries();
  }

  /**
   * Resolves the active policy for a tenant.
   *
   * `activeKey` is a namespaced provider key from tenant settings. When it is
   * not configured or missing, the first registered policy is used, falling
   * back to the core allow-all policy.
   */
  getActive(activeKey?: string): ApprovalPolicy {
    if (activeKey) {
      const policy = this.registry.get(activeKey);

      if (policy) {
        return policy;
      }
    }

    const first = this.registry.getEntries()[0];
    return first?.provider ?? ALLOW_ALL_POLICY;
  }

  removeByOwner(owner: string): number {
    return this.registry.removeByOwner(owner);
  }

  clear(): void {
    this.registry.clear();
  }
}
