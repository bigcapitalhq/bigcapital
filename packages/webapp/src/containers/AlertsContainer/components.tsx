import { Classes, Intent, ProgressBar } from '@blueprintjs/core';
import clsx from 'classnames';
import { debounce } from 'lodash';
import React, { Suspense } from 'react';
import styled from 'styled-components';
import type { WithAlertActionsProps } from '@/containers/Alert/withAlertActions';
import type { ComponentType } from 'react';
import { AppToaster } from '@/components';
import { withAlertActions } from '@/containers/Alert/withAlertActions';
import { withAlertStoreConnect } from '@/containers/Alert/withAlertStoreConnect';
import { compose } from '@/utils';

interface AlertLazyFallbackMessageProps {
  amount: number;
}

function AlertLazyFallbackMessage({
  amount,
}: AlertLazyFallbackMessageProps): React.ReactElement {
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

interface ToastProgressLoadingResult {
  message: React.ReactElement;
  onDismiss: (didTimeoutExpire?: boolean) => void;
  timeout: number;
}

function AlertLazyFallback(): React.ReactElement {
  const progressToastInterval = React.useRef<number | null>(null);
  const toastKey = React.useRef<string | null>(null);

  const toastProgressLoading = (amount: number): ToastProgressLoadingResult => {
    return {
      message: <AlertLazyFallbackMessage amount={amount} />,
      onDismiss: (didTimeoutExpire?: boolean) => {
        if (!didTimeoutExpire && progressToastInterval.current !== null) {
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
        if (progressToastInterval.current !== null) {
          window.clearInterval(progressToastInterval.current);
        }
      } else {
        progress += 10 + Math.random() * 20;
        if (toastKey.current !== null) {
          AppToaster.show(toastProgressLoading(progress), toastKey.current);
        }
      }
    }, 100);
  };

  const hideProgressToast = () => {
    if (progressToastInterval.current !== null) {
      window.clearInterval(progressToastInterval.current);
    }
    if (toastKey.current !== null) {
      AppToaster.dismiss(toastKey.current);
    }
  };

  // Debounce the trigger.
  const dobounceTrigger = React.useRef(
    debounce(() => {
      triggerProgressToast();
    }, 500),
  );
  React.useEffect(() => {
    dobounceTrigger.current();

    return () => {
      hideProgressToast();
      dobounceTrigger.current.cancel();
    };
  });

  return <></>;
}

interface AlertLazyInsideProps extends WithAlertActionsProps {
  name: string;
  isOpen: boolean;
  Component: ComponentType<{ name: string }>;
}

function AlertLazyInside({
  isOpen,
  name,
  Component,
}: AlertLazyInsideProps): React.ReactElement | null {
  if (!isOpen) {
    return null;
  }

  return (
    <Suspense fallback={<AlertLazyFallback />}>
      <Component name={name} />
    </Suspense>
  );
}

export const AlertLazy = compose(
  withAlertStoreConnect(),
  withAlertActions,
)(AlertLazyInside);

const ToastText = styled.div`
  margin-bottom: 10px;
`;
