import { TransactionsLockingGuard } from './TransactionsLockingGuard';

describe('TransactionsLockingGuard', () => {
  const buildGuard = (transactionLocking) => {
    const transactionsLockingRepo = {
      getTransactionsLocking: jest.fn().mockResolvedValue(transactionLocking),
    };
    const guard = new TransactionsLockingGuard(transactionsLockingRepo as any);
    return { guard, transactionsLockingRepo };
  };

  it('should not lock a transaction date inside the unlock window', async () => {
    const { guard } = buildGuard({
      isEnabled: true,
      lockToDate: '2024-06-30',
      unlockFromDate: '2024-01-01',
      unlockToDate: '2024-01-10',
    });

    await expect(guard.isTransactionsLocking('2024-01-05')).resolves.toBe(
      false,
    );
  });

  it('should not lock a transaction date on the unlock to date boundary', async () => {
    const { guard } = buildGuard({
      isEnabled: true,
      lockToDate: '2024-06-30',
      unlockFromDate: '2024-01-01',
      unlockToDate: '2024-01-10',
    });

    await expect(guard.isTransactionsLocking('2024-01-10')).resolves.toBe(
      false,
    );
  });

  it('should not lock a transaction date on the unlock from date boundary', async () => {
    const { guard } = buildGuard({
      isEnabled: true,
      lockToDate: '2024-06-30',
      unlockFromDate: '2024-01-01',
      unlockToDate: '2024-01-10',
    });

    await expect(guard.isTransactionsLocking('2024-01-01')).resolves.toBe(
      false,
    );
  });

  it('should lock a transaction date within the locking date but outside the unlock window', async () => {
    const { guard } = buildGuard({
      isEnabled: true,
      lockToDate: '2024-06-30',
      unlockFromDate: '2024-01-01',
      unlockToDate: '2024-01-10',
    });

    await expect(guard.isTransactionsLocking('2024-02-01')).resolves.toBe(true);
  });

  it('should lock a transaction date when no unlock window is defined', async () => {
    const { guard } = buildGuard({
      isEnabled: true,
      lockToDate: '2024-06-30',
      unlockFromDate: null,
      unlockToDate: null,
    });

    await expect(guard.isTransactionsLocking('2024-02-01')).resolves.toBe(true);
  });

  it('should not lock a transaction date when locking is disabled', async () => {
    const { guard } = buildGuard({
      isEnabled: false,
      lockToDate: '2024-06-30',
      unlockFromDate: null,
      unlockToDate: null,
    });

    await expect(guard.isTransactionsLocking('2024-02-01')).resolves.toBe(
      false,
    );
  });
});
