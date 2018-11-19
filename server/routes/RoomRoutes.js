import { Router } from 'express';
import RoomController from '../controllers/RoomController';

const router = new Router();

// Get all rooms
router.route('/rooms').get(RoomController.getRooms);

// Get one room by name
router.route('/rooms/:name').get(RoomController.getRoom);

// Create a new room
router.route('/rooms').post(RoomController.createRoom);

// Delete a room
router.route('/rooms/:name').delete(RoomController.deleteRoom);

export default router;
