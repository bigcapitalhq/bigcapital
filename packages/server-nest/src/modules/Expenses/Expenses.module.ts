import { Module } from '@nestjs/common';
import { CreateExpense } from './commands/CreateExpense.service';
import { DeleteExpense } from './commands/DeleteExpense.service';
import { EditExpense } from './commands/EditExpense.service';
import { PublishExpense } from './commands/PublishExpense.service';
import { ExpensesController } from './Expenses.controller';
import { ExpensesApplication } from './ExpensesApplication.service';
import { GetExpenseService } from './queries/GetExpense.service';

@Module({
  imports: [],
  controllers: [ExpensesController],
  providers: [
    CreateExpense,
    EditExpense,
    DeleteExpense,
    PublishExpense,
    GetExpenseService,
    ExpensesApplication,
  ],
})
export class ExpensesModule {}
