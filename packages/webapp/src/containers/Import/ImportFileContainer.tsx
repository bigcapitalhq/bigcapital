import styles from './ImportFileUploadStep.module.scss';
import type { ReactNode } from 'react';

interface ImportFileContainerProps {
  children: ReactNode;
}

export function ImportFileContainer({ children }: ImportFileContainerProps) {
  return <div className={styles.content}>{children}</div>;
}
