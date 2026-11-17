import { Injectable } from '@nestjs/common';
import { CreateBatchService } from './commands/CreateBatch.service';
import { EditBatchService } from './commands/EditBatch.service';
import { DeleteBatchService } from './commands/DeleteBatch.service';
import { BulkSaveBatchesService } from './commands/BulkSaveBatches.service';
import { GetBatchesService } from './queries/GetBatches.service';
import { CreateBatchDto } from './dtos/CreateBatch.dto';
import { EditBatchDto } from './dtos/EditBatch.dto';
import { BulkSaveBatchesDto } from './dtos/BulkSaveBatches.dto';
import { GetBatchesQueryDto } from './dtos/GetBatchesQuery.dto';
import { ServiceError } from '@/modules/Items/ServiceError';
import { BATCHES_ERRORS } from './types/Batches.types';

@Injectable()
export class BatchesApplication {
  constructor(
    private readonly createBatchService: CreateBatchService,
    private readonly editBatchService: EditBatchService,
    private readonly deleteBatchService: DeleteBatchService,
    private readonly bulkSaveBatchesService: BulkSaveBatchesService,
    private readonly getBatchesService: GetBatchesService,
  ) {}

  /**
   * Retrieves the batches list.
   */
  public list(query: GetBatchesQueryDto) {
    return this.getBatchesService.getBatches(query);
  }

  /**
   * Retrieves the available batches of the given item.
   */
  public available(itemId: number) {
    return this.getBatchesService.getAvailableBatches(itemId);
  }

  /**
   * Retrieves the given batch.
   */
  public async get(id: number) {
    const batch = await this.getBatchesService.getBatch(id);

    if (!batch) {
      throw new ServiceError(BATCHES_ERRORS.BATCH_NOT_FOUND);
    }
    return batch;
  }

  /**
   * Creates a new batch.
   */
  public create(dto: CreateBatchDto) {
    return this.createBatchService.createBatch(dto);
  }

  /**
   * Updates the given batch.
   */
  public edit(id: number, dto: EditBatchDto) {
    return this.editBatchService.editBatch(id, dto);
  }

  /**
   * Creates or updates multiple batches in a single request.
   */
  public bulkSave(dto: BulkSaveBatchesDto) {
    return this.bulkSaveBatchesService.bulkSaveBatches(dto);
  }

  /**
   * Deletes the given batch.
   */
  public delete(id: number) {
    return this.deleteBatchService.deleteBatch(id);
  }
}
