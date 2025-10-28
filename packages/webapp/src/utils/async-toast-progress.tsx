import { isUndefined } from 'lodash';
import clsx from 'classnames';
import {
  Classes,
  Intent,
  ProgressBar,
  Text,
  ToastProps,
} from '@blueprintjs/core';
import { AppToaster } from '@/components';

interface AsyncToastProgress {
  renderProgressProps?: (amount: number) => ToastProps;
}

export function asyncToastProgress({
  renderProgressProps,
}: AsyncToastProgress = {}) {
  let progressToastInterval: number;
  let progress = 0;
  let key: string = '';

  const renderProgress = (amount: number): ToastProps => {
    const customProgressProps = !isUndefined(renderProgressProps)
      ? renderProgressProps(amount)
      : {};

    return {
      icon: 'hand',
      message: (
        <>
          <Text style={{ fontSize: 12, marginBottom: 6 }}>
            Preparing the document.
          </Text>
          <ProgressBar
            className={clsx({
              [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
            })}
            intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
            value={amount / 100}
          />
        </>
      ),
      onDismiss: (didTimeoutExpire: boolean) => {
        if (!didTimeoutExpire) {
          // user dismissed toast with click
          window.clearInterval(progressToastInterval);
        }
      },
      timeout: amount < 100 ? 0 : 2000,
      ...customProgressProps,
    };
  };

  const startProgress = () => {
    key = AppToaster.show(renderProgress(0));

    progressToastInterval = window.setInterval(() => {
      if (progress > 100) {
        window.clearInterval(progressToastInterval);
      } else {
        progress += 10 + Math.random() * 20;
        progress = Math.min(progress, 95); // Ensure progress never reaches 100

        AppToaster.show(renderProgress(progress), key);
      }
    }, 1000);
  };

  const stopProgress = () => {
    progress = 100;
    AppToaster.show(renderProgress(progress), key);
    window.clearInterval(progressToastInterval);
  };
  return { startProgress, stopProgress };
}
