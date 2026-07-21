import type { ReactNode } from 'react';
import styles from './ImportFileUploadStep.module.scss';

interface ImportFileContainerProps {
  children: ReactNode;
}

export function ImportFileContainer({ children }: ImportFileContainerProps) {
  return <div className={styles.content}>{children}</div>;
}
