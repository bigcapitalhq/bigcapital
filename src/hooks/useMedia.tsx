// @ts-nocheck
import React, { useState, useRef, useCallback } from 'react';
import { ProgressBar, Classes, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import { AppToaster } from '@/components';
import { saveFilesInAsync } from '@/utils';

const useMedia = ({ saveCallback, deleteCallback }) => {
  const [files, setFiles] = useState([]);
  const [deletedFiles, setDeletedFiles] = useState([]);
  const toastKey = useRef(0);

  const openProgressToast = useCallback(
    (amount) => ({
      message: (
        <ProgressBar
          className={classNames('toast-progress', {
            [Classes.PROGRESS_NO_STRIPES]: amount >= 100,
          })}
          intent={amount < 100 ? Intent.PRIMARY : Intent.SUCCESS}
          value={amount / 100}
        />
      ),
    }),
    [],
  );

  const saveMedia = useCallback(() => {
    const notUploadedFiles = files.filter((file) => file.uploaded === false);

    if (notUploadedFiles.length > 0) {
      toastKey.current = AppToaster.show(openProgressToast(0));

      const saveAction = (formData, attachment, progressCallback) => {
        return saveCallback(formData, {
          onUploadProgress: (progress) => {
            progressCallback(progress);
          },
        }).then((res) => {
          attachment.uploaded = true;
          return res;
        });
      };
      return saveFilesInAsync(notUploadedFiles, saveAction).onProgress(
        (progress) => {
          if (progress > 0) {
            AppToaster.show(
              openProgressToast(progress * 100),
              toastKey.current,
            );
          }
        },
      );
    }
    return Promise.resolve([]);
  }, [files, openProgressToast, saveCallback]);

  const deleteMedia = useCallback(() => {
    return deletedFiles.length > 0
      ? deleteCallback(deletedFiles)
      : Promise.resolve();
  }, [deletedFiles, deleteCallback]);

  return {
    files,
    setFiles,
    saveMedia,
    deletedFiles,
    setDeletedFiles,
    deleteMedia,
  };
};

export default useMedia;
