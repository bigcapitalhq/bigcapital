import { Container } from 'typedi';
import { SystemUser } from '@/system/models';

/**
 * Attach user to req.currentUser
 * @param {Request} req Express req Object
 * @param {Response} res  Express res Object
 * @param {NextFunction} next  Express next Function
 */
const attachCurrentUser = async (req: Request, res: Response, next: Function) => {
  const Logger = Container.get('logger');

  try {
    Logger.info('[attach_user_middleware] finding system user by id.');
    const user = await SystemUser.query().findById(req.token.id);

    if (!user) {
      Logger.info('[attach_user_middleware] the system user not found.');
      return res.boom.unauthorized();
    }
    req.user = user;
    return next();
  } catch (e) {
    Logger.error('[attach_user_middleware] error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
