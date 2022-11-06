// @ts-nocheck
import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import classNames from 'classnames';
import { Icon } from '@/components/Icon';
import intl from 'react-intl-universal';

// const initialFile: {
//   file: ?File,
//   preview: string,
//   metadata: ?object,
//   uploaded: boolean,
// };

export function Dragzone({
  text = intl.get('drag_drop_files_here_or_click_here'),
  onDrop,
  initialFiles = [],
  onDeleteFile,
  hint,
  className,
}) {
  const [files, setFiles] = useState([]);

  useEffect(() => {
    setFiles([...initialFiles]);
  }, [initialFiles]);

  const { getRootProps, getInputProps } = useDropzone({
    accept: 'image/*',
    onDrop: (acceptedFiles) => {
      const _files = acceptedFiles.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        uploaded: false,
      }));
      setFiles(_files);
    },
  });

  const handleRemove = useCallback(
    (index) => {
      const deletedFile = files.splice(index, 1);
      setFiles([...files]);
      onDeleteFile && onDeleteFile(deletedFile);
    },
    [files, onDeleteFile],
  );

  const thumbs = files.map((file, index) => (
    <div className={'dropzone-thumb'} key={file.name}>
      <div>
        <img src={file.preview} />
      </div>
      <button onClick={() => handleRemove(index)}>
        <Icon icon={'times'} iconSize={12} />
      </button>
    </div>
  ));

  useEffect(
    () => () => {
      files.forEach((file) => URL.revokeObjectURL(file.preview));
    },
    [files, onDrop],
  );

  useEffect(() => {
    onDrop && onDrop(files);
  }, [files, onDrop]);

  return (
    <section className={classNames('dropzone-container', className)}>
      {hint && <div class="dropzone-hint">{hint}</div>}

      <div {...getRootProps({ className: 'dropzone' })}>
        <input {...getInputProps()} />
        <p>{text}</p>
      </div>

      <div className={'dropzone-thumbs'}>{thumbs}</div>
    </section>
  );
}
