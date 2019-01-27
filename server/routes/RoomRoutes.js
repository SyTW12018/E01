import { Router } from 'express';
import RoleRequired from '../middlewares/RoleRequired';
import RoomController from '../controllers/RoomController';
import roomNameValidator from '../validators/RoomNameValidator';

const RoomRoutes = new Router();

// Join a room
RoomRoutes.post('/rooms/:name', roomNameValidator, RoomController.joinRoom);

// Leave a room
RoomRoutes.patch('/rooms/:name', roomNameValidator, RoomController.leaveRoom);

// Get all rooms
RoomRoutes.get('/rooms', RoleRequired('admin'), RoomController.getRooms);

// Get one room by name
RoomRoutes.get('/rooms/:name',
  [ RoleRequired('admin'), roomNameValidator ],
  RoomController.getRoom);

// Delete a room
RoomRoutes.delete('/rooms/:name',
  [ RoleRequired('admin'), roomNameValidator ],
  RoomController.deleteRoom);

export default RoomRoutes;
