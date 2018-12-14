import sockjs from 'sockjs';

const onConnection = (conn) => {
  conn.on('data', (data) => {
    if (typeof data === 'string') {
      try {
        const dataObj = JSON.parse(data);

        if (dataObj && dataObj.authToken) {
          // TODO autentificar
        } else {
          throw new Error('');
        }


        conn.write(JSON.stringify(dataObj));
      } catch (error) {
        conn.write(JSON.stringify({ errors: [ error.message ] }));
      }
    }
  });
};


const initialize = (server) => {
  const wsServer = sockjs.createServer();
  wsServer.on('connection', onConnection);

  wsServer.installHandlers(server, { prefix: '/ws' });
};

export default server => initialize(server);
