// @ts-nocheck
import React from 'react';
import {
  AccountsSelect,
  FFormGroup,
  FormattedMessage as T,
  Col,
  Row,
} from '@/components';

import { withCurrentOrganization } from '@/containers/Organization/withCurrentOrganization';
import { accountsFieldShouldUpdate } from './utils';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import { useItemFormContext } from './ItemFormProvider';
import intl from 'react-intl-universal';
import { flow } from 'fp-ts/function';

/**
 * Item form inventory sections.
 */
function ItemFormInventorySectionInner({ organization: { base_currency } }) {
  const { accounts } = useItemFormContext();

  return (
    <div class="page-form__section page-form__section--inventory">
      <h3>
        <T id={'inventory_information'} />
      </h3>

      <Row>
        <Col xs={6}>
          {/*------------- Inventory Account ------------- */}
          <FFormGroup
            label={intl.get('inventory_account')}
            name={'inventory_account_id'}
            items={accounts}
            fastField={true}
            shouldUpdate={accountsFieldShouldUpdate}
            inline={true}
          >
            <AccountsSelect
              name={'inventory_account_id'}
              items={accounts}
              placeholder={<T id={'select_account'} />}
              filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
              fastField={true}
              shouldUpdate={accountsFieldShouldUpdate}
            />
          </FFormGroup>
        </Col>
      </Row>
    </div>
  );
}

export const ItemFormInventorySection = flow(
  withCurrentOrganization(),
)(ItemFormInventorySectionInner);
