// @ts-nocheck
import moment from 'moment';
import intl from 'react-intl-universal';

export const getDateFormats =()=> [
  {
    id: 1,
    name: intl.get('mm_dd_yy'),
    label: `${moment().format('MM/DD/YYYY')}`,
    value: 'mm/dd/yy',
  },
  {
    id: 2,
    name: intl.get('dd_mm_yy'),
    label: `${moment().format('DD/MM/YYYY')}`,
    value: 'dd/mm/yy',
  },
  {
    id: 3,
    name: intl.get('yy_mm_dd'),
    label: `${moment().format('YYYY/MM/DD')}`,
    value: 'yy/mm/dd',
  },
  {
    id: 4,
    name: intl.get('mm_dd_yy'),
    label: `${moment().format('MM-DD-YYYY')}`,
    value: 'mm-dd-yy',
  },
  {
    id: 5,
    name: intl.get('dd_mm_yy_'),
    label: `${moment().format('DD-MM-YYYY')}`,
    value: 'dd-mm-yy',
  },
  {
    id: 6,
    name: intl.get('yy_mm_dd_'),
    label: `${moment().format('YYYY-MM-DD')}`,
    value: 'yy-mm-dd',
  },
];
