import RoomService from '../services/RoomService';
import { sendToUser } from './WebSocketController';

async function messageReceived(data, user) {
  const room = await RoomService.getRoom(data.room);
  if (room) {
    const users = room.users.filter(roomUser => roomUser.cuid === user.cuid);

    if (!users.empty()) {
      room.users.forEach((user) => {
        sendToUser(user, data.msg);
      });
    }
  }
}

export default () => messageReceived;
