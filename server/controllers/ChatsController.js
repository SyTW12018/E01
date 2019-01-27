import RoomService from '../services/RoomService';
import { send } from './WebSocketController';

async function messageReceived(data, user, channel) {
  const room = await RoomService.getRoom(data.roomName);
  if (room && data.content && data.content !== '') {
    const users = room.users.filter(roomUser => roomUser.cuid === user.cuid);

    if (users.length > 0) {
      room.users.forEach((roomUser) => {
        if (roomUser.conn) {
          const date = new Date();
          send(roomUser.conn, {
            ...data,
            time: date.toUTCString().replace(date.getUTCFullYear(), ''),
            sender: { cuid: user.cuid, name: user.name },
          }, channel);
        }
      });
    }
  }
}

export default () => messageReceived;
