/**
 * Get schema-aware query builder for a given table and schema name.
 * @param {Knex} trxOrKnex -
 * @param {string} tableName -
 * @param {string} schemaName -
 * @returns {string}
 */
export function getTable(trx, tableName: string, schemaName = null) {
  return schemaName ? trx(tableName).withSchema(schemaName) : trx(tableName);
}

/**
 * Get schema-aware table name.
 * @param {string} tableName -
 * @returns {string}
 */
export function getTableName(tableName: string, schemaName = null): string {
  return schemaName ? `${schemaName}.${tableName}` : tableName;
}

/**
 * Retrieve the lock table name from given migration table name.
 * @param {string} tableName
 * @returns {string}
 */
export function getLockTableName(tableName: string): string {
  return `${tableName}_lock`;
}

/**
 * Retrieve the lock table name from given migration table name with schema.
 * @param {string} tableName
 * @param {string} schemaName
 * @returns {string}
 */
export function getLockTableNameWithSchema(
  tableName: string,
  schemaName = null
): string {
  return schemaName
    ? `${schemaName} + ${getLockTableName(tableName)}`
    : getLockTableName(tableName);
}
