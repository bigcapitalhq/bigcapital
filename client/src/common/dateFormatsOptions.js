import moment from 'moment';
import { formatMessage } from 'services/intl';

export default [
  {
    id: 1,
    name: formatMessage({ id: 'mm_dd_yy' }),
    label: `${moment().format('MM/DD/YYYY')}`,
    value: 'mm/dd/yy',
  },
  {
    id: 2,
    name: formatMessage({ id: 'dd_mm_yy' }),
    label: `${moment().format('DD/MM/YYYY')}`,
    value: 'dd/mm/yy',
  },
  {
    id: 3,
    name: formatMessage({ id: 'yy_mm_dd' }),
    label: `${moment().format('YYYY/MM/DD')}`,
    value: 'yy/mm/dd',
  },
  {
    id: 4,
    name: formatMessage({ id: 'mm_dd_yy' }),
    label: `${moment().format('MM-DD-YYYY')}`,
    value: 'mm-dd-yy',
  },
  {
    id: 5,
    name: formatMessage({ id: 'dd_mm_yy_' }),
    label: `${moment().format('DD-MM-YYYY')}`,
    value: 'dd-mm-yy',
  },
  {
    id: 6,
    name: formatMessage({ id: 'yy_mm_dd_' }),
    label: `${moment().format('YYYY-MM-DD')}`,
    value: 'yy-mm-dd',
  },
];
