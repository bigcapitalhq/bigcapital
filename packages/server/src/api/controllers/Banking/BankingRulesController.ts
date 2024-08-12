import { Inject, Service } from 'typedi';
import { NextFunction, Request, Response, Router } from 'express';
import BaseController from '@/api/controllers/BaseController';
import { BankRulesApplication } from '@/services/Banking/Rules/BankRulesApplication';
import { body, param } from 'express-validator';
import {
  ICreateBankRuleDTO,
  IEditBankRuleDTO,
} from '@/services/Banking/Rules/types';

@Service()
export class BankingRulesController extends BaseController {
  @Inject()
  private bankRulesApplication: BankRulesApplication;

  /**
   * Bank rule DTO validation schema.
   */
  private get bankRuleValidationSchema() {
    return [
      body('name').isString().exists(),
      body('order').isInt({ min: 0 }),

      // Apply to if transaction is.
      body('apply_if_account_id')
        .isInt({ min: 0 })
        .optional({ nullable: true }),
      body('apply_if_transaction_type').isIn(['deposit', 'withdrawal']),

      // Conditions
      body('conditions_type').isString().isIn(['and', 'or']).default('and'),
      body('conditions').isArray({ min: 1 }),
      body('conditions.*.field').exists().isIn(['description', 'amount']),
      body('conditions.*.comparator')
        .exists()
        .isIn([
          'equals',
          'equal',
          'contains',
          'not_contain',
          'bigger',
          'bigger_or_equal',
          'smaller',
          'smaller_or_equal',
        ])
        .default('contain')
        .trim(),
      body('conditions.*.value').exists().trim(),

      // Assign
      body('assign_category').isString(),
      body('assign_account_id').isInt({ min: 0 }),
      body('assign_payee').isString().optional({ nullable: true }),
      body('assign_memo').isString().optional({ nullable: true }),
    ];
  }

  /**
   * Router constructor.
   */
  public router() {
    const router = Router();

    router.post(
      '/',
      [...this.bankRuleValidationSchema],
      this.validationResult,
      this.createBankRule.bind(this)
    );
    router.post(
      '/:id',
      [param('id').toInt().exists(), ...this.bankRuleValidationSchema],
      this.validationResult,
      this.editBankRule.bind(this)
    );
    router.delete(
      '/:id',
      [param('id').toInt().exists()],
      this.validationResult,
      this.deleteBankRule.bind(this)
    );
    router.get(
      '/:id',
      [param('id').toInt().exists()],
      this.validationResult,
      this.getBankRule.bind(this)
    );
    router.get(
      '/',
      [param('id').toInt().exists()],
      this.validationResult,
      this.getBankRules.bind(this)
    );
    return router;
  }

  /**
   * Creates a new bank rule.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async createBankRule(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { tenantId } = req;
    const createBankRuleDTO = this.matchedBodyData(req) as ICreateBankRuleDTO;

    try {
      const bankRule = await this.bankRulesApplication.createBankRule(
        tenantId,
        createBankRuleDTO
      );
      return res.status(200).send({
        id: bankRule.id,
        message: 'The bank rule has been created successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Edits the given bank rule.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async editBankRule(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;
    const { id: ruleId } = req.params;
    const editBankRuleDTO = this.matchedBodyData(req) as IEditBankRuleDTO;

    try {
      await this.bankRulesApplication.editBankRule(
        tenantId,
        ruleId,
        editBankRuleDTO
      );
      return res.status(200).send({
        id: ruleId,
        message: 'The bank rule has been updated successfully.',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Deletes the given bank rule.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async deleteBankRule(
    req: Request<{ id: number }>,
    res: Response,
    next: NextFunction
  ) {
    const { id: ruleId } = req.params;
    const { tenantId } = req;

    try {
      await this.bankRulesApplication.deleteBankRule(tenantId, ruleId);

      return res
        .status(200)
        .send({ message: 'The bank rule has been deleted.', id: ruleId });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieve the given bank rule.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getBankRule(req: Request, res: Response, next: NextFunction) {
    const { id: ruleId } = req.params;
    const { tenantId } = req;

    try {
      const bankRule = await this.bankRulesApplication.getBankRule(
        tenantId,
        ruleId
      );

      return res.status(200).send({ bankRule });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Retrieves the bank rules.
   * @param {Request} req
   * @param {Response} res
   * @param {NextFunction} next
   */
  private async getBankRules(req: Request, res: Response, next: NextFunction) {
    const { tenantId } = req;

    try {
      const bankRules = await this.bankRulesApplication.getBankRules(tenantId);
      return res.status(200).send({ bankRules });
    } catch (error) {
      next(error);
    }
  }
}
