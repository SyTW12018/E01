import { Router } from 'express';
import RoleRequired from '../middlewares/RoleRequired';
import RoomController from '../controllers/RoomController';
import roomNameValidator from '../validators/RoomNameValidator';

const router = new Router();

// Join a room
router.post('/roomsRoutes/:name', roomNameValidator, RoomController.joinRoom);

// Get all roomsRoutes
router.get('/roomsRoutes', RoleRequired('admin'), RoomController.getRooms);

// Get one room by name
router.get('/roomsRoutes/:name',
  [ RoleRequired('admin'), roomNameValidator ],
  RoomController.getRoom);

// Delete a room
router.delete('/roomsRoutes/:name',
  [ RoleRequired('admin'), roomNameValidator ],
  RoomController.deleteRoom);

export default router;
