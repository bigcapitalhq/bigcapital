import systemDatabase from './system-database';
import tenantDatabase from './tenant-database';
import signup from './signup';
import gotenberg from './gotenberg';
import plaid from './plaid';
import lemonsqueezy from './lemonsqueezy';
import s3 from './s3';
import openExchange from './open-exchange';
import posthog from './posthog';
import stripePayment from './stripe-payment';
import signupConfirmation from './signup-confirmation';
import signupRestrictions from './signup-restrictions';
import jwt from './jwt';
import mail from './mail';
import loops from './loops';
import bankfeed from './bankfeed';
import throttle from './throttle';
import cloud from './cloud';

export const config = [
  systemDatabase,
  cloud,
  tenantDatabase,
  signup,
  gotenberg,
  plaid,
  lemonsqueezy,
  s3,
  openExchange,
  posthog,
  stripePayment,
  signupConfirmation,
  signupRestrictions,
  jwt,
  mail,
  loops,
  bankfeed,
  throttle,
];
