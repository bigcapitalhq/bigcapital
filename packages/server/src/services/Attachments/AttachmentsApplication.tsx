import { Inject, Service } from "typedi";
import { UploadDocument } from "./UploadDocument";


@Service()
export class AttachmentsApplication {

  @Inject()
  private uploadDocumentService: UploadDocument;

  upload(data: any) {
    return this.uploadDocumentService.upload(data);
  }

  delete(attachmentId: string) {}

  get(attachmentId: string) {

  }
}