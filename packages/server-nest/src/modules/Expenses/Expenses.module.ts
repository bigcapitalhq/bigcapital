import { Module } from '@nestjs/common';
import { CreateExpense } from './commands/CreateExpense.service';
import { DeleteExpense } from './commands/DeleteExpense.service';
import { EditExpense } from './commands/EditExpense.service';
import { PublishExpense } from './commands/PublishExpense.service';
import { ExpensesController } from './Expenses.controller';
import { ExpensesApplication } from './ExpensesApplication.service';
import { GetExpenseService } from './queries/GetExpense.service';
import { ExpenseDTOTransformer } from './commands/CommandExpenseDTO.transformer';
import { CommandExpenseValidator } from './commands/CommandExpenseValidator.service';
import { TenancyContext } from '../Tenancy/TenancyContext.service';
import { TransformerInjectable } from '../Transformer/TransformerInjectable.service';

@Module({
  imports: [],
  controllers: [ExpensesController],
  providers: [
    CreateExpense,
    ExpenseDTOTransformer,
    CommandExpenseValidator,
    EditExpense,
    DeleteExpense,
    PublishExpense,
    GetExpenseService,
    ExpensesApplication,
    TenancyContext,
    TransformerInjectable
  ],
})
export class ExpensesModule {}
