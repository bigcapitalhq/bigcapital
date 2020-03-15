import React, {useState, useEffect} from 'react';
import {Formik, useFormik, ErrorMessage} from "formik";
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
import {pick} from 'lodash';
import Icon from 'components/Icon';
import ViewFormConnect from 'connectors/ViewFormPage.connector';
import {compose} from 'utils';

function ViewForm({
  columns,
  fields,
  viewColumns,
  viewForm,
  submitView,
  editView,
  onDelete,
}) {
  const intl = useIntl();
  const [draggedColumns, setDraggedColumn] = useState([]);
  const [availableColumns, setAvailableColumns] = useState(columns); 

  const defaultViewRole = {
    field_key: '',
    comparator: 'AND',
    value: '',
    index: 1,
  };
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
    )
  });
  const initialEmptyForm = {
    resource_name: '',
    name: '',
    logic_expression: '',
    roles: [
      defaultViewRole,
    ],
    columns: [],
  };
  const initialForm = { ...initialEmptyForm, ...viewForm };

  const formik = useFormik({
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
    onSubmit: (values) => {

      if (viewForm && viewForm.id) {
        editView(viewForm.id, values).then((response) => {

        });
      } else {
        submitView(values).then((response) => {

        });
      }
    },
  });

  useEffect(() => {
    formik.setFieldValue('columns', draggedColumns.map((column, index) => ({
      index, key: column.key,
    })));
  }, [draggedColumns]);

  const conditionalsItems = [
    { value: 'and', label: 'AND' },
    { value: 'or', label: 'OR' },
  ];
  const whenConditionalsItems = [
    { value: '', label: 'When' },
  ];

  // Compatotors items.
  const compatatorsItems = [
    {value: '', label: 'Select a compatator'},
    {value: 'equals', label: 'Equals'},
    {value: 'not_equal', label: 'Not Equal'},
    {value: 'contain', label: 'Contain'},
    {value: 'not_contain', label: 'Not Contain'},
  ];

  // Resource fields.
  const resourceFields = [
    {value: '', label: 'Select a field'},
    ...fields.map((field) => ({ value: field.key, label: field.labelName, })),
  ];
  // Account item of select accounts field.
  const selectItem = (item, { handleClick, modifiers, query }) => {
    return (<MenuItem text={item.label} key={item.key} onClick={handleClick} />)
  };
  // Handle click new condition button.
  const onClickNewRole = () => {
    formik.setFieldValue('roles', [
      ...formik.values.roles,
      {
        ...defaultViewRole,
        index: formik.values.roles.length + 1,
      }
    ]);
  };
  // Handle click remove view role button.
  const onClickRemoveRole = (viewRole, index) => () => {
    const viewRoles = [...formik.values.roles];
    viewRoles.splice(index, 1);
    viewRoles.map((role, i) => {
      role.index = i + 1;
      return role;
    });
    formik.setFieldValue('roles', viewRoles);
  };

  const onClickDeleteView = () => { onDelete(viewForm); };
  return (
    <div class="view-form">
      <form onSubmit={formik.handleSubmit}>
        <div class="view-form--name-section">
          <Row>
            <Col sm={8}>
              <FormGroup
                label={intl.formatMessage({'id': 'View Name'})}
                className={'form-group--name'}
                intent={formik.errors.name && Intent.DANGER}
                helperText={formik.errors.name && formik.errors.label}
                inline={true}
                fill={true}>

                <InputGroup
                  intent={formik.errors.name && Intent.DANGER}
                  fill={true}
                  {...formik.getFieldProps('name')} />
              </FormGroup>
            </Col>
          </Row>
        </div>
   
        <H5 className="mb2">Define the conditionals</H5>

        {formik.values.roles.map((role, index) => (
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
                intent={formik.getFieldMeta(`roles[${index}].field_key`).error && Intent.DANGER}>

                <HTMLSelect
                  options={resourceFields}
                  value={role.field}
                  className={Classes.FILL}
                  {...formik.getFieldProps(`roles[${index}].field_key`)} />
              </FormGroup>
            </Col>

            <Col sm={2}>
              <FormGroup
                intent={formik.getFieldMeta(`roles[${index}].comparator`).error && Intent.DANGER}>

                <HTMLSelect
                  options={compatatorsItems}
                  value={role.comparator}
                  className={Classes.FILL}
                  {...formik.getFieldProps(`roles[${index}].comparator`)} />
              </FormGroup>
            </Col>

            <Col sm={5} class="flex">
              <FormGroup>
                <InputGroup
                  placeholder={intl.formatMessage({'id': 'value'})}
                  intent={formik.getFieldMeta(`roles[${index}].value`).error && Intent.DANGER}
                  {...formik.getFieldProps(`roles[${index}].value`)} />
              </FormGroup>
              
              <Button 
                icon={<Icon icon="mines" />}
                iconSize={14}
                className="ml2"
                minimal={true} 
                intent={Intent.DANGER}
                onClick={onClickRemoveRole(role, index)} />
            </Col>
          </Row>
        ))}

      <div class="mt1">
        <Button
          minimal={true}
          intent={Intent.PRIMARY}
          onClick={onClickNewRole}>
          + New Conditional
        </Button>
      </div>

      <div class="view-form--logic-expression-section">
        <Row>
          <Col sm={8}>
            <FormGroup
              label={intl.formatMessage({'id': 'Logic Expression'})}
              className={'form-group--logic-expression'}
              intent={formik.errors.logic_expression && Intent.DANGER}
              helperText={formik.errors.logic_expression && formik.errors.logic_expression}
              inline={true}
              fill={true}>

              <InputGroup intent={formik.errors.logic_expression && Intent.DANGER} fill={true}
                {...formik.getFieldProps('logic_expression')} />
            </FormGroup>
          </Col>
        </Row>

      </div>
      <H5 className={'mb2'}>Columns Preferences</H5>
      
      <div class="dragable-columns">
        <Row>
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
        <Button intent={Intent.PRIMARY} type="submit">Submit</Button>
        <Button intent={Intent.NONE} type="submit" className="ml2">Cancel</Button>

        { (viewForm && viewForm.id) && (
          <Button intent={Intent.DANGER} onClick={onClickDeleteView}>Delete</Button>
        ) }
      </div>
    </form>
  </div>
  );
}

export default compose(
  ViewFormConnect,
)(ViewForm);