import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ExpensesApplication } from './ExpensesApplication.service';
import { IExpensesFilter } from './Expenses.types';
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

@Controller('expenses')
@ApiTags('Expenses')
@ApiExtraModels(
  PaginatedResponseDto,
  ExpenseResponseDto,
  ValidateBulkDeleteResponseDto,
)
@ApiCommonHeaders()
export class ExpensesController {
  constructor(private readonly expensesApplication: ExpensesApplication) { }

  @Post('validate-bulk-delete')
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
  @ApiOperation({ summary: 'Deletes multiple expenses.' })
  @ApiResponse({
    status: 200,
    description: 'Expenses deleted successfully',
  })
  public bulkDeleteExpenses(@Body() bulkDeleteDto: BulkDeleteDto) {
    return this.expensesApplication.bulkDeleteExpenses(bulkDeleteDto.ids);
  }

  /**
   * Create a new expense transaction.
   * @param {IExpenseCreateDTO} expenseDTO
   */
  @Post()
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
  @ApiOperation({ summary: 'Delete the given expense transaction.' })
  public deleteExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.deleteExpense(expenseId);
  }

  /**
   * Publish the given expense transaction.
   * @param {number} expenseId
   */
  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish the given expense transaction.' })
  public publishExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.publishExpense(expenseId);
  }

  /**
   * Get the expense transaction details.
   */
  @Get()
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
  public getExpenses(@Query() filterDTO: IExpensesFilter) {
    return this.expensesApplication.getExpenses(filterDTO);
  }

  /**
   * Get the expense transaction details.
   * @param {number} expenseId
   */
  @Get(':id')
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
