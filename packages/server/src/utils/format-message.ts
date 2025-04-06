import { defaultTo } from 'lodash';

export const formatMessage = (message: string, args: Record<string, any>) => {
  let formattedMessage = message;

  Object.keys(args).forEach((key) => {
    const variable = `{${key}}`;
    const value = defaultTo(args[key], '');

    formattedMessage = formattedMessage.replace(
      new RegExp(variable, 'g'),
      value
    );
  });
  return formattedMessage;
};