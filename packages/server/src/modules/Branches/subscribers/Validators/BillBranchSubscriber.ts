import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { ValidateBranchExistance } from '../../integrations/ValidateBranchExistance';
import {
  IBillCreatingPayload,
  IBillEditingPayload,
} from '@/modules/Bills/Bills.types';

@Injectable()
export class BillBranchValidateSubscriber {
  constructor(
    private readonly validateBranchExistance: ValidateBranchExistance,
  ) { }

  /**
   * Validate branch existance on bill creating.
   * @param {IBillCreatingPayload} payload
   */
  @OnEvent(events.bill.onCreating)
  async validateBranchExistanceOnBillCreating({
    billDTO,
  }: IBillCreatingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      billDTO.branchId,
    );
  }

  /**
   * Validate branch existance once bill editing.
   * @param {IBillEditingPayload} payload
   */
  @OnEvent(events.bill.onEditing)
  async validateBranchExistanceOnBillEditing({ billDTO }: IBillEditingPayload) {
    await this.validateBranchExistance.validateTransactionBranchWhenActive(
      billDTO.branchId,
    );
  }
}
