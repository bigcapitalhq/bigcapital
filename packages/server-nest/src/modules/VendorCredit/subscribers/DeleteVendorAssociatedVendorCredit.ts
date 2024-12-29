// import { Inject, Injectable } from '@nestjs/common';
// import { OnEvent } from '@nestjs/event-emitter';
// import { VendorCredit } from '../models/VendorCredit';
// import { IVendorEventDeletingPayload } from '@/modules/Vendors/types/Vendors.types';
// import { events } from '@/common/events/events';
// import { ServiceError } from '@/modules/Items/ServiceError';

// const ERRORS = {
//   VENDOR_HAS_TRANSACTIONS: 'VENDOR_HAS_TRANSACTIONS',
// };

// @Injectable()
// export class DeleteVendorAssociatedVendorCredit {
//   /**
//    * @param {typeof VendorCredit} vendorCreditModel - Vendor credit model.
//    */
//   constructor(
//     @Inject(VendorCredit.name)
//     private readonly vendorCreditModel: typeof VendorCredit,
//   ) {}

//   /**
//    * Validate vendor has no associated credit transaction once the vendor deleting.
//    * @param {IVendorEventDeletingPayload} payload -
//    */
//   @OnEvent(events.vendors.onDeleting)
//   public async validateVendorHasNoCreditsTransactionsOnceDeleting({
//     vendorId,
//   }: IVendorEventDeletingPayload) {
//     await this.validateVendorHasNoCreditsTransactions(vendorId);
//   }

//   /**
//    * Validate the given vendor has no associated vendor credit transactions.
//    * @param {number} vendorId
//    */
//   public async validateVendorHasNoCreditsTransactions(
//     vendorId: number,
//   ): Promise<void> {
//     const associatedVendors = await this.vendorCreditModel
//       .query()
//       .where('vendorId', vendorId);

//     if (associatedVendors.length > 0) {
//       throw new ServiceError(ERRORS.VENDOR_HAS_TRANSACTIONS);
//     }
//   }
// }
