import { Injectable } from '@nestjs/common';
import { castArray, uniq } from 'lodash';
import { PromisePool } from '@supercharge/promise-pool';
import { DeleteCustomer } from './commands/DeleteCustomer.service';

@Injectable()
export class BulkDeleteCustomersService {
  constructor(private readonly deleteCustomerService: DeleteCustomer) {}

  public async bulkDeleteCustomers(
    customerIds: number[],
    options?: { skipUndeletable?: boolean },
  ): Promise<void> {
    const { skipUndeletable = false } = options ?? {};
    const ids = uniq(castArray(customerIds));

    const results = await PromisePool.withConcurrency(1)
      .for(ids)
      .process(async (customerId: number) => {
        try {
          await this.deleteCustomerService.deleteCustomer(customerId);
        } catch (error) {
          if (!skipUndeletable) {
            throw error;
          }
        }
      });

    if (!skipUndeletable && results.errors && results.errors.length > 0) {
      throw results.errors[0].raw ?? results.errors[0];
    }
  }
}

