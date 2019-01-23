import RoomService from '../services/RoomService';
import wrapAsync from '../utils/AsyncWrapper';
import { send } from './WebSocketController';

function parseRoom(room) {
  const parsedRoom = { ...room };
  parsedRoom.users = parsedRoom.users.map(user => ({ cuid: user.cuid, owner: user.owner }));
  return parsedRoom;
}

function parseRooms(rooms) {
  return rooms.map(room => (parseRoom(room)));
}

/**
 * Get all rooms
 * @param req
 * @param res
 * @returns void
 */
async function getRooms(req, res) {
  const rooms = await RoomService.getRooms();
  return res.status(200).json({ rooms: parseRooms(rooms) });
}

/**
 * Join a room
 * @param req
 * @param res
 * @returns void
 */
async function joinRoom(req, res) {
  const roomName = req.params.name;

  const room = await RoomService.getRoom(roomName);
  if (room) {
    if (room.users.find(user => user.cuid === req.user.cuid)) {
      return res.status(200).json({ room: parseRoom(room) });
    }

    room.users.push({ cuid: req.user.cuid, owner: false });
    try {
      await RoomService.updateRoom(roomName, room);
    } catch (error) {
      return res.status(202).json({ errors: [ 'The room is full' ] });
    }

    return res.status(200).json({ room: parseRoom(room) });
  }

  const newRoom = await RoomService.createRoom(roomName, req.user);
  return res.status(201).json({ room: parseRoom(newRoom) });
}

/**
 * Leave a room
 * @param req
 * @param res
 * @returns void
 */
async function leaveRoom(req, res) {
  const roomName = req.params.name;

  const room = await RoomService.getRoom(roomName);
  if (room) {
    if (room.users.find(user => user.cuid === req.user.cuid)) {
      room.users = room.users.filter(user => user.cuid !== req.user.cuid);
      await RoomService.updateRoom(roomName, room);
      return res.status(200).json({ room: parseRoom(room) });
    }

    return res.status(202).end();
  }

  return res.status(404).json({ errors: [ 'The room doesn\'t exist' ] });
}

/**
 * Get a room
 * @param req
 * @param res
 * @returns void
 */
async function getRoom(req, res) {
  const room = await RoomService.getRoom(req.params.name);
  if (room) return res.status(200).json({ room: parseRoom(room) });

  return res.status(404).json({ errors: [ 'The room doesn\'t exist' ] });
}

/**
 * Delete a room
 * @param req
 * @param res
 * @returns void
 */
async function deleteRoom(req, res) {
  const room = await RoomService.deleteRoom(req.params.name);
  if (room) return res.status(200).json({ room });

  return res.status(404).json({ errors: [ 'The room doesn\'t exist' ] });
}

/**
 * Connect the user to the room via websocket
 * @returns {Promise<void>}
 */
const WsRoomController = () => async (data, user, channel, conn) => {
  const room = await RoomService.getRoom(data.roomName);
  if (room) {
    if (room.users.find(userR => userR.cuid === user.cuid)) {
      room.users = room.users.map(userR => (userR.cuid !== user.cuid ? userR : { ...userR, conn }));

      await RoomService.updateRoom(data.roomName, room);
      send(conn, { ok: true }, channel);
    }
  }
};

export default {
  getRooms: wrapAsync(getRooms),
  joinRoom: wrapAsync(joinRoom),
  leaveRoom: wrapAsync(leaveRoom),
  getRoom: wrapAsync(getRoom),
  deleteRoom: wrapAsync(deleteRoom),
};

export { WsRoomController };
