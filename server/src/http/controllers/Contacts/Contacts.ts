import { check, param, query } from 'express-validator';
import BaseController from "@/http/controllers/BaseController";

export default class ContactsController extends BaseController {

  /**
   * Contact DTO schema.
   */
  get contactDTOSchema() {
    return [
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
    ];
  }

  /**
   * Contact new DTO schema.
   */
  get contactNewDTOSchema() {
    return [
      check('balance').optional().isNumeric().toInt(),
    ];
  }

  /**
   * Contact edit DTO schema.
   */
  get contactEditDTOSchema() {
    return [

    ]
  }

  get specificContactSchema() {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  get bulkContactsSchema() {
    return [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
    ]
  }
}