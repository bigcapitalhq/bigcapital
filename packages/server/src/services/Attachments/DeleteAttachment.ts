import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { s3 } from '@/lib/S3/S3';
import { Inject, Service } from 'typedi';
import HasTenancyService from '../Tenancy/TenancyService';

@Service()
export class DeleteAttachment {
  @Inject()
  private tenancy: HasTenancyService;

  /**
   * Deletes the give file attachment file key.
   * @param {number} tenantId
   * @param {string} filekey
   */
  async delete(tenantId: number, filekey: string): Promise<void> {
    const { Document, DocumentLink } = this.tenancy.models(tenantId);

    const params = {
      Bucket: process.env.AWS_BUCKET,
      Key: filekey,
    };
    await s3.send(new DeleteObjectCommand(params));

    const foundDocument = await Document.query()
      .findOne('key', filekey)
      .throwIfNotFound();

    // Delete all document links
    await DocumentLink.query().where('documentId', foundDocument.id).delete();

    // Delete thedocument.
    await Document.query().findById(foundDocument.id).delete();
  }
}
