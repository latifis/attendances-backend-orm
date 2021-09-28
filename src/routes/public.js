// const { authJwt } = require("../middleware");

import express from 'express';
import validate from 'express-validation';

import * as adminController from '../controllers/user/user.controller';
import * as userValidator from '../controllers/user/user.validator';

const router = express.Router();

//= ===============================
// Public routes
//= ===============================

router.post(
  '/login',
  validate(userValidator.login),
  adminController.login,
);
router.post(
  '/register',
  validate(userValidator.register),
  adminController.register,
);

router.get(
  '/forgetPassword',
  adminController.forgetPassword
);

module.exports = router;
