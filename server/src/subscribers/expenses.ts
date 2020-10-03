import { Container, Inject, Service } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from 'subscribers/events';
import ExpensesService from 'services/Expenses/ExpensesService';
import TenancyService from 'services/Tenancy/TenancyService';
import {
  EventDispatcher,
  EventDispatcherInterface,
} from 'decorators/eventDispatcher';

@Service()
export default class ExpensesSubscriber {
  
  constructor(
    @Inject()
    tenancy: TenancyService,

    @EventDispatcher()
    eventDispatcher: EventDispatcherInterface,
  ) {
    console.log(this, 'XXXX');
    // this.eventDispatcher.on(events.expenses.onCreated, this.onExpenseCreated);
  }

  public onExpenseCreated({ expenseId, tenantId }) {
    console.log(this)
 
    // // 7. In case expense published, write journal entries.
    // if (expenseObj.publishedAt) {
    //   await this.writeJournalEntries(tenantId, expenseModel, false);
    // }
    
  }

  // @On(events.expenses.onEdited)
  public onExpenseEdited({ expenseId, tenantId }) {
    // - In case expense published, write journal entries.
    // if (expenseObj.publishedAt) {
    //   await this.writeJournalEntries(tenantId, expenseModel, true, authorizedUser);
    // }
  }

  // @On(events.expenses.onDeleted)
  public onExpenseDeleted({ expenseId, tenantId }) {
    // if (expense.published) {
    //   await this.revertJournalEntries(tenantId, expenseId);
    // }
  }

  // @On(events.expenses.onPublished)
  public onExpensePublished({ expenseId, tenantId }) {

  }

  // @On(events.expenses.onBulkDeleted)
  public onExpenseBulkDeleted({ expensesIds, tenantId }) {

  }

  // @On(events.expenses.onBulkPublished)
  public onExpenseBulkPublished({ expensesIds, tenantId }) {

  }
}