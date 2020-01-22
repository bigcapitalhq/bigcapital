import express from 'express';
import helmet from 'helmet';
import boom from 'express-boom';
import '../config';
import routes from '@/http';
import '@/models';

const app = express();

// Express configuration
app.set('port', process.env.PORT || 3000);

app.use(helmet());
app.use(boom());
app.use(express.json());

routes(app);

export default app;
