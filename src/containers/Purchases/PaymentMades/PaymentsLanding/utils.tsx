// @ts-nocheck
import { pick } from 'lodash';

export const transformPaymentViewsToTabs = (paymentMadeViews) => {
    return paymentMadeViews.map((view) => ({
      ...pick(view, ['name', 'id']),
    }));
  };