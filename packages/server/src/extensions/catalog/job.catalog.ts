import { extensionJobName } from '@bigcapital/extension-sdk';
import type { ExtensionJobDefinition } from '@bigcapital/extension-sdk/server';
import { ContributionCatalog } from './contribution.catalog';
import type { JobContribution } from '../extension.types';

export class JobCatalog extends ContributionCatalog<JobContribution> {
  registerForOwner(
    owner: string,
    definition: ExtensionJobDefinition,
  ): JobContribution {
    return this.register({
      id: extensionJobName(owner, definition.name),
      owner,
      name: definition.name,
      definition,
    });
  }
}
