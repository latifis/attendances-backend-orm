import express from 'express';
import * as userController from '../controllers/admin/admin.controller';

const router = express.Router();

//= ===============================
// Admin routes
//= ===============================
router.get(
    '/allUsers',
    userController.getAllUsers
);

router.get(
    '/allAttendances',
    userController.getAllAttendances
);

router.get(
    "/show/:detailId",
    userController.getUserById
);

module.exports = router;