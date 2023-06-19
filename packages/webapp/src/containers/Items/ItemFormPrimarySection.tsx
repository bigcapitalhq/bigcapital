// @ts-nocheck
import React, { useEffect, useRef } from 'react';
import {
  FormGroup,
  InputGroup,
  RadioGroup,
  Classes,
  Radio,
  Position,
} from '@blueprintjs/core';
import { ErrorMessage, FastField } from 'formik';
import { CLASSES } from '@/constants/classes';
import {
  CategoriesSelectList,
  Hint,
  Col,
  Row,
  FieldRequiredHint,
  FormattedMessage as T,
  FormattedHTMLMessage,
} from '@/components';
import classNames from 'classnames';

import { useItemFormContext } from './ItemFormProvider';
import { handleStringChange, inputIntent } from '@/utils';
import { categoriesFieldShouldUpdate } from './utils';

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
          <FastField name={'name'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'item_name'} />}
                labelInfo={<FieldRequiredHint />}
                className={'form-group--item-name'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'name'} />}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  {...field}
                  intent={inputIntent({ error, touched })}
                  inputRef={(ref) => (nameFieldRef.current = ref)}
                />
              </FormGroup>
            )}
          </FastField>

          {/*----------- SKU ----------*/}
          <FastField name={'code'}>
            {({ field, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'item_code'} />}
                className={'form-group--item_code'}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name={'code'} />}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  intent={inputIntent({ error, touched })}
                  {...field}
                />
              </FormGroup>
            )}
          </FastField>

          {/*----------- Item category ----------*/}
          <FastField
            name={'category_id'}
            categories={itemsCategories}
            shouldUpdate={categoriesFieldShouldUpdate}
          >
            {({ form, field: { value }, meta: { error, touched } }) => (
              <FormGroup
                label={<T id={'category'} />}
                inline={true}
                intent={inputIntent({ error, touched })}
                helperText={<ErrorMessage name="category_id" />}
                className={classNames('form-group--category', Classes.FILL)}
              >
                <CategoriesSelectList
                  categories={itemsCategories}
                  selecetedCategoryId={value}
                  onCategorySelected={(category) => {
                    form.setFieldValue('category_id', category.id);
                  }}
                />
              </FormGroup>
            )}
          </FastField>
        </Col>

        <Col xs={3}>
          {/* <Dragzone
            initialFiles={initialAttachmentFiles}
            onDrop={handleDropFiles}
            onDeleteFile={handleDeleteFile}
            hint={'Attachments: Maximum size: 20MB'}
            className={'mt2'}
          /> */}
        </Col>
      </Row>
    </div>
  );
}
