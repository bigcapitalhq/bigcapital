import { Inject, Injectable } from '@nestjs/common';
import { Knex } from 'knex';
import { Batch } from '../models/Batch';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { UnitOfWork } from '@/modules/Tenancy/TenancyDB/UnitOfWork.service';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BatchesValidators } from '../BatchesValidators.service';
import { BATCHES_ERRORS } from '../types/Batches.types';
import { BulkSaveBatchesDto } from '../dtos/BulkSaveBatches.dto';
import { EditBatchDto } from '../dtos/EditBatch.dto';
import { CreateBatchService } from './CreateBatch.service';
import { EditBatchService } from './EditBatch.service';

@Injectable()
export class BulkSaveBatchesService {
  /**
   * @param {UnitOfWork} uow
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {BatchesValidators} validators
   * @param {CreateBatchService} createBatchService
   * @param {EditBatchService} editBatchService
   */
  constructor(
    private readonly uow: UnitOfWork,

    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    private readonly validators: BatchesValidators,
    private readonly createBatchService: CreateBatchService,
    private readonly editBatchService: EditBatchService,
  ) {}

  /**
   * Creates new batches and updates the existing ones in a single transaction.
   */
  public async bulkSaveBatches(dto: BulkSaveBatchesDto): Promise<Batch[]> {
    await this.validateBulkSave(dto);

    return this.uow.withTransaction(async (trx: Knex.Transaction) => {
      const savedBatches: Batch[] = [];

      for (const batchDto of dto.batches) {
        if (batchDto.batchId) {
          const editBatchDto: EditBatchDto = {
            id: batchDto.batchId,
            batchNumber: batchDto.batchNumber,
            batchRef: batchDto.batchRef,
            manufacturedDate: batchDto.manufacturedDate,
            expiryDate: batchDto.expiryDate,
            ...(batchDto.quantity !== undefined
              ? { quantity: batchDto.quantity }
              : {}),
          };
          const batch = await this.editBatchService.editBatch(
            batchDto.batchId,
            editBatchDto,
            trx,
          );
          savedBatches.push(batch);
          continue;
        }
        const batch = await this.createBatchService.createBatch(
          {
            itemId: dto.itemId,
            batchNumber: batchDto.batchNumber,
            batchRef: batchDto.batchRef ?? undefined,
            manufacturedDate: batchDto.manufacturedDate ?? undefined,
            expiryDate: batchDto.expiryDate ?? undefined,
            quantity: batchDto.quantity ?? 0,
            sourceTransactionType: batchDto.sourceTransactionType,
            sourceTransactionId: batchDto.sourceTransactionId,
          },
          trx,
        );
        savedBatches.push(batch);
      }
      return savedBatches;
    });
  }

  /**
   * Validates the bulk save payload before starting the transaction.
   */
  private async validateBulkSave(dto: BulkSaveBatchesDto): Promise<void> {
    await this.validators.validateBatchItem(dto.itemId);

    await this.validateExistingBatches(dto);
    this.validatePayloadBatchNumbers(dto);
    dto.batches.forEach((batchDto) => {
      this.validators.validateBatchDates(
        batchDto.manufacturedDate,
        batchDto.expiryDate,
      );
    });
  }

  /**
   * Validates that the batches to edit exist and belong to the given item.
   */
  private async validateExistingBatches(
    dto: BulkSaveBatchesDto,
  ): Promise<void> {
    const batchesIds = [
      ...new Set(
        dto.batches
          .filter(
            (batchDto) =>
              batchDto.batchId !== null && batchDto.batchId !== undefined,
          )
          .map((batchDto) => Number(batchDto.batchId)),
      ),
    ];
    if (batchesIds.length === 0) {
      return;
    }
    const batches = await this.batchModel().query().whereIn('id', batchesIds);

    if (batches.length !== batchesIds.length) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_NOT_FOUND);
    }
    batches.forEach((batch) => {
      if (Number(batch.itemId) !== Number(dto.itemId)) {
        throw new ServiceError(BATCHES_ERRORS.BATCH_ITEM_MISMATCH);
      }
    });
  }

  /**
   * Validates that the payload does not contain duplicate batch numbers.
   */
  private validatePayloadBatchNumbers(dto: BulkSaveBatchesDto): void {
    const seenBatchNumbers = new Set<string>();

    dto.batches.forEach((batchDto) => {
      const batchNumber = batchDto.batchNumber.trim().toLowerCase();

      if (seenBatchNumbers.has(batchNumber)) {
        throw new ServiceError(BATCHES_ERRORS.BATCH_NUMBER_EXISTS);
      }
      seenBatchNumbers.add(batchNumber);
    });
  }
}
