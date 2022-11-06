// @ts-nocheck
import React from 'react';
import classNames from 'classnames';
import { FormattedMessage as T } from '@/components';

import { saveInvoke } from '@/utils';

/**
 * Billing plan.
 */
export default function BillingPlan({
  name,
  description,
  price,
  currencyCode,

  value,
  selectedOption,
  onSelected,
}) {
  const handlePlanClick = () => {
    saveInvoke(onSelected, value);
  };
  return (
    <div
      id={'basic-plan'}
      className={classNames('plan-radio', {
        'is-selected': selectedOption === value,
      })}
      onClick={handlePlanClick}
    >
      <div className={'plan-radio__header'}>
        <div className={'plan-radio__name'}>{name}</div>
      </div>

      <div className={'plan-radio__description'}>
        <ul>
          {description.map((line) => (
            <li>{line}</li>
          ))}
        </ul>
      </div>

      <div className={'plan-radio__price'}>
        <span className={'plan-radio__amount'}>
          {price} {currencyCode}
        </span>
        <span className={'plan-radio__period'}>
          <T id={'monthly'} />
        </span>
      </div>
    </div>
  );
}
