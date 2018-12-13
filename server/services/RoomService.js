let roomsStorage = [];

/**
 * Get all roomsRoutes
 * @returns {Promise<Array>}
 */
async function getRooms() {
  return roomsStorage;
}

/**
 * Create a room
 * @param name
 * @param owner
 * @returns {Promise<{name: string, usersRoutes: {owner: boolean, cuid: string}[], dateAdded: Date}>}
 */
async function createRoom(name, owner) {
  const room = await getRoom(name);
  if (room) throw new Error('A room with that name already exists');

  const newRoom = {
    name,
    users: [ { cuid: owner.cuid, owner: true } ],
    dateAdded: new Date(),
  };
  roomsStorage.push(newRoom);
  return newRoom;
}

/**
 * Get room by name
 * @param name
 * @returns {Promise<*>}
 */
async function getRoom(name) {
  return (await getRooms()).find(room => room.name === name);
}

/**
 * Delete a room by name
 * @param name
 * @returns {Promise<*>}
 */
async function deleteRoom(name) {
  const room = await getRoom(name);

  if (!room) {
    return null;
  }

  roomsStorage = roomsStorage.filter(room => room.name !== name);
  return { name };
}

/**
 * Update a room
 * @param name
 * @param newRoom
 * @returns {Promise<*>}
 */
async function updateRoom(name, newRoom) {
  const oldRoom = await getRoom(name);

  if (!oldRoom) {
    return null;
  }

  // TODO validate newRoom, throw if not valid, ex. is full

  roomsStorage = roomsStorage.filter(room => room.name !== name);
  roomsStorage.push(newRoom);
  return { newRoom };
}

export default {
  getRooms,
  createRoom,
  getRoom,
  deleteRoom,
  updateRoom,
};
