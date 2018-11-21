/* eslint-disable no-console */

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import expressValidator from 'express-validator';
import bodyParser from 'body-parser';
import users from './routes/UserRoutes';
import rooms from './routes/RoomRoutes';

// const fs = require('fs');

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 3001);
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(bodyParser.json()); // support json encoded bodies
app.use(expressValidator());

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Example of middleware
/*
app.use((req, res, next) => {
  UsersService.addTemporalUser().then((user) => {
    req.user = user;
    next();
  });
});
*/

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

if (process.env.NODE_ENV !== 'test') {
  // MongoDB Connection
  mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/videocon', { useNewUrlParser: true })
    .catch((error) => {
      if (error) {
        console.error('Cannot connect to MongoDB!');
        // throw error;
      }
    });
}

app.use('/api', users);
app.use('/api', rooms);

/*
// Errors handling
app.use((err, req, res, next) => {
  // Specific for validation errors

  if (err) {
    if (err instanceof validation.ValidationError) {
      return res.status(err.status)
        .json(err);
    }

    // Other type of errors, it *might* also be a Runtime Error
    if (process.env.NODE_ENV !== 'production') {
      return res.status(500).send(err.stack);
    }

    return res.status(500);
  }

  return next();
});
*/

app.listen(app.get('port'), () => {
  console.log(`Server running at: http://localhost:${app.get('port')}/`);
});
