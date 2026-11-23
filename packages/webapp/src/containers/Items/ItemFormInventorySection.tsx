import { Button, ButtonGroup } from '@blueprintjs/core';
import { useFormikContext } from 'formik';
import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import { accountsFieldShouldUpdate } from './utils';
import type { ItemFormValues } from './types';
import {
  AccountsSelect,
  FeatureCan,
  FFormGroup,
  FInputGroup,
  FormattedMessage as T,
  Box,
} from '@/components';
import { Features } from '@/constants';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';

export function ItemFormInventorySection() {
  const { accounts } = useItemFormContext();
  const { values, setFieldValue } = useFormikContext<ItemFormValues>();

  return (
    <Box data-section-id="inventory">
      <ItemFormSectionTitle>Inventory details</ItemFormSectionTitle>

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

      {values.type === 'inventory' && (
        <FeatureCan feature={Features.BatchTracking}>
          <FFormGroup
            name="inventoryTracking"
            label={intl.get('item.inventory_tracking')}
            inline
          >
            <ButtonGroup
              aria-label={intl.get('item.inventory_tracking')}
              role="group"
            >
              {(['none', 'batches'] as const).map((mode) => (
                <Button
                  key={mode}
                  type="button"
                  active={values.inventoryTracking === mode}
                  aria-pressed={values.inventoryTracking === mode}
                  onClick={() => setFieldValue('inventoryTracking', mode)}
                >
                  {intl.get(mode === 'none' ? 'none' : 'batch.tab.label')}
                </Button>
              ))}
            </ButtonGroup>
          </FFormGroup>
        </FeatureCan>
      )}

      {/*------------- Reorder point ------------- */}
      {values.type === 'inventory' && (
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
      )}
    </Box>
  );
}
