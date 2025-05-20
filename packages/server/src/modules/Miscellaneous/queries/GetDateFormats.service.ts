import * as moment from 'moment';
import { Injectable } from '@nestjs/common';
import { DATE_FORMATS } from '../Miscellaneous.constants';

@Injectable()
export class GetDateFormatsService {
  getDateFormats() {
    return DATE_FORMATS.map((dateFormat) => {
      return {
        label: `${moment().format(dateFormat)} [${dateFormat}]`,
        key: dateFormat,
      };
    });
  }
}
