import { check, param, query, body, ValidationChain } from 'express-validator';
import BaseController from "api/controllers/BaseController";
import { DATATYPES_LENGTH } from 'data/DataTypes';

export default class ContactsController extends BaseController {
  /**
   * @returns {ValidationChain[]}
   */
  get contactDTOSchema(): ValidationChain[] {
    return [
      check('salutation').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('first_name').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('last_name').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),

      check('company_name').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('display_name').exists().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),

      check('email').optional({ nullable: true }).isString().normalizeEmail().isEmail().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('website').optional().isString().trim().isURL().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('work_phone').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('personal_phone').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),

      check('billing_address_1').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_2').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_city').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_country').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_email').optional().isString().isEmail().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_postcode').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_phone').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('billing_address_state').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),

      check('shipping_address_1').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_2').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_city').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_country').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_email').optional().isString().isEmail().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_postcode').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_phone').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),
      check('shipping_address_state').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.STRING }),

      check('note').optional().isString().trim().escape().isLength({ max: DATATYPES_LENGTH.TEXT }),
      check('active').optional().isBoolean().toBoolean(),
    ];
  }

  /**
   * Contact new DTO schema.
   * @returns {ValidationChain[]}
   */
  get contactNewDTOSchema(): ValidationChain[] {
    return [
      check('opening_balance').optional({ nullable: true }).isInt({ min: 0, max: DATATYPES_LENGTH.DECIMAL_13_3 }).toInt(),
      body('opening_balance_at')
        .if(body('opening_balance').exists()).exists()
        .isISO8601(),
    ];
  }

  /**
   * Contact edit DTO schema.
   * @returns {ValidationChain[]}
   */
  get contactEditDTOSchema(): ValidationChain[] {
    return [

    ]
  }

  /**
   * @returns {ValidationChain[]}
   */
  get specificContactSchema(): ValidationChain[] {
    return [
      param('id').exists().isNumeric().toInt(),
    ];
  }

  /**
   * @returns {ValidationChain[]}
   */
  get bulkContactsSchema(): ValidationChain[] {
    return [
      query('ids').isArray({ min: 2 }),
      query('ids.*').isNumeric().toInt(),
    ]
  }
}