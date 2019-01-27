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
import { WsRoomController } from './controllers/RoomController';

const server = express();
dotenv.config();

server.set('port', process.env.PORT || 3001);

if (process.env.DEBUG) server.use(morgan('dev')); // log every request to the console
server.use(bodyParser.urlencoded({ extended: 'true' })); // parse application/x-www-form-urlencoded
server.use(bodyParser.json()); // parse application/json
server.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
server.use(cookieParser());
server.use(methodOverride());
server.use(auth());

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

server.use('/auth', authRoutes);
server.use('/', usersRoutes);
server.use('/', roomsRoutes);

if (process.env.NODE_ENV === 'production') {
  server.use(express.static('client/build'));

  // Redirect unknown requests to the react app
  server.get('*', (req, res) => {
    res.sendFile(path.join(`${__dirname}/../client/build/index.html`));
  });
}

// Errors handling
server.use((err, req, res, next) => { // eslint-disable-line no-unused-vars
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

const expressServer = server.listen(server.get('port'), () => {
  console.log(`${process.env.NODE_ENV === 'test' ? 'Test server' : 'Server'} running on port ${server.get('port')}`);
});

const wsServer = wsController(expressServer);
wsServer.register('rooms', WsRoomController());
wsServer.register('chats', ChatsController());

export default server;
