import jwt from 'jsonwebtoken';
import User from '@/models/User';

const authMiddleware = (req, res, next) => {
  const token = req.headers['x-access-token'] || req.query.token;

  const onError = () => res.status(401).send({
    success: false,
    message: 'unauthorized',
  });

  if (!token) {
    return onError();
  }
  const { JWT_SECRET_KEY } = process.env;

  const verify = new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET_KEY, async (error, decoded) => {
      if (error) {
        reject(error);
      } else {
        req.user = await User.where('id', decoded._id).fetch();

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
