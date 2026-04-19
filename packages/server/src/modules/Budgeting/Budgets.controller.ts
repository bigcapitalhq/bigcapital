import {
  Controller,
  Post,
  Body,
  Param,
  Delete,
  Get,
  Query,
  ParseIntPipe,
  Put,
  HttpCode,
  UseGuards,
} from '@nestjs/common';
import { BudgetsApplication } from './BudgetsApplication.service';
import { CreateBudgetDto, EditBudgetDto } from './dtos/CreateBudget.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { BudgetResponseDto } from './dtos/BudgetResponse.dto';
import { GetBudgetsQueryDto } from './dtos/GetBudgetsQuery.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { BudgetAction } from './types/Budgets.types';

@Controller('budgets')
@ApiTags('Budgets')
@ApiExtraModels(BudgetResponseDto)
@ApiExtraModels(ValidateBulkDeleteResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class BudgetsController {
  constructor(private readonly budgetsApplication: BudgetsApplication) {}

  @Post('validate-bulk-delete')
  @HttpCode(200)
  @RequirePermission(BudgetAction.Delete, AbilitySubject.Budget)
  @ApiOperation({
    summary:
      'Validates which budgets can be deleted and returns counts of deletable and non-deletable budgets.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed. Returns counts and IDs of deletable and non-deletable budgets.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  async validateBulkDeleteBudgets(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.budgetsApplication.validateBulkDeleteBudgets(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @HttpCode(200)
  @RequirePermission(BudgetAction.Delete, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Deletes multiple budgets in bulk.' })
  @ApiResponse({
    status: 200,
    description: 'The budgets have been successfully deleted.',
  })
  async bulkDeleteBudgets(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.budgetsApplication.bulkDeleteBudgets(bulkDeleteDto.ids, {
      skipUndeletable: bulkDeleteDto.skipUndeletable ?? false,
    });
  }

  @Post()
  @RequirePermission(BudgetAction.Create, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Create a new budget.' })
  @ApiResponse({
    status: 201,
    description: 'The budget has been successfully created.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  async createBudget(@Body() budgetDTO: CreateBudgetDto) {
    return this.budgetsApplication.createBudget(budgetDTO);
  }

  @Put(':id')
  @RequirePermission(BudgetAction.Edit, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Edit the given budget.' })
  @ApiResponse({
    status: 200,
    description: 'The budget has been successfully updated.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  @ApiResponse({ status: 404, description: 'The budget not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The budget id',
  })
  async editBudget(
    @Param('id', ParseIntPipe) id: number,
    @Body() budgetDTO: EditBudgetDto,
  ) {
    return this.budgetsApplication.editBudget(id, budgetDTO);
  }

  @Delete(':id')
  @RequirePermission(BudgetAction.Delete, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Delete the given budget.' })
  @ApiResponse({
    status: 200,
    description: 'The budget has been successfully deleted.',
  })
  @ApiResponse({ status: 404, description: 'The budget not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The budget id',
  })
  async deleteBudget(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsApplication.deleteBudget(id);
  }

  @Post(':id/activate')
  @HttpCode(200)
  @RequirePermission(BudgetAction.Edit, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Activate the given budget.' })
  @ApiResponse({
    status: 200,
    description: 'The budget has been successfully activated.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The budget id',
  })
  async activateBudget(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsApplication.activateBudget(id);
  }

  @Post(':id/close')
  @HttpCode(200)
  @RequirePermission(BudgetAction.Edit, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Close the given budget.' })
  @ApiResponse({
    status: 200,
    description: 'The budget has been successfully closed.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The budget id',
  })
  async closeBudget(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsApplication.closeBudget(id);
  }

  @Get(':id')
  @RequirePermission(BudgetAction.View, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Retrieves the budget details.' })
  @ApiResponse({
    status: 200,
    description: 'The budget details have been successfully retrieved.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  @ApiResponse({ status: 404, description: 'The budget not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The budget id',
  })
  async getBudget(@Param('id', ParseIntPipe) id: number) {
    return this.budgetsApplication.getBudget(id);
  }

  @Get()
  @RequirePermission(BudgetAction.View, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Retrieves the budgets list.' })
  @ApiResponse({
    status: 200,
    description: 'The budgets list has been successfully retrieved.',
  })
  async getBudgets(@Query() filterDTO: GetBudgetsQueryDto) {
    return this.budgetsApplication.getBudgets(filterDTO);
  }
}
