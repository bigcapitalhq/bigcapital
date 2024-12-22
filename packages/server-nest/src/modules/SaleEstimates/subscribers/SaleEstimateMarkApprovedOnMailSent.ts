// import { ERRORS } from '../constants';
// import { OnEvent } from '@nestjs/event-emitter';
// import { Injectable } from '@nestjs/common';
// import { DeliverSaleEstimateService } from '../commands/DeliverSaleEstimate.service';
// import { events } from '@/common/events/events';
// import { ISaleEstimateMailPresendEvent } from '../types/SaleEstimates.types';
// import { ServiceError } from '@/modules/Items/ServiceError';

// @Injectable()
// export class SaleEstimateMarkApprovedOnMailSentSubscriber {
//   constructor(
//     private readonly deliverEstimateService: DeliverSaleEstimateService,
//   ) {}

//   /**
//    * Marks the given estimate approved on submitting mail.
//    * @param {ISaleEstimateMailPresendEvent}
//    */
//   @OnEvent(events.saleEstimate.onPreMailSend)
//   public async markEstimateApproved({
//     saleEstimateId,
//   }: ISaleEstimateMailPresendEvent) {
//     try {
//       await this.deliverEstimateService.deliverSaleEstimate(saleEstimateId);
//     } catch (error) {
//       if (
//         error instanceof ServiceError &&
//         error.errorType === ERRORS.SALE_ESTIMATE_ALREADY_DELIVERED
//       ) {
//       } else {
//         throw error;
//       }
//     }
//   }
// }
