import { Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { BranchesSettingsService } from '../BranchesSettings';

@Injectable()
export class BranchTransactionDTOTransformer {
  constructor(private readonly branchesSettings: BranchesSettingsService) {}

  /**
   * Excludes DTO branch id when mutli-warehouses feature is inactive.
   * @returns {any}
   */
  private excludeDTOBranchIdWhenInactive = <T extends { branchId?: number }>(
    DTO: T,
  ): Omit<T, 'branchId'> | T => {
    const isActive = this.branchesSettings.isMultiBranchesActive();

    return !isActive ? omit(DTO, ['branchId']) : DTO;
  };

  /**
   * Transformes the input DTO for branches feature.
   * @param {T} DTO -
   * @returns {Omit<T, 'branchId'> | T}
   */
  public transformDTO = <T extends { branchId?: number }>(
    DTO: T,
  ): Omit<T, 'branchId'> | T => {
    return this.excludeDTOBranchIdWhenInactive<T>(DTO);
  };
}
