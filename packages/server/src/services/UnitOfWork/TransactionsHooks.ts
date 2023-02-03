/**
 * @param {any} maybeTrx
 * @returns {maybeTrx is import('objection').TransactionOrKnex & { executionPromise: Promise<any> }}
 */
function checkIsTransaction(maybeTrx) {
  return Boolean(maybeTrx && maybeTrx.executionPromise);
}

/**
 * Wait for a transaction to be complete.
 * @param {import('objection').TransactionOrKnex} [trx]
 */
export async function waitForTransaction(trx) {
  return Promise.resolve(checkIsTransaction(trx) ? trx.executionPromise : null);
}

/**
 * Run a callback when the transaction is done.
 * @param {import('objection').TransactionOrKnex | undefined} trx
 * @param {Function} callback
 */
export function runAfterTransaction(trx, callback) {
  waitForTransaction(trx).then(
    () => {
      // If transaction success, then run action
      return Promise.resolve(callback()).catch((error) => {
        setTimeout(() => {
          throw error;
        });
      });
    },
    () => {
      // Ignore transaction error
    }
  );
}
