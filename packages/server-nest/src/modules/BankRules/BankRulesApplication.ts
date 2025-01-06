import { Injectable } from '@nestjs/common';
import { CreateBankRuleService } from './commands/CreateBankRule.service';
import { DeleteBankRuleService } from './commands/DeleteBankRule.service';
import { EditBankRuleService } from './commands/EditBankRule.service';
import { GetBankRuleService } from './queries/GetBankRule.service';
import { GetBankRulesService } from './queries/GetBankRules.service';
import { ICreateBankRuleDTO, IEditBankRuleDTO } from './types';
import { BankRule } from './models/BankRule';

@Injectable()
export class BankRulesApplication {
  constructor(
    private readonly createBankRuleService: CreateBankRuleService,
    private readonly editBankRuleService: EditBankRuleService,
    private readonly deleteBankRuleService: DeleteBankRuleService,
    private readonly getBankRuleService: GetBankRuleService,
    private readonly getBankRulesService: GetBankRulesService,
  ) {}

  /**
   * Creates new bank rule.
   * @param {ICreateBankRuleDTO} createRuleDTO - Bank rule data.
   * @returns {Promise<void>}
   */
  public createBankRule(
    createRuleDTO: ICreateBankRuleDTO,
  ): Promise<BankRule> {
    return this.createBankRuleService.createBankRule(createRuleDTO);
  }

  /**
   * Edits the given bank rule.
   * @param {number} ruleId - Bank rule identifier.
   * @param {IEditBankRuleDTO} editRuleDTO - Bank rule data.
   * @returns {Promise<void>}
   */
  public editBankRule(
    ruleId: number,
    editRuleDTO: IEditBankRuleDTO,
  ): Promise<void> {
    return this.editBankRuleService.editBankRule(ruleId, editRuleDTO);
  }

  /**
   * Deletes the given bank rule.
   * @param {number} ruleId - Bank rule identifier.
   * @returns {Promise<void>}
   */
  public deleteBankRule(ruleId: number): Promise<void> {
    return this.deleteBankRuleService.deleteBankRule(ruleId);
  }

  /**
   * Retrieves the given bank rule.
   * @param {number} ruleId - Bank rule identifier.
   * @returns {Promise<any>}
   */
  public getBankRule(ruleId: number): Promise<any> {
    return this.getBankRuleService.getBankRule(ruleId);
  }

  /**
   * Retrieves the bank rules of the given account.
   * @param {number} accountId - Bank account identifier.
   * @returns {Promise<any>}
   */
  public getBankRules(): Promise<any> {
    return this.getBankRulesService.getBankRules();
  }
}
