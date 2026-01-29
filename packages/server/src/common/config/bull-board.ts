import { registerAs } from '@nestjs/config';
import { parseBoolean } from '@/utils/parse-boolean';

export default registerAs('bullBoard', () => ({
  enabled: parseBoolean<boolean>(process.env.BULL_BOARD_ENABLED, false),
  username: process.env.BULL_BOARD_USERNAME,
  password: process.env.BULL_BOARD_PASSWORD,
}));
