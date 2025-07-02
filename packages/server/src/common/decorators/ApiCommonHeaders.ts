import { applyDecorators } from '@nestjs/common';
import { ApiHeader } from '@nestjs/swagger';

export function ApiCommonHeaders() {
  return applyDecorators(
    ApiHeader({
      name: 'Authorization',
      description:
        "Value must be 'Bearer <token>' where <token> is an API key prefixed with 'bc_' or a JWT token.",
      schema: { type: 'string', example: 'Bearer bc_1234567890abcdef' },
      required: true,
    }),
    ApiHeader({
      name: 'organization-id',
      description:
        'Required if Authorization is a JWT token. The organization ID to operate within.',
      required: true,
    }),
  );
}
