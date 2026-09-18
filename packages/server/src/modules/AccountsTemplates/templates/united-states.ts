import { AccountsTemplate } from '../AccountsTemplates.types';

const MEALS_NOTE = 'Kept apart because tax deductibility differs by kind.';

/**
 * Four-digit numbering by section, as most US accountants and bookkeepers
 * expect it. No US standard prescribes account numbers; this is the common
 * convention, not a regulatory chart.
 */
export const UnitedStatesTemplate: AccountsTemplate = {
  key: 'united-states',
  name: 'United States',
  country: 'US',
  description:
    'Four-digit numbering by section: 1000s assets, 2000s liabilities, 3000s equity, 4000s income, 5000s cost of sales, 6000s operating expenses and 8000s other expenses.',
  accounts: [
    // Assets
    {
      slug: 'bank-account',
      code: '1010',
      name: 'Business Checking',
      accountType: 'bank',
    },
    {
      slug: 'undeposited-funds',
      code: '1020',
      name: 'Undeposited Funds',
      accountType: 'cash',
    },
    {
      slug: 'petty-cash',
      code: '1030',
      name: 'Petty Cash',
      accountType: 'cash',
    },
    {
      slug: 'stripe-clearing',
      code: '1040',
      name: 'Stripe Clearing',
      accountType: 'other-current-asset',
    },
    {
      slug: 'accounts-receivable',
      code: '1200',
      name: 'Accounts Receivable (A/R)',
      accountType: 'accounts-receivable',
    },
    {
      slug: 'inventory-asset',
      code: '1300',
      name: 'Inventory Asset',
      accountType: 'inventory',
    },
    {
      slug: 'prepaid-expenses',
      code: '1400',
      name: 'Prepaid Expenses',
      accountType: 'other-current-asset',
    },
    {
      code: '1450',
      name: 'Security Deposits',
      accountType: 'other-current-asset',
      description: 'Refundable deposits held by landlords or vendors.',
    },
    {
      slug: 'computer-equipment',
      code: '1500',
      name: 'Computer Equipment',
      accountType: 'fixed-asset',
    },
    {
      slug: 'office-equipment',
      code: '1510',
      name: 'Office Equipment',
      accountType: 'fixed-asset',
    },
    {
      code: '1590',
      name: 'Accumulated Depreciation',
      accountType: 'fixed-asset',
      description:
        'Contra-asset holding accumulated depreciation on fixed assets.',
    },

    // Liabilities
    {
      slug: 'accounts-payable',
      code: '2000',
      name: 'Accounts Payable (A/P)',
      accountType: 'accounts-payable',
    },
    {
      code: '2100',
      name: 'Credit Card',
      accountType: 'credit-card',
      description: 'Rename to match the card, and add one account per card.',
    },
    {
      slug: 'tax-payable',
      code: '2200',
      name: 'Sales Tax Payable',
      accountType: 'tax-payable',
    },
    {
      slug: 'unearned-revenue',
      code: '2300',
      name: 'Unearned Revenue',
      accountType: 'other-current-liability',
    },
    {
      code: '2400',
      name: 'Payroll Liabilities',
      accountType: 'other-current-liability',
      description:
        'Withheld payroll taxes and benefits owed but not yet remitted.',
    },
    {
      code: '2600',
      name: 'Loans Payable',
      accountType: 'long-term-liability',
      description: 'Borrowings repayable beyond one year.',
    },

    // Equity. Contributed capital and distributions depend on the legal
    // structure and come from the variant.
    {
      slug: 'retained-earnings',
      code: '3900',
      name: 'Retained Earnings',
      accountType: 'equity',
    },
    {
      slug: 'opening-balance-equity',
      code: '3950',
      name: 'Opening Balance Equity',
      accountType: 'equity',
    },

    // Income
    {
      slug: 'sales-of-product-income',
      code: '4000',
      name: 'Sales of Product Income',
      accountType: 'income',
    },
    {
      slug: 'sales-of-service-income',
      code: '4010',
      name: 'Sales of Service Income',
      accountType: 'income',
    },
    {
      slug: 'uncategorized-income',
      code: '4900',
      name: 'Uncategorized Income',
      accountType: 'income',
    },
    {
      slug: 'discount',
      code: '4910',
      name: 'Discount',
      accountType: 'other-income',
    },
    {
      slug: 'other-charges',
      code: '4920',
      name: 'Other Charges',
      accountType: 'other-income',
    },
    {
      slug: 'other-income',
      code: '4990',
      name: 'Other Income',
      accountType: 'other-income',
    },

    // Cost of sales
    {
      slug: 'cost-of-goods-sold',
      code: '5000',
      name: 'Cost of Goods Sold',
      accountType: 'cost-of-goods-sold',
    },
    {
      code: '5010',
      name: 'Subcontracted Services',
      accountType: 'cost-of-goods-sold',
      description:
        'Independent contractors who deliver work sold to customers, reportable on Form 1099-NEC.',
    },

    // Operating expenses
    {
      code: '6000',
      name: 'Payroll - Wages',
      accountType: 'expense',
      description: 'Gross wages paid to employees.',
    },
    {
      code: '6010',
      name: 'Payroll Taxes',
      accountType: 'expense',
      description: 'Employer share of payroll taxes.',
    },
    {
      code: '6020',
      name: 'Employee Benefits',
      accountType: 'expense',
      description: 'Health and other employee benefit costs.',
    },
    {
      code: '6100',
      name: 'Supplies and Materials',
      accountType: 'expense',
    },
    {
      code: '6110',
      name: 'Software and Subscriptions',
      accountType: 'expense',
    },
    {
      code: '6120',
      name: 'Insurance',
      accountType: 'expense',
      description:
        'General liability, professional liability and auto premiums.',
    },
    {
      code: '6130',
      name: 'Education and Training',
      accountType: 'expense',
    },
    {
      code: '6140',
      name: 'Legal and Professional Fees',
      accountType: 'expense',
      description: 'Attorney, accountant and tax preparation fees.',
    },
    {
      slug: 'rent',
      code: '6200',
      name: 'Rent',
      accountType: 'expense',
    },
    {
      code: '6210',
      name: 'Utilities',
      accountType: 'expense',
    },
    {
      code: '6220',
      name: 'Telephone and Internet',
      accountType: 'expense',
    },
    {
      code: '6300',
      name: 'Travel',
      accountType: 'expense',
    },
    {
      code: '6310',
      name: 'Meals - Clients and Prospects',
      accountType: 'expense',
      description: MEALS_NOTE,
    },
    {
      code: '6320',
      name: 'Meals - Travel',
      accountType: 'expense',
      description: MEALS_NOTE,
    },
    {
      code: '6330',
      name: 'Meals - Employees on Premises',
      accountType: 'expense',
      description: MEALS_NOTE,
    },
    {
      code: '6340',
      name: 'Employee Events',
      accountType: 'expense',
      description: MEALS_NOTE,
    },
    {
      code: '6350',
      name: 'Entertainment',
      accountType: 'expense',
      description: MEALS_NOTE,
    },
    {
      code: '6355',
      name: 'Vehicle',
      accountType: 'expense',
    },
    {
      code: '6360',
      name: 'Fuel',
      accountType: 'expense',
      parentCode: '6355',
    },
    {
      code: '6370',
      name: 'Vehicle Maintenance and Repairs',
      accountType: 'expense',
      parentCode: '6355',
    },
    {
      code: '6380',
      name: 'Tolls and Parking',
      accountType: 'expense',
      parentCode: '6355',
    },
    {
      code: '6400',
      name: 'Advertising and Marketing',
      accountType: 'expense',
    },
    {
      code: '6410',
      name: 'Dues and Memberships',
      accountType: 'expense',
    },
    {
      code: '6420',
      name: 'Licenses and Permits',
      accountType: 'expense',
    },
    {
      code: '6430',
      name: 'Taxes and Government Fees',
      accountType: 'expense',
      description: 'State and local taxes and government fees.',
    },
    {
      slug: 'bank-fees-and-charges',
      code: '6500',
      name: 'Bank Fees and Charges',
      accountType: 'expense',
    },
    {
      code: '6510',
      name: 'Merchant and Processing Fees',
      accountType: 'expense',
      description: 'Card processing and payment platform fees.',
    },
    {
      code: '6520',
      name: 'Interest Expense',
      accountType: 'expense',
    },
    {
      slug: 'office-expenses',
      code: '6600',
      name: 'Office Expenses',
      accountType: 'expense',
    },
    {
      code: '6610',
      name: 'Postage and Delivery',
      accountType: 'expense',
    },
    {
      code: '6620',
      name: 'Repairs and Maintenance',
      accountType: 'expense',
    },
    {
      slug: 'depreciation-expense',
      code: '6700',
      name: 'Depreciation Expense',
      accountType: 'expense',
    },
    {
      code: '6900',
      name: 'Uncategorized Expense',
      accountType: 'expense',
      description:
        'Holding account for expenses not yet classified. Clear it before closing each month.',
    },

    // Other expenses
    {
      slug: 'purchase-discount',
      code: '8100',
      name: 'Purchase Discount',
      accountType: 'other-expense',
    },
    {
      slug: 'exchange-grain-loss',
      code: '8200',
      name: 'Exchange Gain or Loss',
      accountType: 'other-expense',
    },
    {
      slug: 'other-expenses',
      code: '8900',
      name: 'Other Expenses',
      accountType: 'other-expense',
    },
  ],
  remove: [
    // A second bank account is better created with the real bank's name.
    'saving-bank-account',
    // Seeded as current liabilities under a shared slug: "Owner A Drawings"
    // belongs in equity, and loans go under 2600.
    'owner-drawings',
    // Opening balances go to Opening Balance Equity.
    'opening-balance-liabilities',
    // Duplicates Unearned Revenue.
    'revenue-received-in-advance',
  ],
  variants: [
    {
      key: 'corporation',
      name: 'Corporation (S corporation or C corporation)',
      accounts: [
        {
          slug: 'owner-equity',
          code: '3000',
          name: 'Common Stock',
          accountType: 'equity',
          description: 'Par or stated value of the shares issued.',
        },
        {
          code: '3020',
          name: 'Additional Paid-In Capital',
          accountType: 'equity',
          description:
            'Shareholder contributions beyond the par value of stock.',
        },
        {
          slug: 'drawings',
          code: '3100',
          name: 'Shareholder Distributions',
          accountType: 'equity',
          description: 'Distributions paid to shareholders.',
        },
      ],
    },
    {
      key: 'partnership',
      name: 'Partnership or multi-member LLC',
      accounts: [
        {
          slug: 'owner-equity',
          code: '3000',
          name: "Partners' Capital",
          accountType: 'equity',
          description: "The partners' capital in the business.",
        },
        {
          code: '3020',
          name: 'Partner Contributions',
          accountType: 'equity',
          description: 'Capital the partners put into the business.',
        },
        {
          slug: 'drawings',
          code: '3100',
          name: 'Partner Distributions',
          accountType: 'equity',
          description: 'Distributions paid to partners.',
        },
      ],
    },
    {
      key: 'sole-proprietorship',
      name: 'Sole proprietorship or single-member LLC',
      accounts: [
        {
          slug: 'owner-equity',
          code: '3000',
          name: "Owner's Equity",
          accountType: 'equity',
          description: "The owner's investment in the business.",
        },
        {
          code: '3020',
          name: "Owner's Contributions",
          accountType: 'equity',
          description: 'Money the owner puts into the business.',
        },
        {
          slug: 'drawings',
          code: '3100',
          name: "Owner's Draw",
          accountType: 'equity',
          description: 'Withdrawals by the owner.',
        },
      ],
    },
  ],
};
