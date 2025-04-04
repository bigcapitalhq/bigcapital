import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Knex } from 'knex';
import { Inject, Injectable } from '@nestjs/common';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { ConfigService } from '@nestjs/config';
import { S3_CLIENT } from '../S3/S3.module';
import { DocumentModel } from './models/Document.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentLinkModel } from './models/DocumentLink.model';

@Injectable()
export class DeleteAttachment {
  constructor(
    private readonly uow: UnitOfWork,
    private readonly configService: ConfigService,

    @Inject(S3_CLIENT)
    private readonly s3Client: S3Client,

    @Inject(Document.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,

    @Inject(DocumentLinkModel.name)
    private readonly documentLinkModel: TenantModelProxy<typeof DocumentLinkModel>
  ) {

  }

  /**
   * Deletes the give file attachment file key.
   * @param {string} filekey
   */
  async delete(filekey: string): Promise<void> {
    const params = {
      Bucket: this.configService.get('s3.bucket'),
      Key: filekey,
    };
    await this.s3Client.send(new DeleteObjectCommand(params));

    const foundDocument = await this.documentModel().query()
      .findOne('key', filekey)
      .throwIfNotFound();

    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Delete all document links
      await this.documentLinkModel().query(trx)
        .where('documentId', foundDocument.id)
        .delete();

      // Delete thedocument.
      await this.documentModel().query(trx).findById(foundDocument.id).delete();
    });
  }
}
