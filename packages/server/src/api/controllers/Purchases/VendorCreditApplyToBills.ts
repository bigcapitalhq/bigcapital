import { Service, Inject } from 'typedi';
import { Router, Request, Response, NextFunction } from 'express';
import { param, check } from 'express-validator';
import BaseController from '../BaseController';
import ApplyVendorCreditToBills from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/ApplyVendorCreditToBills';
import DeleteApplyVendorCreditToBill from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/DeleteApplyVendorCreditToBill';
import { ServiceError } from '@/exceptions';
import GetAppliedBillsToVendorCredit from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/GetAppliedBillsToVendorCredit';
import GetVendorCreditToApplyBills from '@/services/Purchases/VendorCredits/ApplyVendorCreditToBills/GetVendorCreditToApplyBills';

@Service()
export default class VendorCreditApplyToBills extends BaseController {
  @Inject()
  applyVendorCreditToBillsService: ApplyVendorCreditToBills;

  @Inject()
  deleteAppliedCreditToBillsService: DeleteApplyVendorCreditToBill;

  @Inject()
  getAppliedBillsToCreditService: GetAppliedBillsToVendorCredit;

  @Inject()
  getCreditToApplyBillsService: GetVendorCreditToApplyBills;

  /**
   *
   * @returns
   */
  router() {
    const router = Router();

    router.post(
      '/:id/apply-to-bills',
      [
        param('id').exists().isNumeric().toInt(),

        check('entries').isArray({ min: 1 }),
        check('entries.*.bill_id').exists().isInt().toInt(),
        check('entries.*.amount').exists().isNumeric().toFloat(),
      ],
      this.validationResult,
      this.asyncMiddleware(this.applyVendorCreditToBills),
      this.handleServiceErrors
    );
    router.delete(
      '/applied-to-bills/:applyId',
      [param('applyId').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.deleteApplyCreditToBill),
      this.handleServiceErrors
    );
    router.get(
      '/:id/apply-to-bills',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getVendorCreditAssociatedBillsToApply),
      this.handleServiceErrors
    );
    router.get(
      '/:id/applied-bills',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getVendorCreditAppliedBills),
      this.handleServiceErrors
    );
    return router;
  }

  /**
   * Apply vendor credit to the given bills.
   * @param {Request}
   * @param {Response}
   * @param {NextFunction}
   */
  public applyVendorCreditToBills = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: vendorCreditId } = req.params;
    const applyCreditToBillsDTO = this.matchedBodyData(req);

    try {
      await this.applyVendorCreditToBillsService.applyVendorCreditToBills(
        tenantId,
        vendorCreditId,
        applyCreditToBillsDTO
      );
      return res.status(200).send({
        id: vendorCreditId,
        message:
          'The vendor credit has been applied to the given bills successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Deletes vendor credit applied to bill transaction.
   * @param {Request}
   * @param {Response}
   * @param {NextFunction}
   */
  public deleteApplyCreditToBill = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { applyId } = req.params;

    try {
      await this.deleteAppliedCreditToBillsService.deleteApplyVendorCreditToBills(
        tenantId,
        applyId
      );
      return res.status(200).send({
        id: applyId,
        message:
          'The applied vendor credit to bill has been deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   */
  public getVendorCreditAssociatedBillsToApply = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: vendorCreditId } = req.params;

    try {
      const bills =
        await this.getCreditToApplyBillsService.getCreditToApplyBills(
          tenantId,
          vendorCreditId
        );
      return res.status(200).send({ data: bills });
    } catch (error) {
      next(error);
    }
  };

  /**
   *
   */
  public getVendorCreditAppliedBills = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const { tenantId } = req;
    const { id: vendorCreditId } = req.params;

    try {
      const appliedBills =
        await this.getAppliedBillsToCreditService.getAppliedBills(
          tenantId,
          vendorCreditId
        );
      return res.status(200).send({ data: appliedBills });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Handles service errors.
   * @param {Error} error
   * @param {Request} req
   * @param {Response} res
   * @param next
   */
  handleServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'VENDOR_CREDIT_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR_CREDIT_NOT_FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'BILL_ENTRIES_IDS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'BILL_ENTRIES_IDS_NOT_FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'BILLS_NOT_OPENED_YET') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'BILLS_NOT_OPENED_YET', code: 300 }],
        });
      }
      if (error.errorType === 'BILLS_HAS_NO_REMAINING_AMOUNT') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'BILLS_HAS_NO_REMAINING_AMOUNT', code: 400 }],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_HAS_NO_REMAINING_AMOUNT') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'VENDOR_CREDIT_HAS_NO_REMAINING_AMOUNT', code: 500 },
          ],
        });
      }
      if (error.errorType === 'VENDOR_CREDIT_APPLY_TO_BILLS_NOT_FOUND') {
        return res.boom.badRequest(null, {
          errors: [
            { type: 'VENDOR_CREDIT_APPLY_TO_BILLS_NOT_FOUND', code: 600 },
          ],
        });
      }
    }
    next(error);
  }
}
