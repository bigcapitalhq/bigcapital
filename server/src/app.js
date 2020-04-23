import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import i18n from 'i18n';
import rootPath from 'app-root-path';
import fileUpload from 'express-fileupload';
import '../config';
import '@/database/objection';
import routes from '@/http';

global.rootPath = rootPath.path;

const app = express();

i18n.configure({
  locales: ['en'],
  directory: `${__dirname}/resources/locale`,
});

// i18n init parses req for language headers, cookies, etc.
app.use(i18n.init);

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(helmet());
app.use(boom());
app.use(express.json());
app.use(fileUpload({
  createParentPath: true,
}));

routes(app);

export default app;
