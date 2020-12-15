import React from 'react';
import { Intent, Tag, ProgressBar } from '@blueprintjs/core';
import { Choose, If, Icon } from 'components';
import { FormattedMessage as T, useIntl } from 'react-intl';

const calculateStatus = (paymentAmount, balanceAmount) =>
  paymentAmount / balanceAmount;

export const statusAccessor = (row) => {
  return (
    <div className={'status-accessor'}>
      <Choose>
        <Choose.When condition={row.is_delivered}>
          <Choose>
            <Choose.When condition={row.is_overdue && !row.is_partially_paid}>
              <span className={'overdue_status'}>
                <p>
                  <T id={'overdue_by'} /> {row.overdue_days} <T id={'day'} />
                </p>
              </span>
            </Choose.When>

            <Choose.When condition={!row.is_overdue && row.is_partially_paid}>
              <div>
                <span>
                  <p>
                    <T id={'due_in'} /> {row.remaining_days}{' '}
                    <T id={'day_partially_paid'} /> ${row.due_amount}{' '}
                    <T id={'due'} />
                  </p>
                </span>
                <ProgressBar
                  animate={false}
                  stripes={false}
                  intent={Intent.PRIMARY}
                  value={calculateStatus(row.payment_amount, row.balance)}
                />
              </div>
            </Choose.When>

            <Choose.When condition={row.is_overdue && row.is_partially_paid}>
              <div>
                <span>
                  <p>
                    <T id={'overdue_by'} /> {row.overdue_days}{' '}
                    <T id={'day_partially_paid'} /> ${row.due_amount}{' '}
                    <T id={'due'} />
                  </p>
                </span>
                <ProgressBar
                  animate={false}
                  stripes={false}
                  intent={Intent.PRIMARY}
                  value={calculateStatus(row.payment_amount, row.balance)}
                />
              </div>
            </Choose.When>

            <Choose.When condition={row.is_fully_paid}>
              <span className={'fully-paid'}>
                <Icon icon="checkmark-16" iconSize={20} />
              </span>
              <span>
                <T id={'paid'} />
              </span>
            </Choose.When>
            <Choose.Otherwise>
              <span className={'remaining-status'}>
                <p>
                  <T id={'due_in'} /> {row.remaining_days} <T id={'day'} />
                </p>
              </span>
            </Choose.Otherwise>
          </Choose>
        </Choose.When>

        <Choose.Otherwise>
          <Tag minimal={true}>
            <T id={'draft'} />
          </Tag>
        </Choose.Otherwise>
      </Choose>
    </div>
  );
};
