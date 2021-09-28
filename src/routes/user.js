var express = require("express");
import validate from 'express-validation';

import * as userController from '../controllers/user/user.controller';
import * as userValidator from '../controllers/user/user.validator';

const router = express.Router();

router.get(
    '/:userId',
    userController.getUserById
);

router.put(
    '/:userId',
    validate(userValidator.updateUserById),
    userController.updateUserById
);

router.delete(
    '/deleteUser',
    validate(userValidator.deleteUser),
    userController.deleteUser
);

router.post(
    '/checkin',
    validate(userValidator.checkIn),
    userController.checkIn
);

router.post(
    '/checkout',
    validate(userValidator.checkOut),
    userController.checkOut
);

router.post(
    '/resetPassword',
    validate(userValidator.resetPassword),
    userController.resetPassword,
);

router.get(
    '/location',
    validate(userValidator.getLocation),
    userController.getLocation);
module.exports = router;