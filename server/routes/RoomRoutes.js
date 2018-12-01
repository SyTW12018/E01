import { Router } from 'express';
import RoleRequired from '../middlewares/RoleRequired';
import RoomController from '../controllers/RoomController';

const router = new Router();

// Get all rooms
router.get('/rooms', RoleRequired('admin'), RoomController.getRooms);

// Get one room by name
router.get('/rooms/:name', RoleRequired('admin'), RoomController.getRoom);

// Create a new room
router.post('/rooms', RoleRequired('admin'), RoomController.createRoom);

// Delete a room
router.delete('/rooms/:name', RoleRequired('admin'), RoomController.deleteRoom);

export default router;
