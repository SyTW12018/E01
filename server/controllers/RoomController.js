import cuid from 'cuid';
import slug from 'limax';
import sanitizeHtml from 'sanitize-html';

// TODO almacenar las salas en memoria siguiendo el modelo propuesto

/**
 * Get all rooms
 * @param req
 * @param res
 * @returns void
 */
function getRooms(req, res) {
  // TODO obtener salas
  res.json({ errors: 'not implemented yet' });
}

/**
 * Create a room
 * @param req
 * @param res
 * @returns void
 */
function createRoom(req, res) {
  // TODO crear sala
  res.json({ errors: 'not implemented yet' });
}

/**
 * Get a room
 * @param req
 * @param res
 * @returns void
 */
function getRoom(req, res) {
  // TODO obtener una sala por su nombre
  res.json({ errors: 'not implemented yet' });
}

/**
 * Delete a room
 * @param req
 * @param res
 * @returns void
 */
function deleteRoom(req, res) {
  // TODO eliminar sala
  res.json({ errors: 'not implemented yet' });
}

export default {
  getRooms,
  createRoom,
  getRoom,
  deleteRoom,
};
