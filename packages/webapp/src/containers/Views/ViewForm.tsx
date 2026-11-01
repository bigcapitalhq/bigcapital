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
import { useFormik } from 'formik';
import { pick, get } from 'lodash';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Row, Col } from 'react-grid-system';
import intl from 'react-intl-universal';
import { useHistory } from 'react-router-dom';
import { ReactSortable } from 'react-sortablejs';
import * as Yup from 'yup';
import { FormattedMessage as T } from '@/components';
import { If, Icon, AppToaster } from '@/components';
import { ErrorMessage } from '@/components/ErrorMessage';
import { ViewFormContainer } from '@/containers/Views/ViewForm.container';
import { transfromToSnakeCase } from '@/utils';

export interface ViewRole {
  fieldKey: string;
  comparator: string;
  value: string;
  index: number;
}

export interface ViewRoleMeta extends ViewRole {
  field?: { key: string };
}

export interface ViewColumnItem {
  id: string | number;
  key: string;
  label: string;
}

export interface ViewMeta {
  id?: string | number;
  name?: string;
  columns?: ViewColumnItem[];
  roles?: ViewRoleMeta[];
  roles_logic_expression?: string;
  logicExpression?: string;
  resource?: { name?: string };
}

export interface ResourceField {
  key: string;
  label_name: string;
}

export interface ResourceMetadata {
  label: string;
  baseRoute: string;
}

export interface ViewFormValues {
  resourceName: string;
  name: string;
  logicExpression: string;
  roles: ViewRole[];
  columns: Array<{ key: string; index: number }>;
}

const Sortable = ReactSortable as unknown as React.ComponentType<
  React.PropsWithChildren<{
    list: ViewColumnItem[];
    setList: React.Dispatch<React.SetStateAction<ViewColumnItem[]>>;
    group: string;
  }>
>;

interface ViewFormInnerProps {
  requestSubmitView: (form: unknown) => Promise<unknown>;
  requestEditView: (id: string | number, form: unknown) => Promise<unknown>;
  onDelete?: (view: ViewMeta | null) => void;

  viewId?: string | number;
  viewMeta?: ViewMeta | null;

  resourceName?: string;
  resourceColumns: ViewColumnItem[];
  resourceFields: ResourceField[];
  resourceMetadata: ResourceMetadata;

  changePageSubtitle: (subtitle: string) => void;
}

function ViewFormInner({
  requestSubmitView,
  requestEditView,
  onDelete,

  viewMeta,

  resourceName,
  resourceColumns,
  resourceFields,
  resourceMetadata,

  changePageSubtitle,
}: ViewFormInnerProps) {
  const history = useHistory();

  useEffect(() => {
    changePageSubtitle(resourceMetadata.label);
    return () => {
      changePageSubtitle('');
    };
  }, [changePageSubtitle, resourceMetadata.label]);

  const [draggedColumns, setDraggedColumn] = useState<ViewColumnItem[]>([
    ...(viewMeta && viewMeta.columns ? viewMeta.columns : []),
  ]);

  const draggedColumnsIds = useMemo(
    () => draggedColumns.map((c) => c.id),
    [draggedColumns],
  );

  const [availableColumns, setAvailableColumns] = useState<ViewColumnItem[]>([
    ...(viewMeta && viewMeta.columns
      ? resourceColumns.filter(
          (column) => draggedColumnsIds.indexOf(column.id) === -1,
        )
      : resourceColumns),
  ]);

  const defaultViewRole = useMemo(
    () => ({
      fieldKey: '',
      comparator: '',
      value: '',
      index: 1,
    }),
    [],
  );

  const validationSchema = Yup.object().shape({
    resourceName: Yup.string().required(),
    name: Yup.string()
      .required()
      .label(intl.formatMessage({ id: 'name_' })),
    logicExpression: Yup.string()
      .required()
      .label(intl.formatMessage({ id: 'logic_expression' })),
    roles: Yup.array().of(
      Yup.object().shape({
        comparator: Yup.string().required(),
        value: Yup.string().required(),
        fieldKey: Yup.string().required(),
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
      resourceName: resourceName || '',
      name: '',
      logicExpression: '',
      roles: [defaultViewRole],
      columns: [] as Array<{ key: string; index: number }>,
    }),
    [defaultViewRole, resourceName],
  );

  const initialForm = useMemo((): ViewFormValues & {
    roles_logic_expression?: string;
  } => {
    const meta = (viewMeta ?? {}) as ViewMeta;
    return {
      ...initialEmptyForm,
      ...meta,
      resourceName: meta.resource?.name || resourceName || '',
    } as ViewFormValues & { roles_logic_expression?: string };
  }, [initialEmptyForm, viewMeta, resourceName]);

  const {
    values,
    errors,
    touched,
    setFieldValue,
    getFieldProps,
    handleSubmit,
    isSubmitting,
  } = useFormik<ViewFormValues>({
    enableReinitialize: true,
    validationSchema: validationSchema,
    initialValues: {
      ...initialEmptyForm,
      ...(pick(
        initialForm,
        Object.keys(initialEmptyForm),
      ) as Partial<ViewFormValues>),
      // The view API returns `roles_logic_expression` in snake_case.
      logicExpression: initialForm.roles_logic_expression || '',
      roles: [
        ...(initialForm.roles ?? []).map((role): ViewRole => {
          return {
            ...(pick(role, Object.keys(defaultViewRole)) as ViewRole),
            fieldKey: (role as ViewRoleMeta).field?.key ?? '',
          };
        }),
      ],
    },
    onSubmit: (values, { setSubmitting }) => {
      // The views API expects snake_case payload.
      const payload = transfromToSnakeCase(values);

      if (viewMeta && viewMeta.id) {
        requestEditView(viewMeta.id, payload).then(() => {
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
        requestSubmitView(payload).then(() => {
          AppToaster.show({
            message: 'the_view_has_been_submit',
            intent: Intent.SUCCESS,
          });
          history.push(
            `${resourceMetadata.baseRoute}/${viewMeta?.id}/custom_view`,
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

  // Compatotors items.
  const compatatorsItems = useMemo(
    () => [
      { value: '', label: 'Compatator' },
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
    (_viewRole: ViewRole, index: number) => {
      const viewRoles = [...values.roles];

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
    onDelete?.(viewMeta ?? null);
  }, [onDelete, viewMeta]);

  const hasError = (path: string) => get(errors, path) && get(touched, path);

  const getSelectFieldProps = (name: string) => {
    const { value, onChange, onBlur } = getFieldProps(name);

    return { value, onChange, onBlur };
  };

  const handleClickCancelBtn = () => {
    history.goBack();
  };

  return (
    <div className="view-form">
      <form onSubmit={handleSubmit}>
        <div className="view-form--name-section">
          <Row>
            <Col sm={8}>
              <FormGroup
                label={intl.get('view_name')}
                className={'form-group--name'}
                intent={errors.name && touched.name ? Intent.DANGER : undefined}
                helperText={
                  <ErrorMessage {...{ errors, touched }} name={'name'} />
                }
                inline={true}
              >
                <InputGroup
                  intent={
                    errors.name && touched.name ? Intent.DANGER : undefined
                  }
                  fill={true}
                  {...getFieldProps('name')}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>

        <H5 className="mb2">Define the conditionals</H5>

        {values.roles.map((role, index) => (
          <Row key={index} className="view-form__role-conditional">
            <Col sm={2} className="flex">
              <div className="mr2 pt1 condition-number">{index + 1}</div>
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
                intent={
                  hasError(`roles[${index}].fieldKey`)
                    ? Intent.DANGER
                    : undefined
                }
              >
                <HTMLSelect
                  options={resourceFieldsOptions}
                  className={Classes.FILL}
                  {...getSelectFieldProps(`roles[${index}].fieldKey`)}
                />
              </FormGroup>
            </Col>

            <Col sm={2}>
              <FormGroup
                intent={
                  hasError(`roles[${index}].comparator`)
                    ? Intent.DANGER
                    : undefined
                }
              >
                <HTMLSelect
                  options={compatatorsItems}
                  className={Classes.FILL}
                  {...getSelectFieldProps(`roles[${index}].comparator`)}
                />
              </FormGroup>
            </Col>

            <Col sm={5} className="flex">
              <FormGroup
                intent={
                  hasError(`roles[${index}].value`) ? Intent.DANGER : undefined
                }
              >
                <InputGroup
                  placeholder={intl.get('value')}
                  {...getFieldProps(`roles[${index}].value`)}
                />
              </FormGroup>

              <Button
                icon={<Icon icon="times-circle" iconSize={14} />}
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

        <div className="view-form--logic-expression-section">
          <Row>
            <Col sm={8}>
              <FormGroup
                label={intl.get('Logic Expression')}
                className={'form-group--logic-expression'}
                intent={
                  errors.logicExpression && touched.logicExpression
                    ? Intent.DANGER
                    : undefined
                }
                helperText={
                  <ErrorMessage
                    {...{ errors, touched }}
                    name="logicExpression"
                  />
                }
                inline={true}
              >
                <InputGroup
                  intent={
                    errors.logicExpression && touched.logicExpression
                      ? Intent.DANGER
                      : undefined
                  }
                  fill={true}
                  {...getFieldProps('logicExpression')}
                />
              </FormGroup>
            </Col>
          </Row>
        </div>

        <H5 className={'mb2'}>Columns Preferences</H5>

        <div className="dragable-columns">
          <Row gutterWidth={14}>
            <Col sm={4} className="dragable-columns__column">
              <H6 className="dragable-columns__title">Available Columns</H6>

              <InputGroup placeholder={intl.get('search')} leftIcon="search" />

              <div className="dragable-columns__items">
                <Menu>
                  <Sortable
                    list={availableColumns}
                    setList={setAvailableColumns}
                    group="shared-group-name"
                  >
                    {availableColumns.map((field) => (
                      <MenuItem key={field.id} text={field.label} />
                    ))}
                  </Sortable>
                </Menu>
              </div>
            </Col>

            <Col sm={1}>
              <div className="dragable-columns__arrows">
                <div>
                  <Icon
                    icon="arrow-circle-left"
                    iconSize={30}
                    color="#cecece"
                  />
                </div>
                <div className="mt2">
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

              <div className="dragable-columns__items">
                <Menu>
                  <Sortable
                    list={draggedColumns}
                    setList={setDraggedColumn}
                    group="shared-group-name"
                  >
                    {draggedColumns.map((field) => (
                      <MenuItem key={field.id} text={field.label} />
                    ))}
                  </Sortable>
                </Menu>
              </div>
            </Col>
          </Row>
        </div>

        <div className="form__floating-footer">
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

          <If condition={!!(viewMeta && viewMeta.id)}>
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

export const ViewForm = ViewFormContainer(ViewFormInner);
