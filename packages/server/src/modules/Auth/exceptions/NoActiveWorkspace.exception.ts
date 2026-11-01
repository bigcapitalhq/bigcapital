import { UnauthorizedException } from '@nestjs/common';

export class NoActiveWorkspaceException extends UnauthorizedException {
  constructor() {
    super({
      message:
        'No active workspace available. Please contact the administrator.',
      errors: [{ type: 'ORGANIZATION.INACTIVE' }],
    });
  }
}
