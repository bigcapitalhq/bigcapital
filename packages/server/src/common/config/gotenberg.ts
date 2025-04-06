import { registerAs } from '@nestjs/config';

export default registerAs('gotenberg', () => ({
  url: process.env.GOTENBERG_URL,
  docsUrl: process.env.GOTENBERG_DOCS_URL,
}));
