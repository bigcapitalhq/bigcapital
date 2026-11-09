import { pick } from 'lodash';

interface PaymentView {
  name?: string;
  id?: number;
  [key: string]: any;
}

export const transformPaymentViewsToTabs = (
  paymentMadeViews: PaymentView[],
) => {
  return paymentMadeViews.map((view) => ({
    ...pick(view, ['name', 'id']),
  }));
};
