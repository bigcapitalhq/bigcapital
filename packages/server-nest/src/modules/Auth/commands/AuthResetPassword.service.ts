import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthResetPasswordService {
  resetPassword(token: string, password: string): Promise<{ message: string }> {
    return new Promise((resolve) => {
      resolve({ message: 'Reset password link sent to your email' });
    });
  }
}
