import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import TenancyService from 'services/Tenancy/TenancyService';

@EventSubscriber()
export default class BillSubscriber {
  tenancy: TenancyService;
  logger: any;

  /**
   * Constructor method.
   */
  constructor() {
    this.tenancy = Container.get(TenancyService);
    this.logger = Container.get('logger');
  }

  /**
   * Handles vendor balance increment once bill created.
   */
  @On(events.bill.onCreated)
  async handleVendorBalanceIncrement({ tenantId, billId, bill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Increments vendor balance.
    this.logger.info('[bill] trying to increment vendor balance.', {
      tenantId,
      billId,
    });
    await vendorRepository.changeBalance(bill.vendorId, bill.amount);
  }

  /**
   * Handles vendor balance decrement once bill deleted.
   */
  @On(events.bill.onDeleted)
  async handleVendorBalanceDecrement({ tenantId, billId, oldBill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Decrements vendor balance.
    this.logger.info('[bill] trying to decrement vendor balance.', {
      tenantId,
      billId,
    });
    await vendorRepository.changeBalance(oldBill.vendorId, oldBill.amount * -1);
  }

  /**
   * Handles vendor balance difference change.
   */
  @On(events.bill.onEdited)
  async handleVendorBalanceDiffChange({ tenantId, billId, oldBill, bill }) {
    const { vendorRepository } = this.tenancy.repositories(tenantId);

    // Changes the diff vendor balance between old and new amount.
    this.logger.info('[bill[ change vendor the different balance.', {
      tenantId,
      billId,
    });
    await vendorRepository.changeDiffBalance(
      bill.vendorId,
      bill.amount,
      oldBill.amount,
      oldBill.vendorId
    );
  }
}
