import JWT from 'jsonwebtoken';
import { ISystemUser } from '@/interfaces';
import config from '@/config';

interface IExtendedSystemUser extends ISystemUser {
  oidc_access_token?: string;
  oidc_id_token?: string;
  oidc_refresh_token?: string;
}

/**
 * Generates JWT token for the given user.
 * @param {IExtendedSystemUser} user
 * @return {string} token
 */
export const generateToken = (user: IExtendedSystemUser): string => {
  const today = new Date();
  const exp = new Date(today);
  exp.setDate(today.getDate() + 60);

  return JWT.sign(
    {
      id: user.id, // We are gonna use this in the middleware 'isAuth'
      exp: exp.getTime() / 1000,
      oidc_access_token: user.oidc_access_token,
      oidc_id_token: user.oidc_id_token,
      oidc_refresh_token: user.oidc_refresh_token,
    },
    config.jwtSecret
  );
};
