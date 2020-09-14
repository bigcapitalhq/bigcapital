import { validationResult } from 'express-validator';

export default (req, res, next) => {
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) {
    return res.boom.badData(null, {
      code: 'validation_error',
      ...validationErrors,
    });
  }
  next();
}