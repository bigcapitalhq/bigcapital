import { Inject, Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Knex } from 'knex';
import { Batch } from '../models/Batch';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { batchEvents } from '../Batches.events';
import { BatchesValidators } from '../BatchesValidators.service';
import { EditBatchDto } from '../dtos/EditBatch.dto';
import { formatBatchDate, toBatchQuantity } from '../Batches.utils';
import {
  IBatchEditedPayload,
  IBatchEditingPayload,
} from '../types/Batches.types';

@Injectable()
export class EditBatchService {
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
   * Updates the given batch.
   */
  public async editBatch(id: number, dto: EditBatchDto): Promise<Batch> {
    const oldBatch = await this.batchModel().query().findById(id);
    this.validators.validateBatchExistance(oldBatch);

    const batchNumber = dto.batchNumber?.trim() ?? oldBatch.batchNumber;
    await this.validators.validateBatchNumberUnique(
      oldBatch.itemId,
      batchNumber,
      oldBatch.id,
    );
    this.validators.validateBatchDates(
      dto.manufacturedDate ?? oldBatch.manufacturedDate,
      dto.expiryDate ?? oldBatch.expiryDate,
    );

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      // Triggers `onBatchEditing` event.
      await this.eventEmitter.emitAsync(batchEvents.onEditing, {
        batchId: id,
        batchDTO: dto,
        oldBatch,
        trx,
      } as IBatchEditingPayload);

      const batch = await this.batchModel()
        .query(trx)
        .patchAndFetchById(id, {
          ...(dto.batchNumber !== undefined
            ? { batchNumber: batchNumber }
            : {}),
          ...(dto.batchRef !== undefined
            ? { batchRef: dto.batchRef?.trim() || null }
            : {}),
          ...(dto.manufacturedDate !== undefined
            ? { manufacturedDate: formatBatchDate(dto.manufacturedDate) }
            : {}),
          ...(dto.expiryDate !== undefined
            ? { expiryDate: formatBatchDate(dto.expiryDate) }
            : {}),
          ...(dto.quantity !== undefined
            ? { quantity: toBatchQuantity(dto.quantity) }
            : {}),
        });

      // Triggers `onBatchEdited` event.
      await this.eventEmitter.emitAsync(batchEvents.onEdited, {
        batch,
        batchId: batch.id,
        batchDTO: dto,
        oldBatch,
        trx,
      } as IBatchEditedPayload);

      return batch;
    });
  }
}
