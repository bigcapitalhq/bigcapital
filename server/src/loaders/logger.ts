import winston from 'winston';

const transports = {
  console: new winston.transports.Console({ level: 'warn' }),
  file: new winston.transports.File({ filename: 'stdout.log' }),
};

export default winston.createLogger({
  transports: [
    transports.console,
    transports.file,
  ],
});
