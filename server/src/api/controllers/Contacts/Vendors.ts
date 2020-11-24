import { Request, Response, Router, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { body, query, ValidationChain, check } from 'express-validator';

import ContactsController from 'api/controllers/Contacts/Contacts';
import VendorsService from 'services/Contacts/VendorsService';
import { ServiceError } from 'exceptions';
import { IVendorNewDTO, IVendorEditDTO, IVendorsFilter } from 'interfaces';
import asyncMiddleware from 'api/middleware/asyncMiddleware';

@Service()
export default class VendorsController extends ContactsController {
  @Inject()
  vendorsService: VendorsService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post('/', [
      ...this.contactDTOSchema,
      ...this.contactNewDTOSchema,
      ...this.vendorDTOSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.newVendor.bind(this)),
      this.handlerServiceErrors,
    );
    router.post('/:id', [
      ...this.contactDTOSchema,
      ...this.contactEditDTOSchema,
      ...this.vendorDTOSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.editVendor.bind(this)),
      this.handlerServiceErrors,
    );
    router.delete('/:id', [
      ...this.specificContactSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.deleteVendor.bind(this)),
      this.handlerServiceErrors,
    );
    router.delete('/', [
      ...this.bulkContactsSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.deleteBulkVendors.bind(this)),
      this.handlerServiceErrors,
    );
    router.get('/:id', [
      ...this.specificContactSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.getVendor.bind(this)),
      this.handlerServiceErrors,
    );
    router.get('/', [
      ...this.vendorsListSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.getVendorsList.bind(this)),
    );
    return router;
  }

  /**
   * Vendor DTO schema.
   * @returns {ValidationChain[]}
   */
  get vendorDTOSchema(): ValidationChain[] {
    return [
      check('currency_code').optional().trim().escape(),
    ];
  }

  /**
   * Vendors datatable list validation schema.
   * @returns {ValidationChain[]}
   */
  get vendorsListSchema() {
    return [
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),

      query('column_sort_by').optional(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
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
    const { tenantId } = req;

    try {
      const vendor = await this.vendorsService.newVendor(tenantId, contactDTO);

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
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      await this.vendorsService.editVendor(tenantId, contactId, contactDTO);

      return res.status(200).send({
        id: contactId,
        message: 'The vendor has been edited successfully.',
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
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      await this.vendorsService.deleteVendor(tenantId, contactId)

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
    const { tenantId } = req;
    const { id: vendorId } = req.params;

    try {
      const vendor = await this.vendorsService.getVendor(tenantId, vendorId)
      return res.status(200).send({ vendor });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes vendors in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async deleteBulkVendors(req: Request, res: Response, next: NextFunction) {
    const { ids: contactsIds } = req.query;
    const { tenantId } = req;

    try {
      await this.vendorsService.deleteBulkVendors(tenantId, contactsIds)
      return res.status(200).send({ ids: contactsIds });
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
      filterRoles: [],
      ...this.matchedBodyData(req),
    };

    try {
      const {
        vendors,
        pagination,
        filterMeta,
      } = await this.vendorsService.getVendorsList(tenantId, vendorsFilter);

      return res.status(200).send({
        vendors,
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
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
  handlerServiceErrors(error, req: Request, res: Response, next: NextFunction) {
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
      if (error.errorType === 'some_vendors_have_bills') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SOME.VENDORS.HAVE.BILLS', code: 300 }],
        });
      }
      if (error.errorType === 'vendor_has_bills') {
        return res.status(400).send({
          errors: [{ type: 'VENDOR.HAS.BILLS', code: 400 }],
        });
      }
    }
    next(error);
  }
}