import { extensionFeatureKey } from '@bigcapital/extension-sdk';
import type { SettingDefinition } from '@bigcapital/extension-sdk';
import { ContributionCatalog } from './contribution.catalog';
import type { SettingContribution } from '../extension.types';

export class SettingCatalog extends ContributionCatalog<SettingContribution> {
  registerForOwner(
    owner: string,
    definition: SettingDefinition,
  ): SettingContribution {
    return this.register({
      id: extensionFeatureKey(owner, definition.key),
      owner,
      key: definition.key,
      definition,
    });
  }
}
