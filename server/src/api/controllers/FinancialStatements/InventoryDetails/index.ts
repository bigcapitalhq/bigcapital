import { Inject, Service } from 'typedi';
import { query } from 'express-validator';
import {
  NextFunction,
  Router,
  Request,
  Response,
  ValidationChain,
} from 'express';
import BaseController from 'api/controllers/BaseController';
import InventoryDetailsService from 'services/FinancialStatements/InventoryDetails/InventoryDetailsService';
import InventoryDetailsTable from 'services/FinancialStatements/InventoryDetails/InventoryDetailsTable';

@Service()
export default class InventoryDetailsController extends BaseController {
  @Inject()
  inventoryDetailsService: InventoryDetailsService;

  /**
   * Router constructor.
   */
  router() {
    const router = Router();

    router.get(
      '/',
      this.validationSchema,
      this.validationResult,
      this.asyncMiddleware(this.inventoryDetails.bind(this))
    );
    return router;
  }

  /**
   * Balance sheet validation schecma.
   * @returns {ValidationChain[]}
   */
  get validationSchema(): ValidationChain[] {
    return [
      query('number_format.precision')
        .optional()
        .isInt({ min: 0, max: 5 })
        .toInt(),
      query('number_format.divide_on_1000').optional().isBoolean().toBoolean(),
      query('number_format.negative_format')
        .optional()
        .isIn(['parentheses', 'mines'])
        .trim()
        .escape(),
      query('from_date').optional(),
      query('to_date').optional(),
      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Retrieve the cashflow statment to json response.
   * @param {ICashFlowStatement} cashFlow -
   */
  private transformJsonResponse(inventoryDetails) {
    const { data, query } = inventoryDetails;

    return {
      data: this.transfromToResponse(data),
      meta: this.transfromToResponse(query),
    };
  }

  /**
   * Transformes the report statement to table rows.
   */
  private transformToTableRows(inventoryDetails) {
    const inventoryDetailsTable = new InventoryDetailsTable(inventoryDetails);

    return {
      table: {
        data: inventoryDetailsTable.tableData(),
        columns: inventoryDetailsTable.tableColumns(),
      },
      meta: this.transfromToResponse(inventoryDetails.query),
    };
  }

  /**
   * Retrieve the cash flow statment.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  async inventoryDetails(req: Request, res: Response, next: NextFunction) {
    const { tenantId, settings } = req;
    const filter = {
      ...this.matchedQueryData(req),
    };

    try {
      const inventoryDetails =
        await this.inventoryDetailsService.inventoryDetails(tenantId, filter);

      const accept = this.accepts(req);
      const acceptType = accept.types(['json', 'application/json+table']);

      switch (acceptType) {
        case 'application/json+table':
          return res
            .status(200)
            .send(this.transformToTableRows(inventoryDetails));
        case 'json':
        default:
          return res
            .status(200)
            .send(this.transformJsonResponse(inventoryDetails));
      }
    } catch (error) {
      next(error);
    }
  }
}
