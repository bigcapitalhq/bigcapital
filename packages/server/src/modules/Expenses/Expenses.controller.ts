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

@Controller('expenses')
@ApiTags('Expenses')
@ApiExtraModels(PaginatedResponseDto, ExpenseResponseDto)
export class ExpensesController {
  constructor(private readonly expensesApplication: ExpensesApplication) {}

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
