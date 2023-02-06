import moment from 'moment-timezone';
import { Service } from 'typedi';
import { DATE_FORMATS } from './constants';

@Service()
export default class DateFormatsService {
  getDateFormats() {
    return DATE_FORMATS.map((dateFormat) => {
      return {
        label: `${moment().format(dateFormat)} [${dateFormat}]`,
        key: dateFormat,
      };
    });
  }
}
