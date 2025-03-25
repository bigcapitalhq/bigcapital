export function sanitizeDatabaseName(dbName: string) {
  // Replace any character that is not alphanumeric or an underscore with an underscore
  return dbName.replace(/[^a-zA-Z0-9_]/g, '');
}
