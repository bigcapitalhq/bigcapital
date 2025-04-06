import { defaultTo } from 'lodash';
import { IOrganizationBuildDTO } from './Organization.types';
import { BuildOrganizationDto } from './dtos/Organization.dto';

/**
 * Transformes build DTO object.
 * @param {IOrganizationBuildDTO} buildDTO
 * @returns {IOrganizationBuildDTO}
 */
export const transformBuildDto = (
  buildDTO: BuildOrganizationDto,
): BuildOrganizationDto => {
  return {
    ...buildDTO,
    dateFormat: defaultTo(buildDTO.dateFormat, 'DD MMM yyyy'),
  };
};
