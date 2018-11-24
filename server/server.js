/* eslint-disable no-console */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import methodOverride from 'method-override';
import users from './routes/UserRoutes';
import rooms from './routes/RoomRoutes';
import auth from './middlewares/AuthMiddleware';

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 3001);

if (process.env.NODE_ENV === 'debug') app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json()); // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(cookieParser());
app.use(methodOverride());
app.use(expressValidator());
app.use(express.static('client/build'));
app.use(auth());

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

let mongoUrl;
if (process.env.NODE_ENV === 'test') {
  mongoUrl = process.env.MONGO_URL_TEST || 'mongodb://localhost:27017/videocon-test';
} else {
  mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/videocon';
}

// MongoDB Connection
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

app.use('/api', users);
app.use('/api', rooms);

// Errors handling
app.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
  if (err) {
    // It can be a Runtime Error
    if (process.env.NODE_ENV === 'debug') {
      console.error(err.stack);
      res.status(500).send(err.stack);
    } else {
      res.status(500).end();
    }
  }
});

app.listen(app.get('port'), () => {
  console.log(`${process.env.NODE_ENV === 'test' ? 'Test server' : 'Server'} running on port ${app.get('port')}`);
});

export default app;
