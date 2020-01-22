/* eslint-disable consistent-return */
import jwt from 'jsonwebtoken';
import User from '@/models/User';
// import Auth from '@/models/Auth';

const authMiddleware = (req, res, next) => {
  const { JWT_SECRET_KEY } = process.env;
  const token = req.headers['x-access-token'] || req.query.token;

  const onError = () => {
    // Auth.loggedOut();
    res.status(401).send({
      success: false,
      message: 'unauthorized',
    });
  };

  if (!token) {
    return onError();
  }

  const verify = new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        // eslint-disable-next-line no-underscore-dangle
        req.user = await User.query().findById(decoded._id);
        // Auth.setAuthenticatedUser(req.user);

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
