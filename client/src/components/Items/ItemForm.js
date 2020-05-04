import React, { useState, useMemo, useCallback } from 'react';
import * as Yup from 'yup';
import { useFormik } from 'formik';
import {
  FormGroup,
  MenuItem,
  Intent,
  InputGroup,
  HTMLSelect,
  Button,
  Classes,
  Checkbox,
} from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
import { Select } from '@blueprintjs/select';
import AppToaster from 'components/AppToaster';
import AccountsConnect from 'connectors/Accounts.connector';
import ItemsConnect from 'connectors/Items.connect';
import {compose} from 'utils';
import ErrorMessage from 'components/ErrorMessage';
import classNames from 'classnames';
import Icon from 'components/Icon';
import ItemCategoryConnect from 'connectors/ItemsCategory.connect';
import MoneyInputGroup from 'components/MoneyInputGroup';
import {useHistory} from 'react-router-dom';
import Dragzone from 'components/Dragzone';
import MediaConnect from 'connectors/Media.connect';
import useMedia from 'hooks/useMedia';

const ItemForm = ({
  requestSubmitItem,
  
  accounts,
  categories,

  requestSubmitMedia,
  requestDeleteMedia,
}) => {
  const [selectedAccounts, setSelectedAccounts] = useState({});
  const history = useHistory();

  const {
    files,
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  } = useMedia({
    saveCallback: requestSubmitMedia,
    deleteCallback: requestDeleteMedia,
  })

  const ItemTypeDisplay = useMemo(() => ([
    { value: null, label: 'Select Item Type' },
    { value: 'service', label: 'Service' },
    { value: 'inventory', label: 'Inventory' },
    { value: 'non-inventory', label: 'Non-Inventory' }
  ]), []);

  const validationSchema = Yup.object().shape({
    active: Yup.boolean(),
    name: Yup.string().required(),
    type: Yup.string().trim().required(),
    sku: Yup.string().trim(),
    cost_price: Yup.number(),
    sell_price: Yup.number(),
    cost_account_id: Yup.number().required(),
    sell_account_id: Yup.number().required(),
    inventory_account_id: Yup.number().when('type', {
      is: (value) => value === 'inventory',
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(),
    }),
    category_id: Yup.number().nullable(),
    stock: Yup.string() || Yup.boolean()
  });

  const initialValues = useMemo(() => ({
    active: true,
    name: '',
    type: '',
    sku: '',
    cost_price: 0,
    sell_price: 0,
    cost_account_id: null,
    sell_account_id: null,
    inventory_account_id: null,
    category_id: null,
    note: '',
  }), []);

  const {
    getFieldProps,
    setFieldValue,
    values,
    touched,
    errors,
    handleSubmit,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting }) => {
      const saveItem = (mediaIds) => {
        const formValues = { ...values, media_ids: mediaIds };

        return requestSubmitItem(formValues).then((response) => {
          AppToaster.show({
            message: 'The_Items_has_been_submit'
          });
          setSubmitting(false);
          history.push('/dashboard/items');
        })
        .catch((error) => {
          setSubmitting(false);
        });
      };

      Promise.all([
        saveMedia(),
        deleteMedia(),
      ]).then(([savedMediaResponses]) => {
        const mediaIds = savedMediaResponses.map(res => res.data.media.id);
        return saveItem(mediaIds);
      });
    }
  });

  const accountItem = useCallback((item, { handleClick }) => (
    <MenuItem key={item.id} text={item.name} label={item.code} onClick={handleClick} />
  ), []);

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

  const onItemAccountSelect = useCallback((filedName) => {
    return (account) => {
      setSelectedAccounts({
        ...selectedAccounts,
        [filedName]: account
      });
      setFieldValue(filedName, account.id);
    };
  }, [setFieldValue, selectedAccounts]);

  const categoryItem = useCallback((item, { handleClick }) => (
    <MenuItem text={item.name} onClick={handleClick} />
  ), []);

  const getSelectedAccountLabel = useCallback((fieldName, defaultLabel) => {
    return typeof selectedAccounts[fieldName] !== 'undefined'
      ? selectedAccounts[fieldName].name : defaultLabel;
  }, [selectedAccounts]);

  const requiredSpan = useMemo(() => (<span class="required">*</span>), []);
  const infoIcon = useMemo(() => (<Icon icon="info-circle" iconSize={12} />), []);

  const handleMoneyInputChange = (fieldKey) => (e, value) => {
    setFieldValue(fieldKey, value);
  };

  const initialAttachmentFiles = useMemo(() => {
    return [];
  }, []);

  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const handleDeleteFile = useCallback((_deletedFiles) => {
    _deletedFiles.forEach((deletedFile) => {
      if (deletedFile.uploaded && deletedFile.metadata.id) {
        setDeletedFiles([
          ...deletedFiles, deletedFile.metadata.id,
        ]);
      }
    });
  }, [setDeletedFiles, deletedFiles]);  

  return (
    <div class='item-form'>
      <form onSubmit={handleSubmit}>
        <div class="item-form__primary-section">
          <Row>
            <Col xs={7}>
              <FormGroup
                medium={true}
                label={'Item Type'}
                labelInfo={requiredSpan}
                className={'form-group--item-type'}
                intent={(errors.type && touched.type) && Intent.DANGER}
                helperText={<ErrorMessage {...{errors, touched}} name="type" />}
                inline={true}
              >
                <HTMLSelect
                  fill={true}
                  options={ItemTypeDisplay}
                  {...getFieldProps('type')}
                />
              </FormGroup>

              <FormGroup
                label={'Item Name'}
                labelInfo={requiredSpan}
                className={'form-group--item-name'}
                intent={(errors.name && touched.name) && Intent.DANGER}
                helperText={<ErrorMessage {...{errors, touched}} name="name" />}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  intent={(errors.name && touched.name) && Intent.DANGER}
                  {...getFieldProps('name')}
                />
              </FormGroup>

              <FormGroup
                label={'SKU'}
                labelInfo={infoIcon}
                className={'form-group--item-sku'}
                intent={(errors.sku && touched.sku) && Intent.DANGER}
                helperText={<ErrorMessage {...{errors, touched}} name="sku" />}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  intent={(errors.sku && touched.sku) && Intent.DANGER}
                  {...getFieldProps('sku')}
                />
              </FormGroup>

              <FormGroup
                label={'Category'}
                labelInfo={infoIcon}
                inline={true}
                intent={(errors.category_id && touched.category_id) && Intent.DANGER}
                helperText={<ErrorMessage {...{errors, touched}} name="category" />}
                className={classNames(
                  'form-group--select-list',
                  'form-group--category',
                  Classes.FILL,
                )}
              >
                <Select
                  items={categories}
                  itemRenderer={categoryItem}
                  itemPredicate={filterAccounts}
                  popoverProps={{ minimal: true }}
                  onItemSelect={onItemAccountSelect('category_id')}
                >
                  <Button
                    fill={true}
                    rightIcon='caret-down'
                    text={getSelectedAccountLabel('category_id', 'Select category')}
                  />
                </Select>
              </FormGroup>

              <FormGroup
                label={' '}
                inline={true}
                className={'form-group--active'}
              >
                <Checkbox
                  inline={true}
                  label={'Active'}
                  defaultChecked={values.active}
                  {...getFieldProps('active')}
                />
              </FormGroup>
            </Col>

            <Col xs={3}>
              <Dragzone
                initialFiles={initialAttachmentFiles}
                onDrop={handleDropFiles}
                onDeleteFile={handleDeleteFile}
                hint={'Attachments: Maxiumum size: 20MB'}
                className={'mt2'} />
            </Col>
          </Row>
        </div>

        <Row gutterWidth={16} className={'item-form__accounts-section'}>
          <Col width={404}>
            <h4>Purchase Information</h4>

            <FormGroup
              label={'Selling Price'}
              className={'form-group--item-selling-price'}
              intent={(errors.selling_price && touched.selling_price) && Intent.DANGER}
              helperText={<ErrorMessage {...{errors, touched}} name="selling_price" />}
              inline={true}
            >
              <MoneyInputGroup
                value={values.selling_price}
                prefix={'$'}
                onChange={handleMoneyInputChange('selling_price')}
                inputGroupProps={{
                  medium: true,
                  intent: (errors.selling_price && touched.selling_price) && Intent.DANGER,
                }} />
            </FormGroup>

            <FormGroup
              label={'Account'}
              labelInfo={infoIcon}
              inline={true}
              intent={(errors.sell_account_id && touched.sell_account_id) && Intent.DANGER}
              helperText={<ErrorMessage {...{errors, touched}} name="sell_account_id" />}
              className={classNames(
                'form-group--sell-account', 'form-group--select-list',
                Classes.FILL)}
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
                  text={getSelectedAccountLabel('sell_account_id', 'Select account')}
                />
              </Select>
            </FormGroup>
          </Col>

          <Col width={404}>
            <h4>
              Sales Information
            </h4>

            <FormGroup
              label={'Cost Price'}
              className={'form-group--item-cost-price'}
              intent={(errors.cost_price && touched.cost_price) && Intent.DANGER}
              helperText={<ErrorMessage {...{errors, touched}} name="cost_price" />}
              inline={true}
            >
              <MoneyInputGroup
                value={values.cost_price}
                prefix={'$'}
                onChange={handleMoneyInputChange('cost_price')}
                inputGroupProps={{
                  medium: true,
                  intent: (errors.cost_price && touched.cost_price) && Intent.DANGER,
                }} />
            </FormGroup>

            <FormGroup
              label={'Account'}
              labelInfo={infoIcon}
              inline={true}
              intent={(errors.cost_account_id && touched.cost_account_id) && Intent.DANGER}
              helperText={<ErrorMessage {...{errors, touched}} name="cost_account_id" />}
              className={classNames(
                'form-group--cost-account',
                'form-group--select-list',
                Classes.FILL)}
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
                  text={getSelectedAccountLabel('cost_account_id', 'Select account')}
                />
              </Select>
            </FormGroup>
          </Col>
        </Row>

        <Row className={'item-form__accounts-section mt2'}>
          <Col width={404}>
            <h4>
              Inventory Information
            </h4>

            <FormGroup
              label={'Inventory Account'}
              inline={true}
              intent={(errors.inventory_account_id && touched.inventory_account_id) && Intent.DANGER}
              helperText={<ErrorMessage {...{errors, touched}} name="inventory_account_id" />}
              className={classNames(
                'form-group--item-inventory_account',
                'form-group--select-list',
                Classes.FILL)}
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
                  text={getSelectedAccountLabel('inventory_account_id','Select account')}
                />
              </Select>
            </FormGroup>

            <FormGroup
              label={'Opening Stock'}
              className={'form-group--item-stock'}
              // intent={errors.cost_price && Intent.DANGER}
              // helperText={formik.errors.stock && formik.errors.stock}
              inline={true}
            >
              <InputGroup
                medium={true}
                intent={errors.stock && Intent.DANGER}
                {...getFieldProps('stock')}
              />
            </FormGroup>
          </Col>
        </Row>

        <div class='form__floating-footer'>
          <Button intent={Intent.PRIMARY} type='submit'>
            Save
          </Button>

          <Button className={'ml1'}>Save as Draft</Button>
          <Button className={'ml1'} onClick={'handleClose'}>Close</Button>
        </div>
      </form>
    </div>
  );
};

export default compose(
  AccountsConnect,
  ItemsConnect,
  ItemCategoryConnect,
  MediaConnect,
)(ItemForm);