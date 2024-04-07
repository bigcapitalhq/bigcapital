import { ServiceError } from '@/exceptions';
import { ISaleEstimateMailPresendEvent } from '@/interfaces';
import events from '@/subscribers/events';
import { Inject, Service } from 'typedi';
import { DeliverSaleEstimate } from '../DeliverSaleEstimate';
import { ERRORS } from '../constants';

@Service()
export class SaleEstimateMarkApprovedOnMailSent {
  @Inject()
  private deliverEstimateService: DeliverSaleEstimate;

  /**
   * Attaches events.
   */
  public attach(bus) {
    bus.subscribe(events.saleEstimate.onPreMailSend, this.markEstimateApproved);
  }

  /**
   * Marks the given estimate approved on submitting mail.
   * @param {ISaleEstimateMailPresendEvent}
   */
  private markEstimateApproved = async ({ tenantId, saleEstimateId }: ISaleEstimateMailPresendEvent) => {
    try {
      await this.deliverEstimateService.deliverSaleEstimate(tenantId, saleEstimateId);
    } catch (error) {
      if (error instanceof ServiceError && error.errorType === ERRORS.SALE_ESTIMATE_ALREADY_DELIVERED) {
      } else {
        throw error;
      }
    }
  };
}
