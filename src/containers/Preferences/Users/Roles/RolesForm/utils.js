export const transformToArray = ({ permissions }) => {
  return Object.keys(permissions).map((index) => {
    const [value, key] = index.split('/');

    return {
      subject: value,
      ability: key,
      value: permissions[index],
    };
  });
};

export const transformPermissionsToObject = (permissions) => {
  const output = {};
  permissions.forEach((item) => {
    output[`${item.subject}/${item.ability}`] = !!item.value;
  });
  return output;
};

export const transformToObject = (role) => {
  return {
    role_name: role.name,
    role_description: role.description,
    permissions: transformPermissionsToObject(role.permissions),
  };
};

export const getDefaultValuesFromSchema = (schema) => {
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
          ability: ability.key,
          value: ability.default,
        }));
    })
    .flat();
};

export const getNewRoleInitialValues = (schema) => {
  return {
    permissions: transformPermissionsToObject(
      getDefaultValuesFromSchema(schema),
    ),
  };
};

export function getSerivceColumnPermission(service, columnKey) {
  return service.permissions.find((permission) => {
    return permission.relatedColumn === columnKey;
  });
}

export function getServiceExtraPermissions(service) {
  return service.permissions.filter((permission) => {
    return !permission.relatedColumn;
  });
}
