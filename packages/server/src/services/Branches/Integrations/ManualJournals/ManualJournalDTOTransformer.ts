import { omit } from 'lodash';
import { Inject, Service } from 'typedi';
import { IManualJournal } from '@/interfaces';
import { BranchesSettings } from '../../BranchesSettings';

@Service()
export class ManualJournalBranchesDTOTransformer {
  @Inject()
  branchesSettings: BranchesSettings;

  private excludeDTOBranchIdWhenInactive = (
    tenantId: number,
    DTO: IManualJournal
  ): IManualJournal => {
    const isActive = this.branchesSettings.isMultiBranchesActive(tenantId);

    if (isActive) return DTO;

    return {
      ...DTO,
      entries: DTO.entries.map((e) => omit(e, ['branchId'])),
    };
  };
  /**
   *
   */
  public transformDTO =
    (tenantId: number) =>
    (DTO: IManualJournal): IManualJournal => {
      return this.excludeDTOBranchIdWhenInactive(tenantId, DTO);
    };
}
