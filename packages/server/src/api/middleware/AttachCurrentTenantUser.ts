import { Container } from 'typedi';
import { Request, Response } from 'express';

/**
 * Attach user to req.currentUser
 * @param {Request} req Express req Object
 * @param {Response} res  Express res Object
 * @param {NextFunction} next  Express next Function
 */
const attachCurrentUser = async (req: Request, res: Response, next: Function) => {
  const Logger = Container.get('logger');
  const { systemUserRepository } = Container.get('repositories');

  try {
    Logger.info('[attach_user_middleware] finding system user by id.');
    const user = await systemUserRepository.findOneById(req.token.id);

    if (!user) {
      Logger.info('[attach_user_middleware] the system user not found.');
      return res.boom.unauthorized();
    }
    if (!user.active) {
      Logger.info('[attach_user_middleware] the system user not found.');
      return res.boom.badRequest(
        'The authorized user is inactivated.',
        { errors: [{ type: 'USER_INACTIVE', code: 100, }] },
      );
    }
    // Delete password property from user object.
    Reflect.deleteProperty(user, 'password');
    req.user = user;
    return next();
  } catch (e) {
    Logger.error('[attach_user_middleware] error attaching user to req: %o', e);
    return next(e);
  }
};

export default attachCurrentUser;
