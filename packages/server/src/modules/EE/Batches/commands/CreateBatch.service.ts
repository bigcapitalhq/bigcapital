import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Batch } from '../models/Batch';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { batchEvents } from '../Batches.events';
import { BatchesValidators } from '../BatchesValidators.service';
import { CreateBatchDto } from '../dtos/CreateBatch.dto';
import { formatBatchDate, toBatchQuantity } from '../Batches.utils';
import {
  IBatchCreatedPayload,
  IBatchCreatingPayload,
} from '../types/Batches.types';

@Injectable()
export class CreateBatchService {
  /**
   * @param {EventEmitter2} eventEmitter
   * @param {UnitOfWork} uow
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {BatchesValidators} validators
   */
  constructor(
    private readonly eventEmitter: EventEmitter2,
    private readonly uow: UnitOfWork,

    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    private readonly validators: BatchesValidators,
  ) {}

  /**
   * Creates a new batch.
   */
  public async createBatch(
    dto: CreateBatchDto,
    trx?: Knex.Transaction,
  ): Promise<Batch> {
    await this.validators.validateBatchItem(dto.itemId);
    await this.validators.validateBatchNumberUnique(
      dto.itemId,
      dto.batchNumber,
    );
    this.validators.validateBatchDates(dto.manufacturedDate, dto.expiryDate);

    return this.uow.withTransaction(async (transaction: Knex.Transaction) => {
      // Triggers `onBatchCreating` event.
      await this.eventEmitter.emitAsync(batchEvents.onCreating, {
        batchDTO: dto,
        trx: transaction,
      } as IBatchCreatingPayload);

      const batch = await this.batchModel()
        .query(transaction)
        .insertAndFetch({
          itemId: dto.itemId,
          batchNumber: dto.batchNumber.trim(),
          batchRef: dto.batchRef?.trim() || null,
          manufacturedDate: formatBatchDate(dto.manufacturedDate),
          expiryDate: formatBatchDate(dto.expiryDate),
          quantity: toBatchQuantity(dto.quantity),
          sourceTransactionType: dto.sourceTransactionType || null,
          sourceTransactionId: dto.sourceTransactionId || null,
        });

      // Triggers `onBatchCreated` event.
      await this.eventEmitter.emitAsync(batchEvents.onCreated, {
        batch,
        batchId: batch.id,
        batchDTO: dto,
        trx: transaction,
      } as IBatchCreatedPayload);

      return batch;
    }, trx);
  }
}
