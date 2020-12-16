import { Request, Response, Router, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check, query } from 'express-validator';
import ContactsController from 'api/controllers/Contacts/Contacts';
import CustomersService from 'services/Contacts/CustomersService';
import { ServiceError } from 'exceptions';
import { ICustomerNewDTO, ICustomerEditDTO } from 'interfaces';
import asyncMiddleware from 'api/middleware/asyncMiddleware';
import DynamicListingService from 'services/DynamicListing/DynamicListService';

@Service()
export default class CustomersController extends ContactsController {
  @Inject()
  customersService: CustomersService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post('/', [
      ...this.contactDTOSchema,
      ...this.contactNewDTOSchema,
      ...this.customerDTOSchema,
      ...this.createCustomerDTOSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.newCustomer.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/opening_balance',
      [
        ...this.specificContactSchema,
        check('opening_balance').exists().isNumeric().toFloat(),
        check('opening_balance_at').optional().isISO8601(),
      ],
      this.validationResult,
      asyncMiddleware(this.editOpeningBalanceCustomer.bind(this)),
      this.handlerServiceErrors,
    );
    router.post('/:id', [
      ...this.contactDTOSchema,
      ...this.contactEditDTOSchema,
      ...this.customerDTOSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.editCustomer.bind(this)),
      this.handlerServiceErrors,
    );
    router.delete('/:id', [
      ...this.specificContactSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.deleteCustomer.bind(this)),
      this.handlerServiceErrors,
    );
    router.delete('/', [
      ...this.bulkContactsSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.deleteBulkCustomers.bind(this)),
      this.handlerServiceErrors,
    );
    router.get('/', [
      ...this.validateListQuerySchema,
    ],
      this.validationResult,
      asyncMiddleware(this.getCustomersList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse,
    );
    router.get('/:id', [
      ...this.specificContactSchema,
    ],
      this.validationResult,
      asyncMiddleware(this.getCustomer.bind(this)),
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Customer DTO schema.
   */
  get customerDTOSchema() {
    return [
      check('customer_type')
        .exists()
        .isIn(['business', 'individual'])
        .trim()
        .escape(),
    ];
  }

  /**
   * Create customer DTO schema.
   */
  get createCustomerDTOSchema() {
    return [
      check('currency_code')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: 3 }),
    ];
  }

  /**
   * List param query schema.
   */
  get validateListQuerySchema() {
    return [
      query('column_sort_by').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),

      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
    ];
  }

  /**
   * Creates a new customer.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async newCustomer(req: Request, res: Response, next: NextFunction) {
    const contactDTO: ICustomerNewDTO = this.matchedBodyData(req);
    const { tenantId } = req;

    try {
      const contact = await this.customersService.newCustomer(tenantId, contactDTO);

      return res.status(200).send({
        id: contact.id,
        message: 'The customer has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits the given customer details.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async editCustomer(req: Request, res: Response, next: NextFunction) {
    const contactDTO: ICustomerEditDTO = this.matchedBodyData(req);
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      await this.customersService.editCustomer(tenantId, contactId, contactDTO);

      return res.status(200).send({
        id: contactId,
        message: 'The customer has been edited successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Changes the opening balance of the given customer.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async editOpeningBalanceCustomer(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: customerId } = req.params;
    const {
      openingBalance,
      openingBalanceAt,
    } = this.matchedBodyData(req);

    try {
      await this.customersService.changeOpeningBalance(
        tenantId,
        customerId,
        openingBalance,
        openingBalanceAt,
      );
      return res.status(200).send({
        id: customerId,
        message: 'The opening balance of the given customer has been changed successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given customer from the storage.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async deleteCustomer(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      await this.customersService.deleteCustomer(tenantId, contactId)
      return res.status(200).send({ id: contactId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve details of the given customer id.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async getCustomer(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      const customer = await this.customersService.getCustomer(tenantId, contactId);

      return res.status(200).send({
        customer: this.transfromToResponse(customer),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes customers in bulk.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async deleteBulkCustomers(req: Request, res: Response, next: NextFunction) {
    const { ids: contactsIds } = req.query;
    const { tenantId } = req;

    try {
      await this.customersService.deleteBulkCustomers(tenantId, contactsIds)
      return res.status(200).send({ ids: contactsIds });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve customers paginated and filterable list.
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  async getCustomersList(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      filterRoles: [],
      sortOrder: 'asc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };
    if (filter.stringifiedFilterRoles) {
      filter.filterRoles = JSON.parse(filter.stringifiedFilterRoles);
    }

    try {
      const {
        customers,
        pagination,
        filterMeta,
      } = await this.customersService.getCustomersList(tenantId, filter);

      return res.status(200).send({
        customers: this.transfromToResponse(customers),
        pagination: this.transfromToResponse(pagination),
        filter_meta: this.transfromToResponse(filterMeta),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Handles service errors.
   * @param {Error} error 
   * @param {Request} req 
   * @param {Response} res 
   * @param {NextFunction} next 
   */
  handlerServiceErrors(error: Error, req: Request, res: Response, next: NextFunction) {
    if (error instanceof ServiceError) {
      if (error.errorType === 'contact_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'contacts_not_found') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMERS.NOT.FOUND', code: 200 }],
        });
      }
      if (error.errorType === 'some_customers_have_invoices') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'SOME.CUSTOMERS.HAVE.SALES_INVOICES', code: 300 }],
        });
      }
      if (error.errorType === 'customer_has_invoices') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER.HAS.SALES_INVOICES', code: 400 }],
        });
      }
      if (error.errorType === 'OPENING_BALANCE_DATE_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'OPENING_BALANCE_DATE_REQUIRED', code: 500 }],
        });
      }
    }
    next(error);
  }
}