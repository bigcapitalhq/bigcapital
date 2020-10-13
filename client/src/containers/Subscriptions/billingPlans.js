import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { plans } from 'common/subscriptionModels';

function BillingPlan({
  name,
  description,
  price,
  slug,
  currency,
  onSelected,
  selected,
}) {
  return (
    <a
      id={'basic-plan'}
      className={`plan-wrapper ${classNames({
        'plan-selected': selected,
      })} `}
      onClick={() => onSelected(slug)}
    >
      <div className={'plan-header'}>
        <div className={'plan-name'}>
          <T id={name} />
        </div>
      </div>
      <div className={'plan-description'}>
        <ul>
          {description.map((desc, index) => (
            <li>{desc}</li>
          ))}
        </ul>
      </div>
      <div className={'plan-price'}>
        <span className={'amount'}>
          {' '}
          {price} {currency}
        </span>
        <span className={'period'}>
          <T id={'year_per'} />
        </span>
      </div>
    </a>
  );
}

function BillingPlans({ formik, title, selected = 1 }) {
  const planRef = useRef(null);

  useEffect(() => {
    const plans = planRef.current.querySelectorAll('a');
    const planSelected = planRef.current.querySelector('.plan-selected');

    plans.forEach((el) => {
      el.addEventListener('click', () => {
        planSelected.classList.remove('plan-selected');
        el.classList.add('plan-selected');
      });
    });
  });

  return (
    <section class="billing-section">
      <h1 className={'bg-title'}>
        <T id={title} />
      </h1>
      <p className='paragraph'>
        <T id={'please_enter_your_preferred_payment_method'} />
      </p>
      <div className={'billing-form__plan-container'} ref={planRef}>
        {plans.map((plan, index) => (
          <BillingPlan
            name={plan.name}
            description={plan.description}
            slug={plan.slug}
            price={plan.price}
            currency={plan.currency}
            onSelected={() => formik.setFieldValue('plan_slug', plan.slug)}
            selected={selected == index + 1}
          />
        ))}
      </div>
    </section>
  );
}

export default BillingPlans;

