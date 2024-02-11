import { Router } from 'express';
import { verification } from '../Middleware/Verification.js';
import { createNotification, deleteNotification, getAllNotificationsByUser, getAllReadNotificationsByUser, getAllUnReadNotificationsByUser, readNotification } from '../Controllers/notificationController.js';
const notification = Router();

notification.post('/createNotification',verification, createNotification);
notification.delete('/deleteNotification/:id',verification, deleteNotification);
notification.put('/readNotification',verification, readNotification);
notification.get("/getAllNotificationsByUser/:user_id",verification,getAllNotificationsByUser)
notification.get("/getAllReadNotificationsByUser/:user_id",verification,getAllReadNotificationsByUser)
notification.get("/getAllUnReadNotificationsByUser/:user_id",verification,getAllUnReadNotificationsByUser)
export default notification;
