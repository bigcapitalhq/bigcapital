// @ts-nocheck
import { Checkbox, Popover } from '@blueprintjs/core';
import { Field } from 'formik';
import React from 'react';
import styled from 'styled-components';
import {
  getSerivceColumnPermission,
  getServiceExtraPermissions,
  FULL_ACCESS_CHECKBOX_STATE,
  handleCheckboxFullAccessChange,
  handleCheckboxPermissionChange,
} from './utils';
import { Card, If, ButtonLink, Choose, T } from '@/components';
import {
  getPermissionsSchema,
  ModulePermissionsStyle,
} from '@/constants/permissionsSchema';

interface PermissionItem {
  subject: string;
  ability?: string;
  key?: string;
  value: boolean;
  default?: boolean;
  relatedColumn?: string;
  label?: string;
}

interface PermissionService {
  subject: string;
  label?: string;
  permissions: PermissionItem[];
}

interface PermissionModule {
  label?: string;
  type?: string;
  serviceFullAccess?: boolean;
  columns?: Array<{ key: string; label?: string }>;
  services: PermissionService[];
}

interface FormState {
  values: {
    permissions: Record<string, boolean>;
    serviceFullAccess: Record<string, boolean | number>;
  };
  setFieldValue: (field: string, value: unknown) => void;
}

// Module permissions context.
const ModulePermissionsContext = React.createContext<{
  module: PermissionModule;
} | null>(null);
const ModuleServiceContext = React.createContext<{
  service: PermissionService;
} | null>(null);

/**
 * Retrieves the module permissions provider.
 */
const useModulePermissionsProvider = () =>
  React.useContext(ModulePermissionsContext);

/**
 * Module permissions service context provider.
 */
const useModulePermissionsServiceProvider = () =>
  React.useContext(ModuleServiceContext);

interface ModulePermissionsProviderProps {
  module: PermissionModule;
  children: React.ReactNode;
}

/**
 * Module permissions context state provider.
 */
function ModulePermissionsProvider({
  module,
  children,
}: ModulePermissionsProviderProps) {
  return (
    <ModulePermissionsContext.Provider value={{ module }}>
      {children}
    </ModulePermissionsContext.Provider>
  );
}

interface ModulePermissionsServiceProviderProps {
  service: PermissionService;
  children: React.ReactNode;
}

/**
 * Module permissions service context state provider.
 */
function ModulePermissionsServiceProvider({
  service,
  children,
}: ModulePermissionsServiceProviderProps) {
  return (
    <ModuleServiceContext.Provider value={{ service }}>
      {children}
    </ModuleServiceContext.Provider>
  );
}

interface PermissionBodyColumnProps {
  column: { key: string; label?: string };
}

/**
 * Permissions body columns.
 */
function PermissionBodyColumn({ column }: PermissionBodyColumnProps) {
  // Module permssions service context.
  const ctx = useModulePermissionsServiceProvider();
  const service = ctx?.service as PermissionService;

  // Retrieve the related permission of the given column key.
  const permission = getSerivceColumnPermission(service, column.key);

  // Display empty cell if the current column key has no related permissions.
  if (!permission) {
    return <td className={'permission-checkbox'}></td>;
  }
  return (
    <td className={'permission-checkbox'}>
      <Field
        name={`permissions.${service.subject}/${permission.key}`}
        type="checkbox"
      >
        {({ field, form }) => (
          <PermissionCheckbox
            inline={true}
            {...field}
            onChange={handleCheckboxPermissionChange(
              form as FormState,
              permission,
              service,
            )}
          />
        )}
      </Field>
    </td>
  );
}

interface ModulePermissionsTableColumnsProps {
  columns: Array<{ key: string; label?: string }>;
}

/**
 *
 */
function ModulePermissionsTableColumns({
  columns,
}: ModulePermissionsTableColumnsProps) {
  return columns.map((column, idx) => (
    <PermissionBodyColumn key={column.key ?? idx} column={column} />
  ));
}

/**
 * Module columns permissions extra permissions popover.
 */
function ModuleExtraPermissionsPopover() {
  const ctx = useModulePermissionsServiceProvider();
  const service = ctx?.service as PermissionService;

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
            key={`${service.subject}/${permission.key}`}
            name={`permissions.${service.subject}/${permission.key}`}
            type="checkbox"
          >
            {({ form, field }) => (
              <PermissionCheckbox
                inline={true}
                label={permission.label}
                {...field}
                onChange={handleCheckboxPermissionChange(
                  form as FormState,
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
 */
function ModulePermissionExtraPermissions() {
  const ctx = useModulePermissionsServiceProvider();
  const service = ctx?.service as PermissionService;

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
 */
function ModulePermissionsTableHead() {
  const ctx = useModulePermissionsProvider();
  const module = ctx?.module as PermissionModule;
  const { serviceFullAccess, columns } = module;

  return (
    <thead>
      <tr>
        <th></th>
        <If condition={serviceFullAccess}>
          <th className={'full'}>
            <T id={'permissions.column.full_access'} />
          </th>
        </If>
        {columns?.map((column, idx) => (
          <th key={column.key ?? idx} className={'permission'}>
            {column.label}
          </th>
        ))}
        <th></th>
      </tr>
    </thead>
  );
}

/**
 * Module permissions service full access.
 */
function ModulePermissionsServiceFullAccess() {
  // Module permissions provider.
  const modCtx = useModulePermissionsProvider();
  const module = modCtx?.module as PermissionModule;

  // Module service provider.
  const svcCtx = useModulePermissionsServiceProvider();
  const service = svcCtx?.service as PermissionService;

  return (
    <If condition={module.serviceFullAccess}>
      <td className="full-access-permission">
        <Field name={`serviceFullAccess.${service.subject}`} type="checkbox">
          {({ form, field }) => (
            <PermissionCheckbox
              inline={true}
              {...field}
              indeterminate={
                field.value === FULL_ACCESS_CHECKBOX_STATE.INDETARMINE
              }
              onChange={handleCheckboxFullAccessChange(
                service,
                form as FormState,
              )}
            />
          )}
        </Field>
      </td>
    </If>
  );
}

/**
 * Module permissions table body.
 */
function ModulePermissionsTableBody() {
  const ctx = useModulePermissionsProvider();
  const module = ctx?.module as PermissionModule;
  const { services, columns } = module;

  return (
    <tbody>
      {services.map((service) => (
        <ModulePermissionsServiceProvider
          key={service.subject}
          service={service}
        >
          <tr>
            <td className="service-label">{service.label} </td>

            <ModulePermissionsServiceFullAccess />
            <ModulePermissionsTableColumns columns={columns ?? []} />
            <ModulePermissionExtraPermissions />
          </tr>
        </ModulePermissionsServiceProvider>
      ))}
    </tbody>
  );
}

/**
 * Module permissions table.
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
 */
function ModuleVerticalTableCells() {
  const ctx = useModulePermissionsServiceProvider();
  const service = ctx?.service as PermissionService;

  return (
    <td className={'permissions'}>
      {service.permissions.map((permission) => (
        <div key={`${service.subject}/${permission.key}`}>
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
                  form as FormState,
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
 */
function ModulePermissionsVerticalServices() {
  const ctx = useModulePermissionsProvider();
  const module = ctx?.module as PermissionModule;

  return (
    <ModulePermissionsVerticalServicesRoot>
      <ModulePermissionsVerticalTable>
        <tbody>
          {module.services.map((service) => (
            <ModulePermissionsServiceProvider
              key={service.subject}
              service={service}
            >
              <tr>
                <td className={'service-label'}>{service.label} </td>
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
 */
function ModulePermissionsBody() {
  const ctx = useModulePermissionsProvider();
  const module = ctx?.module as PermissionModule;

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

interface ModulePermissionsProps {
  module: PermissionModule;
}

/**
 * Permissions module.
 */
function ModulePermissions({ module }: ModulePermissionsProps) {
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
 */
export const RolesPermissionList = () => {
  const permissions = getPermissionsSchema() as PermissionModule[];

  return (
    <ModulesPermission>
      {permissions.map((module, idx) => (
        <ModulePermissions key={idx} module={module} />
      ))}
    </ModulesPermission>
  );
};

const PermissionCheckbox = styled(Checkbox)`
  &.bp4-control.bp4-checkbox .bp4-control-indicator {
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
      .bp4-control.bp4-inline {
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
