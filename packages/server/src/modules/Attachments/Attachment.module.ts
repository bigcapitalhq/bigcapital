import { Module } from '@nestjs/common';
import { ClsService } from 'nestjs-cls';
import {
  StorageModule,
  STORAGE_PROVIDER,
} from '../Storage/Storage.module';
import { StorageProvider } from '../Storage/StorageProvider';
import { DeleteAttachment } from './DeleteAttachment';
import { GetAttachment } from './GetAttachment';
import { GetAttachmentPresignedUrl } from './GetAttachmentPresignedUrl';
import { LinkAttachment } from './LinkAttachment';
import { UnlinkAttachment } from './UnlinkAttachment';
import { ValidateAttachments } from './ValidateAttachments';
import { AttachmentsOnBillPayments } from './events/AttachmentsOnPaymentsMade';
import { AttachmentsOnBills } from './events/AttachmentsOnBills';
import { AttachmentsOnCreditNote } from './events/AttachmentsOnCreditNote';
import { AttachmentsOnExpenses } from './events/AttachmentsOnExpenses';
import { AttachmentsOnPaymentsReceived } from './events/AttachmentsOnPaymentsReceived';
import { AttachmentsOnManualJournals } from './events/AttachmentsOnManualJournals';
import { AttachmentsOnVendorCredits } from './events/AttachmentsOnVendorCredits';
import { AttachmentsOnSaleInvoiceCreated } from './events/AttachmentsOnSaleInvoice';
import { AttachmentsOnSaleReceipt } from './events/AttachmentsOnSaleReceipts';
import { AttachmentsOnSaleEstimates } from './events/AttachmentsOnSaleEstimates';
import { AttachmentsController } from './Attachments.controller';
import { RegisterTenancyModel } from '../Tenancy/TenancyModels/Tenancy.module';
import { DocumentModel } from './models/Document.model';
import { DocumentLinkModel } from './models/DocumentLink.model';
import { AttachmentsApplication } from './AttachmentsApplication';
import { UploadDocument } from './UploadDocument';
import { StorageUploadPipeline } from './StorageUploadPipeline';
import { MULTER_MODULE_OPTIONS } from '@/common/constants/files.constants';

const models = [
  RegisterTenancyModel(DocumentModel),
  RegisterTenancyModel(DocumentLinkModel),
];

@Module({
  imports: [StorageModule.register(), ...models],
  exports: [...models, GetAttachmentPresignedUrl],
  controllers: [AttachmentsController],
  providers: [
    DeleteAttachment,
    GetAttachment,
    GetAttachmentPresignedUrl,
    LinkAttachment,
    UnlinkAttachment,
    ValidateAttachments,
    AttachmentsOnBillPayments,
    AttachmentsOnBills,
    AttachmentsOnCreditNote,
    AttachmentsOnExpenses,
    AttachmentsOnPaymentsReceived,
    AttachmentsOnManualJournals,
    AttachmentsOnVendorCredits,
    AttachmentsOnSaleInvoiceCreated,
    AttachmentsOnSaleReceipt,
    AttachmentsOnSaleEstimates,
    AttachmentsApplication,
    UploadDocument,
    StorageUploadPipeline,
    {
      provide: MULTER_MODULE_OPTIONS,
      inject: [STORAGE_PROVIDER, ClsService],
      useFactory: (storage: StorageProvider, cls: ClsService) => ({
        storage: storage.createMulterStorage(() =>
          cls.get<string>('organizationId'),
        ),
      }),
    },
  ],
})
export class AttachmentsModule {}
