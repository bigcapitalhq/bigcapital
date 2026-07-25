import { DepGraph } from 'dependency-graph';
import { chain, isEmpty, castArray, memoize } from 'lodash';
import * as R from 'ramda';
import type { RolesFormPermission } from './types';
import {
  getPermissionsSchema,
  getPermissionsSchemaService,
  getPermissionsSchemaServices,
} from '@/constants/permissionsSchema';

interface PermissionItem {
  subject: string;
  ability: string;
  key?: string;
  value: boolean;
  default?: boolean;
  relatedColumn?: string;
  depend?: unknown;
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

interface PermissionSchemaItem {
  subject: string;
  abilities?: PermissionItem[];
  extra_abilities?: PermissionItem[];
}

interface FormLike {
  values: {
    permissions: Record<string, boolean>;
    serviceFullAccess: Record<string, boolean | number>;
  };
  setFieldValue: (field: string, value: unknown) => void;
}

export const FULL_ACCESS_CHECKBOX_STATE = {
  INDETARMINE: -1,
  ON: true,
  OFF: false,
} as const;

/**
 * Transformes the permissions object to array.
 */
export const transformToArray = ({
  permissions,
}: {
  permissions: Record<string, boolean>;
}): RolesFormPermission[] => {
  return Object.keys(permissions).map((index) => {
    const [value, key] = index.split('/');

    return {
      subject: value,
      ability: key,
      value: permissions[index],
    };
  });
};

function transformPermissions(
  permissions: Record<string, boolean>,
): Array<{ key: string; subject: string; value: boolean }> {
  return Object.keys(permissions).map((permissionKey) => {
    const [subject, key] = permissionKey.split('/');
    const value = permissions[permissionKey];

    return { key, subject, value };
  });
}

/**
 * Transformes permissions array to object.
 */
export const transformPermissionsToObject = (
  permissions: Array<{ subject: string; ability: string; value: boolean }>,
): Record<string, boolean> => {
  const output: Record<string, boolean> = {};
  permissions.forEach((item) => {
    output[`${item.subject}/${item.ability}`] = !!item.value;
  });
  return output;
};

/**
 *
 */
export const transformToObject = (role: {
  name: string;
  description: string;
  permissions: Array<{ subject: string; ability: string; value: boolean }>;
}) => {
  const permissions = transformPermissionsToObject(role.permissions);
  const serviceFullAccess = getInitialServicesFullAccess(permissions);

  return {
    role_name: role.name,
    role_description: role.description,
    permissions,
    serviceFullAccess,
  };
};

export const getDefaultValuesFromSchema = (
  schema: PermissionSchemaItem[],
): RolesFormPermission[] => {
  return schema
    .map((item) => {
      const abilities = [
        ...(item.abilities || []),
        ...(item.extra_abilities || []),
      ];
      return abilities
        .filter((ability) => ability.default)
        .map((ability) => ({
          subject: item.subject,
          ability: ability.key || '',
          value: !!ability.default,
        }));
    })
    .flat();
};

/**
 * Retrieve initial values of full access services.
 */
export const getInitialServicesFullAccess = (
  formPermissions: Record<string, boolean>,
): Record<string, boolean | number> => {
  const services = getPermissionsSchemaServices();

  return chain(services)
    .map((service: PermissionService) => {
      const { subject } = service;
      const isFullChecked = isServiceFullChecked(subject, formPermissions);
      const isFullUnchecked = isServiceFullUnchecked(subject, formPermissions);
      const value = detarmineCheckboxState(isFullChecked, isFullUnchecked);

      return [service.subject, value];
    })
    .fromPairs()
    .value();
};

/**
 *
 */
export const getNewRoleInitialValues = (
  schema: PermissionSchemaItem[],
): {
  permissions: Record<string, boolean>;
  serviceFullAccess: Record<string, boolean | number>;
} => {
  const permissions = transformPermissionsToObject(
    getDefaultValuesFromSchema(schema),
  );
  const serviceFullAccess = getInitialServicesFullAccess(permissions);

  return {
    permissions,
    serviceFullAccess,
  };
};

/**
 *
 */
export function getSerivceColumnPermission(
  service: PermissionService,
  columnKey: string,
): PermissionItem | undefined {
  return service.permissions.find((permission) => {
    return permission.relatedColumn === columnKey;
  });
}

/**
 *
 */
export function getServiceExtraPermissions(
  service: PermissionService,
): PermissionItem[] {
  return service.permissions.filter((permission) => {
    return !permission.relatedColumn;
  });
}

/**
 * Detarmines the given service subject is full permissions checked.
 */
export function isServiceFullChecked(
  subject: string,
  permissions: Record<string, boolean>,
): boolean {
  const serviceSchema = getPermissionsSchemaService(
    subject,
  ) as PermissionService;

  return serviceSchema.permissions.every(
    (permission) => permissions[`${subject}/${permission.key}`],
  );
}

/**
 * Detarmines the given service subject is fully associated permissions unchecked.
 */
export function isServiceFullUnchecked(
  subject: string,
  permissionsMap: Record<string, boolean>,
): boolean {
  const serviceSchema = getPermissionsSchemaService(
    subject,
  ) as PermissionService;

  return serviceSchema.permissions.every(
    (permission) => !permissionsMap[`${subject}/${permission.key}`],
  );
}

/**
 * Handles permission checkbox change.
 */
export const handleCheckboxPermissionChange = R.curry(
  (
    form: FormLike,
    permission: PermissionItem,
    service: PermissionService,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const { subject } = service;
    const isChecked = event.currentTarget.checked;
    const permKey = `${subject}/${permission.key}`;

    const permissionsGraph = memoizedPermissionsGraph();
    const dependencies = isChecked
      ? permissionsGraph.dependenciesOf(permKey)
      : permissionsGraph.dependantsOf(permKey);

    const newDependsPermiss = chain(dependencies)
      .map((dep: string) => [dep, isChecked])
      .fromPairs()
      .value();

    const newPermissions = {
      ...form.values.permissions,
      [permKey]: isChecked,
      ...newDependsPermiss,
    };
    const isFullChecked = isServiceFullChecked(subject, newPermissions);
    const isFullUnchecked = isServiceFullUnchecked(subject, newPermissions);
    form.setFieldValue(`permissions.${permKey}`, isChecked);
    form.setFieldValue(
      `serviceFullAccess.${subject}`,
      detarmineCheckboxState(isFullChecked, isFullUnchecked),
    );

    dependencies.forEach((depKey: string) => {
      form.setFieldValue(`permissions.${depKey}`, isChecked);
    });
  },
);

/**
 * Detarmines the permission checkbox state.
 */
function detarmineCheckboxState(
  isFullChecked: boolean,
  isFullUnchecked: boolean,
): boolean | number {
  return isFullChecked
    ? FULL_ACCESS_CHECKBOX_STATE.ON
    : isFullUnchecked
      ? FULL_ACCESS_CHECKBOX_STATE.OFF
      : FULL_ACCESS_CHECKBOX_STATE.INDETARMINE;
}

/**
 * Retreive the service all permissions paths.
 */
export function getServiceAllPermissionsPaths(subject: string): string[] {
  const service = getPermissionsSchemaService(subject) as PermissionService;

  return service.permissions.map(
    (perm) => `permissions.${subject}/${perm.key}`,
  );
}

/**
 * Handle full access service checkbox change.
 */
export const handleCheckboxFullAccessChange = R.curry(
  (
    service: PermissionService,
    form: FormLike,
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const isChecked = event.currentTarget.checked;
    const permsPaths = getServiceAllPermissionsPaths(service.subject);

    form.setFieldValue(`serviceFullAccess.${service.subject}`, isChecked);

    permsPaths.forEach((permissionPath) => {
      form.setFieldValue(
        permissionPath,
        isChecked
          ? FULL_ACCESS_CHECKBOX_STATE.ON
          : FULL_ACCESS_CHECKBOX_STATE.OFF,
      );
    });
  },
);

/**
 * Retrieves all flatten modules permissions.
 */
export function getAllFlattenPermissionsSchema(): Array<
  PermissionItem & { subject: string }
> {
  const permissions = getPermissionsSchema() as PermissionModule[];

  return chain(permissions)
    .map((module) => module.services)
    .flatten()
    .map((module: PermissionService) =>
      module.permissions.map((permission) => ({
        ...permission,
        subject: module.subject,
      })),
    )
    .flatten()
    .value();
}

/**
 * Retrieve the permissions schema dependencies graph.
 */
export const getPermissionsSchemaGraph = (): DepGraph<PermissionItem> => {
  const graph = new DepGraph<PermissionItem>();
  const permissions = getAllFlattenPermissionsSchema();

  permissions.forEach((permission) => {
    graph.addNode(`${permission.subject}/${permission.key}`, permission);
  });
  const nodesOrder = graph.overallOrder();

  nodesOrder.forEach((key) => {
    const node = graph.getNodeData(key);

    if (isEmpty(node.depend)) return;

    const depends = castArray<{ subject?: string; key: string }>(
      node.depend as unknown as { subject?: string; key: string },
    );

    depends.forEach((dependRelation) => {
      const subject = dependRelation.subject || node.subject;
      graph.addDependency(key, `${subject}/${dependRelation.key}`);
    });
  });
  return graph;
};

const memoizedPermissionsGraph = memoize(getPermissionsSchemaGraph);
