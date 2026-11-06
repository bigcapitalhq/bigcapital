import { Injectable } from '@nestjs/common';
import { GetBankReconciliationsQueryDto } from './dtos/GetBankReconciliationsQuery.dto';
import { CreateBankReconciliationDto } from './dtos/CreateBankReconciliation.dto';
import { UpdateBankReconciliationDto } from './dtos/UpdateBankReconciliation.dto';
import { FinishBankReconciliationDto } from './dtos/FinishBankReconciliation.dto';
import { UndoBankReconciliationDto } from './dtos/UndoBankReconciliation.dto';
import { GetBankReconciliationsService } from './queries/GetBankReconciliations.service';
import { GetBankReconciliationService } from './queries/GetBankReconciliation.service';
import { CreateBankReconciliationService } from './commands/CreateBankReconciliation.service';
import { UpdateBankReconciliationService } from './commands/UpdateBankReconciliation.service';
import { FinishBankReconciliationService } from './commands/FinishBankReconciliation.service';
import { UndoBankReconciliationService } from './commands/UndoBankReconciliation.service';
import { DeleteBankReconciliationService } from './commands/DeleteBankReconciliation.service';

@Injectable()
export class BankingReconciliationApplication {
  constructor(
    private readonly getBankReconciliationsService: GetBankReconciliationsService,
    private readonly getBankReconciliationService: GetBankReconciliationService,
    private readonly createBankReconciliationService: CreateBankReconciliationService,
    private readonly updateBankReconciliationService: UpdateBankReconciliationService,
    private readonly finishBankReconciliationService: FinishBankReconciliationService,
    private readonly undoBankReconciliationService: UndoBankReconciliationService,
    private readonly deleteBankReconciliationService: DeleteBankReconciliationService,
  ) {}

  /**
   * Retrieves the reconciliations of the given bank account.
   */
  public getBankReconciliations(query: GetBankReconciliationsQueryDto) {
    return this.getBankReconciliationsService.getBankReconciliations(query);
  }

  /**
   * Retrieves the given reconciliation detail.
   */
  public getBankReconciliation(reconciliationId: number) {
    return this.getBankReconciliationService.getBankReconciliation(
      reconciliationId,
    );
  }

  /**
   * Creates a new reconciliation draft.
   */
  public async createBankReconciliation(
    reconciliationDTO: CreateBankReconciliationDto,
  ) {
    const reconciliation =
      await this.createBankReconciliationService.createBankReconciliation(
        reconciliationDTO,
      );

    return this.getBankReconciliationService.getBankReconciliation(
      reconciliation.id,
    );
  }

  /**
   * Updates the given reconciliation draft.
   */
  public async updateBankReconciliation(
    reconciliationId: number,
    reconciliationDTO: UpdateBankReconciliationDto,
  ) {
    await this.updateBankReconciliationService.updateBankReconciliation(
      reconciliationId,
      reconciliationDTO,
    );

    return this.getBankReconciliationService.getBankReconciliation(
      reconciliationId,
    );
  }

  /**
   * Finishes the given reconciliation.
   */
  public async finishBankReconciliation(
    reconciliationId: number,
    reconciliationDTO: FinishBankReconciliationDto,
  ) {
    await this.finishBankReconciliationService.finishBankReconciliation(
      reconciliationId,
      reconciliationDTO,
    );

    return this.getBankReconciliationService.getBankReconciliation(
      reconciliationId,
    );
  }

  /**
   * Undoes the given reconciliation.
   */
  public async undoBankReconciliation(
    reconciliationId: number,
    undoDTO: UndoBankReconciliationDto,
  ) {
    await this.undoBankReconciliationService.undoBankReconciliation(
      reconciliationId,
      undoDTO,
    );

    return this.getBankReconciliationService.getBankReconciliation(
      reconciliationId,
    );
  }

  /**
   * Deletes the given draft or voided reconciliation.
   */
  public deleteBankReconciliation(reconciliationId: number) {
    return this.deleteBankReconciliationService.deleteBankReconciliation(
      reconciliationId,
    );
  }
}
