import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import i18n from 'i18n';
import '../config';
import routes from '@/http';
import '@/models';

const app = express();

// i18n.configure({
//   // setup some locales - other locales default to en silently
//   locales: ['en'],

//   // sets a custom cookie name to parse locale settings from.
//   cookie: 'yourcookiename',

//   // where to store json files - defaults to './locales'
//   directory: `${__dirname}/resources/locale`,
// });

// i18n init parses req for language headers, cookies, etc.
// app.use(i18n.init);

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(helmet());
app.use(boom());
app.use(express.json());

routes(app);

export default app;
