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
        <Choose.When condition={row.is_fully_paid && row.is_delivered}>
          <span className={'fully-paid-icon'}>
            <Icon icon="small-tick" iconSize={18} />
          </span>
          <span class="fully-paid-text">
            <T id={'paid'} />
          </span>
        </Choose.When>

        <Choose.When condition={row.is_delivered}>
          <Choose>
            <Choose.When condition={row.is_overdue}>
              <span className={'overdue-status'}>
                <T id={'overdue_by'} values={{ overdue: row.overdue_days }} />
              </span>
            </Choose.When>
            <Choose.Otherwise>
              <span className={'due-status'}>
                <T id={'due_in'} values={{ due: row.remaining_days }} />
              </span>
            </Choose.Otherwise>
          </Choose>

          <If condition={row.is_partially_paid}>
            <span class="partial-paid">
              <T
                id={'day_partially_paid'}
                values={{
                  due: row.due_amount,
                  currencySign: '$',
                }}
              />
            </span>
            <ProgressBar
              animate={false}
              stripes={false}
              intent={Intent.PRIMARY}
              value={calculateStatus(row.payment_amount, row.balance)}
            />
          </If>
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
