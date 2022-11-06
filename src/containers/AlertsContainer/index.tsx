// @ts-nocheck
import React from 'react';
import { AlertLazy } from './components'
import registered from './registered';

export default function AlertsContainer() {
  return (
    <React.Fragment>
      {registered.map((alert) => (
        <AlertLazy name={alert.name} Component={alert.component} />
      ))}
    </React.Fragment>
  );
}
