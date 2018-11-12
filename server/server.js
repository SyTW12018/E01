import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import users from './routes/user.routes';
import rooms from './routes/room.routes';

// const fs = require('fs');

const app = express();
dotenv.config();

app.set('port', process.env.PORT || 3001);

// Express only serves static assets in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));
}

// Set native promises as mongoose promise
mongoose.Promise = global.Promise;

// MongoDB Connection
if (process.env.NODE_ENV !== 'test') {
  mongoose.connect(process.env.MONGO_URL || 'mongodb://localhost:27017/videocon').catch((error) => {
    if (error) {
      console.error('Cannot connect to MongoDB!'); // eslint-disable-line no-console
      // throw error;
    }
  });
}

app.use('/api', users);
app.use('/api', rooms);

app.listen(app.get('port'), () => {
  console.log(`Find the server at: http://localhost:${app.get('port')}/`); // eslint-disable-line no-console
});
