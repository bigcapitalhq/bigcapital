import React from 'react';
import classNames from 'classnames';
import { Choose, Icon } from 'components';

export default function DashboardLoadingIndicator({
  isLoading = false,
  className,
  children,
}) {
  return (  
    <Choose>
      <Choose.When condition={isLoading}>
        <div className={classNames('bigcapital-loading', className)}>
          <div class="center">
            <Icon icon="bigcapital" height={37} width={214} />
            <span class="text">Please wait while resources loading...</span> 
          </div>
        </div>
      </Choose.When>

      <Choose.Otherwise>
        { children }
      </Choose.Otherwise>
    </Choose>
  );
}
