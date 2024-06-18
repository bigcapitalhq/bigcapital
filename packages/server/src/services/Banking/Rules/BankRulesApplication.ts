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
   * @returns
   */
  public createBankRule(tenantId: number, createRuleDTO: ICreateBankRuleDTO) {
    return this.createBankRuleService.createBankRule(tenantId, createRuleDTO);
  }

  /**
   * Edits the given bank rule.
   * @param {number} tenantId
   * @param {IEditBankRuleDTO} editRuleDTO
   * @returns
   */
  public editBankRule(
    tenantId: number,
    ruleId: number,
    editRuleDTO: IEditBankRuleDTO
  ) {
    return this.editBankRuleService.editBankRule(tenantId, ruleId, editRuleDTO);
  }

  /**
   * Deletes the given bank rule.
   * @param {number} tenantId
   * @param {number} ruleId
   * @returns
   */
  public deleteBankRule(tenantId: number, ruleId: number) {
    return this.deleteBankRuleService.deleteBankRule(tenantId, ruleId);
  }

  /**
   * Retrieves the given bank rule.
   * @param {number} tenantId
   * @param {number} ruleId
   * @returns
   */
  public getBankRule(tenantId: number, ruleId: number) {
    return this.getBankRuleService.getBankRule(tenantId, ruleId);
  }

  /**
   * Retrieves the bank rules of the given account.
   * @param {number} tenantId
   * @param {number} accountId
   * @returns
   */
  public getBankRules(tenantId: number) {
    return this.getBankRulesService.getBankRules(tenantId);
  }
}
