import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import {
  User
} from '../../models';
import {
  successResponse,
  errorResponse,
  uniqueId
} from '../../helpers';

export const getAllUsers = async (req, res) => {
  try {
    const page = req.params.page || 1;
    const limit = 2;
    const users = await User.findAndCountAll({
      order: [
        ['createdAt', 'DESC'],
        ['name', 'ASC']
      ],
      // offset: (page - 1) * limit,
      // limit,
    });
    return successResponse(req, res, {
      users
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// not yet
export const allAttendances = async (req, res) => {
  try {


  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

export const getUserById = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const [updated] = await User.update(req.body, {
      where: {
        id: id
      }
    });
    if (updated) {
      const updatedUser = await User.findOne({
        where: {
          id: id
        }
      });
      return res.status(200).json({
        user: updatedUser
      })
    }
    throw new Error("User not found");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}