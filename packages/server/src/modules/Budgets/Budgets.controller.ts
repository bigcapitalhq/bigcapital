import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { BudgetsApplication } from './BudgetsApplication.service';
import { CreateBudgetDto, EditBudgetDto } from './dtos/Budget.dto';
import { GetBudgetsQueryDto } from './dtos/GetBudgetsQuery.dto';
import { BudgetResponseDto } from './dtos/BudgetResponse.dto';
import { BudgetAction } from './types/Budgets.types';

@Controller('budgets')
@ApiTags('Budgets')
@ApiExtraModels(BudgetResponseDto)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class BudgetsController {
  constructor(private readonly budgetsApplication: BudgetsApplication) {}

  @Post()
  @RequirePermission(BudgetAction.Create, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Create a new budget.' })
  @ApiResponse({
    status: 201,
    description: 'The budget has been successfully created.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  public createBudget(@Body() budgetDTO: CreateBudgetDto) {
    return this.budgetsApplication.createBudget(budgetDTO);
  }

  @Put(':id')
  @RequirePermission(BudgetAction.Edit, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Edit the given budget.' })
  @ApiResponse({
    status: 200,
    description: 'The budget has been successfully edited.',
    schema: { $ref: getSchemaPath(BudgetResponseDto) },
  })
  @ApiResponse({ status: 404, description: 'The budget not found.' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The budget id',
  })
  public editBudget(
    @Param('id') budgetId: number,
    @Body() budgetDTO: EditBudgetDto,
  ) {
    return this.budgetsApplication.editBudget(budgetId, budgetDTO);
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
  public deleteBudget(@Param('id') budgetId: number) {
    return this.budgetsApplication.deleteBudget(budgetId);
  }

  @Get(':id')
  @RequirePermission(BudgetAction.View, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Retrieves the given budget details.' })
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
  public getBudget(@Param('id') budgetId: number) {
    return this.budgetsApplication.getBudget(budgetId);
  }

  @Get()
  @RequirePermission(BudgetAction.View, AbilitySubject.Budget)
  @ApiOperation({ summary: 'Retrieves the budgets paginated list.' })
  @ApiResponse({
    status: 200,
    description: 'The budgets have been successfully retrieved.',
    schema: {
      type: 'array',
      items: { $ref: getSchemaPath(BudgetResponseDto) },
    },
  })
  public getBudgets(@Query() filterDTO: GetBudgetsQueryDto) {
    return this.budgetsApplication.getBudgets(filterDTO);
  }
}
