import { Router } from 'express';
import RoleRequired from '../middlewares/RoleRequired';
import RoomController from '../controllers/RoomController';
import roomNameValidator from '../validators/RoomNameValidator';

const router = new Router();

// Join a room
router.post('/rooms/:name', roomNameValidator, RoomController.joinRoom);

// Leave a room
router.patch('/rooms/:name', roomNameValidator, RoomController.leaveRoom);

// Get all rooms
router.get('/rooms', RoleRequired('admin'), RoomController.getRooms);

// Get one room by name
router.get('/rooms/:name',
  [ RoleRequired('admin'), roomNameValidator ],
  RoomController.getRoom);

// Delete a room
router.delete('/rooms/:name',
  [ RoleRequired('admin'), roomNameValidator ],
  RoomController.deleteRoom);

export default router;
