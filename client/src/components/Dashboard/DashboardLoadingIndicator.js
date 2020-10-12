import React from 'react';
import classNames from 'classnames';
import { Choose, Icon } from 'components';

export default function DashboardLoadingIndicator({
  isLoading = false,
  className,
  children,
}) {
  return (
    <div className={classNames(className)}>
      <Choose>
        <Choose.When condition={isLoading}>
          <div class="center">
            <Icon icon="bigcapital" height={37} width={214} />
            <span>Please wait while resources loading...</span> 
          </div>
        </Choose.When>

        <Choose.Otherwise>
          { children }
        </Choose.Otherwise>
      </Choose>
    </div>
  );
}
