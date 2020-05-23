import React, { useState, useMemo, useCallback,useEffect } from 'react';
import * as Yup from 'yup';
import { useFormik, Formik } from 'formik';
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
import { FormattedMessage as T, useIntl } from 'react-intl';
import { queryCache } from 'react-query';
import { useParams, useHistory } from 'react-router-dom';
import { pick } from 'lodash';
import classNames from 'classnames';

import AppToaster from 'components/AppToaster';
import ErrorMessage from 'components/ErrorMessage';
import Icon from 'components/Icon';
import MoneyInputGroup from 'components/MoneyInputGroup';
import Dragzone from 'components/Dragzone';
import { ListSelect } from 'components';

import withItemsActions from 'containers/Items/withItemsActions';
import withItemCategories from 'containers/Items/withItemCategories'
import withAccounts from 'containers/Accounts/withAccounts';
import withMediaActions from 'containers/Media/withMediaActions';
import useMedia from 'hooks/useMedia';
import withItems from './withItems';
import withItemDetail from 'containers/Items/withItemDetail'
import withDashboardActions from 'containers/Dashboard/withDashboard';
import withAccountDetail from 'containers/Accounts/withAccountDetail';

import { compose } from 'utils';


const ItemForm = ({
  // #withItemActions
  requestSubmitItem,
  requestEditItem,

  accounts,
  itemDetail,
  onFormSubmit,
  onCancelForm, 

  // #withDashboard
  changePageTitle,

  // #withItemCategories
  categoriesList,

  // #withMediaActions
  requestSubmitMedia,
  requestDeleteMedia,  
}) => {
  const [payload, setPayload] = useState({});
  
  const history = useHistory();
  const { formatMessage } = useIntl();
  const {id} =useParams();
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
  });

  const ItemTypeDisplay = useMemo(() => [
    { value: null, label: formatMessage({id:'select_item_type'}) },
    { value: 'service', label: formatMessage({id:'service'}) },
    { value: 'inventory', label: formatMessage({id:'inventory'}) },
    { value: 'non-inventory', label: formatMessage({id:'non_inventory'}) },
  ], []);

  const validationSchema = Yup.object().shape({
    active: Yup.boolean(),
    name: Yup.string().required().label(formatMessage({id:'item_name_'})),
    type: Yup.string().trim().required().label(formatMessage({id:'item_type_'})),
    sku: Yup.string().trim(),
    cost_price: Yup.number(),
    sell_price: Yup.number(),
    cost_account_id: Yup.number().required().label(formatMessage({id:'cost_account_id'})),
    sell_account_id: Yup.number().required().label(formatMessage({id:'sell_account_id'})),
    inventory_account_id: Yup.number().when('type', {
      is: (value) => value === 'inventory',
      then: Yup.number().required(),
      otherwise: Yup.number().nullable(),
    }),
    category_id: Yup.number().nullable(),
    stock: Yup.string() || Yup.boolean(),
  });

  const defaultInitialValues = useMemo(
    () => ({
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
    }),
    []
  );
  const initialValues = useMemo(() => ({
    ...(itemDetail) ? {
      ...pick(itemDetail, Object.keys(defaultInitialValues)),
 
    } : {
      ...defaultInitialValues,
    }
  }), [itemDetail, defaultInitialValues]);

  const saveInvokeSubmit = useCallback((payload) => {
    onFormSubmit && onFormSubmit(payload)
  }, [onFormSubmit]);

  useEffect(() => {
    itemDetail && itemDetail.id ?
      changePageTitle(formatMessage({id:'edit_item_details'})) :
      changePageTitle(formatMessage({id:'new_item'}));
  }, [changePageTitle,itemDetail]);

  const {
    getFieldProps,
    setFieldValue,
    values,
    touched,
    errors,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialValues,
    },
    onSubmit: (values, { setSubmitting,resetForm,setErrors }) => {

      const saveItem = (mediaIds) => {
        const formValues = { ...values, media_ids: mediaIds };
        if(itemDetail && itemDetail.id ){

          requestEditItem(itemDetail.id,formValues)
          .then((response)=>{
            AppToaster.show({
              message:formatMessage({
                id:'the_item_has_been_successfully_edited',
              },{
                number:itemDetail.id
              }),
              intent:Intent.SUCCESS
            });
            setSubmitting(false);
            saveInvokeSubmit({action:'update',...payload})
            history.push('/items');
            resetForm();
          }).catch((errors)=>{
            setSubmitting(false)
          });

        }else{
         
          requestSubmitItem(formValues).then((response) => {
            AppToaster.show({
              message: formatMessage({
                id: 'service_has_been_successful_created',
              }, {
                name: values.name,
                service: formatMessage({ id: 'item' }),
              }),
              intent: Intent.SUCCESS,
            });
            queryCache.removeQueries(['items-table']);
            history.push('/items');
          });
        };
        }

         

      Promise.all([saveMedia(), deleteMedia()]).then(
        ([savedMediaResponses]) => {
          const mediaIds = savedMediaResponses.map((res) => res.data.media.id);
          return saveItem(mediaIds);
        }
      );
    },
  });

  const accountItem = useCallback(
    (item, { handleClick }) => (
      <MenuItem
        key={item.id}
        text={item.name}
        label={item.code}
        onClick={handleClick}
      />
    ),
    []
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

  const onItemAccountSelect = useCallback((filedName) => {
    return (account) => {
      setFieldValue(filedName, account.id);
    };
  }, [setFieldValue]);

  const categoryItem = useCallback(
    (item, { handleClick }) => (
      <MenuItem text={item.name} onClick={handleClick} />
    ),
    []
  );

  const requiredSpan = useMemo(() => <span class='required'>*</span>, []);
  const infoIcon = useMemo(() => <Icon icon='info-circle' iconSize={12} />, []);

  const handleMoneyInputChange = (fieldKey) => (e, value) => {
    setFieldValue(fieldKey, value);
  };

 
  const initialAttachmentFiles =useMemo(()=>{
    return itemDetail && itemDetail.media
    ? itemDetail.media.map((attach)=>({
    
      preview:attach.attachment_file,
      upload:true,
      metadata:{...attach}
    
    })):[];
    
      },[itemDetail])
  const handleDropFiles = useCallback((_files) => {
    setFiles(_files.filter((file) => file.uploaded === false));
  }, []);

  const handleDeleteFile = useCallback(
    (_deletedFiles) => {
      _deletedFiles.forEach((deletedFile) => {
        if (deletedFile.uploaded && deletedFile.metadata.id) {
          setDeletedFiles([...deletedFiles, deletedFile.metadata.id]);
        }
      });
    },
    [setDeletedFiles, deletedFiles]
  );

  const handleCancelClickBtn = () => {
    history.goBack();
  };

  return (
    <div class='item-form'>
      <form onSubmit={handleSubmit}>
        <div class='item-form__primary-section'>
          <Row>
            <Col xs={7}>

              {/* Item type */}
              <FormGroup
                medium={true}
                label={<T id={'item_type'} />}
                labelInfo={requiredSpan}
                className={'form-group--item-type'}
                intent={errors.type && touched.type && Intent.DANGER}
                helperText={
                  <ErrorMessage {...{ errors, touched }} name='type' />
                }
                inline={true}
              >
                <HTMLSelect
                  fill={true}
                  options={ItemTypeDisplay}
                  {...getFieldProps('type')}
                />
              </FormGroup>
              
              {/* Item name */}
              <FormGroup
                label={<T id={'item_name'} />}
                labelInfo={requiredSpan}
                className={'form-group--item-name'}
                intent={errors.name && touched.name && Intent.DANGER}
                helperText={
                  <ErrorMessage {...{ errors, touched }} name='name' />
                }
                inline={true}
              >
                <InputGroup
                  medium={true}
                  intent={errors.name && touched.name && Intent.DANGER}
                  {...getFieldProps('name')}
                />
              </FormGroup>

              {/* SKU */}
              <FormGroup
                label={<T id={'sku'} />}
                labelInfo={infoIcon}
                className={'form-group--item-sku'}
                intent={errors.sku && touched.sku && Intent.DANGER}
                helperText={<ErrorMessage {...{ errors, touched }} name='sku' />}
                inline={true}
              >
                <InputGroup
                  medium={true}
                  intent={errors.sku && touched.sku && Intent.DANGER}
                  {...getFieldProps('sku')}
                />
              </FormGroup>

              {/* Item category */}
              <FormGroup
                label={<T id={'category'} />}
                labelInfo={infoIcon}
                inline={true}
                intent={
                  errors.category_id && touched.category_id && Intent.DANGER
                }
                helperText={
                  <ErrorMessage {...{ errors, touched }} name='category' />
                }
                className={classNames(
                  'form-group--select-list',
                  'form-group--category',
                  Classes.FILL
                )}
              >
                <ListSelect
                  items={categoriesList}
                  itemRenderer={categoryItem}
                  itemPredicate={filterAccounts}
                  popoverProps={{ minimal: true }}
                  onItemSelect={onItemAccountSelect('category_id')}

                  selectedItem={values.category_id}
                  selectedItemProp={'id'}
                  
                  defaultText={<T id={'select_category'} />}
                  labelProp={'name'}
                />
              </FormGroup>
                
              {/* Active checkbox */}
              <FormGroup
                label={' '}
                inline={true}
                className={'form-group--active'}
              >
                <Checkbox
                  inline={true}
                  label={<T id={'active'}/>}
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
                className={'mt2'}
              />
            </Col>
          </Row>
        </div>

        <Row gutterWidth={16} className={'item-form__accounts-section'}>
          <Col width={404}>
            <h4><T id={'purchase_information'}/></h4>

            <FormGroup
              label={<T id={'selling_price'}/>}
              className={'form-group--item-selling-price'}
              intent={errors.selling_price && touched.selling_price && Intent.DANGER}
              helperText={
                <ErrorMessage {...{ errors, touched }} name='selling_price' />
              }
              inline={true}
            >
              <MoneyInputGroup
                value={values.selling_price}
                prefix={'$'}
                onChange={handleMoneyInputChange('selling_price')}
                inputGroupProps={{
                  medium: true,
                  intent:
                    errors.selling_price &&
                    touched.selling_price &&
                    Intent.DANGER,
                }}
              />
            </FormGroup>
              
            {/* Selling account */}
            <FormGroup
              label={<T id={'account'} />}
              labelInfo={infoIcon}
              inline={true}
              intent={
                errors.sell_account_id &&
                touched.sell_account_id &&
                Intent.DANGER
              }
              helperText={
                <ErrorMessage {...{ errors, touched }} name='sell_account_id' />
              }
              className={classNames(
                'form-group--sell-account',
                'form-group--select-list',
                Classes.FILL
              )}
            >
              <ListSelect
                items={accounts}
                itemRenderer={accountItem}
                itemPredicate={filterAccounts}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemAccountSelect('sell_account_id')}

                selectedItem={values.sell_account_id}
                selectedItemProp={'id'}

                defaultText={<T id={'select_account'} />}
                labelProp={'name'}
              />
            </FormGroup>
          </Col>

          <Col width={404}>
            <h4><T id={'sales_information'} /></h4>

            {/* Cost price */}
            <FormGroup
              label={<T id={'cost_price'} />}
              className={'form-group--item-cost-price'}
              intent={errors.cost_price && touched.cost_price && Intent.DANGER}
              helperText={
                <ErrorMessage {...{ errors, touched }} name='cost_price' />
              }
              inline={true}
            >
              <MoneyInputGroup
                value={values.cost_price}
                prefix={'$'}
                onChange={handleMoneyInputChange('cost_price')}
                inputGroupProps={{
                  medium: true,
                  intent:
                    errors.cost_price && touched.cost_price && Intent.DANGER,
                }}
              />
            </FormGroup>

            <FormGroup
              label={<T id={'account'} />}
              labelInfo={infoIcon}
              inline={true}
              intent={
                errors.cost_account_id &&
                touched.cost_account_id &&
                Intent.DANGER
              }
              helperText={
                <ErrorMessage {...{ errors, touched }} name='cost_account_id' />
              }
              className={classNames(
                'form-group--cost-account',
                'form-group--select-list',
                Classes.FILL
              )}
            >
              <ListSelect
                items={accounts}
                itemRenderer={accountItem}
                itemPredicate={filterAccounts}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemAccountSelect('cost_account_id')}

                defaultText={<T id={'select_account'} />} 
                labelProp={'name'}
                selectedItem={values.cost_account_id}
                selectedItemProp={'id'}
              />
            </FormGroup>
          </Col>
        </Row>

        <Row className={'item-form__accounts-section mt2'}>
          <Col width={404}>
            <h4>
              <T id={'inventory_information'} />
            </h4>

            <FormGroup
              label={<T id={'inventory_account'}/>}
              inline={true}
              intent={
                errors.inventory_account_id &&
                touched.inventory_account_id &&
                Intent.DANGER
              }
              helperText={<ErrorMessage {...{ errors, touched }} name='inventory_account_id' />}
              className={classNames(
                'form-group--item-inventory_account',
                'form-group--select-list',
                Classes.FILL
              )}
            >
              <ListSelect
                items={accounts}
                itemRenderer={accountItem}
                itemPredicate={filterAccounts}
                popoverProps={{ minimal: true }}
                onItemSelect={onItemAccountSelect('inventory_account_id')}
                
                defaultText={<T id={'select_account'} />}
                labelProp={'name'}
                selectedItem={values.inventory_account_id}
                selectedItemProp={'id'} />
            </FormGroup>

            <FormGroup
              label={<T id={'opening_stock'}/>}
              className={'form-group--item-stock'}
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
          <Button intent={Intent.PRIMARY} disabled={isSubmitting} type='submit'>
          
           { itemDetail && itemDetail.id ? <T id={'edit'}/> : <T id={'save'}/> }
          </Button>

          <Button className={'ml1'} disabled={isSubmitting}>
            <T id={'save_as_draft'}/>
          </Button>

          <Button className={'ml1'} onClick={handleCancelClickBtn}>
            <T id={'close'} />
          </Button>
        </div>
      </form>
    </div>
  );
};

export default compose(
  withAccounts(({accounts})=>({
    accounts,
  })),
  withAccountDetail,
  withItemsActions,
  withItemDetail,
  withItemCategories(({ categoriesList }) => ({
    categoriesList,
  })),
  withDashboardActions,
  withMediaActions,
)(ItemForm);
