import { Router } from 'express';
import RoomController from '../controllers/RoomController';

const router = new Router();

// Get all rooms
router.get('/rooms', RoomController.getRooms);

// Get one room by name
router.get('/rooms/:name', RoomController.getRoom);

// Create a new room
router.post('/rooms', RoomController.createRoom);

// Delete a room
router.delete('/rooms/:name', RoomController.deleteRoom);

export default router;
