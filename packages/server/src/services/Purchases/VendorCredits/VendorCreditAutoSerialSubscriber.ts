import { Service, Inject } from 'typedi';
import events from '@/subscribers/events';
import BaseVendorCredit from './BaseVendorCredit';
import { IVendorCreditCreatedPayload } from '@/interfaces';

@Service()
export default class VendorCreditAutoSerialSubscriber {
  @Inject()
  vendorCreditService: BaseVendorCredit;

  /**
   * Attaches events with handlers.
   */
  public attach(bus) {
    bus.subscribe(events.vendorCredit.onCreated, this.autoIncrementOnceCreated);
  }

  /**
   * Auto serial increment once the vendor credit created.
   * @param {IVendorCreditCreatedPayload} payload
   */
  private autoIncrementOnceCreated = ({
    tenantId,
  }: IVendorCreditCreatedPayload) => {
    this.vendorCreditService.incrementSerialNumber(tenantId);
  };
}
