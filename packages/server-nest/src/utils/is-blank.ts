import * as _ from 'lodash';

export const isBlank = (value) => {
  return (_.isEmpty(value) && !_.isNumber(value)) || _.isNaN(value);
};
