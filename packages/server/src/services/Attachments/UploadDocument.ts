import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class UploadDocument {
  @Inject()
  private tenancy: HasTenancyService;

  async upload(tenantId: number, file: any) {
    const { Document } = this.tenancy.models(tenantId);

    const insertedDocument = await Document.query().insert({
      key: file.key,
      extension: file.mimetype,
    });
    return insertedDocument;
  }
}
