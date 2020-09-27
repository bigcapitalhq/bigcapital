import React, {
  useState,
  useMemo,
  useCallback,
  useEffect,
  useRef,
} from 'react';
import { FormattedMessage as T, useIntl } from 'react-intl';
import { PaymentMethodTabs } from './SubscriptionTabs';

function BillingTab({ formik }) {
  const [plan, setPlan] = useState();
  const planRef = useRef(null);
  const billingRef = useRef(null);

  const handlePlan = () => {
    const plans = planRef.current.querySelectorAll('a');
    const planSelected = planRef.current.querySelector('.plan-selected');

    plans.forEach((el) => {
      el.addEventListener('click', () => {
        planSelected.classList.remove('plan-selected');
        el.classList.add('plan-selected');
      });
    });
  };

  const handleBilling = () => {
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
  };

  useEffect(() => {
    handlePlan();
    handleBilling();
  });

  return (
    <div>
      <section>
        <h1 className={'bg-title'}>
          <T id={'a_select_a_plan'} />
        </h1>
        <p className={'bg-message '}>
          <T id={'please_enter_your_preferred_payment_method'} />
        </p>
        <div className={'billing-form__plan-container'} ref={planRef}>
          <a
            id={'basic-plan'}
            className={`plan-wrapper plan-selected`}
            onClick={() =>
              setPlan({ ...formik.setFieldValue('plan_slug', 'basic') })
            }
          >
            <div className={'plan-header'}>
              <div className={'plan-name'}>
                <T id={'Basic'} />
              </div>
            </div>
            <div className={'plan-description'}>
              <ul>
                <li>Sales/purchases module.</li>
                <li>Expense module.</li>
                <li>Inventory module.</li>
                <li>Unlimited status pages.</li>
                <li>Unlimited status pages.</li>
              </ul>
            </div>
            <div className={'plan-price'}>
              <span className={'amount'}>1200 LYD</span>
              <span className={'period'}>
                <T id={'year_per'} />
              </span>
            </div>
          </a>
          <a
            id={'pro-plan'}
            className={`plan-wrapper`}
            onClick={() =>
              setPlan({ ...formik.setFieldValue('plan_slug', 'pro') })
            }
          >
            <div className={'plan-header'}>
              <div className={'plan-name'}>
                <T id={'pro'} />
              </div>
            </div>
            <div className={'plan-description'}>
              <ul>
                <li>Sales/purchases module.</li>
                <li>Expense module.</li>
                <li>Inventory module.</li>
                <li>Unlimited status pages.</li>
                <li>Unlimited status pages.</li>
              </ul>
            </div>
            <div className={'plan-price'}>
              <span className={'amount'}>1200 LYD</span>
              <span className={'period'}>
                <T id={'year_per'} />
              </span>
            </div>
          </a>
        </div>
      </section>

      <section>
        <h1 className={'bg-title'}>
          <T id={'b_choose_your_billing'} />
        </h1>
        <p className={'bg-message'}>
          <T id={'please_enter_your_preferred_payment_method'} />
        </p>
        <div className={'payment-method-continer'} ref={billingRef}>
          <a
            href={'#'}
            id={'monthly'}
            className={'period-container billing-selected'}
          >
            <span className={'bg-period'}>
              <T id={'monthly'} />
            </span>
            <div className={'plan-price'}>
              <span className={'amount'}>1200 LYD</span>
              <span className={'period'}>
                <T id={'year'} />
              </span>
            </div>
          </a>
          <a href={'#'} id={'yearly'} className={'period-container'}>
            <span className={'bg-period'}>
              <T id={'yearly'} />
            </span>
            <div className={'plan-price'}>
              <span className={'amount'}>1200 LYD</span>
              <span className={'period'}>
                <T id={'year'} />
              </span>
            </div>
          </a>
        </div>
      </section>
      <section>
        <h1 className={'bg-title'}>
          <T id={'c_payment_methods'} />
        </h1>
        <p className={'bg-message'}>
          <T id={'please_enter_your_preferred_payment_method'} />
        </p>
        <PaymentMethodTabs formik={formik} />
      </section>
    </div>
  );
}

export default BillingTab;
