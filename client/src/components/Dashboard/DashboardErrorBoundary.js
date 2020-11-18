import React from 'react';
import { Icon } from 'components';

export default function DashboardErrorBoundary({}) {
  return (
    <div class="dashboard__error-boundary">
      <h1>Sorry about that! Something went wrong</h1>
      <p>If the problem stuck, please <a href="#">contact us</a> as soon as possible.</p>
      <Icon icon="bigcapital" height={30} width={160} />
    </div>
  )
}