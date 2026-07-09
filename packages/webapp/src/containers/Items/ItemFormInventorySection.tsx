import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import { accountsFieldShouldUpdate } from './utils';
import {
  AccountsSelect,
  FFormGroup,
  FormattedMessage as T,
  Box,
  Row,
  Col,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';

export function ItemFormInventorySection() {
  const { accounts } = useItemFormContext();

  return (
    <Box data-section-id="inventory">
      <ItemFormSectionTitle>Inventory details</ItemFormSectionTitle>

      <Row>
        <Col xs={6}>
          {/*------------- Inventory Account ------------- */}
          <FFormGroup
            label={intl.get('inventory_account')}
            name={'inventoryAccountId'}
            fastField={true}
            inline={true}
          >
            <AccountsSelect
              name={'inventoryAccountId'}
              items={accounts}
              placeholder={<T id={'select_account'} />}
              filterByTypes={[ACCOUNT_TYPE.INVENTORY]}
              fastField={true}
              shouldUpdate={accountsFieldShouldUpdate}
              accounts={accounts}
            />
          </FFormGroup>
        </Col>
      </Row>
    </Box>
  );
}
