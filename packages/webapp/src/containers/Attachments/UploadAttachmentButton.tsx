import {
  Button,
  Classes,
  Popover,
  PopoverInteractionKind,
} from '@blueprintjs/core';
import clsx from 'classnames';
import { Field, useFormikContext } from 'formik';
import styles from './UploadAttachmentButton.module.scss';
import { UploadAttachmentsPopoverContent } from './UploadAttachmentsPopoverContent';
import type { AttachmentFile } from './UploadAttachmentsPopoverContent';
import type { FieldProps } from 'formik';
import { FFormGroup } from '@/components';
import { transformToCamelCase, transfromToSnakeCase } from '@/utils';

interface AttachmentFormValues {
  attachments?: unknown[];
}

function UploadAttachmentButtonButtonContentField() {
  return (
    <Field name={'attachments'}>
      {({ form: { setFieldValue }, field: { value } }: FieldProps) => (
        <UploadAttachmentsPopoverContent
          value={transformToCamelCase(value) as AttachmentFile[]}
          onChange={(changedValue) => {
            setFieldValue(
              'attachments',
              transfromToSnakeCase(
                changedValue as unknown as Record<string, unknown>,
              ),
            );
          }}
        />
      )}
    </Field>
  );
}

export function UploadAttachmentButton() {
  const { values } = useFormikContext<AttachmentFormValues>();
  const uploadedFiles = values?.attachments?.length || 0;

  return (
    <FFormGroup
      name={'attachments'}
      label={'Attachments'}
      className={styles.attachmentField}
      fastField={true}
    >
      <Popover
        interactionKind={PopoverInteractionKind.CLICK}
        popoverClassName={clsx(styles.popover, Classes.POPOVER_CONTENT_SIZING)}
        placement={'top-start'}
        enforceFocus={false}
        autoFocus={false}
        content={<UploadAttachmentButtonButtonContentField />}
      >
        <Button className={styles.attachmentButton}>
          {uploadedFiles > 0 ? (
            <>Upload attachments ({uploadedFiles})</>
          ) : (
            <>Upload attachments</>
          )}
        </Button>
      </Popover>
    </FFormGroup>
  );
}
