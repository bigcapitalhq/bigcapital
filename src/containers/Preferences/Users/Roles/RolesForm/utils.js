import { isEmpty } from 'lodash';

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

export const transformToObject = ({ name, description, permissions }) => {
  if (!isEmpty(permissions)) {
    const output = {};
    permissions.forEach((item) => {
      output[`${item.subject}/${item.ability}`] = !!item.value;
    });
    return {
      role_name: name,
      role_description: description,
      permissions: { ...output },
    };
  }
};
