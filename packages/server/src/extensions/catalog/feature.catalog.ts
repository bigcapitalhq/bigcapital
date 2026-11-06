import { extensionFeatureKey } from '@bigcapital/extension-sdk';
import type { FeatureDefinition } from '@bigcapital/extension-sdk';
import { ContributionCatalog } from './contribution.catalog';
import type { FeatureContribution } from '../extension.types';

export class FeatureCatalog extends ContributionCatalog<FeatureContribution> {
  registerForOwner(
    owner: string,
    definition: FeatureDefinition,
  ): FeatureContribution {
    return this.register({
      id: extensionFeatureKey(owner, definition.key),
      owner,
      key: definition.key,
      definition,
    });
  }
}
