import React from 'react';
import Icon from 'components/Icon';

function AuthCopyright() {
  return (
    <div class="auth-copyright">
      <div class="auth-copyright__text">
        © 2001–2020 All Rights Reserved.
      </div>

      <Icon width={122} height={22} icon={'bigcapital'} />
    </div>    
  );
}

export default AuthCopyright;
