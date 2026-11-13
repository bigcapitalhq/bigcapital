import { Inject, Injectable } from '@nestjs/common';
import { Batch } from '../models/Batch';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BatchesValidators } from '../BatchesValidators.service';
import { CreateBatchDto } from '../dtos/CreateBatch.dto';
import { formatBatchDate, toBatchQuantity } from '../Batches.utils';

@Injectable()
export class CreateBatchService {
  /**
   * @param {TenantModelProxy<typeof Batch>} batchModel
   * @param {BatchesValidators} validators
   */
  constructor(
    @Inject(Batch.name)
    private readonly batchModel: TenantModelProxy<typeof Batch>,

    private readonly validators: BatchesValidators,
  ) {}

  /**
   * Creates a new batch.
   */
  public async createBatch(dto: CreateBatchDto): Promise<Batch> {
    await this.validators.validateBatchItem(dto.itemId);
    await this.validators.validateBatchNumberUnique(
      dto.itemId,
      dto.batchNumber,
    );
    this.validators.validateBatchDates(dto.manufacturedDate, dto.expiryDate);

    return this.batchModel()
      .query()
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
  }
}
