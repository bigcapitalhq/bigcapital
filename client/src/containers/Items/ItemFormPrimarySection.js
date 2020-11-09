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
import { FormattedMessage as T, useIntl } from 'react-intl';
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
  return (
    <div className={classNames(CLASSES.PAGE_FORM_HEADER_PRIMARY)}>
      <Row>
        <Col xs={7}>
          {/*----------- Item type ----------*/}
          <FormGroup
            medium={true}
            label={<T id={'item_type'} />}
            labelInfo={<FieldRequiredHint />}
            className={'form-group--item-type'}
            intent={errors.type && touched.type && Intent.DANGER}
            helperText={<ErrorMessage {...{ errors, touched }} name="type" />}
            inline={true}
          >
            <RadioGroup
              inline={true}
              onChange={handleStringChange((value) => {
                setFieldValue('item_type', value);
              })}
              selectedValue={values.item_type}
            >
              <Radio
                label={
                  <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={'Services that you provide to customers.'}
                    position={Position.BOTTOM_LEFT}
                  >
                    <T id={'service'} />
                  </Tooltip>
                }
                value="service"
              />
              <Radio
                label={
                  <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={
                      'Products you buy and/or sell and that you track quantities of.'
                    }
                    position={Position.BOTTOM_LEFT}
                  >
                    <T id={'inventory'} />
                  </Tooltip>
                }
                value="inventory"
              />
              <Radio
                label={
                  <Tooltip
                    className={Classes.TOOLTIP_INDICATOR}
                    content={
                      'Products you buy and/or sell but don’t need to (or can’t) track quantities of, for example, nuts and bolts used in an installation.'
                    }
                    position={Position.BOTTOM_LEFT}
                  >
                    <T id={'non_inventory'} />
                  </Tooltip>
                }
                value="non_inventory"
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
            label={<T id={'sku'} />}
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
                setFieldValue('item_category_id', category.id);
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
