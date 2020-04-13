import React, {useState, useEffect, useCallback, useMemo} from 'react';
import { useFormik } from "formik";
import {useIntl} from 'react-intl';
import {
  InputGroup,
  FormGroup,
  Intent,
  Button,
  MenuItem,
  Classes,
  HTMLSelect,
  Menu,
  H5,
  H6,
} from "@blueprintjs/core";
import {Row, Col} from 'react-grid-system';
import { ReactSortable } from 'react-sortablejs';
import * as Yup from 'yup';
import {pick, get} from 'lodash';
import Icon from 'components/Icon';
import ViewFormConnect from 'connectors/ViewFormPage.connector';
import {compose} from 'utils';
import ErrorMessage from 'components/ErrorMessage';
import DashboardConnect from 'connectors/Dashboard.connector';
import ResourceConnect from 'connectors/Resource.connector';
import AppToaster from 'components/AppToaster';

function ViewForm({
  resourceName,
  columns,
  fields,
  viewColumns,
  viewForm,
  viewFormColumns,
  submitView,
  editView,
  onDelete,
  getResourceField,
  getResourceColumn,
}) {
  const intl = useIntl();

  const [draggedColumns, setDraggedColumn] = useState([
    ...(viewForm && viewForm.columns) ? viewForm.columns.map((column) => {
      return getResourceColumn(column.field_id);
    }) : []
  ]);

  const draggedColumnsIds = useMemo(() =>
    draggedColumns.map(c => c.id), [draggedColumns]);
  
  const [availableColumns, setAvailableColumns] = useState([
    ...(viewForm && viewForm.columns) ? columns.filter((column) => 
      draggedColumnsIds.indexOf(column.id) === -1
    ) : columns,
  ]);

  const defaultViewRole = useMemo(() => ({
    field_key: '', comparator: '', value: '', index: 1,
  }), []);

  const validationSchema = Yup.object().shape({
    resource_name: Yup.string().required(),
    name: Yup.string().required(),
    logic_expression: Yup.string().required(),
    roles: Yup.array().of(
      Yup.object().shape({
        comparator: Yup.string().required(),
        value: Yup.string().required(),
        field_key: Yup.string().required(),
        index: Yup.number().required(),
      })
    ),
    columns: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required(),
        index: Yup.string().required(),
      }),
    ),
  });
  const initialEmptyForm = useMemo(() => ({
    resource_name: resourceName || '',
    name: '',
    logic_expression: '',
    roles: [
      defaultViewRole,
    ],
    columns: [],
  }), [defaultViewRole, resourceName]);

  const initialForm = useMemo(() =>
    ({
      ...initialEmptyForm,
      ...viewForm ? {
        ...viewForm,
        resource_name: viewForm.resource.name,
      } : {},
    }),
    [initialEmptyForm, viewForm]);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    handleSubmit,
    isSubmitting,
  } = useFormik({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...pick(initialForm, Object.keys(initialEmptyForm)),
      logic_expression: initialForm.roles_logic_expression || '',
      roles: [
        ...initialForm.roles.map((role) => {
          return {
            ...pick(role, Object.keys(defaultViewRole)),
            field_key: role.field ? role.field.key : '',
          };
        }),
      ],
    },
    onSubmit: (values, { setSubmitting }) => {
      if (viewForm && viewForm.id) {
        editView(viewForm.id, values).then((response) => {
          AppToaster.show({
            message: 'the_view_has_been_edited'
          });
          setSubmitting(false);
        });
      } else {
        submitView(values).then((response) => {
          AppToaster.show({
            message: 'the_view_has_been_submit'
          });
          setSubmitting(false);
        });
      }
    },
  });

  useEffect(() => {
    setFieldValue('columns',
      draggedColumns.map((column, index) => ({
      index, key: column.key,
    })));
  }, [setFieldValue, draggedColumns]);

  const conditionalsItems = useMemo(() => ([
    { value: 'and', label: 'AND' },
    { value: 'or', label: 'OR' },
  ]), []);

  const whenConditionalsItems = useMemo(() => ([
    { value: '', label: 'When' },
  ]), []);

  // Compatotors items.
  const compatatorsItems = useMemo(() => ([
    {value: '', label: 'Compatator'},
    {value: 'equals', label: 'Equals'},
    {value: 'not_equal', label: 'Not Equal'},
    {value: 'contain', label: 'Contain'},
    {value: 'not_contain', label: 'Not Contain'},
  ]), []);

  // Resource fields.
  const resourceFields = useMemo(() => ([
    {value: '', label: 'Select a field'},
    ...fields.map((field) => ({ value: field.key, label: field.label_name, })),
  ]), [fields]);

  // Account item of select accounts field.
  const selectItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.label} key={item.key} onClick={handleClick} />)
  };
  // Handle click new condition button.
  const onClickNewRole = useCallback(() => {
    setFieldValue('roles', [
      ...values.roles,
      {
        ...defaultViewRole,
        index: values.roles.length + 1,
      }
    ]);
  }, [defaultViewRole, setFieldValue, values]);

  // Handle click remove view role button.
  const onClickRemoveRole = useCallback((viewRole, index) => () => {
    const viewRoles = [...values.roles];

    // Can't continue if view roles equals or less than 1.
    if (viewRoles.length <= 1) { return; }

    viewRoles.splice(index, 1);
    viewRoles.map((role, i) => {
      role.index = i + 1;
      return role;
    });
    setFieldValue('roles', viewRoles);
  }, [values, setFieldValue]);

  const onClickDeleteView = useCallback(() => {
    onDelete && onDelete(viewForm);
  }, [onDelete, viewForm]);

  const hasError = (path) => get(errors, path) && get(touched, path); 
  
  console.log(errors, touched);

  return (
    <div class="view-form">
      <form onSubmit={handleSubmit}>
        <div class="view-form--name-section">
          <Row>
            <Col sm={8}>
              <FormGroup
                label={intl.formatMessage({'id': 'View Name'})}
                className={'form-group--name'}
                intent={(errors.name && touched.name) && Intent.DANGER}
                helperText={<ErrorMessage {...{errors, touched}} name={'name'} />}
                inline={true}
                fill={true}>

                <InputGroup
                  intent={(errors.name && touched.name) && Intent.DANGER}
                  fill={true}
                  {...getFieldProps('name')} />
              </FormGroup>
            </Col>
          </Row>
        </div>
   
        <H5 className="mb2">Define the conditionals</H5>

        {values.roles.map((role, index) => (
          <Row class="view-form__role-conditional">
            <Col sm={2} class="flex">
              <div class="mr2 pt1 condition-number">{ index + 1 }</div>
              {(index === 0) ? (
                <HTMLSelect options={whenConditionalsItems} className={Classes.FILL} />
              ) : (
                <HTMLSelect options={conditionalsItems} className={Classes.FILL} />
              )}
            </Col>

            <Col sm={2}>
              <FormGroup
                intent={hasError(`roles[${index}].field_key`) && Intent.DANGER}>
                <HTMLSelect
                  options={resourceFields}
                  value={role.field_key}
                  className={Classes.FILL}
                  {...getFieldProps(`roles[${index}].field_key`)} />
              </FormGroup>
            </Col>

            <Col sm={2}>
              <FormGroup
                intent={hasError(`roles[${index}].comparator`) && Intent.DANGER}>
                <HTMLSelect
                  options={compatatorsItems}
                  value={role.comparator}
                  className={Classes.FILL}
                  {...getFieldProps(`roles[${index}].comparator`)} />
              </FormGroup>
            </Col>

            <Col sm={5} class="flex">
              <FormGroup
                intent={hasError(`roles[${index}].value`) && Intent.DANGER}>
                <InputGroup
                  placeholder={intl.formatMessage({'id': 'value'})}
                  {...getFieldProps(`roles[${index}].value`)} />
              </FormGroup>
              
              <Button 
                icon={<Icon icon="times-circle" iconSize={14} />}
                iconSize={14}
                className="ml2"
                minimal={true} 
                intent={Intent.DANGER}
                onClick={onClickRemoveRole(role, index)} />
            </Col>
          </Row>
        ))}

      <div className={'view-form__role-conditions-actions'}> 
        <Button
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={onClickNewRole}>
          New Conditional
        </Button>
      </div>

      <div class="view-form--logic-expression-section">
        <Row>
          <Col sm={8}>
            <FormGroup
              label={intl.formatMessage({'id': 'Logic Expression'})}
              className={'form-group--logic-expression'}
              intent={(errors.logic_expression && touched.logic_expression) && Intent.DANGER}
              helperText={<ErrorMessage {...{errors, touched}} name='logic_expression' />}
              inline={true}
              fill={true}>

              <InputGroup
                intent={(errors.logic_expression && touched.logic_expression) && Intent.DANGER}
                fill={true}
                {...getFieldProps('logic_expression')} />
            </FormGroup>
          </Col>
        </Row>
      </div>

      <H5 className={'mb2'}>Columns Preferences</H5>
      
      <div class="dragable-columns">
        <Row gutterWidth={14}>
          <Col sm={4} className="dragable-columns__column">
            <H6 className="dragable-columns__title">Available Columns</H6>

            <InputGroup
              placeholder={intl.formatMessage({id: 'search'})}
              leftIcon="search" />

            <div class="dragable-columns__items">
              <Menu>
                <ReactSortable
                  list={availableColumns}
                  setList={setAvailableColumns}
                  group="shared-group-name">
                  {availableColumns.map((field) => (
                    <MenuItem key={field.id} text={field.label} />
                  ))}
                </ReactSortable>
              </Menu>
            </div>
          </Col>

          <Col sm={1}>
            <div class="dragable-columns__arrows">
              <div><Icon icon="arrow-circle-left" iconSize={30} color="#cecece" /></div>
              <div class="mt2"><Icon icon="arrow-circle-right" iconSize={30} color="#cecece" /></div>
            </div>
          </Col>

          <Col sm={4} className="dragable-columns__column">
            <H6 className="dragable-columns__title">Selected Columns</H6>
            <InputGroup placeholder={intl.formatMessage({id: 'search'})} leftIcon="search" />

            <div class="dragable-columns__items">
              <Menu>
                <ReactSortable
                  list={draggedColumns}
                  setList={setDraggedColumn}
                  group="shared-group-name">
                  {draggedColumns.map((field) => (
                    <MenuItem key={field.id} text={field.label} />
                  ))}
                </ReactSortable>
              </Menu>
            </div>
          </Col>
        </Row>
      </div>
      
      <div class="form__floating-footer">
        <Button
          intent={Intent.PRIMARY}
          type="submit"
          disabled={isSubmitting}>
          Submit
        </Button>

        <Button intent={Intent.NONE} type="submit" className="ml1">Cancel</Button>

        { (viewForm && viewForm.id) && (
          <Button
            intent={Intent.DANGER}
            onClick={onClickDeleteView}
            className={"right mr2"}>
              Delete
          </Button>
        ) }
      </div>
    </form>
  </div>
  );
}

export default compose(
  ViewFormConnect,
  DashboardConnect,
  ResourceConnect,
)(ViewForm);