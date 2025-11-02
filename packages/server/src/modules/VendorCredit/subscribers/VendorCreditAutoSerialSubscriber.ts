import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { events } from '@/common/events/events';
import { VendorCreditAutoIncrementService } from '../commands/VendorCreditAutoIncrement.service';
import { IVendorCreditCreatedPayload } from '../types/VendorCredit.types';

@Injectable()
export class VendorCreditAutoSerialSubscriber {
  constructor(
    private readonly vendorCreditIncrementService: VendorCreditAutoIncrementService,
  ) { }

  /**
   * Auto serial increment once vendor credit created.
   * @param {IVendorCreditCreatedPayload} payload -
   */
  @OnEvent(events.vendorCredit.onCreated)
  async autoSerialIncrementOnceCreated({ }: IVendorCreditCreatedPayload) {
    await this.vendorCreditIncrementService.incrementSerialNumber();
  }
}
