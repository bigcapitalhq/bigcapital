import { GetPlansService } from './GetPlans.service';

const buildPlanModel = (plans: unknown[]) => {
  const queryBuilder = {
    where: jest.fn().mockReturnThis(),
    whereNotNull: jest.fn().mockReturnThis(),
    orderBy: jest.fn().mockResolvedValue(plans),
  };
  return {
    query: jest.fn(() => queryBuilder),
  };
};

describe('GetPlansService', () => {
  it('groups monthly and annual rows into a single plan family', async () => {
    const planModel = buildPlanModel([
      {
        id: 1,
        slug: 'capital-basic-monthly',
        name: 'Capital Basic',
        desc: 'Good for service businesses that just started.',
        familySlug: 'capital-basic',
        price: 10,
        currency: 'USD',
        invoiceInterval: 'month',
        invoicePeriod: 1,
        features: JSON.stringify([{ text: 'Unlimited invoices' }]),
        isFeatured: false,
      },
      {
        id: 2,
        slug: 'capital-basic-annually',
        name: 'Capital Basic',
        desc: 'Good for service businesses that just started.',
        familySlug: 'capital-basic',
        price: 90,
        currency: 'USD',
        invoiceInterval: 'year',
        invoicePeriod: 1,
        features: JSON.stringify([{ text: 'Unlimited invoices' }]),
        isFeatured: false,
      },
    ]);

    const service = new GetPlansService(planModel as never);
    const plans = await service.getPlans();

    expect(plans).toHaveLength(1);
    expect(plans[0].slug).toBe('capital-basic');
    expect(plans[0].features).toEqual([{ text: 'Unlimited invoices' }]);
    expect(plans[0].prices).toHaveLength(2);
    expect(plans[0].prices[0]).toMatchObject({
      slug: 'capital-basic-monthly',
      interval: 'month',
      amount: 10,
    });
    expect(plans[0].prices[1]).toMatchObject({
      slug: 'capital-basic-annually',
      interval: 'year',
      amount: 90,
    });
  });
});
