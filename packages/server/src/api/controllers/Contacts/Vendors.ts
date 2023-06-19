import { Request, Response, Router, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { body, query, ValidationChain, check } from 'express-validator';

import ContactsController from '@/api/controllers/Contacts/Contacts';
import { ServiceError } from '@/exceptions';
import {
  IVendorNewDTO,
  IVendorEditDTO,
  IVendorsFilter,
  AbilitySubject,
  VendorAction,
} from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { VendorsApplication } from '@/services/Contacts/Vendors/VendorsApplication';

@Service()
export default class VendorsController extends ContactsController {
  @Inject()
  private vendorsApplication: VendorsApplication;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(VendorAction.Create, AbilitySubject.Vendor),
      [
        ...this.contactDTOSchema,
        ...this.contactNewDTOSchema,
        ...this.vendorDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.newVendor.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/opening_balance',
      CheckPolicies(VendorAction.Edit, AbilitySubject.Vendor),
      [
        ...this.specificContactSchema,
        check('opening_balance').exists().isNumeric().toFloat(),
        check('opening_balance_at').optional().isISO8601(),
        check('opening_balance_exchange_rate')
          .default(1)
          .isFloat({ gt: 0 })
          .toFloat(),
        check('opening_balance_branch_id')
          .optional({ nullable: true })
          .isNumeric()
          .toInt(),
      ],
      this.validationResult,
      asyncMiddleware(this.editOpeningBalanceVendor.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(VendorAction.Edit, AbilitySubject.Vendor),
      [
        ...this.contactDTOSchema,
        ...this.contactEditDTOSchema,
        ...this.vendorDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editVendor.bind(this)),
      this.handlerServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(VendorAction.Delete, AbilitySubject.Vendor),
      [...this.specificContactSchema],
      this.validationResult,
      asyncMiddleware(this.deleteVendor.bind(this)),
      this.handlerServiceErrors
    );
    router.get(
      '/:id',
      CheckPolicies(VendorAction.View, AbilitySubject.Vendor),
      [...this.specificContactSchema],
      this.validationResult,
      asyncMiddleware(this.getVendor.bind(this)),
      this.handlerServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(VendorAction.View, AbilitySubject.Vendor),
      [...this.vendorsListSchema],
      this.validationResult,
      asyncMiddleware(this.getVendorsList.bind(this))
    );
    return router;
  }

  /**
   * Vendor DTO schema.
   * @returns {ValidationChain[]}
   */
  get vendorDTOSchema(): ValidationChain[] {
    return [
      check('currency_code')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ min: 3, max: 3 }),
    ];
  }

  /**
   * Vendors datatable list validation schema.
   * @returns {ValidationChain[]}
   */
  get vendorsListSchema() {
    return [
      query('view_slug').optional().isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('inactive_mode').optional().isBoolean().toBoolean(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
    ];
  }

  /**
   * Creates a new vendor.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async newVendor(req: Request, res: Response, next: NextFunction) {
    const contactDTO: IVendorNewDTO = this.matchedBodyData(req);
    const { tenantId, user } = req;

    try {
      const vendor = await this.vendorsApplication.createVendor(
        tenantId,
        contactDTO,
        user
      );

      return res.status(200).send({
        id: vendor.id,
        message: 'The vendor has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits the given vendor details.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async editVendor(req: Request, res: Response, next: NextFunction) {
    const contactDTO: IVendorEditDTO = this.matchedBodyData(req);
    const { tenantId, user } = req;
    const { id: contactId } = req.params;

    try {
      await this.vendorsApplication.editVendor(
        tenantId,
        contactId,
        contactDTO,
        user
      );

      return res.status(200).send({
        id: contactId,
        message: 'The vendor has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Changes the opening balance of the given vendor.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async editOpeningBalanceVendor(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, user } = req;
    const { id: vendorId } = req.params;
    const editOpeningBalanceDTO = this.matchedBodyData(req);

    try {
      await this.vendorsApplication.editOpeningBalance(
        tenantId,
        vendorId,
        editOpeningBalanceDTO
      );
      return res.status(200).send({
        id: vendorId,
        message:
          'The opening balance of the given vendor has been changed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given vendor from the storage.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async deleteVendor(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: contactId } = req.params;

    try {
      await this.vendorsApplication.deleteVendor(tenantId, contactId, user);

      return res.status(200).send({
        id: contactId,
        message: 'The vendor has been deleted successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve details of the given vendor id.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getVendor(req: Request, res: Response, next: NextFunction) {
    const { tenantId, user } = req;
    const { id: vendorId } = req.params;

    try {
      const vendor = await this.vendorsApplication.getVendor(
        tenantId,
        vendorId,
        user
      );
      return res.status(200).send(this.transformToResponse({ vendor }));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve vendors datatable list.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async getVendorsList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    const vendorsFilter: IVendorsFilter = {
      inactiveMode: false,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { vendors, pagination, filterMeta } =
        await this.vendorsApplication.getVendors(tenantId, vendorsFilter);

      return res.status(200).send({
        vendors: this.transformToResponse(vendors),
        pagination: this.transformToResponse(pagination),
        filter_meta: this.transformToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handle service errors.
   * @param {Error} error -
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  private handlerServiceErrors(
    error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'contacts_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDORS.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'OPENING_BALANCE_DATE_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'OPENING_BALANCE_DATE_REQUIRED', code: 500 }],
        });
      }
      if (error.errorType === 'VENDOR_HAS_TRANSACTIONS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'VENDOR_HAS_TRANSACTIONS', code: 600 }],
        });
      }
    }
    next(error);
  }
}
