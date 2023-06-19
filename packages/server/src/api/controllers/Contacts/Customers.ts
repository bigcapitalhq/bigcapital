import { Request, Response, Router, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check, query } from 'express-validator';
import ContactsController from '@/api/controllers/Contacts/Contacts';
import CustomersService from '@/services/Contacts/CustomersService';
import { ServiceError } from '@/exceptions';
import {
  ICustomerNewDTO,
  ICustomerEditDTO,
  AbilitySubject,
  CustomerAction,
} from '@/interfaces';
import asyncMiddleware from '@/api/middleware/asyncMiddleware';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import CheckPolicies from '@/api/middleware/CheckPolicies';
import { CustomersApplication } from '@/services/Contacts/Customers/CustomersApplication';

@Service()
export default class CustomersController extends ContactsController {
  @Inject()
  private customersApplication: CustomersApplication;

  @Inject()
  private dynamicListService: DynamicListingService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post(
      '/',
      CheckPolicies(CustomerAction.Create, AbilitySubject.Customer),
      [
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
      CheckPolicies(CustomerAction.Edit, AbilitySubject.Customer),
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
      asyncMiddleware(this.editOpeningBalanceCustomer.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id',
      CheckPolicies(CustomerAction.Edit, AbilitySubject.Customer),
      [
        ...this.contactDTOSchema,
        ...this.contactEditDTOSchema,
        ...this.customerDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editCustomer.bind(this)),
      this.handlerServiceErrors
    );
    router.delete(
      '/:id',
      CheckPolicies(CustomerAction.Delete, AbilitySubject.Customer),
      [...this.specificContactSchema],
      this.validationResult,
      asyncMiddleware(this.deleteCustomer.bind(this)),
      this.handlerServiceErrors
    );
    router.get(
      '/',
      CheckPolicies(CustomerAction.View, AbilitySubject.Customer),
      [...this.validateListQuerySchema],
      this.validationResult,
      asyncMiddleware(this.getCustomersList.bind(this)),
      this.dynamicListService.handlerErrorsToResponse
    );
    router.get(
      '/:id',
      CheckPolicies(CustomerAction.View, AbilitySubject.Customer),
      [...this.specificContactSchema],
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

      query('view_slug').optional().isString().trim(),
      query('stringified_filter_roles').optional().isJSON(),

      query('inactive_mode').optional().isBoolean().toBoolean(),
      query('search_keyword').optional({ nullable: true }).isString().trim(),
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
    const { tenantId, user } = req;

    try {
      const contact = await this.customersApplication.createCustomer(
        tenantId,
        contactDTO,
        user
      );

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
    const { tenantId, user } = req;
    const { id: contactId } = req.params;

    try {
      await this.customersApplication.editCustomer(
        tenantId,
        contactId,
        contactDTO,
        user
      );

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
  async editOpeningBalanceCustomer(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId, user } = req;
    const { id: customerId } = req.params;
    const openingBalanceEditDTO = this.matchedBodyData(req);

    try {
      await this.customersApplication.editOpeningBalance(
        tenantId,
        customerId,
        openingBalanceEditDTO
      );
      return res.status(200).send({
        id: customerId,
        message:
          'The opening balance of the given customer has been changed successfully.',
      });
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
    const { tenantId, user } = req;
    const { id: contactId } = req.params;

    try {
      const customer = await this.customersApplication.getCustomer(
        tenantId,
        contactId,
        user
      );

      return res.status(200).send({
        customer: this.transformToResponse(customer),
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
    const { tenantId, user } = req;
    const { id: contactId } = req.params;

    try {
      await this.customersApplication.deleteCustomer(tenantId, contactId, user);

      return res.status(200).send({
        id: contactId,
        message: 'The customer has been deleted successfully.',
      });
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
      inactiveMode: false,
      sortOrder: 'desc',
      columnSortBy: 'created_at',
      page: 1,
      pageSize: 12,
      ...this.matchedQueryData(req),
    };

    try {
      const { customers, pagination, filterMeta } =
        await this.customersApplication.getCustomers(tenantId, filter);

      return res.status(200).send({
        customers: this.transformToResponse(customers),
        pagination: this.transformToResponse(pagination),
        filter_meta: this.transformToResponse(filterMeta),
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
  private handlerServiceErrors(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
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
      if (error.errorType === 'OPENING_BALANCE_DATE_REQUIRED') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'OPENING_BALANCE_DATE_REQUIRED', code: 500 }],
        });
      }
      if (error.errorType === 'CUSTOMER_HAS_TRANSACTIONS') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CUSTOMER_HAS_TRANSACTIONS', code: 600 }],
        });
      }
    }
    next(error);
  }
}
