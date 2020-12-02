import moment from 'moment';

export default [
  {
    id: 1,
    name: 'MM/DD/YY',
    label: `${moment().format('MM/DD/YYYY')}`,
    value: 'mm/dd/yy',
  },
  {
    id: 2,
    name: 'DD/MM/YY',
    label: `${moment().format('DD/MM/YYYY')}`,
    value: 'dd/mm/yy',
  },
  {
    id: 3,
    name: 'YY/MM/DD',
    label: `${moment().format('YYYY/MM/DD')}`,
    value: 'yy/mm/dd',
  },
  {
    id: 4,
    name: 'MM-DD-YY',
    label: `${moment().format('MM-DD-YYYY')}`,
    value: 'mm-dd-yy',
  },
  {
    id: 5,
    name: 'DD-MM-YY',
    label: `${moment().format('DD-MM-YYYY')}`,
    value: 'dd-mm-yy',
  },
  {
    id: 6,
    name: 'YY-MM-DD',
    label: `${moment().format('YYYY-MM-DD')}`,
    value: 'yy-mm-dd',
  },
]