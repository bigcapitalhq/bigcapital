// @ts-nocheck
import React from 'react';
import classNames from 'classnames';

import { T } from '@/components';
import { saveInvoke } from '@/utils';

import '@/style/pages/Subscription/PlanRadio.scss';
import '@/style/pages/Subscription/PlanPeriodRadio.scss';

export function SubscriptionPlans({ value, plans, onSelect }) {
  const handleSelect = (value) => {
    onSelect && onSelect(value);
  };

  return (
    <div className={'plan-radios'}>
      {plans.map((plan) => (
        <SubscriptionPlan
          name={plan.name}
          description={plan.description}
          slug={plan.slug}
          price={plan.price}
          currencyCode={plan.currencyCode}
          value={plan.slug}
          onSelected={handleSelect}
          selectedOption={value}
        />
      ))}
    </div>
  );
}

export function SubscriptionPlan({
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

/**
 * Subscription periods.
 */
export function SubscriptionPeriods({ periods, selectedPeriod, onPeriodSelect }) {
  const handleSelected = (value) => {
    saveInvoke(onPeriodSelect, value);
  };

  return (
    <div className={'plan-periods'}>
      {periods.map((period) => (
        <SubscriptionPeriod
          period={period.slug}
          label={period.label}
          onSelected={handleSelected}
          price={period.price}
          selectedPeriod={selectedPeriod}
        />
      ))}
    </div>
  );
}

/**
 * Billing period.
 */
export function SubscriptionPeriod({
  // #ownProps
  label,
  selectedPeriod,
  onSelected,
  period,
  price,
  currencyCode,
}) {
  const handlePeriodClick = () => {
    saveInvoke(onSelected, period);
  };
  return (
    <div
      id={`plan-period-${period}`}
      className={classNames(
        { 'is-selected': period === selectedPeriod },
        'period-radio',
      )}
      onClick={handlePeriodClick}
    >
      <span className={'period-radio__label'}>{label}</span>

      <div className={'period-radio__price'}>
        <span className={'period-radio__amount'}>
          {price} {currencyCode}
        </span>
        <span className={'period-radio__period'}>{label}</span>
      </div>
    </div>
  );
}
