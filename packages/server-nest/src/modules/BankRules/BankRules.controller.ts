import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { BankRulesApplication } from './BankRulesApplication';
import { ICreateBankRuleDTO, IEditBankRuleDTO } from './types';
import { PublicRoute } from '../Auth/Jwt.guard';
import { BankRule } from './models/BankRule';

@Controller('banking/rules')
@PublicRoute()
export class BankRulesController {
  constructor(private readonly bankRulesApplication: BankRulesApplication) {}

  @Post()
  async createBankRule(
    @Body() createRuleDTO: ICreateBankRuleDTO,
  ): Promise<BankRule> {
    return this.bankRulesApplication.createBankRule(createRuleDTO);
  }

  @Put(':id')
  async editBankRule(
    @Param('id') ruleId: number,
    @Body() editRuleDTO: IEditBankRuleDTO,
  ): Promise<void> {
    return this.bankRulesApplication.editBankRule(ruleId, editRuleDTO);
  }

  @Delete(':id')
  async deleteBankRule(@Param('id') ruleId: number): Promise<void> {
    return this.bankRulesApplication.deleteBankRule(ruleId);
  }

  @Get(':id')
  async getBankRule(@Param('id') ruleId: number): Promise<any> {
    return this.bankRulesApplication.getBankRule(ruleId);
  }

  @Get()
  async getBankRules(): Promise<any> {
    return this.bankRulesApplication.getBankRules();
  }
}
