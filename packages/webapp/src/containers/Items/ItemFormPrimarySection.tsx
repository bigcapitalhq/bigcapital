// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import {
  FormGroup,
  RadioGroup,
  Classes,
  Radio,
  Position,
  MenuItem,
} from '@blueprintjs/core';
import { ErrorMessage, FastField } from 'formik';
import { CLASSES } from '@/constants/classes';
import {
  Hint,
  Col,
  Row,
  FieldRequiredHint,
  FormattedMessage as T,
  FormattedHTMLMessage,
  FFormGroup,
  FSelect,
  FInputGroup,
} from '@/components';
import classNames from 'classnames';

import { useItemFormContext } from './ItemFormProvider';
import { handleStringChange, inputIntent } from '@/utils';
// import { categoriesFieldShouldUpdate } from './utils';

/**
 * Item form primary section.
 */
export default function ItemFormPrimarySection() {
  // Item form context.
  const { isNewMode, item, itemsCategories } = useItemFormContext();

  const nameFieldRef = useRef(null);

  useEffect(() => {
    // Auto focus item name field once component mount.
    if (nameFieldRef.current) {
      nameFieldRef.current.focus();
    }
  }, []);

  const itemTypeHintContent = (
    <>
      <div class="mb1">
        <FormattedHTMLMessage id={'services_that_you_provide_to_customers'} />
      </div>
      <div class="mb1">
        <FormattedHTMLMessage id={'products_you_buy_and_or_sell'} />
      </div>
    </>
  );

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
      {/*----------- Item type ----------*/}
      <FastField name={'type'}>
        {({ form, field: { value }, meta: { touched, error } }) => (
          <FormGroup
            medium={true}
            label={<T id={'item_type'} />}
            labelInfo={
              <span>
                <FieldRequiredHint />
                <Hint
                  content={itemTypeHintContent}
                  position={Position.BOTTOM_LEFT}
                />
              </span>
            }
            className={'form-group--item-type'}
            intent={inputIntent({ error, touched })}
            helperText={<ErrorMessage name="item_type" />}
            inline={true}
          >
            <RadioGroup
              inline={true}
              onChange={handleStringChange((_value) => {
                form.setFieldValue('type', _value);
              })}
              selectedValue={value}
              disabled={!isNewMode && item.type === 'inventory'}
            >
              <Radio label={<T id={'service'} />} value="service" />
              <Radio label={<T id={'inventory'} />} value="inventory" />
            </RadioGroup>
          </FormGroup>
        )}
      </FastField>

      <Row>
        <Col xs={7}>
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
              medium={true}
              inputRef={(ref) => (nameFieldRef.current = ref)}
              fastField
            />
          </FFormGroup>

          {/*----------- SKU ----------*/}
          <FFormGroup
            name={'code'}
            label={<T id={'item_code'} />}
            inline={true}
            fastField
          >
            <FInputGroup name={'code'} medium={true} fastField />
          </FFormGroup>

          {/*----------- Item category ----------*/}
          <FFormGroup
            name={'category_id'}
            label={<T id={'category'} />}
            inline={true}
          >
            <FSelect
              name={'category_id'}
              items={itemsCategories}
              valueAccessor={'id'}
              textAccessor={'name'}
              placeholder={<T id={'select_category'} />}
              popoverProps={{ minimal: true, captureDismiss: true }}
            />
          </FFormGroup>
        </Col>

        <Col xs={3}>
          {/* <Dragzone
            initialFiles={initialAttachmentFiles}
            onDrop={handleDropFiles}
            onDeleteFile={handleDeleteFile}
            hint={'Attachments: Maxiumum size: 20MB'}
            className={'mt2'}
          /> */}
        </Col>
      </Row>
    </div>
  );
}
