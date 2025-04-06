import { Module } from "@nestjs/common";
import * as multerS3 from 'multer-s3';
import { S3_CLIENT, S3Module } from "../S3/S3.module";
import { DeleteAttachment } from "./DeleteAttachment";
import { GetAttachment } from "./GetAttachment";
import { getAttachmentPresignedUrl } from "./GetAttachmentPresignedUrl";
import { LinkAttachment } from "./LinkAttachment";
import { UnlinkAttachment } from "./UnlinkAttachment";
import { ValidateAttachments } from "./ValidateAttachments";
import { AttachmentsOnBillPayments } from "./events/AttachmentsOnPaymentsMade";
import { AttachmentsOnBills } from "./events/AttachmentsOnBills";
import { AttachmentsOnCreditNote } from "./events/AttachmentsOnCreditNote";
import { AttachmentsOnExpenses } from "./events/AttachmentsOnExpenses";
import { AttachmentsOnPaymentsReceived } from "./events/AttachmentsOnPaymentsReceived";
import { AttachmentsOnManualJournals } from "./events/AttachmentsOnManualJournals";
import { AttachmentsOnVendorCredits } from "./events/AttachmentsOnVendorCredits";
import { AttachmentsOnSaleInvoiceCreated } from "./events/AttachmentsOnSaleInvoice";
import { AttachmentsController } from "./Attachments.controller";
import { RegisterTenancyModel } from "../Tenancy/TenancyModels/Tenancy.module";
import { DocumentModel } from "./models/Document.model";
import { DocumentLinkModel } from "./models/DocumentLink.model";
import { AttachmentsApplication } from "./AttachmentsApplication";
import { UploadDocument } from "./UploadDocument";
import { AttachmentUploadPipeline } from "./S3UploadPipeline";
import { MULTER_MODULE_OPTIONS } from "@/common/constants/files.constants";
import { ConfigService } from "@nestjs/config";
import { S3Client } from "@aws-sdk/client-s3";

const models = [
  RegisterTenancyModel(DocumentModel),
  RegisterTenancyModel(DocumentLinkModel),
];

@Module({
  imports: [S3Module, ...models],
  controllers: [AttachmentsController],
  providers: [
    DeleteAttachment,
    GetAttachment,
    getAttachmentPresignedUrl,
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
    AttachmentsApplication,
    UploadDocument,
    AttachmentUploadPipeline,
    {
      provide: MULTER_MODULE_OPTIONS,
      inject: [ConfigService, S3_CLIENT],
      useFactory: (configService: ConfigService, s3: S3Client) => ({
        storage: multerS3({
          s3,
          bucket: configService.get('s3.bucket'),
          contentType: multerS3.AUTO_CONTENT_TYPE,
          metadata: function (req, file, cb) {
            cb(null, { fieldName: file.fieldname });
          },
          key: function (req, file, cb) {
            cb(null, Date.now().toString());
          },
          acl: function(req, file, cb) {
            // Conditionally set file to public or private based on isPublic flag
            const aclValue = true ? 'public-read' : 'private';
            // Set ACL based on the isPublic flag
            cb(null, aclValue); 
          }
        }),
      })
    }
  ]
})
export class AttachmentsModule {}