

export default class InventoryValuationSummary {

  static router() {
    const router = express.Router();

    router.get('/inventory_valuation_summary',
      asyncMiddleware(this.inventoryValuationSummary),
    );
    return router;
  }

  static inventoryValuationSummary(req, res) {

  }
}