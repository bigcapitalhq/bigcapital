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
  FSelect,
  FormattedMessage as T,
  Box,
  Row,
  Col,
} from '@/components';
import { ACCOUNT_TYPE } from '@/constants/accountTypes';
import {
  getItemCostMethodLabel,
  ITEM_COST_METHOD_INHERIT,
} from '@/constants/costMethods';
import { useSettingsItems } from '@/hooks/query';

export function ItemFormInventorySection() {
  const { accounts, item, isNewMode, itemsCategories } = useItemFormContext();
  const { values } = useFormikContext<ItemFormValues>();
  const { data: itemsSettings } = useSettingsItems();

  // The cost method is frozen once the item has its first inventory transaction.
  const isCostMethodLocked = !isNewMode && Boolean(item?.costMethodLockedAt);
  const defaultCostMethod =
    (itemsSettings?.defaultCostMethod as string | undefined) || 'AVG';

  const selectedCategory = itemsCategories.find(
    (category) => String(category.id) === String(values.categoryId),
  );
  const inheritedCostMethod = selectedCategory?.costMethod || defaultCostMethod;

  const costMethodOptions = [
    {
      value: ITEM_COST_METHOD_INHERIT,
      label: intl.get('cost_method_inherit_from_category'),
    },
    { value: 'AVG', label: intl.get('cost_method_average') },
    { value: 'FIFO', label: intl.get('cost_method_fifo') },
    { value: 'LIFO', label: intl.get('cost_method_lifo') },
  ];

  const costMethodHelperText = isCostMethodLocked
    ? intl.get('cost_method_locked_hint')
    : values.costMethod
      ? intl.get('cost_method_item_hint')
      : intl.get('cost_method_inherit_hint', {
          method: getItemCostMethodLabel(inheritedCostMethod),
        });

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
            {/*------------- Cost method ------------- */}
            <FFormGroup
              label={intl.get('cost_method')}
              name={'costMethod'}
              helperText={costMethodHelperText}
              inline={true}
            >
              <FSelect
                name={'costMethod'}
                items={costMethodOptions}
                valueAccessor={'value'}
                textAccessor={'label'}
                filterable={false}
                popoverProps={{ minimal: true }}
                buttonProps={{ 'data-testId': 'item-cost-method-select' }}
                disabled={isCostMethodLocked}
                fill={true}
              />
            </FFormGroup>
          </Col>
        )}

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
