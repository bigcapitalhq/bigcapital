import intl from 'react-intl-universal';
import { Radio } from '@blueprintjs/core';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import { accountsFieldShouldUpdate } from './utils';
import {
  AccountsSelect,
  FFormGroup,
  FRadioGroup,
  FormattedMessage as T,
  Box,
  Row,
  Col,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';

export function ItemFormInventorySection() {
  const { accounts, item } = useItemFormContext() as any;
  // Server rejects cost-method changes after inventory txs; unlock until API sends flag.
  const costMethodLocked = Boolean(item?.costMethodLocked);

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

      <Row>
        <Col xs={6}>
          <FFormGroup
            label={intl.get('cost_method') || 'Cost Method'}
            name={'costMethod'}
            fastField={true}
            inline={true}
            helperText={
              costMethodLocked
                ? intl.get('cost_method_locked') ||
                  'Cost method is locked after inventory transactions exist.'
                : undefined
            }
          >
            <FRadioGroup
              name={'costMethod'}
              inline={true}
              disabled={costMethodLocked}
            >
              <Radio
                label={intl.get('average_cost') || 'Average'}
                value="AVG"
              />
              <Radio label="FIFO" value="FIFO" />
              <Radio label="LIFO" value="LIFO" />
            </FRadioGroup>
          </FFormGroup>
        </Col>
      </Row>
    </Box>
  );
}
