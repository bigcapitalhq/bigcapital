import React from 'react';
import { FastField, ErrorMessage } from 'formik';
import {
  FormGroup,
  InputGroup,
  ControlGroup,
  Position,
} from '@blueprintjs/core';
import { DateInput } from '@blueprintjs/datetime';
import {
  AccountsSelectList,
  MoneyInputGroup,
  InputPrependText,
  Col,
  Row,
  Hint,
} from 'components';
import { CLASSES } from 'common/classes';
import { FormattedMessage as T } from 'react-intl';
import classNames from 'classnames';
import withAccounts from 'containers/Accounts/withAccounts';
import withSettings from 'containers/Settings/withSettings';
import {
  compose,
  tansformDateValue,
  momentFormatter,
  inputIntent,
  handleDateChange,
} from 'utils';

/**
 * Item form inventory sections.
 */
function ItemFormInventorySection({ accountsList, baseCurrency }) {
  return (
    <div class="page-form__section page-form__section--inventory">
      <h3>
        <T id={'inventory_information'} />
      </h3>

      <Row>
        <Col xs={6}>
          {/*------------- Inventory account ------------- */}
          <FastField name={'inventory_account_id'}>
            {({ form, field: { value }, meta: { touched, error } }) => (
              <FormGroup
                label={<T id={'inventory_account'} />}
                inline={true}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="inventory_account_id" />}
                className={classNames(
                  'form-group--item-inventory_account',
                  'form-group--select-list',
                  CLASSES.FILL,
                )}
              >
                <AccountsSelectList
                  accounts={accountsList}
                  onAccountSelected={(account) => {
                    form.setFieldValue('inventory_account_id', account.id);
                  }}
                  defaultSelectText={<T id={'select_account'} />}
                  selectedAccountId={value}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>
      </Row>
    </div>
  );
}

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withSettings(({ organizationSettings }) => ({
    baseCurrency: organizationSettings?.baseCurrency,
  })),
)(ItemFormInventorySection);
