import path from 'path';
import dotenv from 'dotenv';
import errorHandler from 'errorhandler';
import app from './http/app';

dotenv.config({
  path: path.join(__dirname, '.env') 
});

app.use(errorHandler);

const server = app.listen(app.get('port'), () => {
  console.log(
    "  App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env")
  );
  console.log("  Press CTRL-C to stop\n");
});
 
export default server;
