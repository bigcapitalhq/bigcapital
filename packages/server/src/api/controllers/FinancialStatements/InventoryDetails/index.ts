import { Inject, Service } from 'typedi';
import { query } from 'express-validator';
import {
  NextFunction,
  Router,
  Request,
  Response,
  ValidationChain,
} from 'express';
import BaseController from '@/api/controllers/BaseController';
import { AbilitySubject, ReportsAction } from '@/interfaces';
import { InventortyDetailsApplication } from '@/services/FinancialStatements/InventoryDetails/InventoryDetailsApplication';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { ACCEPT_TYPE } from '@/interfaces/Http';

@Service()
export default class InventoryDetailsController extends BaseController {
  @Inject()
  private inventoryItemDetailsApp: InventortyDetailsApplication;

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.get(
      '/',
      CheckPolicies(
        ReportsAction.READ_INVENTORY_ITEM_DETAILS,
        AbilitySubject.Report
      ),
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
  private get validationSchema(): ValidationChain[] {
    return [
      query('number_format.precision')
        .optional()
        .isInt({ min: 0, max: 5 })
        .toInt(),
      query('number_format.divide_on_1000').optional().isBoolean().toBoolean(),
      query('number_format.negative_format')
        .optional()
        .isIn(['parentheses', 'mines'])
        .trim(),
      query('from_date').optional(),
      query('to_date').optional(),

      query('none_zero').optional().isBoolean().toBoolean(),
      query('none_transactions').optional().isBoolean().toBoolean(),

      query('items_ids').optional().isArray(),
      query('items_ids.*').optional().isInt().toInt(),

      // Filtering by branches.
      query('branches_ids').optional().toArray().isArray({ min: 1 }),
      query('branches_ids.*').isNumeric().toInt(),

      // Filtering by warehouses.
      query('warehouses_ids').optional().toArray().isArray({ min: 1 }),
      query('warehouses_ids.*').isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve the inventory item details sheet.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   * @returns {Response}
   */
  private async inventoryDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const filter = {
      ...this.matchedQueryData(req),
    };

    try {
      const accept = this.accepts(req);
      const acceptType = accept.types([
        ACCEPT_TYPE.APPLICATION_JSON,
        ACCEPT_TYPE.APPLICATION_JSON_TABLE,
        ACCEPT_TYPE.APPLICATION_CSV,
        ACCEPT_TYPE.APPLICATION_XLSX,
        ACCEPT_TYPE.APPLICATION_PDF,
      ]);
      // Retrieves the csv format.
      if (acceptType === ACCEPT_TYPE.APPLICATION_CSV) {
        const buffer = await this.inventoryItemDetailsApp.csv(tenantId, filter);

        res.setHeader('Content-Disposition', 'attachment; filename=output.csv');
        res.setHeader('Content-Type', 'text/csv');

        return res.send(buffer);
        // Retrieves the xlsx format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_XLSX) {
        const buffer = await this.inventoryItemDetailsApp.xlsx(
          tenantId,
          filter
        );
        res.setHeader(
          'Content-Disposition',
          'attachment; filename=output.xlsx'
        );
        res.setHeader(
          'Content-Type',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
        return res.send(buffer);
        // Retrieves the json table format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_JSON_TABLE) {
        const table = await this.inventoryItemDetailsApp.table(
          tenantId,
          filter
        );
        return res.status(200).send(table);
        // Retrieves the pdf format.
      } else if (acceptType === ACCEPT_TYPE.APPLICATION_PDF) {
        const buffer = await this.inventoryItemDetailsApp.pdf(tenantId, filter);

        res.set({
          'Content-Type': 'application/pdf',
          'Content-Length': buffer.length,
        });
        return res.send(buffer);
      } else {
        const sheet = await this.inventoryItemDetailsApp.sheet(
          tenantId,
          filter
        );
        return res.status(200).send(sheet);
      }
    } catch (error) {
      next(error);
    }
  }
}
