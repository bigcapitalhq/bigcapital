import { Radio, Position, Tooltip } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { useRef, useEffect } from 'react';
import intl from 'react-intl-universal';
import { useItemFormContext } from './ItemFormProvider';
import { ItemFormSectionTitle } from './ItemFormSectionTitle';
import {
  FCheckbox,
  FieldRequiredHint,
  FormattedMessage as T,
  FFormGroup,
  FRadioGroup,
  FSelect,
  FInputGroup,
  Box,
} from '@/components';

export function ItemFormBasicSection() {
  const { isNewMode, item, itemsCategories } = useItemFormContext();
  const nameFieldRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (nameFieldRef.current) {
      nameFieldRef.current.focus();
    }
  }, []);

  const itemTypeHintContent = (
    <>
      <div className="mb1">
        <span
          dangerouslySetInnerHTML={{
            __html: intl.formatHTMLMessage({
              id: 'services_that_you_provide_to_customers',
            }),
          }}
        />
      </div>
      <div className="mb1">
        <span
          dangerouslySetInnerHTML={{
            __html: intl.formatHTMLMessage({
              id: 'products_you_buy_and_or_sell',
            }),
          }}
        />
      </div>
    </>
  );

  return (
    <Box data-section-id="primary">
      <ItemFormSectionTitle>Basic details</ItemFormSectionTitle>

      {/*----------- Item type ----------*/}
      <FFormGroup
        name={'type'}
        label={intl.get('item_type')}
        labelInfo={
          <span>
            <FieldRequiredHint />
            <Tooltip
              content={itemTypeHintContent}
              position={Position.BOTTOM_LEFT}
            />
          </span>
        }
        className={classNames('form-group--item-type')}
        inline={true}
        fastField
      >
        <FRadioGroup
          name={'type'}
          inline={true}
          disabled={!isNewMode && item?.type === 'inventory'}
          fastField
        >
          <Radio label={intl.get('service')} value="service" />
          <Radio label={intl.get('inventory')} value="inventory" />
        </FRadioGroup>
      </FFormGroup>

      {/*----------- Item name ----------*/}
      <FFormGroup
        name={'name'}
        label={<T id={'item_name'} />}
        labelInfo={<FieldRequiredHint />}
        inline={true}
        fastField
      >
        <FInputGroup
          name={'name'}
          inputRef={(ref: HTMLInputElement | null) => {
            nameFieldRef.current = ref;
          }}
          fastField
          fill
        />
      </FFormGroup>

      {/*----------- SKU ----------*/}
      <FFormGroup
        name={'code'}
        label={<T id={'item_code'} />}
        inline={true}
        fastField
      >
        <FInputGroup name={'code'} fastField fill />
      </FFormGroup>

      {/*----------- Item category ----------*/}
      <FFormGroup
        name={'categoryId'}
        label={<T id={'category'} />}
        inline={true}
      >
        <FSelect
          name={'categoryId'}
          items={itemsCategories}
          valueAccessor={'id'}
          textAccessor={'name'}
          placeholder={<T id={'select_category'} />}
          popoverProps={{ minimal: true, captureDismiss: true }}
          fill
        />
      </FFormGroup>

      {/*----------- Active ----------*/}
      <FFormGroup
        name={'active'}
        inline={true}
        className={classNames('form-group--active')}
        fastField
      >
        <FCheckbox
          name={'active'}
          inline={true}
          labelElement={<T id={'active'} />}
          fastField
        />
      </FFormGroup>
    </Box>
  );
}
