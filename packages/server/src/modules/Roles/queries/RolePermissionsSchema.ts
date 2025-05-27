import { AbilitySchema } from '../AbilitySchema';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { cloneDeep } from 'lodash';
import { ISubjectAbilitiesSchema } from '../Roles.types';

@Injectable()
export class RolePermissionsSchema {
  constructor(private readonly i18nService: I18nService) {}

  /**
   * Retrieve the role permissions schema with translated labels.
   * @returns {ISubjectAbilitiesSchema[]}
   */
  getRolePermissionsSchema(): ISubjectAbilitiesSchema[] {
    // Clone the schema to avoid modifying the original
    const schema = cloneDeep(AbilitySchema);

    // Apply translations to each subject and its abilities
    return schema.map((subject: ISubjectAbilitiesSchema) => {
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
    });
  }
}
