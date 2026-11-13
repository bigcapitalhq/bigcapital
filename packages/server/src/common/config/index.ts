import app from './app';
import auth from './auth';
import systemDatabase from './system-database';
import tenantDatabase from './tenant-database';
import signup from './signup';
import gotenberg from './gotenberg';
import plaid from './plaid';
import s3 from './s3';
import openExchange from './open-exchange';
import posthog from './posthog';
import stripePayment from './stripe-payment';
import stripeBilling from './stripe-billing';
import signupConfirmation from './signup-confirmation';
import signupRestrictions from './signup-restrictions';
import jwt from './jwt';
import google from './google';
import mail from './mail';
import sms from './sms';
import loops from './loops';
import bankfeed from './bankfeed';
import throttle from './throttle';
import cloud from './cloud';
import redis from './redis';
import queue from './queue';
import bullBoard from './bull-board';
import clickhouse from './clickhouse';
import twoFactor from './two-factor';

export const config = [
  app,
  auth,
  systemDatabase,
  cloud,
  tenantDatabase,
  signup,
  gotenberg,
  plaid,
  s3,
  openExchange,
  posthog,
  stripePayment,
  stripeBilling,
  signupConfirmation,
  signupRestrictions,
  jwt,
  google,
  mail,
  sms,
  loops,
  bankfeed,
  throttle,
  redis,
  queue,
  bullBoard,
  clickhouse,
  twoFactor,
];
