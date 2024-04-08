import { NextFunction, Request, Response } from 'express';
import {
  CheckViolationError,
  DBError,
  DataError,
  ForeignKeyViolationError,
  NotFoundError,
  NotNullViolationError,
  UniqueViolationError,
  ValidationError,
} from 'objection';

// In this example `res` is an express response object.
export default function ObjectionErrorHandlerMiddleware(err: Error, req: Request, res: Response, next: NextFunction) {
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
  }
  next(err);
}
