import { Service, Inject } from 'typedi';
import { omit } from 'lodash';
import { BranchesSettings } from '../BranchesSettings';

@Service()
export class BranchTransactionDTOTransform {
  @Inject()
  branchesSettings: BranchesSettings;

  /**
   * Excludes DTO branch id when multi-warehouses feature is inactive.
   * @param   {number} tenantId
   * @returns {any}
   */
  private excludeDTOBranchIdWhenInactive = <T extends { branchId?: number }>(
    tenantId: number,
    DTO: T
  ): Omit<T, 'branchId'> | T => {
    const isActive = this.branchesSettings.isMultiBranchesActive(tenantId);

    return !isActive ? omit(DTO, ['branchId']) : DTO;
  };

  /**
   * Transformes the input DTO for branches feature.
   * @param   {number} tenantId -
   * @param   {T}      DTO -
   * @returns {Omit<T, 'branchId'> | T}
   */
  public transformDTO =
    <T extends { branchId?: number }>(tenantId: number) =>
    (DTO: T): Omit<T, 'branchId'> | T => {
      return this.excludeDTOBranchIdWhenInactive<T>(tenantId, DTO);
    };
}
