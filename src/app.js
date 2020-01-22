import express from 'express';
import morgan from 'morgan';
import errorHandler from './lib/middlewares/globalErrorHandler';
import { getUsersRouter } from './domains/users/users.routes';
import { getEventsRouter } from './domains/events/events.routes';


class App {
  routes = [];

  addApiRoute(route) {
    this.routes.push(route);
    return this;
  }

  createExpressApp() {
    const app = express();
    app.use(express.json());
    
    this.addApiRoute(getUsersRouter())
    this.addApiRoute(getEventsRouter())

    if (app.get('env') === 'development') {
      app.use(morgan('dev'));
    }

    if (this.routes.length !== 0) {
      this.routes.forEach(route => {
        app.use(route);
      });
    }

    // errorHandler should be added as the last middleware to the app
    app.use(errorHandler);

    return app;
  }

  start(config, logger) {
    const app = this.createExpressApp();

    // create app server and start it
    app.listen(config.port, () => {
      logger.info(`app running on port ${config.port}`);
    });
  }
}

const app = new App();
export default app;