import { Transformer } from '@/lib/Transformer/Transformer';
import Project from 'models/Project';
import { formatNumber } from 'utils';

export class ProjectTransformer extends Transformer {
  /**
   * Include these attributes to sale invoice object.
   * @returns {Array}
   */
  public includeAttributes = (): string[] => {
    return [
      'costEstimateFormatted',
      'deadlineFormatted',
      'contactDisplayName',
      'statusFormatted',
    ];
  };

  /**
   * Exclude these attributes.
   * @returns {string[]}
   */
  public excludeAttributes = (): string[] => {
    return ['contact'];
  };

  /**
   * Retrieves the formatted value of cost estimate.
   * @param {Project} project
   * @returns {string}
   */
  public costEstimateFormatted = (project: Project) => {
    return formatNumber(project.costEstimate, {
      currencyCode: this.context.organization.baseCurrency,
    });
  };

  /**
   * Retrieves the formatted value of the deadline date.
   * @param {Project} project
   * @returns {string}
   */
  public deadlineFormatted = (project: Project) => {
    return this.formatDate(project.deadline);
  };

  /**
   * Retrieves the contact display name.
   * @param {Project} project
   * @returns {string}
   */
  public contactDisplayName = (project: Project) => {
    return project.contact.displayName;
  };

  /**
   * Retrieves the formatted value of project's status.
   * @param {Project} project
   * @returns {string}
   */
  public statusFormatted = (project: Project) => {
    return project.status;
  };
}
