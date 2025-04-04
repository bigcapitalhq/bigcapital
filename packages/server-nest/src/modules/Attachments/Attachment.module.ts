import { Module } from "@nestjs/common";
import { S3Module } from "../S3/S3.module";
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



@Module({
  imports: [S3Module],
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
    AttachmentsOnVendorCredits
  ]
})
export class AttachmentsModule {}