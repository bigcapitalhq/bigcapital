import React from 'react';
import { AlertLazy } from './components';
import { registered } from './registered';

export function AlertsContainer(): React.ReactElement {
  return (
    <React.Fragment>
      {registered.map((alert) => (
        <AlertLazy
          key={alert.name}
          name={alert.name}
          Component={alert.component}
        />
      ))}
    </React.Fragment>
  );
}
