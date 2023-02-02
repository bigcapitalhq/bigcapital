// @ts-nocheck
import React from 'react';
import { Redirect } from 'react-router-dom';

export default function DefaultRoute() {
  const defaultTab = '/preferences/general';

  return (<Redirect from='/preferences' to={defaultTab} />);
}