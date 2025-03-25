import { defaultTo } from 'lodash';
import { IOrganizationBuildDTO } from './Organization.types';

/**
 * Transformes build DTO object.
 * @param {IOrganizationBuildDTO} buildDTO
 * @returns {IOrganizationBuildDTO}
 */
export const transformBuildDto = (
  buildDTO: IOrganizationBuildDTO,
): IOrganizationBuildDTO => {
  return {
    ...buildDTO,
    dateFormat: defaultTo(buildDTO.dateFormat, 'DD MMM yyyy'),
  };
};
