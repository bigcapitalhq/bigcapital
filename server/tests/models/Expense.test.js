import { create, expect } from '~/testInit';
import Expense from 'models/Expense';
import ExpenseCategory from 'models/ExpenseCategory';
import {
  tenantFactory,
  tenantWebsite
} from '~/dbInit';
 
describe('Model: Expense', () => {
  describe('relations', () => {
    it('Expense model may belongs to associated payment account.', async () => {
      const expense = await tenantFactory.create('expense');
      
      const expenseModel = await Expense.tenant().query().findById(expense.id);
      const paymentAccountModel = await expenseModel.$relatedQuery('paymentAccount');
      
      expect(paymentAccountModel.id).equals(expense.paymentAccountId);
    });

    it('Expense model may has many associated expense categories.', async () => {
      const expenseCategory = await tenantFactory.create('expense_category');

      const expenseModel = await Expense.tenant().query().findById(expenseCategory.expenseId);
      const expenseCategories = await expenseModel.$relatedQuery('categories');

      expect(expenseCategories.length).equals(1);
      expect(expenseCategories[0].expenseId).equals(expenseModel.id);
    });

    it('Expense model may belongs to associated user model.', async () => {
      const expense = await tenantFactory.create('expense');
      
      const expenseModel = await Expense.tenant().query().findById(expense.id);
      const expenseUserModel = await expenseModel.$relatedQuery('user');
      
      expect(expenseUserModel.id).equals(expense.userId);
    });
  });
});
