import React, { useState, useRef, useEffect } from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import classNames from 'classnames';
import { paymentmethod } from 'common/subscriptionModels';

function BillingPeriod({ price, period, currency, onSelected, selected }) {
  return (
    <a
      href={'#!'}
      id={'monthly'}
      className={`period-container ${classNames({
        'billing-selected': selected,
      })} `}
    >
      <span className={'bg-period'}>
        <T id={period} />
      </span>

      <div className={'plan-price'}>
        <span className={'amount'}>
          {price} {currency}
        </span>
        <span className={'period'}>
          <T id={'year'} />
        </span>
      </div>
    </a>
  );
}
function BillingPeriods({ formik, title, selected = 1 }) {
  const billingRef = useRef(null);

  useEffect(() => {
    const billingPriod = billingRef.current.querySelectorAll('a');
    const billingSelected = billingRef.current.querySelector(
      '.billing-selected',
    );
    billingPriod.forEach((el) => {
      el.addEventListener('click', () => {
        billingSelected.classList.remove('billing-selected');
        el.classList.add('billing-selected');
      });
    });
  });

  return (
    <section class="billing-section">
      <h1>
        <T id={title} />
      </h1>
      <p className='paragraph'>
        <T id={'please_enter_your_preferred_payment_method'} />
      </p>
      <div className={'payment-method-continer'} ref={billingRef}>
        {paymentmethod.map((pay, index) => (
          <BillingPeriod
            period={pay.period}
            price={pay.price}
            currency={pay.currency}
             onSelected={()=>formik.setFieldValue('period', pay.period)}
            selected={selected == index + 1}
          />
        ))}
      </div>
    </section>
  );
}

export default BillingPeriods;
