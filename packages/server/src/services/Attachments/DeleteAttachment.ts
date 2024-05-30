import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { Inject, Service } from 'typedi';
import { s3 } from '@/lib/S3/S3';
import HasTenancyService from '../Tenancy/TenancyService';
import config from '@/config';
import UnitOfWork from '../UnitOfWork';
import { Knex } from 'knex';

@Service()
export class DeleteAttachment {
  @Inject()
  private tenancy: HasTenancyService;

  @Inject()
  private uow: UnitOfWork;

  /**
   * Deletes the give file attachment file key.
   * @param {number} tenantId
   * @param {string} filekey
   */
  async delete(tenantId: number, filekey: string): Promise<void> {
    const { Document, DocumentLink } = this.tenancy.models(tenantId);

    const params = {
      Bucket: config.s3.bucket,
      Key: filekey,
    };
    await s3.send(new DeleteObjectCommand(params));

    const foundDocument = await Document.query()
      .findOne('key', filekey)
      .throwIfNotFound();

    await this.uow.withTransaction(tenantId, async (trx: Knex.Transaction) => {
      // Delete all document links
      await DocumentLink.query(trx)
        .where('documentId', foundDocument.id)
        .delete();

      // Delete thedocument.
      await Document.query(trx).findById(foundDocument.id).delete();
    });
  }
}
