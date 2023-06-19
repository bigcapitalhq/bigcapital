// @ts-nocheck
import React, { Suspense } from 'react';
import styled from 'styled-components';
import clsx from 'classnames';
import * as R from 'ramda';
import { Intent, Classes, ProgressBar } from '@blueprintjs/core';
import { debounce } from 'lodash';

import withAlertStoreConnect from '@/containers/Alert/withAlertStoreConnect';
import withAlertActions from '@/containers/Alert/withAlertActions';

import { AppToaster } from '@/components';

function AlertLazyFallbackMessage({ amount }) {
  return (
    <React.Fragment>
      <ToastText>Alert content is loading, just a second.</ToastText>
      <ProgressBar
        className={clsx({
          [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
        })}
        intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
        value={amount / 100}
      />
    </React.Fragment>
  );
}

function AlertLazyFallback({}) {
  const progressToastInterval = React.useRef(null);
  const toastKey = React.useRef(null);

  const toastProgressLoading = (amount) => {
    return {
      message: <AlertLazyFallbackMessage amount={amount} />,
      onDismiss: (didTimeoutExpire) => {
        if (!didTimeoutExpire) {
          window.clearInterval(progressToastInterval.current);
        }
      },
      timeout: amount < 100 ? 0 : 2000,
    };
  };

  const triggerProgressToast = () => {
    let progress = 0;
    toastKey.current = AppToaster.show(toastProgressLoading(0));

    progressToastInterval.current = window.setInterval(() => {
      if (toastKey.current == null || progress > 100) {
        window.clearInterval(progressToastInterval.current);
      } else {
        progress += 10 + Math.random() * 20;
        AppToaster.show(toastProgressLoading(progress), toastKey.current);
      }
    }, 100);
  };

  const hideProgressToast = () => {
    window.clearInterval(progressToastInterval.current);
    AppToaster.dismiss(toastKey.current);
  };

  // Debounce the trigger.
  const doBounceTrigger = React.useRef(
    debounce(() => {
      triggerProgressToast();
    }, 500),
  );
  React.useEffect(() => {
    doBounceTrigger.current();

    return () => {
      hideProgressToast();
      doBounceTrigger.current.cancel();
    };
  });

  return null;
}

function AlertLazyInside({ isOpen, name, Component }) {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={<AlertLazyFallback />}>
      <Component name={name} />
    </Suspense>
  );
}

export const AlertLazy = R.compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AlertLazyInside);

const ToastText = styled.div`
  margin-bottom: 10px;
`;
