// @ts-nocheck
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import { FormattedMessage as T } from '@/components';

import { useHistory } from 'react-router-dom';
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
} from '@blueprintjs/core';
import { Row, Col } from 'react-grid-system';
import { ReactSortable } from 'react-sortablejs';
import * as Yup from 'yup';
import { pick, get } from 'lodash';
import ErrorMessage from '@/components/ErrorMessage';
import { If, Icon, AppToaster } from '@/components';
import ViewFormContainer from '@/containers/Views/ViewForm.container.js';

function ViewForm({
  requestSubmitView,
  requestEditView,
  onDelete,

  viewId,
  viewMeta,

  resourceName,
  resourceColumns,
  resourceFields,
  resourceMetadata,

  changePageSubtitle,
}) {
  const intl = useIntl();
  const history = useHistory();

  useEffect(() => {
    changePageSubtitle(resourceMetadata.label);
    return () => {
      changePageSubtitle('');
    };
  }, [changePageSubtitle, resourceMetadata.label]);

  const [draggedColumns, setDraggedColumn] = useState([
    ...(viewMeta && viewMeta.columns ? viewMeta.columns : []),
  ]);

  const draggedColumnsIds = useMemo(
    () => draggedColumns.map((c) => c.id),
    [draggedColumns],
  );

  const [availableColumns, setAvailableColumns] = useState([
    ...(viewMeta && viewMeta.columns
      ? resourceColumns.filter(
          (column) => draggedColumnsIds.indexOf(column.id) === -1,
        )
      : resourceColumns),
  ]);

  const defaultViewRole = useMemo(
    () => ({
      field_key: '',
      comparator: '',
      value: '',
      index: 1,
    }),
    [],
  );

  const validationSchema = Yup.object().shape({
    resource_name: Yup.string().required(),
    name: Yup.string()
      .required()
      .label(intl.formatMessage({ id: 'name_' })),
    logic_expression: Yup.string()
      .required()
      .label(intl.formatMessage({ id: 'logic_expression' })),
    roles: Yup.array().of(
      Yup.object().shape({
        comparator: Yup.string().required(),
        value: Yup.string().required(),
        field_key: Yup.string().required(),
        index: Yup.number().required(),
      }),
    ),
    columns: Yup.array().of(
      Yup.object().shape({
        key: Yup.string().required(),
        index: Yup.string().required(),
      }),
    ),
  });

  const initialEmptyForm = useMemo(
    () => ({
      resource_name: resourceName || '',
      name: '',
      logic_expression: '',
      roles: [defaultViewRole],
      columns: [],
    }),
    [defaultViewRole, resourceName],
  );

  const initialForm = useMemo(
    () => ({
      ...initialEmptyForm,
      ...(viewMeta
        ? {
            ...viewMeta,
            resource_name: viewMeta.resource?.name || resourceName,
          }
        : {}),
    }),
    [initialEmptyForm, viewMeta, resourceName],
  );

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
      roles: [],
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
      if (viewMeta && viewMeta.id) {
        requestEditView(viewMeta.id, values).then((response) => {
          AppToaster.show({
            message: 'the_view_has_been_edited',
            intent: Intent.SUCCESS,
          });
          history.push(
            `${resourceMetadata.baseRoute}/${viewMeta.id}/custom_view`,
          );
          setSubmitting(false);
        });
      } else {
        requestSubmitView(values).then((response) => {
          AppToaster.show({
            message: 'the_view_has_been_submit',
            intent: Intent.SUCCESS,
          });
          history.push(
            `${resourceMetadata.baseRoute}/${viewMeta.id}/custom_view`,
          );
          setSubmitting(false);
        });
      }
    },
  });

  useEffect(() => {
    setFieldValue(
      'columns',
      draggedColumns.map((column, index) => ({
        index,
        key: column.key,
      })),
    );
  }, [setFieldValue, draggedColumns]);

  const conditionalsItems = useMemo(
    () => [
      { value: 'and', label: 'AND' },
      { value: 'or', label: 'OR' },
    ],
    [],
  );

  const whenConditionalsItems = useMemo(
    () => [{ value: '', label: 'When' }],
    [],
  );

  // Competitors items.
  const comparatorsItems = useMemo(
    () => [
      { value: '', label: 'Comparator' },
      { value: 'equals', label: 'Equals' },
      { value: 'not_equal', label: 'Not Equal' },
      { value: 'contain', label: 'Contain' },
      { value: 'not_contain', label: 'Not Contain' },
    ],
    [],
  );

  // Resource fields.
  const resourceFieldsOptions = useMemo(
    () => [
      { value: '', label: 'Select a field' },
      ...resourceFields.map((field) => ({
        value: field.key,
        label: field.label_name,
      })),
    ],
    [resourceFields],
  );

  // Account item of select accounts field.
  const selectItem = (item, { handleClick, modifiers, query }) => {
    return <MenuItem text={item.label} key={item.key} onClick={handleClick} />;
  };
  // Handle click new condition button.
  const onClickNewRole = useCallback(() => {
    setFieldValue('roles', [
      ...values.roles,
      {
        ...defaultViewRole,
        index: values.roles.length + 1,
      },
    ]);
  }, [defaultViewRole, setFieldValue, values]);

  // Handle click remove view role button.
  const onClickRemoveRole = useCallback(
    (viewRole, index) => {
      let viewRoles = [...values.roles];

      // Can't continue if view roles equals or less than 1.
      if (viewRoles.length > 1) {
        viewRoles.splice(index, 1);

        setFieldValue(
          'roles',
          viewRoles.map((role) => {
            return role;
          }),
        );
      }
    },
    [values, setFieldValue],
  );

  const onClickDeleteView = useCallback(() => {
    onDelete && onDelete(viewMeta);
  }, [onDelete, viewMeta]);

  const hasError = (path) => get(errors, path) && get(touched, path);

  const handleClickCancelBtn = () => {
    history.goBack();
  };

  return (
    <div class="view-form">
      <form onSubmit={handleSubmit}>
        <div class="view-form--name-section">
          <Row>
            <Col sm={8}>
              <FormGroup
                label={<T id={'view_name'} />}
                className={'form-group--name'}
                intent={errors.name && touched.name && Intent.DANGER}
                helperText={
                  <ErrorMessage {...{ errors, touched }} name={'name'} />
                }
                inline={true}
                fill={true}
              >
                <InputGroup
                  intent={errors.name && touched.name && Intent.DANGER}
                  fill={true}
                  {...getFieldProps('name')}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>

        <H5 className="mb2">Define the conditionals</H5>

        {values.roles.map((role, index) => (
          <Row class="view-form__role-conditional">
            <Col sm={2} class="flex">
              <div class="mr2 pt1 condition-number">{index + 1}</div>
              {index === 0 ? (
                <HTMLSelect
                  options={whenConditionalsItems}
                  className={Classes.FILL}
                />
              ) : (
                <HTMLSelect
                  options={conditionalsItems}
                  className={Classes.FILL}
                />
              )}
            </Col>

            <Col sm={2}>
              <FormGroup
                intent={hasError(`roles[${index}].field_key`) && Intent.DANGER}
              >
                <HTMLSelect
                  options={resourceFieldsOptions}
                  value={role.field_key}
                  className={Classes.FILL}
                  {...getFieldProps(`roles[${index}].field_key`)}
                />
              </FormGroup>
            </Col>

            <Col sm={2}>
              <FormGroup
                intent={hasError(`roles[${index}].comparator`) && Intent.DANGER}
              >
                <HTMLSelect
                  options={comparatorsItems}
                  value={role.comparator}
                  className={Classes.FILL}
                  {...getFieldProps(`roles[${index}].comparator`)}
                />
              </FormGroup>
            </Col>

            <Col sm={5} class="flex">
              <FormGroup
                intent={hasError(`roles[${index}].value`) && Intent.DANGER}
              >
                <InputGroup
                  placeholder={intl.get('value')}
                  {...getFieldProps(`roles[${index}].value`)}
                />
              </FormGroup>

              <Button
                icon={<Icon icon="times-circle" iconSize={14} />}
                iconSize={14}
                className="ml2"
                minimal={true}
                intent={Intent.DANGER}
                onClick={() => onClickRemoveRole(role, index)}
              />
            </Col>
          </Row>
        ))}

        <div className={'view-form__role-conditions-actions'}>
          <Button
            minimal={true}
            intent={Intent.PRIMARY}
            onClick={onClickNewRole}
          >
            <T id={'new_conditional'} />
          </Button>
        </div>

        <div class="view-form--logic-expression-section">
          <Row>
            <Col sm={8}>
              <FormGroup
                label={intl.get('Logic Expression')}
                className={'form-group--logic-expression'}
                intent={
                  errors.logic_expression &&
                  touched.logic_expression &&
                  Intent.DANGER
                }
                helperText={
                  <ErrorMessage
                    {...{ errors, touched }}
                    name="logic_expression"
                  />
                }
                inline={true}
                fill={true}
              >
                <InputGroup
                  intent={
                    errors.logic_expression &&
                    touched.logic_expression &&
                    Intent.DANGER
                  }
                  fill={true}
                  {...getFieldProps('logic_expression')}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>

        <H5 className={'mb2'}>Columns Preferences</H5>

        <div class="dragable-columns">
          <Row gutterWidth={14}>
            <Col sm={4} className="dragable-columns__column">
              <H6 className="dragable-columns__title">Available Columns</H6>

              <InputGroup placeholder={intl.get('search')} leftIcon="search" />

              <div class="dragable-columns__items">
                <Menu>
                  <ReactSortable
                    list={availableColumns}
                    setList={setAvailableColumns}
                    group="shared-group-name"
                  >
                    {availableColumns.map((field) => (
                      <MenuItem key={field.id} text={field.label} />
                    ))}
                  </ReactSortable>
                </Menu>
              </div>
            </Col>

            <Col sm={1}>
              <div class="dragable-columns__arrows">
                <div>
                  <Icon
                    icon="arrow-circle-left"
                    iconSize={30}
                    color="#cecece"
                  />
                </div>
                <div class="mt2">
                  <Icon
                    icon="arrow-circle-right"
                    iconSize={30}
                    color="#cecece"
                  />
                </div>
              </div>
            </Col>

            <Col sm={4} className="dragable-columns__column">
              <H6 className="dragable-columns__title">Selected Columns</H6>
              <InputGroup placeholder={intl.get('search')} leftIcon="search" />

              <div class="dragable-columns__items">
                <Menu>
                  <ReactSortable
                    list={draggedColumns}
                    setList={setDraggedColumn}
                    group="shared-group-name"
                  >
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
          <Button intent={Intent.PRIMARY} type="submit" disabled={isSubmitting}>
            <T id={'submit'} />
          </Button>

          <Button
            intent={Intent.NONE}
            className="ml1"
            onClick={handleClickCancelBtn}
          >
            <T id={'cancel'} />
          </Button>

          <If condition={viewMeta && viewMeta.id}>
            <Button
              intent={Intent.DANGER}
              onClick={onClickDeleteView}
              className={'right mr2'}
            >
              <T id={'delete'} />
            </Button>
          </If>
        </div>
      </form>
    </div>
  );
}

export default ViewFormContainer(ViewForm);
