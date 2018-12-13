import RoomService from '../services/RoomService';

/**
 * Get all rooms
 * @param req
 * @param res
 * @returns void
 */
async function getRooms(req, res) {
  const rooms = await RoomService.getRooms();
  return res.status(200).json({ rooms });
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
      return res.status(200).json({ room });
    }

    room.users.push({ cuid: req.user.cuid, owner: false });
    try {
      await RoomService.updateRoom(roomName, room);
    } catch (error) {
      return res.status(202).json({ errors: [ 'The room is full' ] });
    }
    return res.status(200).json({ room });
  }

  const newRoom = await RoomService.createRoom(roomName, req.user);
  return res.status(201).json({ room: newRoom });
}

/**
 * Get a room
 * @param req
 * @param res
 * @returns void
 */
async function getRoom(req, res) {
  const room = await RoomService.getRoom(req.params.name);
  if (room) return res.status(200).json({ room });

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

export default {
  getRooms,
  joinRoom,
  getRoom,
  deleteRoom,
};
