import sockjs from 'sockjs';
import AuthService from '../services/AuthService';

const controllers = new Map();

const invokeControllers = (channel, data, user, conn) => {
  if (controllers.has(channel)) {
    controllers.get(channel).forEach(async (controller) => {
      await controller(data, user, channel, conn);
    });
  }
};

const onConnection = (conn) => {
  conn.on('data', async (data) => {
    if (typeof data === 'string') {
      try {
        const dataObj = JSON.parse(data);
        const user = await AuthService.getUser(dataObj.authToken);

        if (user) {
          if (dataObj.channel) {
            invokeControllers(dataObj.channel, dataObj.data, user, conn);
          } else {
            invokeControllers('*', dataObj.data, user, conn);
          }
        } else {
          return conn.write(JSON.stringify({ errors: [ 'Authentication needed' ] }));
        }
      } catch (error) {
        return conn.write(JSON.stringify({ errors: [ error.message ] }));
      }
    }

    return null;
  });
};

const register = (channel, controller) => {
  if (controllers.has(channel)) {
    controllers.set(channel, [ ...controllers.get(channel), controller ]);
  } else {
    controllers.set(channel, [ controller ]);
  }
};

const send = (conn, data, channel) => {
  conn.write(JSON.stringify({ channel, data }));
};

const initialize = (server) => {
  const wsServer = sockjs.createServer();
  wsServer.on('connection', onConnection);

  wsServer.installHandlers(server, { prefix: '/ws' });
};

export default (server) => {
  initialize(server);
  return {
    register,
  };
};

export { send };
