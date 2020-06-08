import express from 'express';
import {
  check,
  param,
  query,
  validationResult,
} from 'express-validator';
import { pick } from 'lodash';
import asyncMiddleware from '@/http/middleware/asyncMiddleware';
import {
  mapViewRolesToConditionals,
  mapFilterRolesToDynamicFilter,
} from '@/lib/ViewRolesBuilder';
import {
  DynamicFilter,
  DynamicFilterSortBy,
  DynamicFilterViews,
  DynamicFilterFilterRoles,
} from '@/lib/DynamicFilter';


const validatioRoles = [
  check('customer_type')
    .exists()
    .isIn(['individual', 'business'])
    .trim()
    .escape(),
  check('first_name').optional().trim().escape(),
  check('last_name').optional().trim().escape(),

  check('company_name').optional().trim().escape(),

  check('display_name').exists().trim().escape(),

  check('email').optional().isEmail().trim().escape(),
  check('work_phone').optional().trim().escape(),
  check('personal_phone').optional().trim().escape(),

  check('billing_address_city').optional().trim().escape(),
  check('billing_address_country').optional().trim().escape(),
  check('billing_address_email').optional().isEmail().trim().escape(),
  check('billing_address_zipcode').optional().trim().escape(),
  check('billing_address_phone').optional().trim().escape(),
  check('billing_address_state').optional().trim().escape(),

  check('shipping_address_city').optional().trim().escape(),
  check('shipping_address_country').optional().trim().escape(),
  check('shipping_address_email').optional().isEmail().trim().escape(),
  check('shipping_address_zip_code').optional().trim().escape(),
  check('shipping_address_phone').optional().trim().escape(),
  check('shipping_address_state').optional().trim().escape(),

  check('note').optional().trim().escape(),
  check('active').optional().isBoolean().toBoolean(),

  check('custom_fields').optional().isArray({ min: 1 }),
  check('custom_fields.*.key').exists().trim().escape(),
  check('custom_fields.*.value').exists(),
];

export default {
  /**
   * Router constructor.
   */
  router() {
    const router = express.Router();

    router.post('/',
      this.newCustomer.validation,
      asyncMiddleware(this.newCustomer.handler));

    router.post('/:id',
      this.editCustomer.validation,
      asyncMiddleware(this.editCustomer.handler));

    router.delete('/:id',
      this.deleteCustomer.validation,
      asyncMiddleware(this.deleteCustomer.handler));

    router.get('/',
      this.listCustomers.validation,
      asyncMiddleware(this.listCustomers.handler));

    router.get('/:id',
      this.getCustomer.validation,
      asyncMiddleware(this.getCustomer.handler));

    return router;
  },

  /**
   * Retrieve customers list with pagination and custom view metadata.
   */
  listCustomers: {
    validation: [
      query('column_sort_order').optional().isIn(['created_at']),
      query('sort_order').optional().isIn(['desc', 'asc']),
      query('page').optional().isNumeric().toInt(),
      query('page_size').optional().isNumeric().toInt(),
      query('custom_view_id').optional().isNumeric().toInt(),
      query('stringified_filter_roles').optional().isJSON(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Resource, View, Customer } = req.models;
      const errorReasons = [];

      const customersResource = await Resource.query()
        .where('name', 'customers')
        .withGraphFetched('fields')
        .first();

      if (!customersResource) {
        return res.status(400).send({
          errors: [{ type: 'CUSTOMERS.RESOURCE.NOT.FOUND', code: 200 }],
        });
      }

      const filter = {
        column_sort_order: '',
        sort_order: '',
        page: 1,
        page_size: 10,
        custom_view_id: null,
        filter_roles: [],
        ...req.query,
      };
      if (filter.stringified_filter_roles) {
        filter.filter_roles = JSON.parse(filter.stringified_filter_roles);
      }
      const view = await View.query().onBuild((builder) => {
        if (filter.custom_view_id) {
          builder.where('id', filter.custom_view_id);
        } else {
          builder.where('favourite', true);
        }
        builder.where('resource_id', customersResource.id);
        builder.withGraphFetched('roles.field');
        builder.withGraphFetched('columns');
        builder.first();
      });
      const resourceFieldsKeys = customersResource.fields.map((c) => c.key);
      const dynamicFilter = new DynamicFilter(Customer.tableName);

      // Dynamic filter with view roles.
      if (view && view.roles.length > 0) {
        const viewFilter = new DynamicFilterViews(
          mapViewRolesToConditionals(view.roles),
          view.rolesLogicExpression,
        );
        if (!viewFilter.validateFilterRoles()) {
          errorReasons.push({ type: 'VIEW.LOGIC.EXPRESSION.INVALID', code: 400 });
        }
        dynamicFilter.setFilter(viewFilter);
      }

      // Dynamic filter with filter roles.
      if (filter.filter_roles.length > 0) {
        // Validate the accounts resource fields.
        const filterRoles = new DynamicFilterFilterRoles(
          mapFilterRolesToDynamicFilter(filter.filter_roles),
          customersResource.fields,
        );
        dynamicFilter.setFilter(filterRoles);

        if (filterRoles.validateFilterRoles().length > 0) {
          errorReasons.push({ type: 'ITEMS.RESOURCE.HAS.NO.FIELDS', code: 500 });
        }
      }

      // Dynamic filter with column sort order.
      if (filter.column_sort_order) {
        if (resourceFieldsKeys.indexOf(filter.column_sort_order) === -1) {
          errorReasons.push({ type: 'COLUMN.SORT.ORDER.NOT.FOUND', code: 300 });
        }
        const sortByFilter = new DynamicFilterSortBy(
          filter.column_sort_order,
          filter.sort_order,
        );
        dynamicFilter.setFilter(sortByFilter);
      }
      if (errorReasons.length > 0) {
        return res.status(400).send({ errors: errorReasons });
      }
      // Customers query.
      const customers = await Customer.query().onBuild((builder) => {
        dynamicFilter.buildQuery()(builder);
      }).pagination(filter.page - 1, filter.page_size);

      return res.status(200).send({
        customers,
        ...(view) ? {
          customViewId: view.id,
        } : {},
      });
    }
  },

  /**
   * Submit a new customer details.
   */
  newCustomer: {
    validation: [
      ...validatioRoles,
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Customer } = req.models;
      const form = { ...req.body };

      const customer = await Customer.query().insertAndFetch({
        ...pick(form, [
          'customer_type',
          'first_name',
          'last_name',
          'company_name',
          'display_name',
          
          'email',
          'work_phone',
          'personal_phone',

          'billing_address_1',
          'billing_address_2',
          'billing_address_city',
          'billing_address_country',
          'billing_address_email',
          'billing_address_zipcode',
          'billing_address_phone',
          'billing_address_state',

          'shipping_address_1',
          'shipping_address_2',
          'shipping_address_city',
          'shipping_address_country',
          'shipping_address_email',
          'shipping_address_zipcode',
          'shipping_address_phone',
          'shipping_address_state',

          'note',
          'active',
        ]), 
      });

      return res.status(200).send({ id: customer.id });
    },
  },

  /**
   * Edit details of the given customer id.
   */
  editCustomer: {
    validation: [
      param('id').exists().isNumeric().toInt(),
      ...validatioRoles,
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { id } = req.params;
      const form = { ...req.body };
      const { Customer } = req.models;
      const customer = await Customer.query().where('id', id).first();

      if (!customer) {
        return res.status(404).send({
          errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 200 }],
        });
      }

      await Customer.query().where('id', id).patch({
        ...pick(form, [
          'customer_type',
          'first_name',
          'last_name',
          'company_name',
          'display_name',
          
          'email',
          'work_phone',
          'personal_phone',

          'billing_address_1',
          'billing_address_2',
          'billing_address_city',
          'billing_address_country',
          'billing_address_email',
          'billing_address_zipcode',
          'billing_address_phone',
          'billing_address_state',

          'shipping_address_1',
          'shipping_address_2',
          'shipping_address_city',
          'shipping_address_country',
          'shipping_address_email',
          'shipping_address_zipcode',
          'shipping_address_phone',
          'shipping_address_state',

          'note',
          'active',
        ]),
      });
      return res.status(200).send({ id });
    },
  },

  /**
   * Retrieve details of the given customer id.
   */
  getCustomer: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Customer } = req.models;
      const { id } = req.params;
      const customer = await Customer.query().where('id', id).first();

      if (!customer) {
        return res.status(404).send({
          errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 200 }],
        });
      }
      return res.status(200).send({ customer });
    },
  },

  /**
   * Delete the given customer.
   */
  deleteCustomer: {
    validation: [
      param('id').exists().isNumeric().toInt(),
    ],
    async handler(req, res) {
      const validationErrors = validationResult(req);

      if (!validationErrors.isEmpty()) {
        return res.boom.badData(null, {
          code: 'validation_error', ...validationErrors,
        });
      }
      const { Customer } = req.models;
      const { id } = req.params;
      const customer = await Customer.query().where('id', id).first();

      if (!customer) {
        return res.status(404).send({
          errors: [{ type: 'CUSTOMER.NOT.FOUND', code: 200 }],
        });
      }
      await Customer.query().where('id', id).delete();

      return res.status(200).send();
    },
  }
};
