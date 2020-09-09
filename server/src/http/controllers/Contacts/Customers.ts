import { Request, Response, Router, NextFunction } from 'express';
import { Service, Inject } from 'typedi';
import { check } from 'express-validator';
import ContactsController from '@/http/controllers/Contacts/Contacts';
import CustomersService from '@/services/Contacts/CustomersService';
import { ServiceError } from '@/exceptions';
import { ICustomerNewDTO, ICustomerEditDTO } from '@/interfaces';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';

@Service()
export default class CustomersController extends ContactsController {
  @Inject()
  customersService: CustomersService;

  /**
   * Express router.
   */
  router() {
    const router = Router();

    router.post('/', [
        ...this.contactDTOSchema,
        ...this.contactNewDTOSchema,
        ...this.customerDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.newCustomer.bind(this))
    );
    router.post('/:id', [
        ...this.contactDTOSchema,
        ...this.contactEditDTOSchema,
        ...this.customerDTOSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.editCustomer.bind(this))
    );
    router.delete('/:id', [
        ...this.specificContactSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.deleteCustomer.bind(this))
    );
    router.delete('/', [
        ...this.bulkContactsSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.deleteBulkCustomers.bind(this))
    );
    router.get('/:id', [
        ...this.specificContactSchema,
      ],
      this.validationResult,
      asyncMiddleware(this.getCustomer.bind(this))
    );
    return router;
  }

  /**
   * Customer DTO schema.
   */
  get customerDTOSchema() {
    return [
      check('customer_type').exists().trim().escape(),
      check('opening_balance').optional().isNumeric().toInt(),
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
      return res.status(200).send({ id: contact.id });
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
      await this.customersService.editCustomer(tenantId, contactId, contactDTO;)
      return res.status(200).send({ id: contactId });
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.errorType === 'contact_not_found') {
          return res.boom.badRequest(null, {
            errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 100 }],
          });
        }
      }
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
      if (error instanceof ServiceError) {
        if (error.errorType === 'contact_not_found') {
          return res.boom.badRequest(null, {
            errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 100 }],
          });
        }
        if (error.errorType === 'customer_has_invoices') {
          return res.boom.badRequest(null, {
            errors: [{ type: 'CUSTOMER.HAS.SALES_INVOICES', code: 200 }],
          });
        }
      }
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
      const contact = await this.customersService.getCustomer(tenantId, contactId)
      return res.status(200).send({ contact });
    } catch (error) {
      if (error instanceof ServiceError) {
        if (error.errorType === 'contact_not_found') {
          return res.boom.badRequest(null, {
            errors: [{ type: 'CONTACT.NOT.FOUND', code: 100 }],
          });
        }
      }
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
      if (error instanceof ServiceError) {
        if (error.errorType === 'contacts_not_found') {
          return res.boom.badRequest(null, {
            errors: [{ type: 'CUSTOMERS.NOT.FOUND', code: 100 }],
          });
        }
        if (error.errorType === 'some_customers_have_invoices') {
          return res.boom.badRequest(null, {
            errors: [{ type: 'SOME.CUSTOMERS.HAVE.SALES_INVOICES', code: 200 }],
          });
        }
      }
      next(error);
    }
  }
}