import styles from './MoneyDisplay.module.scss';

interface MoneyDisplayProps {
  children: React.ReactNode;
}

export function MoneyDisplay({ children }: MoneyDisplayProps) {
  return <span className={styles.root}>{children}</span>;
}
