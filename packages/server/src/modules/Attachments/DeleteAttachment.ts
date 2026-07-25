import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { UnitOfWork } from '../Tenancy/TenancyDB/UnitOfWork.service';
import { DocumentModel } from './models/Document.model';
import { TenantModelProxy } from '../System/models/TenantBaseModel';
import { DocumentLinkModel } from './models/DocumentLink.model';
import { StorageProvider } from '../Storage/StorageProvider';
import { STORAGE_PROVIDER } from '../Storage/Storage.module';

@Injectable()
export class DeleteAttachment {
  constructor(
    private readonly uow: UnitOfWork,

    @Inject(STORAGE_PROVIDER)
    private readonly storageProvider: StorageProvider,

    @Inject(DocumentModel.name)
    private readonly documentModel: TenantModelProxy<typeof DocumentModel>,

    @Inject(DocumentLinkModel.name)
    private readonly documentLinkModel: TenantModelProxy<
      typeof DocumentLinkModel
    >,
  ) {}

  /**
   * Deletes the given file attachment file key from storage and database.
   * @param {string} filekey
   */
  async delete(filekey: string): Promise<void> {
    const foundDocument = await this.documentModel()
      .query()
      .findOne('key', filekey)
      .throwIfNotFound();

    await this.storageProvider.deleteObject(filekey);

    await this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Delete all document links
      await this.documentLinkModel()
        .query(trx)
        .where('documentId', foundDocument.id)
        .delete();

      // Delete the document.
      await this.documentModel().query(trx).findById(foundDocument.id).delete();
    });
  }
}
