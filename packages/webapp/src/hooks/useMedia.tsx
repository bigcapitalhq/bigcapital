import { ProgressBar, Classes, Intent } from '@blueprintjs/core';
import classNames from 'classnames';
import React, { useState, useRef, useCallback } from 'react';
import { AppToaster } from '@/components';
import { saveFilesInAsync } from '@/utils';

interface MediaFile {
  uploaded?: boolean;
  [key: string]: unknown;
}

interface UseMediaArgs {
  saveCallback: (
    formData: unknown,
    config: { onUploadProgress: (progress: unknown) => void },
  ) => Promise<unknown>;
  deleteCallback: (files: MediaFile[]) => Promise<unknown>;
}

const showToast = AppToaster.show as (message: unknown, key?: string) => string;

const useMedia = ({ saveCallback, deleteCallback }: UseMediaArgs) => {
  const [files, setFiles] = useState<MediaFile[]>([]);
  const [deletedFiles, setDeletedFiles] = useState<MediaFile[]>([]);
  const toastKey = useRef<string>('');

  const openProgressToast = useCallback(
    (amount: number) => ({
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
      toastKey.current = showToast(openProgressToast(0));

      const saveAction = (
        formData: unknown,
        attachment: MediaFile,
        progressCallback: (progress: number) => void,
      ) => {
        return saveCallback(formData, {
          onUploadProgress: (progress) => {
            progressCallback(progress as number);
          },
        }).then((res) => {
          attachment.uploaded = true;
          return res;
        });
      };
      return (
        saveFilesInAsync(
          notUploadedFiles,
          saveAction,
          undefined,
        ) as unknown as {
          onProgress: (cb: (progress: number) => void) => unknown;
        }
      ).onProgress((progress) => {
        if (progress > 0) {
          showToast(openProgressToast(progress * 100), toastKey.current);
        }
      });
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
