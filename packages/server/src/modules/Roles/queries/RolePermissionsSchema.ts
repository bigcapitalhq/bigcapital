import { AbilitySchema } from '../AbilitySchema';
import { Injectable, Optional } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { cloneDeep } from 'lodash';
import { ISubjectAbilitiesSchema } from '../Roles.types';
import { ExtensionContributionRegistry } from '@/extensions/extension.registry';

@Injectable()
export class RolePermissionsSchema {
  constructor(
    private readonly i18nService: I18nService,

    @Optional()
    private readonly extensionRegistry?: ExtensionContributionRegistry,
  ) {}

  /**
   * Retrieve the role permissions schema with translated labels.
   *
   * Core subjects are translated through i18n. Extension subjects use the
   * literal labels declared in their manifests and are namespaced with
   * `ext:<extensionId>:<subject>`.
   *
   * @returns {ISubjectAbilitiesSchema[]}
   */
  getRolePermissionsSchema(): ISubjectAbilitiesSchema[] {
    // Clone the schema to avoid modifying the original
    const coreSchema = cloneDeep(AbilitySchema);

    // Apply translations to each core subject and its abilities
    const translatedCoreSchema = coreSchema.map(
      (subject: ISubjectAbilitiesSchema) => {
        // Translate subject label
        subject.subjectLabel = this.i18nService.t(subject.subjectLabel);

        // Translate abilities labels
        if (subject.abilities) {
          subject.abilities = subject.abilities.map((ability) => ({
            ...ability,
            label: this.i18nService.t(ability.label),
          }));
        }
        // Translate extra abilities labels if they exist
        if (subject.extraAbilities) {
          subject.extraAbilities = subject.extraAbilities.map((ability) => ({
            ...ability,
            label: this.i18nService.t(ability.label),
          }));
        }

        return subject;
      },
    );

    return [...translatedCoreSchema, ...this.getExtensionAbilitySchema()];
  }

  /**
   * Builds the extension ability schema from the contribution registry.
   */
  private getExtensionAbilitySchema(): ISubjectAbilitiesSchema[] {
    return (this.extensionRegistry?.getAbilities() ?? []).map(
      (contribution) => ({
        subject: contribution.id,
        subjectLabel: contribution.definition.subjectLabel,
        description: contribution.definition.description,
        abilities: contribution.definition.abilities,
        extraAbilities: contribution.definition.extraAbilities,
      }),
    );
  }
}
