import { Container } from 'typedi';
import InventoryService from '@/services/Inventory/Inventory';

export default class ComputeItemCostJob {
  public async handler(job, done: Function): Promise<void> {
    const Logger = Container.get('logger');
    const { startingDate, itemId, costMethod = 'FIFO' } = job.attrs.data;

    Logger.debug(`Compute item cost - started: ${job.attrs.data}`);

    try {
      await InventoryService.computeItemCost(startingDate, itemId, costMethod);  
      Logger.debug(`Compute item cost - completed: ${job.attrs.data}`);
      done();
    } catch(e) {
      console.log(e);
      Logger.error(`Compute item cost: ${job.attrs.data}, error: ${e}`);
      done(e);  
    }
    
  }
}
