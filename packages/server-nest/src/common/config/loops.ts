
import { registerAs } from '@nestjs/config';

export default registerAs('loops', () => ({
  apiKey: process.env.LOOPS_API_KEY,
}));
