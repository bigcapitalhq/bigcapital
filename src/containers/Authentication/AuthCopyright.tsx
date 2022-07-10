import React from 'react';
import moment from 'moment';
import intl from 'react-intl-universal';
import { Icon } from '@/components/Icon';

export default function AuthCopyright() {
  return (
    <div class="auth-copyright">
      <div class="auth-copyright__text">
        {intl.get('all_rights_reserved', {
          pre: moment().subtract(1, 'years').year(),
          current: moment().get('year'),
        })}
      </div>

      <Icon width={122} height={22} icon={'bigcapital'} />
    </div>
  );
}
