import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import { accountsFieldShouldUpdate } from './utils';
import type { ItemFormValues } from './types';
import {
  AccountsSelect,
  FFormGroup,
  FInputGroup,
  FormattedMessage as T,
  Box,
  Row,
  Col,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';

export function ItemFormInventorySection() {
  const { accounts } = useItemFormContext();
  const { values } = useFormikContext<ItemFormValues>();

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

        {values.type === 'inventory' && (
          <Col xs={6}>
            {/*------------- Reorder point ------------- */}
            <FFormGroup
              label={intl.get('reorder_point')}
              name={'reorderPoint'}
              helperText={intl.get('reorder_point_hint')}
              inline={true}
            >
              <FInputGroup
                name={'reorderPoint'}
                type={'number'}
                min={0}
                step={0.001}
                fill={true}
              />
            </FFormGroup>
          </Col>
        )}
      </Row>
    </Box>
  );
}
