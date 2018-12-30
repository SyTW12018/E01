import sockjs from 'sockjs';
import AuthService from '../services/AuthService';

const controllers = new Map();
const connections = new Map();

const invokeControllers = (channel, data, user) => {
  if (controllers.has(channel)) {
    controllers.get(channel).forEach(async (controller) => {
      await controller(data, user, channel);
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
          connections.set(user.cuid, conn);
          if (dataObj.channel) {
            invokeControllers(dataObj.channel, dataObj.data, user);
          } else {
            invokeControllers('*', dataObj.data, user);
          }
        } else {
          return conn.write(JSON.stringify({ errors: [ 'Authentication needed' ] }));
        }

        // return conn.write(JSON.stringify(dataObj));
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

const sendToUser = (user, data, channel) => {
  if (connections.has(user.cuid)) {
    const conn = connections.get(user.cuid);
    conn.write(JSON.stringify({ channel, data }));
  }
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

export { sendToUser };
