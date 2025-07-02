import * as bcrypt from 'bcrypt';
import { AuthApiKeyPrefix } from './Auth.constants';

export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve) => {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash: string) => {
        resolve(hash);
      });
    });
  });

/**
 * Extracts and validates an API key from the Authorization header
 * @param {string} authorization - Full authorization header content.
 */
export const getAuthApiKey = (authorization: string) => {
  const apiKey = authorization.toLowerCase().replace('bearer ', '').trim();
  return apiKey.startsWith(AuthApiKeyPrefix) ? apiKey : '';
};
