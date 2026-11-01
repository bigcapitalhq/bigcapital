import clsx from 'classnames';
import styles from './BankAccountDataTable.module.scss';
import { DataTable } from '@/components';

interface BankAccountDataTableProps {
  className?: string;
  [key: string]: unknown;
}

export function BankAccountDataTable({
  className,
  ...props
}: BankAccountDataTableProps) {
  return (
    <DataTable
      {...props}
      className={clsx('table-constrant', styles.root, className)}
    />
  );
}
