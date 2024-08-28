import { ImportFilePreviewPOJO } from "@/services/Import/interfaces";


export interface IImportFileCommitedEventPayload {
  tenantId: number;
  importId: string;
  meta: ImportFilePreviewPOJO;
}