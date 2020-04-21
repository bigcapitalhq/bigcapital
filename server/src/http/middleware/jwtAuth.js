/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import SystemUser from '@/system/models/SystemUser';

const authMiddleware = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;
  const token = req.headers['x-access-token'] || req.query.token;

  const onError = () => { res.boom.unauthorized(); };

  if (!token) { return onError(); }

  const verify = new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        // eslint-disable-next-line no-underscore-dangle
        req.user = await SystemUser.query().findById(decoded._id);

        if (!req.user) {
          return onError();
        }
        resolve(decoded);
      }
    });
  });

  verify.then(() => { next(); }).catch(onError);
};
export default authMiddleware;
