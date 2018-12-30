/* eslint-disable no-console */

import path from 'path';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import methodOverride from 'method-override';
import usersRoutes from './routes/UserRoutes';
import roomsRoutes from './routes/RoomRoutes';
import authRoutes from './routes/AuthRoutes';
import auth from './middlewares/AuthMiddleware';
import wsController from './controllers/WebSocketController';
import ChatsController from './controllers/ChatsController';

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 3001);

if (process.env.DEBUG) app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());
app.use(methodOverride());
app.use(auth());

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/videocon';

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
      if (process.env.DEBUG) console.log(`MongoDB connection open to ${mongoUrl}`);
    })
    .catch((error) => {
      if (error) {
        console.error(`Cannot connect to MongoDB on ${mongoUrl}`);
        process.exit(1);
      }
    });
}

app.use('/', authRoutes);
app.use('/', usersRoutes);
app.use('/', roomsRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  // Redirect unknown requests to the react app
  app.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../client/build/index.html`));
  });
}

// Errors handling
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err) {
    // It can be a Runtime Error
    if (process.env.DEBUG) {
      console.error(`[DEBUG] ${err.stack}`);
      res.status(500).json({ errors: [ 'Unknown server error', err.stack ] });
    } else {
      res.status(500).json({ errors: [ 'Unknown server error' ] });
    }
  }
});

const server = app.listen(app.get('port'), () => {
  console.log(`${process.env.NODE_ENV === 'test' ? 'Test server' : 'Server'} running on port ${app.get('port')}`);
});

const wsServer = wsController(server);
wsServer.register('chats', ChatsController());

export default app;
