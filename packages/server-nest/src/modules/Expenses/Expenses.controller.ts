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
import {
  IExpenseCreateDTO,
  IExpenseEditDTO,
} from './interfaces/Expenses.interface';
import { PublicRoute } from '../Auth/Jwt.guard';
import { IExpensesFilter } from './Expenses.types';

@Controller('expenses')
@PublicRoute()
export class ExpensesController {
  constructor(private readonly expensesApplication: ExpensesApplication) {}

  /**
   * Create a new expense transaction.
   * @param {IExpenseCreateDTO} expenseDTO
   */
  @Post()
  public createExpense(@Body() expenseDTO: IExpenseCreateDTO) {
    return this.expensesApplication.createExpense(expenseDTO);
  }

  /**
   * Edit the given expense transaction.
   * @param {number} expenseId
   * @param {IExpenseEditDTO} expenseDTO
   */
  @Put(':id')
  public editExpense(
    @Param('id') expenseId: number,
    @Body() expenseDTO: IExpenseEditDTO,
  ) {
    return this.expensesApplication.editExpense(expenseId, expenseDTO);
  }

  /**
   * Delete the given expense transaction.
   * @param {number} expenseId
   */
  @Delete(':id')
  public deleteExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.deleteExpense(expenseId);
  }

  /**
   * Publish the given expense transaction.
   * @param {number} expenseId
   */
  @Post(':id/publish')
  public publishExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.publishExpense(expenseId);
  }

  /**
   * Get the expense transaction details.
   */
  @Get('')
  public getExpenses(@Query() filterDTO: IExpensesFilter) {
    return this.expensesApplication.getExpenses(filterDTO);
  }

  /**
   * Get the expense transaction details.
   * @param {number} expenseId
   */
  @Get(':id')
  public getExpense(@Param('id') expenseId: number) {
    return this.expensesApplication.getExpense(expenseId);
  }
}
