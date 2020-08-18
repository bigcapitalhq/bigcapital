import { Container } from 'typedi';
import InventoryService from '@/services/Inventory/Inventory';

export default class ComputeItemCostJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const { startingDate, itemId, costMethod } = job.attrs.data;

    await InventoryService.computeItemCost(startingDate, itemId, costMethod);  
    done();
  }
}
