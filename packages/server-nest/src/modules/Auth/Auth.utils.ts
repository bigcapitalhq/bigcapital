import * as bcrypt from 'bcrypt';

export const hashPassword = (password: string): Promise<string> =>
  new Promise((resolve) => {
    bcrypt.genSalt(10, (error, salt) => {
      bcrypt.hash(password, salt, (err, hash: string) => {
        resolve(hash);
      });
    });
  });
