import { extensionSubject } from '@bigcapital/extension-sdk';
import type { AbilityDefinition } from '@bigcapital/extension-sdk';
import { ContributionCatalog } from './contribution.catalog';
import type { AbilityContribution } from '../extension.types';

export class AbilityCatalog extends ContributionCatalog<AbilityContribution> {
  registerForOwner(
    owner: string,
    definition: AbilityDefinition,
  ): AbilityContribution {
    return this.register({
      id: extensionSubject(owner, definition.subject),
      owner,
      subject: definition.subject,
      definition,
    });
  }
}
