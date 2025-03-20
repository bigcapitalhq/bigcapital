import { ApiOperation, ApiTags } from '@nestjs/swagger';
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
import { CreateBankRuleDto } from './dtos/BankRule.dto';
import { EditBankRuleDto } from './dtos/BankRule.dto';

@Controller('banking/rules')
@ApiTags('bank-rules')
@PublicRoute()
export class BankRulesController {
  constructor(private readonly bankRulesApplication: BankRulesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank rule.' })
  async createBankRule(
    @Body() createRuleDTO: CreateBankRuleDto,
  ): Promise<BankRule> {
    return this.bankRulesApplication.createBankRule(createRuleDTO);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Edit the given bank rule.' })
  async editBankRule(
    @Param('id') ruleId: number,
    @Body() editRuleDTO: EditBankRuleDto,
  ): Promise<void> {
    return this.bankRulesApplication.editBankRule(ruleId, editRuleDTO);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete the given bank rule.' })
  async deleteBankRule(@Param('id') ruleId: number): Promise<void> {
    return this.bankRulesApplication.deleteBankRule(ruleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the bank rule details.' })
  async getBankRule(@Param('id') ruleId: number): Promise<any> {
    return this.bankRulesApplication.getBankRule(ruleId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the bank rules.' })
  async getBankRules(): Promise<any> {
    return this.bankRulesApplication.getBankRules();
  }
}
