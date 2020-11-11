import React, { useMemo } from 'react';
import {
  FormGroup,
  Intent,
  InputGroup,
  RadioGroup,
  Classes,
  Radio,
  Position,
  Tooltip,
} from '@blueprintjs/core';
import { FormattedMessage as T } from 'react-intl';
import {
  CategoriesSelectList,
  ErrorMessage,
  Hint,
  Col,
  Row,
  FieldRequiredHint,
} from 'components';
import classNames from 'classnames';
import { CLASSES } from 'common/classes';

import withItemCategories from 'containers/Items/withItemCategories';
import withAccounts from 'containers/Accounts/withAccounts';

import { compose, handleStringChange } from 'utils';

/**
 * Item form primary section.
 */
function ItemFormPrimarySection({
  getFieldProps,
  setFieldValue,
  errors,
  touched,
  values,

  // #withItemCategories
  categoriesList,
}) {

  const itemTypeHintContent = (
    <>
      <div class="mb1"><strong>{'Service: '}</strong>{'Services that you provide to customers. '}</div>
      <div class="mb1"><strong>{'Inventory: '}</strong>{'Products you buy and/or sell and that you track quantities of.'}</div>
      <div class="mb1"><strong>{'Non-Inventory: '}</strong>{'Products you buy and/or sell but don’t need to (or can’t) track quantities of, for example, nuts and bolts used in an installation.'}</div>
    </>);

  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
      <Row>
        <Col xs={7}>
          {/*----------- Item type ----------*/}
          <FormGroup
            medium={true}
            label={<T id={'item_type'} />}
            labelInfo={
              <span>
                <FieldRequiredHint />
                <Hint content={itemTypeHintContent} position={Position.BOTTOM_LEFT} />
              </span>
            }
            className={'form-group--item-type'}
            intent={errors.type && touched.type && Intent.DANGER}
            helperText={<ErrorMessage {...{ errors, touched }} name="type" />}
            inline={true}
          >
            <RadioGroup
              inline={true}
              onChange={handleStringChange((value) => {
                setFieldValue('type', value);
              })}
              selectedValue={values.type}
            >
              <Radio
                label={<T id={'service'} />}
                value="service"
              />
              <Radio
                label={<T id={'inventory'} />}
                value="inventory"
              />
              <Radio
                label={<T id={'non_inventory'} />}
                value="non-inventory"
              />
            </RadioGroup>
          </FormGroup>

          {/*----------- Item name ----------*/}
          <FormGroup
            label={<T id={'item_name'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--item-name'}
            intent={errors.name && touched.name && Intent.DANGER}
            helperText={<ErrorMessage {...{ errors, touched }} name="name" />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.name && touched.name && Intent.DANGER}
              {...getFieldProps('name')}
            />
          </FormGroup>

          {/*----------- SKU ----------*/}
          <FormGroup
            label={<T id={'item_code'} />}
            labelInfo={<Hint />}
            className={'form-group--item-sku'}
            intent={errors.sku && touched.sku && Intent.DANGER}
            helperText={<ErrorMessage {...{ errors, touched }} name="sku" />}
            inline={true}
          >
            <InputGroup
              medium={true}
              intent={errors.sku && touched.sku && Intent.DANGER}
              {...getFieldProps('sku')}
            />
          </FormGroup>

          {/*----------- Item category ----------*/}
          <FormGroup
            label={<T id={'category'} />}
            labelInfo={<Hint />}
            inline={true}
            intent={errors.category_id && touched.category_id && Intent.DANGER}
            helperText={
              <ErrorMessage {...{ errors, touched }} name="category" />
            }
            className={classNames(
              'form-group--select-list',
              'form-group--category',
              Classes.FILL,
            )}
          >
            <CategoriesSelectList
              categoriesList={categoriesList}
              selecetedCategoryId={values.category_id}
              onCategorySelected={(category) => {
                setFieldValue('category_id', category.id);
              }}
              popoverProps={{ minimal: true }}
            />
          </FormGroup>
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

export default compose(
  withAccounts(({ accountsList }) => ({
    accountsList,
  })),
  withItemCategories(({ categoriesList }) => ({
    categoriesList,
  })),
)(ItemFormPrimarySection);
