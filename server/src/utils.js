import bcrypt from 'bcryptjs';

const hashPassword = (password) => new Promise((resolve) => {
  bcrypt.genSalt(10, (error, salt) => {
    bcrypt.hash(password, salt, (err, hash) => { resolve(hash); });
  });
});

const origin = (request) => `${request.protocol}://${request.hostname}`;

export {
  hashPassword,
  origin,
};
