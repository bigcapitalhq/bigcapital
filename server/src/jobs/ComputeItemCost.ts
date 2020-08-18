import { Container } from 'typedi';
import InventoryService from '@/services/Inventory/Inventory';

export default class ComputeItemCostJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const { startingDate, itemId, costMethod } = job.attrs.data;

    try {
      await InventoryService.computeItemCost(startingDate, itemId, costMethod);  
      Logger.log(`Compute item cost: ${job.attrs.data}`);
      done();
    } catch(e) {
      Logger.error(`Compute item cost: ${job.attrs.data}, error: ${e}`);
      done(e);  
    }
    
  }
}
