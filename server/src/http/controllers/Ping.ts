import { Router, Request, Response } from 'express';
import InventoryService from '@/services/Inventory/Inventory';

export default class Ping {

  /**
   * Router constur
   */
  static router() {
    const router = Router();

    router.get(
      '/',
      this.ping,
    );
    return router;
  }

  /**
   * 
   * @param {Request} req 
   * @param {Response} res 
   */
  static async ping(req: Request, res: Response) {

    const result = await InventoryService.trackingInventoryLotsCost([
      {
        id: 1,
        date: '2020-02-02',
        direction: 'IN',
        itemId: 1,
        quantity: 100,
        rate: 10,
        transactionType: 'Bill',
        transactionId: 1,
        remaining: 100,
      },
      {
        id: 2,
        date: '2020-02-02',
        direction: 'OUT',
        itemId: 1,
        quantity: 80,
        rate: 10,
        transactionType: 'SaleInvoice',
        transactionId: 1,
      },
      {
        id: 3,
        date: '2020-02-02',
        direction: 'OUT',
        itemId: 2,
        quantity: 500,
        rate: 10,
        transactionType: 'SaleInvoice',
        transactionId: 2,
      },
    ]);

    return res.status(200).send({ id: 1231231 });
  }
}