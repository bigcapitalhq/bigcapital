import React, { useState } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';

import {
  FormGroup,
  MenuItem,
  Intent,
  InputGroup,
  HTMLSelect,
  Button
} from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
import { Select } from '@blueprintjs/select';
import AppToaster from 'components/AppToaster';

export default function ItemForm({
  submitItem,
  accounts,
  category,
}) {
  const [selectedAccounts, setSelectedAccounts] = useState({});

  const ItemTypeDisplay = [
    { label: 'Select Item Type' },
    { value: 'service', label: 'service' },
    { value: 'inventory', label: 'inventory' },
    { value: 'non-inventory', label: 'non-inventory' }
  ];
  const validationSchema = Yup.object().shape({
    name: Yup.string().required(),
    type: Yup.string()
      .trim()
      .required(),
    sku: Yup.string().required(),
    cost_price: Yup.number().required(),
    sell_price: Yup.number().required(),
    cost_account_id: Yup.number().required(),
    sell_account_id: Yup.number().required(),
    inventory_account_id: Yup.number().required(),
    category_id: Yup.number().required(),
    stock: Yup.string() || Yup.boolean()
  });
  const formik = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {},
    onSubmit: values => {
      submitItem(values)
        .then(response => {
          AppToaster.show({
            message: 'The_Items_has_been_Submit'
          });
        })
        .catch(err => {
          alert(err.message);
        });
    }
  });

  const accountItem = (item, { handleClick }) => (
    <MenuItem key={item.id} text={item.name} label={item.code} onClick={handleClick} />
  );
  // Filter Account Items
  const filterAccounts = (query, account, _index, exactMatch) => {
    const normalizedTitle = account.name.toLowerCase();
    const normalizedQuery = query.toLowerCase();
    if (exactMatch) {
      return normalizedTitle === normalizedQuery;
    } else {
      return `${account.code} ${normalizedTitle}`.indexOf(normalizedQuery) >= 0;
    }
  };

  const onItemAccountSelect = filedName => {
    return account => {
      setSelectedAccounts({
        ...selectedAccounts,
        [filedName]: account
      });
      formik.setFieldValue(filedName, account.id);
    };
  };

  const getSelectedAccountLabel = (fieldName, defaultLabel) => {
    return typeof selectedAccounts[fieldName] !== 'undefined'
      ? selectedAccounts[fieldName].name
      : defaultLabel;
  };

  return (
    <div class='item-form'>
      <form onSubmit={formik.handleSubmit}>
        <FormGroup
          medium={true}
          label={'Item Type'}
          className={'form-group--item-type'}
          intent={formik.errors.type && Intent.DANGER}
          helperText={formik.errors.type && formik.errors.type}
          inline={true}
        >
          <HTMLSelect
            fill={true}
            options={ItemTypeDisplay}
            {...formik.getFieldProps('type')}
          />
        </FormGroup>

        <FormGroup
          label={'Item Name'}
          className={'form-group--item-name'}
          intent={formik.errors.name && Intent.DANGER}
          helperText={formik.errors.name && formik.errors.name}
          inline={true}
        >
          <InputGroup
            medium={true}
            intent={formik.errors.name && Intent.DANGER}
            {...formik.getFieldProps('name')}
          />
        </FormGroup>

        <FormGroup
          label={'SKU'}
          className={'form-group--item-sku'}
          intent={formik.errors.sku && Intent.DANGER}
          helperText={formik.errors.sku && formik.errors.sku}
          inline={true}
        >
          <InputGroup
            medium={true}
            intent={formik.errors.sku && Intent.DANGER}
            {...formik.getFieldProps('sku')}
          />
        </FormGroup>
        <FormGroup
          label={'Category'}
          className={'form-group--item-category'}
          inline={true}
          intent={formik.errors.category_id && Intent.DANGER}
          helperText={formik.errors.category_id && formik.errors.category_id}
        >
          <Select
            items={accounts}
            itemRenderer={accountItem}
            itemPredicate={filterAccounts}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemAccountSelect('category_id')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedAccountLabel('category_id', 'Select account')}
            />
          </Select>
        </FormGroup>

        <Row gutterWidth={16}>
          <Col md={4}>
            <FormGroup
              label={'Selling Price'}
              className={'form-group--item-selling-price'}
              intent={formik.errors.sell_price && Intent.DANGER}
              helperText={formik.errors.sell_price && formik.errors.sell_price}
              inline={true}
            >
              <InputGroup
                medium={true}
                intent={formik.errors.sell_price && Intent.DANGER}
                {...formik.getFieldProps('sell_price')}
              />
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup
              label={'Cost Price'}
              className={'form-group--item-cost-price'}
              intent={formik.errors.cost_price && Intent.DANGER}
              helperText={formik.errors.cost_price && formik.errors.cost_price}
              inline={true}
            >
              <InputGroup
                medium={true}
                intent={formik.errors.cost_price && Intent.DANGER}
                {...formik.getFieldProps('cost_price')}
              />
            </FormGroup>
          </Col>
        </Row>
        <Row gutterWidth={16}>
          <Col md={4}>
            <FormGroup
              label={'Account'}
              className={'form-group--item-sell_account_id'}
              inline={true}
              intent={formik.errors.sell_account_id && Intent.DANGER}
              helperText={
                formik.errors.sell_account_id && formik.errors.sell_account_id
              }
            >
              <Select
                items={accounts}
                itemRenderer={accountItem}
                itemPredicate={filterAccounts}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemAccountSelect('sell_account_id')}
              >
                <Button
                  fill={true}
                  rightIcon='caret-down'
                  text={getSelectedAccountLabel(
                    'sell_account_id',
                    'Select account'
                  )}
                />
              </Select>
            </FormGroup>
          </Col>
          <Col md={4}>
            <FormGroup
              label={'Account'}
              className={'form-group--item-cost_account_id'}
              inline={true}
              intent={formik.errors.cost_account_id && Intent.DANGER}
              helperText={
                formik.errors.cost_account_id && formik.errors.cost_account_id
              }
            >
              <Select
                items={accounts}
                itemRenderer={accountItem}
                itemPredicate={filterAccounts}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemAccountSelect('cost_account_id')}
              >
                <Button
                  fill={true}
                  rightIcon='caret-down'
                  text={getSelectedAccountLabel(
                    'cost_account_id',
                    'Select account'
                  )}
                />
              </Select>
            </FormGroup>
          </Col>
        </Row>
        <FormGroup
          label={'Inventory Account'}
          className={'form-group--item-inventory_account_id'}
          inline={true}
          intent={formik.errors.inventory_account_id && Intent.DANGER}
          helperText={
            formik.errors.inventory_account_id &&
            formik.errors.inventory_account_id
          }
        >
          <Select
            items={accounts}
            itemRenderer={accountItem}
            itemPredicate={filterAccounts}
            popoverProps={{ minimal: true }}
            onItemSelect={onItemAccountSelect('inventory_account_id')}
          >
            <Button
              fill={true}
              rightIcon='caret-down'
              text={getSelectedAccountLabel(
                'inventory_account_id',
                'Select account'
              )}
            />
          </Select>
        </FormGroup>
        <FormGroup
          label={'Opening Stock'}
          className={'form-group--item-stock'}
          intent={formik.errors.cost_price && Intent.DANGER}
          helperText={formik.errors.stock && formik.errors.stock}
          inline={true}
        >
          <InputGroup
            medium={true}
            intent={formik.errors.stock && Intent.DANGER}
            {...formik.getFieldProps('stock')}
          />
        </FormGroup>
        <div class='form__floating-footer'>
          <Button intent={Intent.PRIMARY} type='submit'>
            Save
          </Button>
          <Button>Save as Draft</Button>
          <Button onClick={'handleClose'}>Close</Button>
        </div>
      </form>
    </div>
  );
}
