import { formatMessage } from 'services/intl';

export default [
  {
    id: 0,
    name: `${formatMessage({ id: 'january' })} - ${formatMessage({
      id: 'december',
    })}`,
    value: 'january',
  },
  {
    id: 1,
    name: `${formatMessage({ id: 'february' })} - ${formatMessage({
      id: 'january',
    })}`,
    value: 'february',
  },
  {
    id: 2,
    name: `${formatMessage({ id: 'march' })} - ${formatMessage({
      id: 'february',
    })}`,
    value: 'March',
  },
  {
    id: 3,
    name: `${formatMessage({ id: 'april' })} - ${formatMessage({
      id: 'march',
    })}`,
    value: 'april',
  },
  {
    id: 4,
    name: `${formatMessage({ id: 'may' })} - ${formatMessage({
      id: 'april',
    })}`,
    value: 'may',
  },
  {
    id: 5,
    name: `${formatMessage({ id: 'june' })} - ${formatMessage({
      id: 'may',
    })}`,
    value: 'june',
  },
  {
    id: 6,
    name: `${formatMessage({ id: 'july' })} - ${formatMessage({
      id: 'june',
    })}`,
    value: 'july',
  },
  {
    id: 7,
    name: `${formatMessage({ id: 'august' })} - ${formatMessage({
      id: 'july',
    })}`,
    value: 'August',
  },
  {
    id: 8,
    name: `${formatMessage({ id: 'september' })} - ${formatMessage({
      id: 'august',
    })}`,
    value: 'september',
  },
  {
    id: 9,
    name: `${formatMessage({ id: 'october' })} - ${formatMessage({
      id: 'november',
    })}`,
    value: 'october',
  },
  {
    id: 10,
    name: `${formatMessage({ id: 'november' })} - ${formatMessage({
      id: 'october',
    })}`,
    value: 'november',
  },
  {
    id: 11,
    name: `${formatMessage({ id: 'december' })} - ${formatMessage({
      id: 'november',
    })}`,
    value: 'december',
  },
]