// @ts-nocheck

import { Stepper } from '@/components/Stepper';
import { ImportFileUploadStep } from './ImportFileUploadStep';
import styles from './ImportStepper.module.scss';
import { useImportFileContext } from './ImportFileProvider';
import { ImportFileMapping } from './ImportFileMapping';
import { ImportFilePreview } from './ImportFilePreview';

export function ImportStepper() {
  const { step } = useImportFileContext();

  return (
    <Stepper active={step} classNames={{ content: styles.content }}>
      <Stepper.Step label={'File Upload'}>
        <ImportFileUploadStep />
      </Stepper.Step>

      <Stepper.Step label={'Mapping'}>
        <ImportFileMapping />
      </Stepper.Step>

      <Stepper.Step label={'Results'}>
        <ImportFilePreview />
      </Stepper.Step>
    </Stepper>
  );
}
