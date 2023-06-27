import { check, param, query, body, ValidationChain } from 'express-validator';
import { Router, Request, Response, NextFunction } from 'express';
import { Inject, Service } from 'typedi';
import { ServiceError } from '@/exceptions';
import BaseController from '@/api/controllers/BaseController';
import ContactsService from '@/services/Contacts/ContactsService';
import DynamicListingService from '@/services/DynamicListing/DynamicListService';
import { DATATYPES_LENGTH } from '@/data/DataTypes';

@Service()
export default class ContactsController extends BaseController {
  @Inject()
  contactsService: ContactsService;

  @Inject()
  dynamicListService: DynamicListingService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.get(
      '/auto-complete',
      [...this.autocompleteQuerySchema],
      this.validationResult,
      this.asyncMiddleware(this.autocompleteContacts.bind(this)),
      this.dynamicListService.handlerErrorsToResponse
    );
    router.get(
      '/:id',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.getContact.bind(this))
    );
    router.post(
      '/:id/inactivate',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.inactivateContact.bind(this)),
      this.handlerServiceErrors
    );
    router.post(
      '/:id/activate',
      [param('id').exists().isNumeric().toInt()],
      this.validationResult,
      this.asyncMiddleware(this.activateContact.bind(this)),
      this.handlerServiceErrors
    );
    return router;
  }

  /**
   * Auto-complete list query validation schema.
   */
  get autocompleteQuerySchema() {
    return [
      query('column_sort_by').optional().trim().escape(),
      query('sort_order').optional().isIn(['desc', 'asc']),

      query('stringified_filter_roles').optional().isJSON(),
      query('limit').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Retrieve details of the given contact.
   * @param {Request} req -
   * @param {Response} res -
   * @param {NextFunction} next -
   */
  async getContact(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      const contact = await this.contactsService.getContact(
        tenantId,
        contactId
      );
      return res.status(200).send({
        customer: this.transformToResponse(contact),
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve auto-complete contacts list.
   * @param {Request} req - Request object.
   * @param {Response} res - Response object.
   * @param {NextFunction} next
   */
  async autocompleteContacts(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const filter = {
      filterRoles: [],
      sortOrder: 'asc',
      columnSortBy: 'display_name',
      limit: 10,
      ...this.matchedQueryData(req),
    };
    try {
      const contacts = await this.contactsService.autocompleteContacts(
        tenantId,
        filter
      );
      return res.status(200).send({ contacts });
    } catch (error) {
      next(error);
    }
  }

  /**
   * @returns {ValidationChain[]}
   */
  get contactDTOSchema(): ValidationChain[] {
    return [
      check('salutation')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('first_name')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('last_name')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('company_name')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),

      check('display_name')
        .exists()
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),

      check('email')
        .optional({ nullable: true })
        .isString()
        .normalizeEmail()
        .isEmail()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('website')
        .optional({ nullable: true })
        .isString()
        .trim()
        .isURL()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('work_phone')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('personal_phone')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),

      check('billing_address_1')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_2')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_city')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_country')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_email')
        .optional({ nullable: true })
        .isString()
        .isEmail()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_postcode')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_phone')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_state')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),

      check('shipping_address_1')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_2')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_city')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_country')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_email')
        .optional({ nullable: true })
        .isString()
        .isEmail()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_postcode')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_phone')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_state')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.STRING }),

      check('note')
        .optional({ nullable: true })
        .isString()
        .trim()
        .escape()
        .isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('active').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Contact new DTO schema.
   * @returns {ValidationChain[]}
   */
  get contactNewDTOSchema(): ValidationChain[] {
    return [
      check('opening_balance')
        .optional({ nullable: true })
        .isInt({ min: 0, max: DATATYPES_LENGTH.DECIMAL_13_3 })
        .toInt(),
      check('opening_balance_exchange_rate')
        .default(1)
        .isFloat({ gt: 0 })
        .toFloat(),
      body('opening_balance_at')
        .if(body('opening_balance').exists())
        .exists()
        .isISO8601(),
      check('opening_balance_branch_id')
        .optional({ nullable: true })
        .isNumeric()
        .toInt(),
    ];
  }

  /**
   * Contact edit DTO schema.
   * @returns {ValidationChain[]}
   */
  get contactEditDTOSchema(): ValidationChain[] {
    return [];
  }

  /**
   * @returns {ValidationChain[]}
   */
  get specificContactSchema(): ValidationChain[] {
    return [param('id').exists().isNumeric().toInt()];
  }

  /**
   * Activates the given contact.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async activateContact(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      await this.contactsService.activateContact(tenantId, contactId);

      return res.status(200).send({
        id: contactId,
        message: 'The given contact activated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Inactivate the given contact.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  async inactivateContact(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: contactId } = req.params;

    try {
      await this.contactsService.inactivateContact(tenantId, contactId);

      return res.status(200).send({
        id: contactId,
        message: 'The given contact inactivated successfully.',
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
          errors: [{ type: 'CONTACT.NOT.FOUND', code: 100 }],
        });
      }
      if (error.errorType === 'CONTACT_ALREADY_ACTIVE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CONTACT_ALREADY_ACTIVE', code: 700 }],
        });
      }
      if (error.errorType === 'CONTACT_ALREADY_INACTIVE') {
        return res.boom.badRequest(null, {
          errors: [{ type: 'CONTACT_ALREADY_INACTIVE', code: 800 }],
        });
      }
    }
    next(error);
  }
}
