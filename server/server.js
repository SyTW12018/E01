/* eslint-disable no-console */

import path from 'path';
import express from 'express';
import sockjs from 'sockjs';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import methodOverride from 'method-override';
import users from './routes/UserRoutes';
import rooms from './routes/RoomRoutes';
import auth, { login, register, getCurrentUser } from './middlewares/AuthMiddleware';
import loginValidator from './validators/LoginValidator';
import registerUserValidator from './validators/RegisterUserValidator';

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
app.post('/login', loginValidator, login());
app.post('/signup', registerUserValidator, register());
app.get('/user', getCurrentUser());

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/videocon';

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(mongoUrl, { useNewUrlParser: true })
    .then(() => {
      console.log(`MongoDB connection open to ${mongoUrl}`);
    })
    .catch((error) => {
      if (error) {
        console.error(`Cannot connect to MongoDB on ${mongoUrl}`);
        process.exit(1);
      }
    });
}

app.use('/', users);
app.use('/', rooms);

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

// WebSocket server
const wsServer = sockjs.createServer();
wsServer.on('connection', (connection) => {
  console.log('Connected client');

  connection.on('data', (msg) => {
    console.log(`Data: ${msg}`);
    connection.write(msg);
  });
});

wsServer.installHandlers(server, { prefix: '/ws' });

export default app;
