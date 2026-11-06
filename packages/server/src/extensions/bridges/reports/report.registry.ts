import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  ReportContext,
  ReportDefinition,
  ReportProvider,
  ReportResult,
} from '@bigcapital/extension-sdk/bridges';
import {
  BridgeRegistry,
  type RegisteredBridgeProvider,
} from '../bridge.registry';

export interface RegisteredReport {
  /**
   * Namespaced report id used by the host and webapp:
   * `ext:<extensionId>:<providerKey>:<reportId>`
   */
  id: string;
  localId: string;
  extensionId: string;
  providerKey: string;
  definition: ReportDefinition;
  provider: ReportProvider;
}

@Injectable()
export class ReportRegistry {
  private readonly registry = new BridgeRegistry<ReportProvider>();

  register(owner: string, provider: ReportProvider) {
    return this.registry.register(owner, provider);
  }

  getProviders(): ReportProvider[] {
    return this.registry.getAll();
  }

  getProviderEntries(): RegisteredBridgeProvider<ReportProvider>[] {
    return this.registry.getEntries();
  }

  /**
   * Flattens every provider's report definitions into namespaced report ids.
   */
  listReports(): RegisteredReport[] {
    return this.registry.getEntries().flatMap((entry) =>
      entry.provider.list().map((definition) => ({
        id: `${entry.key}:${definition.id}`,
        localId: definition.id,
        extensionId: entry.owner,
        providerKey: entry.key,
        definition,
        provider: entry.provider,
      })),
    );
  }

  async run(reportId: string, context: ReportContext): Promise<ReportResult> {
    const report = this.listReports().find(
      (candidate) => candidate.id === reportId,
    );

    if (!report) {
      throw new NotFoundException(
        `Extension report "${reportId}" was not found.`,
      );
    }

    return report.provider.run(report.localId, context);
  }

  removeByOwner(owner: string): number {
    return this.registry.removeByOwner(owner);
  }

  clear(): void {
    this.registry.clear();
  }
}
