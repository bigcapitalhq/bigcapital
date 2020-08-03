import { InventoryTransaction } from "../../models";


export default class InventoryService {

  async isInventoryPurchaseSold(transactionType, transactionId) {
    
  }

  static deleteTransactions(transactionId, transactionType) {
    return InventoryTransaction.tenant().query()
      .where('transaction_type', transactionType)
      .where('transaction_id', transactionId)
      .delete();
  }
}