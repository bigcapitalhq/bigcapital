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
import { ExpensesApplication } from './ExpensesApplication.service';
import { GetExpensesQueryDto } from './dtos/GetExpensesQuery.dto';
import {
  ApiExtraModels,
  ApiOperation,
  ApiResponse,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';
import { CreateExpenseDto, EditExpenseDto } from './dtos/Expense.dto';
import { PaginatedResponseDto } from '@/common/dtos/PaginatedResults.dto';
import { ExpenseResponseDto } from './dtos/ExpenseResponse.dto';
import { ApiCommonHeaders } from '@/common/decorators/ApiCommonHeaders';
import {
  BulkDeleteDto,
  ValidateBulkDeleteResponseDto,
} from '@/common/dtos/BulkDelete.dto';
import { RequirePermission } from '@/modules/Roles/RequirePermission.decorator';
import { PermissionGuard } from '@/modules/Roles/Permission.guard';
import { AuthorizationGuard } from '@/modules/Roles/Authorization.guard';
import { AbilitySubject } from '@/modules/Roles/Roles.types';
import { ExpenseAction } from './Expenses.types';

@Controller('expenses')
@ApiTags('Expenses')
@ApiExtraModels(
  PaginatedResponseDto,
  ExpenseResponseDto,
  ValidateBulkDeleteResponseDto,
)
@ApiCommonHeaders()
@UseGuards(AuthorizationGuard, PermissionGuard)
export class ExpensesController {
  constructor(private readonly expensesApplication: ExpensesApplication) {}

  @Post('validate-bulk-delete')
  @RequirePermission(ExpenseAction.Delete, AbilitySubject.Expense)
  @ApiOperation({
    summary: 'Validate which expenses can be deleted and return the results.',
  })
  @ApiResponse({
    status: 200,
    description:
      'Validation completed with counts and IDs of deletable and non-deletable expenses.',
    schema: {
      $ref: getSchemaPath(ValidateBulkDeleteResponseDto),
    },
  })
  public validateBulkDeleteExpenses(
    @Body() bulkDeleteDto: BulkDeleteDto,
  ): Promise<ValidateBulkDeleteResponseDto> {
    return this.expensesApplication.validateBulkDeleteExpenses(
      bulkDeleteDto.ids,
    );
  }

  @Post('bulk-delete')
  @RequirePermission(ExpenseAction.Delete, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Deletes multiple expenses.' })
  @ApiResponse({
    status: 200,
    description: 'Expenses deleted successfully',
  })
  public bulkDeleteExpenses(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.expensesApplication.bulkDeleteExpenses(bulkDeleteDto.ids, {
      skipUndeletable: bulkDeleteDto.skipUndeletable ?? false,
    });
  }

  /**
   * Create a new expense transaction.
   * @param {IExpenseCreateDTO} expenseDTO
   */
  @Post()
  @RequirePermission(ExpenseAction.Create, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Create a new expense transaction.' })
  public createExpense(@Body() expenseDTO: CreateExpenseDto) {
    return this.expensesApplication.createExpense(expenseDTO);
  }

  /**
   * Edit the given expense transaction.
   * @param {number} expenseId
   * @param {IExpenseEditDTO} expenseDTO
   */
  @Put(':id')
  @RequirePermission(ExpenseAction.Edit, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Edit the given expense transaction.' })
  public editExpense(
    @Param('id') expenseId: number,
    @Body() expenseDTO: EditExpenseDto,
  ) {
    return this.expensesApplication.editExpense(expenseId, expenseDTO);
  }

  /**
   * Delete the given expense transaction.
   * @param {number} expenseId
   */
  @Delete(':id')
  @RequirePermission(ExpenseAction.Delete, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Delete the given expense transaction.' })
  public deleteExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.deleteExpense(expenseId);
  }

  /**
   * Publish the given expense transaction.
   * @param {number} expenseId
   */
  @Post(':id/publish')
  @RequirePermission(ExpenseAction.Edit, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Publish the given expense transaction.' })
  public publishExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.publishExpense(expenseId);
  }

  /**
   * Get the expense transaction details.
   */
  @Get()
  @RequirePermission(ExpenseAction.View, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Get the expense transactions.' })
  @ApiResponse({
    status: 200,
    description: 'The item list has been successfully retrieved.',
    schema: {
      allOf: [
        { $ref: getSchemaPath(PaginatedResponseDto) },
        {
          properties: {
            data: {
              type: 'array',
              items: { $ref: getSchemaPath(ExpenseResponseDto) },
            },
          },
        },
      ],
    },
  })
  public getExpenses(@Query() filterDTO: GetExpensesQueryDto) {
    return this.expensesApplication.getExpenses(filterDTO);
  }

  /**
   * Get the expense transaction details.
   * @param {number} expenseId
   */
  @Get(':id')
  @RequirePermission(ExpenseAction.View, AbilitySubject.Expense)
  @ApiOperation({ summary: 'Get the expense transaction details.' })
  @ApiResponse({
    status: 200,
    description: 'The expense transaction have been successfully retrieved.',
    schema: {
      $ref: getSchemaPath(ExpenseResponseDto),
    },
  })
  public getExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.getExpense(expenseId);
  }
}
