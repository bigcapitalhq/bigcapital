import { Inject, Service } from 'typedi';
import { CreateBankRuleService } from './CreateBankRule';
import { DeleteBankRuleSerivce } from './DeleteBankRule';
import { EditBankRuleService } from './EditBankRule';
import { GetBankRuleService } from './GetBankRule';
import { GetBankRulesService } from './GetBankRules';
import { ICreateBankRuleDTO, IEditBankRuleDTO } from './types';

@Service()
export class BankRulesApplication {
  @Inject()
  private createBankRuleService: CreateBankRuleService;

  @Inject()
  private editBankRuleService: EditBankRuleService;

  @Inject()
  private deleteBankRuleService: DeleteBankRuleSerivce;

  @Inject()
  private getBankRuleService: GetBankRuleService;

  @Inject()
  private getBankRulesService: GetBankRulesService;

  /**
   * Creates new bank rule.
   * @param {number} tenantId
   * @param {ICreateBankRuleDTO} createRuleDTO
   * @returns {Promise<void>}
   */
  public createBankRule(
    tenantId: number,
    createRuleDTO: ICreateBankRuleDTO
  ): Promise<void> {
    return this.createBankRuleService.createBankRule(tenantId, createRuleDTO);
  }

  /**
   * Edits the given bank rule.
   * @param {number} tenantId
   * @param {IEditBankRuleDTO} editRuleDTO
   * @returns {Promise<void>}
   */
  public editBankRule(
    tenantId: number,
    ruleId: number,
    editRuleDTO: IEditBankRuleDTO
  ): Promise<void> {
    return this.editBankRuleService.editBankRule(tenantId, ruleId, editRuleDTO);
  }

  /**
   * Deletes the given bank rule.
   * @param {number} tenantId
   * @param {number} ruleId
   * @returns {Promise<void>}
   */
  public deleteBankRule(tenantId: number, ruleId: number): Promise<void> {
    return this.deleteBankRuleService.deleteBankRule(tenantId, ruleId);
  }

  /**
   * Retrieves the given bank rule.
   * @param {number} tenantId
   * @param {number} ruleId
   * @returns {Promise<any>}
   */
  public getBankRule(tenantId: number, ruleId: number): Promise<any> {
    return this.getBankRuleService.getBankRule(tenantId, ruleId);
  }

  /**
   * Retrieves the bank rules of the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @returns {Promise<any>}
   */
  public getBankRules(tenantId: number): Promise<any> {
    return this.getBankRulesService.getBankRules(tenantId);
  }
}
