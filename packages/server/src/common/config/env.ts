import { join } from 'path';

const SERVER_ENV_FILE_PATH = join(__dirname, '../../../.env');
const ROOT_ENV_FILE_PATH = join(__dirname, '../../../../../.env');

export const ENV_FILE_PATHS = [SERVER_ENV_FILE_PATH, ROOT_ENV_FILE_PATH];
