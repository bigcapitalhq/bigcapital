import { create, expect } from '~/testInit';
import Expense from '@/models/Expense';
import factory from '../../src/database/factories';

describe('Model: Expense', () => {
  describe('relations', () => {
    it('Expense model may belongs to associated payment account.', async () => {
      const expense = await factory.create('expense');
      
      const expenseModel = await Expense.query().findById(expense.id);
      const paymentAccountModel = await expenseModel.$relatedQuery('paymentAccount');
      
      expect(paymentAccountModel.id).equals(expense.paymentAccountId);
    });

    it('Expense model may belongs to associated expense account.', async () => {
      const expense = await factory.create('expense');
      
      const expenseModel = await Expense.query().findById(expense.id);
      const expenseAccountModel = await expenseModel.$relatedQuery('expenseAccount');
      
      expect(expenseAccountModel.id).equals(expense.expenseAccountId);
    });

    it('Expense model may belongs to associated user model.', async () => {
      const expense = await factory.create('expense');
      
      const expenseModel = await Expense.query().findById(expense.id);
      const expenseUserModel = await expenseModel.$relatedQuery('user');
      
      expect(expenseUserModel.id).equals(expense.userId);
    });
  });
});
