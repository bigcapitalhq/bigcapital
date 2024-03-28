import styles from './ImportFileUploadStep.module.scss';

interface ImportFileContainerProps {
  children: React.ReactNode;
}

export function ImportFileContainer({ children }: ImportFileContainerProps) {
  return <div className={styles.content}>{children}</div>;
}
