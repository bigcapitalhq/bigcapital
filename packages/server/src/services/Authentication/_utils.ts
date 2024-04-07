import config from '@/config';
import { ISystemUser } from '@/interfaces';
import JWT from 'jsonwebtoken';

/**
 * Generates JWT token for the given user.
 * @param {ISystemUser} user
 * @return {string} token
 */
export const generateToken = (user: ISystemUser): string => {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return JWT.sign(
    {
      id: user.id, // We are gonna use this in the middleware 'isAuth'
      exp: exp.getTime() / 1000,
    },
    config.jwtSecret,
  );
};
