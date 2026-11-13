import { Inject, Injectable } from '@nestjs/common';
import { Batch } from '../models/Batch';
import { TenantModelProxy } from '@/modules/System/models/TenantBaseModel';
import { BatchesValidators } from '../BatchesValidators.service';
import { EditBatchDto } from '../dtos/EditBatch.dto';
import { formatBatchDate, toBatchQuantity } from '../Batches.utils';

@Injectable()
export class EditBatchService {
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
   * Updates the given batch.
   */
  public async editBatch(id: number, dto: EditBatchDto): Promise<Batch> {
    const batch = await this.batchModel().query().findById(id);
    this.validators.validateBatchExistance(batch);

    const batchNumber = dto.batchNumber?.trim() ?? batch.batchNumber;
    await this.validators.validateBatchNumberUnique(
      batch.itemId,
      batchNumber,
      batch.id,
    );
    this.validators.validateBatchDates(
      dto.manufacturedDate ?? batch.manufacturedDate,
      dto.expiryDate ?? batch.expiryDate,
    );

    return this.batchModel()
      .query()
      .patchAndFetchById(id, {
        ...(dto.batchNumber !== undefined ? { batchNumber: batchNumber } : {}),
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
  }
}
