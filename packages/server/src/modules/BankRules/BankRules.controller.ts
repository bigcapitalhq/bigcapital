import {
  ApiOperation,
  ApiTags,
  ApiResponse,
  getSchemaPath,
  ApiExtraModels,
} from '@nestjs/swagger';
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
import { CreateBankRuleDto } from './dtos/BankRule.dto';
import { EditBankRuleDto } from './dtos/BankRule.dto';
import { BankRuleResponseDto } from './dtos/BankRuleResponse.dto';

@Controller('banking/rules')
@ApiTags('Bank Rules')
@ApiExtraModels(BankRuleResponseDto)
export class BankRulesController {
  constructor(private readonly bankRulesApplication: BankRulesApplication) {}

  @Post()
  @ApiOperation({ summary: 'Create a new bank rule.' })
  @ApiResponse({
    status: 201,
    description: 'The bank rule has been successfully created.',
    schema: {
      $ref: getSchemaPath(BankRuleResponseDto),
    },
  })
  async createBankRule(
    @Body() createRuleDTO: CreateBankRuleDto,
  ): Promise<BankRuleResponseDto> {
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
  @ApiResponse({
    status: 200,
    description: 'The bank rule has been successfully deleted.',
  })
  async deleteBankRule(@Param('id') ruleId: number): Promise<void> {
    return this.bankRulesApplication.deleteBankRule(ruleId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Retrieves the bank rule details.' })
  @ApiResponse({
    status: 200,
    description: 'The bank rule details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(BankRuleResponseDto) },
  })
  async getBankRule(@Param('id') ruleId: number): Promise<BankRuleResponseDto> {
    return this.bankRulesApplication.getBankRule(ruleId);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieves the bank rules.' })
  @ApiResponse({
    status: 200,
    description: 'The bank rules have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(BankRuleResponseDto) },
    },
  })
  async getBankRules(): Promise<BankRuleResponseDto[]> {
    return this.bankRulesApplication.getBankRules();
  }
}
