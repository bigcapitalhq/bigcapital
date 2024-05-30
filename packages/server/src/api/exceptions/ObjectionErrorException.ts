import { Request, Response, NextFunction } from 'express';
import {
  ValidationError,
  NotFoundError,
  DBError,
  UniqueViolationError,
  NotNullViolationError,
  ForeignKeyViolationError,
  CheckViolationError,
  DataError,
} from 'objection';

/**
 * Handles the Objection error exception.
 * @param {Error} err
 * @param {Request} req
 * @param {Response} res
 * @param {NextFunction} next
 */
export function ObjectionErrorException(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err instanceof ValidationError) {
    switch (err.type) {
      case 'ModelValidation':
        return res.status(400).send({
          message: err.message,
          type: err.type,
          data: err.data,
        });
      case 'RelationExpression':
        return res.status(400).send({
          message: err.message,
          type: 'RelationExpression',
          data: {},
        });

      case 'UnallowedRelation':
        return res.status(400).send({
          message: err.message,
          type: err.type,
          data: {},
        });

      case 'InvalidGraph':
        return res.status(400).send({
          message: err.message,
          type: err.type,
          data: {},
        });

      default:
        return res.status(400).send({
          message: err.message,
          type: 'UnknownValidationError',
          data: {},
        });
    }
  } else if (err instanceof NotFoundError) {
    return res.status(404).send({
      message: err.message,
      type: 'NotFound',
      data: {},
    });
  } else if (err instanceof UniqueViolationError) {
    return res.status(409).send({
      message: err.message,
      type: 'UniqueViolation',
      data: {
        columns: err.columns,
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof NotNullViolationError) {
    return res.status(400).send({
      message: err.message,
      type: 'NotNullViolation',
      data: {
        column: err.column,
        table: err.table,
      },
    });
  } else if (err instanceof ForeignKeyViolationError) {
    return res.status(409).send({
      message: err.message,
      type: 'ForeignKeyViolation',
      data: {
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof CheckViolationError) {
    return res.status(400).send({
      message: err.message,
      type: 'CheckViolation',
      data: {
        table: err.table,
        constraint: err.constraint,
      },
    });
  } else if (err instanceof DataError) {
    return res.status(400).send({
      message: err.message,
      type: 'InvalidData',
      data: {},
    });
  } else if (err instanceof DBError) {
    return res.status(500).send({
      message: err.message,
      type: 'UnknownDatabaseError',
      data: {},
    });
  } else {
    next(err);
  }
}
