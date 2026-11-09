import { defaultTo } from 'lodash';
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
    dateFormat: defaultTo(buildDTO.dateFormat, 'DD MMM YYYY'),
  };
};
