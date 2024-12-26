import { Inject, Injectable } from '@nestjs/common';
import { omit } from 'lodash';
import { BranchesSettingsService } from '../../BranchesSettings';
import { IManualJournalDTO } from '@/modules/ManualJournals/types/ManualJournals.types';

@Injectable()
export class ManualJournalBranchesDTOTransformer {
  constructor(
    @Inject()
    private readonly branchesSettings: BranchesSettingsService,
  ) {}

  /**
   * 
   * @param DTO 
   * @returns 
   */
  private excludeDTOBranchIdWhenInactive = (
    DTO: IManualJournalDTO,
  ): IManualJournalDTO => {
    const isActive = this.branchesSettings.isMultiBranchesActive();

    if (isActive) return DTO;

    return {
      ...DTO,
      entries: DTO.entries.map((e) => omit(e, ['branchId'])),
    };
  };

  /**
   * 
   */
  public transformDTO = (DTO: IManualJournalDTO): IManualJournalDTO => {
      return this.excludeDTOBranchIdWhenInactive(DTO);
    };
}
