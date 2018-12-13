import { Router } from 'express';
import RoleRequired from '../middlewares/RoleRequired';
import RoomController from '../controllers/RoomController';

const router = new Router();

// Join a room
router.post('/rooms/:name', RoomController.joinRoom);

// Get all rooms
router.get('/rooms', RoleRequired('admin'), RoomController.getRooms);

// Get one room by name
router.get('/rooms/:name', RoleRequired('admin'), RoomController.getRoom);

// Delete a room
router.delete('/rooms/:name', RoleRequired('admin'), RoomController.deleteRoom);

export default router;
