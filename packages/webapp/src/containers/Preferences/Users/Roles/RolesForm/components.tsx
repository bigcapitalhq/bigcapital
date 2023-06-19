// @ts-nocheck
import React from 'react';
import styled from 'styled-components';
import { Field } from 'formik';
import { Checkbox, Popover } from '@blueprintjs/core';

import {
  getPermissionsSchema,
  ModulePermissionsStyle,
} from '@/constants/permissionsSchema';
import { Card, If, ButtonLink, Choose, T } from '@/components';
import {
  getSerivceColumnPermission,
  getServiceExtraPermissions,
  FULL_ACCESS_CHECKBOX_STATE,
  handleCheckboxFullAccessChange,
  handleCheckboxPermissionChange,
} from './utils';

// Module permissions context.
const ModulePermissionsContext = React.createContext();
const ModuleServiceContext = React.createContext();

/**
 * Retrieves the module permissions provider.
 * @returns {React.JSX}
 */
const useModulePermissionsProvider = () =>
  React.useContext(ModulePermissionsContext);

/**
 * Module permissions service context provider.
 */
const useModulePermissionsServiceProvider = () =>
  React.useContext(ModuleServiceContext);

/**
 * Module permissions context state provider.
 * @returns {React.JSX}
 */
function ModulePermissionsProvider({ module, children }) {
  return (
    <ModulePermissionsContext.Provider value={{ module }}>
      {children}
    </ModulePermissionsContext.Provider>
  );
}

/**
 * Module permissions service context state provider.
 * @returns {React.JSX}
 */
function ModulePermissionsServiceProvider({ service, children }) {
  return (
    <ModuleServiceContext.Provider value={{ service }}>
      {children}
    </ModuleServiceContext.Provider>
  );
}

/**
 * Permissions body columns.
 * @returns {React.JSX}
 */
function PermissionBodyColumn({ column }) {
  // Module permissions service context.
  const { service } = useModulePermissionsServiceProvider();

  // Retrieve the related permission of the given column key.
  const permission = getSerivceColumnPermission(service, column.key);

  // Display empty cell if the current column key has no related permissions.
  if (!permission) {
    return <td class={'permission-checkbox'}></td>;
  }
  return (
    <td class={'permission-checkbox'}>
      <Field
        name={`permissions.${service.subject}/${permission.key}`}
        type="checkbox"
      >
        {({ field, form }) => (
          <PermissionCheckbox
            inline={true}
            {...field}
            onChange={handleCheckboxPermissionChange(form, permission, service)}
          />
        )}
      </Field>
    </td>
  );
}

/**
 *
 * @returns {React.JSX}
 */
function ModulePermissionsTableColumns({ columns }) {
  return columns.map((column) => <PermissionBodyColumn column={column} />);
}

/**
 * Module columns permissions extra permissions popover.
 * @returns {React.JSX}
 */
function ModuleExtraPermissionsPopover() {
  const { service } = useModulePermissionsServiceProvider();

  // Retrieve the extra permissions of the given service.
  const extraPermissions = getServiceExtraPermissions(service);

  return (
    <Popover>
      <MorePermissionsLink>
        <T id={'permissions.more_permissions'} />
      </MorePermissionsLink>

      <ExtraPermissionsRoot>
        {extraPermissions.map((permission) => (
          <Field
            name={`permissions.${service.subject}/${permission.key}`}
            type="checkbox"
          >
            {({ form, field }) => (
              <PermissionCheckbox
                inline={true}
                label={permission.label}
                {...field}
                onChange={handleCheckboxPermissionChange(
                  form,
                  permission,
                  service,
                )}
              />
            )}
          </Field>
        ))}
      </ExtraPermissionsRoot>
    </Popover>
  );
}

/**
 * Module permissions extra permissions.
 * @returns {React.JSX}
 */
function ModulePermissionExtraPermissions() {
  const { service } = useModulePermissionsServiceProvider();

  // Retrieve the extra permissions of the given service.
  const extraPermissions = getServiceExtraPermissions(service);

  return (
    <td>
      <If condition={extraPermissions.length > 0}>
        <ModuleExtraPermissionsPopover />
      </If>
    </td>
  );
}

/**
 * Module permissions table head.
 * @returns {React.JSX}
 */
function ModulePermissionsTableHead() {
  const {
    module: { serviceFullAccess, columns },
  } = useModulePermissionsProvider();

  return (
    <thead>
      <tr>
        <th></th>
        <If condition={serviceFullAccess}>
          <th class={'full'}>
            <T id={'permissions.column.full_access'} />
          </th>
        </If>
        {columns.map((column) => (
          <th class={'permission'}>{column.label}</th>
        ))}
        <th></th>
      </tr>
    </thead>
  );
}

/**
 * Module permissions service full access.
 * @returns {React.JSX}
 */
function ModulePermissionsServiceFullAccess() {
  // Module permissions provider.
  const { module } = useModulePermissionsProvider();

  // Module service provider.
  const { service } = useModulePermissionsServiceProvider();

  return (
    <If condition={module.serviceFullAccess}>
      <td class="full-access-permission">
        <Field name={`serviceFullAccess.${service.subject}`} type="checkbox">
          {({ form, field }) => (
            <PermissionCheckbox
              inline={true}
              {...field}
              indeterminate={
                field.value === FULL_ACCESS_CHECKBOX_STATE.INDETARMINE
              }
              onChange={handleCheckboxFullAccessChange(service, form)}
            />
          )}
        </Field>
      </td>
    </If>
  );
}

/**
 * Module permissions table body.
 * @returns {React.JSX}
 */
function ModulePermissionsTableBody() {
  const {
    module: { services, columns },
  } = useModulePermissionsProvider();

  return (
    <tbody>
      {services.map((service) => (
        <ModulePermissionsServiceProvider service={service}>
          <tr>
            <td className="service-label">{service.label} </td>

            <ModulePermissionsServiceFullAccess />
            <ModulePermissionsTableColumns columns={columns} />
            <ModulePermissionExtraPermissions />
          </tr>
        </ModulePermissionsServiceProvider>
      ))}
    </tbody>
  );
}

/**
 * Module permissions table.
 * @returns {React.JSX}
 */
function ModulePermissionsTable() {
  return (
    <ModulePermissionsTableRoot>
      <ModulePermissionsTableHead />
      <ModulePermissionsTableBody />
    </ModulePermissionsTableRoot>
  );
}

/**
 * Module vertical table cells.
 * @returns {React.JSX}
 */
function ModuleVerticalTableCells() {
  const { service } = useModulePermissionsServiceProvider();

  return (
    <td class={'permissions'}>
      {service.permissions.map((permission) => (
        <div>
          <Field
            name={`permissions.${service.subject}/${permission.key}`}
            type="checkbox"
          >
            {({ form, field }) => (
              <PermissionCheckbox
                inline={true}
                label={permission.label}
                {...field}
                onChange={handleCheckboxPermissionChange(
                  form,
                  permission,
                  service,
                )}
              />
            )}
          </Field>
        </div>
      ))}
    </td>
  );
}

/**
 * Module permissions vertical services.
 * @returns {React.JSX}
 */
function ModulePermissionsVerticalServices() {
  const { module } = useModulePermissionsProvider();

  return (
    <ModulePermissionsVerticalServicesRoot>
      <ModulePermissionsVerticalTable>
        <tbody>
          {module.services.map((service) => (
            <ModulePermissionsServiceProvider service={service}>
              <tr>
                <td class={'service-label'}>{service.label} </td>
                <ModuleVerticalTableCells />
              </tr>
            </ModulePermissionsServiceProvider>
          ))}
        </tbody>
      </ModulePermissionsVerticalTable>
    </ModulePermissionsVerticalServicesRoot>
  );
}

/**
 * Module permissions body.
 * @returns {React.JSX}
 */
function ModulePermissionsBody() {
  const { module } = useModulePermissionsProvider();

  return (
    <ModulePermissionBodyRoot>
      <Choose>
        <Choose.When
          condition={module.type === ModulePermissionsStyle.Vertical}
        >
          <ModulePermissionsVerticalServices />
        </Choose.When>

        <Choose.When condition={module.type === ModulePermissionsStyle.Columns}>
          <ModulePermissionsTable />
        </Choose.When>
      </Choose>
    </ModulePermissionBodyRoot>
  );
}

/**
 * Permissions module.
 * @returns {React.JSX}
 */
function ModulePermissions({ module }) {
  return (
    <ModulePermissionsRoot>
      <ModulePermissionsProvider module={module}>
        <ModulePermissionHead>
          <ModulePermissionTitle>{module.label} </ModulePermissionTitle>
        </ModulePermissionHead>

        <ModulePermissionsBody />
      </ModulePermissionsProvider>
    </ModulePermissionsRoot>
  );
}

/**
 * Permissions modules list.
 * @return {React.JSX}
 */
export const RolesPermissionList = () => {
  const permissions = getPermissionsSchema();

  return (
    <ModulesPermission>
      {permissions.map((module) => (
        <ModulePermissions module={module} />
      ))}
    </ModulesPermission>
  );
};

const PermissionCheckbox = styled(Checkbox)`
  &.bp3-control.bp3-checkbox .bp3-control-indicator {
    border-radius: 2px;
    border-color: #555;

    &,
    &:before {
      width: 15px;
      height: 15px;
    }
  }
`;

const ModulesPermission = styled.div``;

const ModulePermissionsRoot = styled(Card)`
  padding: 0 !important;
`;

const ModulePermissionHead = styled.div`
  border-bottom: 1px solid #d9d9d9;
  height: 38px;
  padding: 0 15px;
  display: flex;
`;

const ModulePermissionTitle = styled.div`
  font-weight: 500;
  font-size: 16px;
  line-height: 38px;
  color: #878787;
`;

const ModulePermissionBodyRoot = styled.div``;

const ModulePermissionsTableRoot = styled.table`
  border-spacing: 0;

  thead {
    tr th {
      font-weight: 400;
      vertical-align: top;

      &.full,
      &.permission {
        min-width: 70px;
      }
      &.full {
        background-color: #fcfcfc;
      }
    }
  }
  thead,
  tbody {
    tr td,
    tr th {
      border-bottom: 1px solid #eee;
      border-left: 1px solid #eee;
      padding: 10px;

      &:first-of-type {
        border-left: 0;
      }
    }

    tr:last-of-type td {
      border-bottom: 0;
    }

    tr td:last-of-type,
    tr th:last-of-type {
      width: 100%;
    }
  }

  tbody {
    tr td.service-label {
      min-width: 250px;
    }

    tr td {
      .bp3-control.bp3-inline {
        margin: 0;
      }

      &.full-access-permission {
        background-color: #fcfcfc;
      }

      &.full-access-permission,
      &.permission-checkbox {
        text-align: center;
      }
    }
  }
`;

const MorePermissionsLink = styled(ButtonLink)`
  font-size: 12px;
`;

const ExtraPermissionsRoot = styled.div`
  display: flex;
  flex-direction: column;
  padding: 15px;
`;

const ModulePermissionsVerticalServicesRoot = styled.div``;

const ModulePermissionsVerticalTable = styled.table`
  border-spacing: 0;

  tbody {
    tr td {
      padding: 10px;
      vertical-align: top;
      border-left: 1px solid #eee;
      border-bottom: 1px solid #eee;

      &.service-label {
        min-width: 250px;
        color: #333;
      }

      &:first-of-type {
        border-left: 0;
      }

      &.permissions {
        width: 100%;
      }
    }

    tr:last-of-type td {
      border-bottom: 0;
    }
  }
`;
