import React from 'react';
import styled from 'styled-components';
import { Button, Intent } from '@blueprintjs/core';
import clsx from 'classnames';
import { FormattedMessage as T } from 'components';

import { EasySMSIntegrationProvider } from './EasySMSIntegrationProvider';
import withDialogActions from 'containers/Dialog/withDialogActions';
import withAlertsActions from 'containers/Alert/withAlertActions';

import { compose } from 'utils';

/**
 * EasySMS integration.
 */
function EasySMSIntegrationList({
  // #withDialogActions
  openDialog,

  // #withAlertsActions
  openAlert,
}) {
  // Handle EasySMS integrate.
  const handleEasySMSIntegrate = () => {
    openDialog('easysms-integrate', {});
  };

  // Handle EsaySMS disconnect
  const handleEasySMSDiconnect = ({}) => {
    openAlert('easysms-disconnect', {});
  };

  return (
    <EasySMSIntegrationProvider>
      <EasySMSIntegration>
        <EasySMSIntegrationInner>
          <EasySMSIntegrationTitle>Easysms Integration</EasySMSIntegrationTitle>
          <EasySMSIntegrationParagraph>
            <b>Lorem ipsum</b> dolor sit amet, consectetur adipisicing elit, sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua. Lorem
            ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
          </EasySMSIntegrationParagraph>
          <Button
            text={<T id={'esaysms.label.connect'} />}
            onClick={handleEasySMSIntegrate}
          />
        </EasySMSIntegrationInner>
        <EasySMSIntegrationFooter>
          <Button
            onClick={handleEasySMSIntegrate}
            text={<T id={'easysms.label.edit_integration_settings'} />}
          />

          <Button
            text={<T id={'easysms.label.disconnect'} />}
            onClick={handleEasySMSDiconnect}
          />
        </EasySMSIntegrationFooter>
      </EasySMSIntegration>
    </EasySMSIntegrationProvider>
  );
}

export default compose(
  withAlertsActions,
  withDialogActions,
)(EasySMSIntegrationList);

const EasySMSIntegration = styled.div`
  display: flex;
  flex-direction: column;
  padding: 14px;
`;

const EasySMSIntegrationInner = styled.div`
  max-width: 45rem; // 100%
  margin-bottom: 48px; // 48
`;

const EasySMSIntegrationTitle = styled.h2`
  font-weight: 50px;
  margin-bottom: 12px;
`;

const EasySMSIntegrationParagraph = styled.p`
  font-size: 14px;
  line-height: 1.75rem;
  margin-bottom: 15px;
`;

const EasySMSIntegrationFooter = styled.div`
  width: 100%;
  /* max-width: 30rem; */
  display: flex;

  .bp3-button {
    margin-right: 10px;
  }
`;
