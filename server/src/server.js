import errorHandler from 'errorhandler';
import app from '@/app';

app.use(errorHandler);

const server = app.listen(app.get('port'), () => {
  console.log(
    '  App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env'),
  );
  console.log('  Press CTRL-C to stop');
});

export default server;
