import React  from 'react'
import { FormattedMessage as T} from 'react-intl';

export default [
  {
    text: <T id={'general'}/>,
    disabled: false,
    href: '/preferences/general',
  },
  {
    text: <T id={'users'}/>,
    href: '/preferences/users',
  },
  {
    text: <T id={'currencies'}/>,
   
    href: '/preferences/currencies',
  },
  {
    text: <T id={'accountant'}/>,
    disabled: false,
    href: '/preferences/accountant',
  },
  {
    text: <T id={'accounts'}/>,
    disabled: false,
    href: '/preferences/accounts',
  },
];
