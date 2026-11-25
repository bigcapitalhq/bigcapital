import { AbilitySchema } from '../AbilitySchema';
import { Injectable } from '@nestjs/common';
import { I18nService } from 'nestjs-i18n';
import { cloneDeep } from 'lodash';
import { ISubjectAbilitiesSchema } from '../Roles.types';
import { FeaturesManager } from '@/modules/Features/FeaturesManager';

@Injectable()
export class RolePermissionsSchema {
  constructor(
    private readonly i18nService: I18nService,
    private readonly featuresManager: FeaturesManager,
  ) {}

  /**
   * Collects the feature flags referenced by the given subjects and abilities.
   * @param {ISubjectAbilitiesSchema[]} schema
   * @returns {string[]}
   */
  private collectFeatureNames(schema: ISubjectAbilitiesSchema[]): string[] {
    const featureNames = schema.flatMap((subject) => {
      const abilities = [
        ...(subject.abilities || []),
        ...(subject.extraAbilities || []),
      ];
      return [subject.feature, ...abilities.map((ability) => ability.feature)];
    });
    return [
      ...new Set(
        featureNames.filter((feature): feature is string => !!feature),
      ),
    ];
  }

  /**
   * Retrieve the role permissions schema with translated labels.
   * @returns {Promise<ISubjectAbilitiesSchema[]>}
   */
  async getRolePermissionsSchema(): Promise<ISubjectAbilitiesSchema[]> {
    // Clone the schema to avoid modifying the original
    const schema = cloneDeep(AbilitySchema);

    // Retrieve the accessibility of the features referenced by the schema.
    const featuresAccessibility: Record<string, boolean> = {};
    const features = this.collectFeatureNames(schema);

    await Promise.all(
      features.map(async (feature) => {
        featuresAccessibility[feature] = Boolean(
          await this.featuresManager.accessible(feature),
        );
      }),
    );

    const isFeatureAccessible = (feature?: string) =>
      !feature || featuresAccessibility[feature] === true;

    return schema
      .filter((subject) => isFeatureAccessible(subject.feature))
      .map((subject: ISubjectAbilitiesSchema) => {
        // Translate subject label
        subject.subjectLabel = this.i18nService.t(subject.subjectLabel);

        // Translate abilities labels
        if (subject.abilities) {
          subject.abilities = subject.abilities
            .filter((ability) => isFeatureAccessible(ability.feature))
            .map((ability) => ({
              ...ability,
              label: this.i18nService.t(ability.label),
            }));
        }
        // Translate extra abilities labels if they exist
        if (subject.extraAbilities) {
          subject.extraAbilities = subject.extraAbilities
            .filter((ability) => isFeatureAccessible(ability.feature))
            .map((ability) => ({
              ...ability,
              label: this.i18nService.t(ability.label),
            }));
        }

        return subject;
      });
  }
}
