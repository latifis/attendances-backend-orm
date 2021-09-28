import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import axios from 'axios';
import { User } from '../../models';
import { successResponse, errorResponse, uniqueId } from '../../helpers';

export const register = async (req, res) => {
  try {
    const {
       name, username, email, password
    } = req.body;
    if (process.env.IS_GOOGLE_AUTH_ENABLE === 'true') {
      if (!req.body.code) {
        throw new Error('code must be defined');
      }
      const { code } = req.body;
      const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${
        process.env.GOOGLE_CAPTCHA_SECRET_SERVER
      }&response=${code}`;
      const response = await axios({
        method: 'post',
        url: customUrl,
        data: {
          secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
          response: code,
        },
        config: { headers: { 'Content-Type': 'multipart/form-data' } },
      });
      if (!(response && response.data && response.data.success === true)) {
        throw new Error('Google captcha is not valid');
      }
    }

    const user = await User.scope('withSecretColumns').findOne({
      where: { email },
    });
    if (user) {
      throw new Error('User already exists with same email');
    }
    const reqPass = crypto
      .createHash('md5')
      .update(password)
      .digest('hex');
    const payload = {
      name,
      username,
      email,
      password: reqPass,
      isVerified: false,
      verifyToken: uniqueId(),
    };

    const newUser = await User.create(payload);
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.scope('withSecretColumns').findOne({
      where: { email: req.body.email },
    });
    if (!user) {
      throw new Error('Incorrect Email');
    }
    const reqPass = crypto
      .createHash('md5')
      .update(req.body.password || '')
      .digest('hex');
    if (reqPass !== user.password) {
      throw new Error('Incorrect Password');
    }
    const token = jwt.sign(
      {
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET,
    );
    delete user.dataValues.password;
    return successResponse(req, res, { user, token });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

export const profile = async (req, res) => {
  try {
    const { user } = req.user;
    const userId = await User.findOne({ where: { id: user } });
    return successResponse(req, res, { userId });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

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

export const updateUserById = async (req, res) => {
  try {
    User.update(
      {
        name: req.body.name,
        phone: req.body.phone,
        password: req.body.password,
        avatar: req.body.avatar
      },
      { where: { id: req.params.id } }
    ).then((result) => res.json(result))
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

export const deleteUser = async (req, res) => {
  try {
    const {id} = req.params;
    const deleted = await User.destroy({
      where: {id: id}
    });
    if(deleted) {
      return res.status(204).send("User deleted");
    } throw new Error("User not found");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

// not yet
export const checkIn = async (req, res) => {
  try {
    
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

// not yet
export const checkOut = async (req, res) => {
  try {
    
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

// not yet
export const getLocation = async (req, res) => {
  try {
    
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

// not yet
export const forgetPassword = async (req, res) => {
  try {

  } catch (error) {
    return errorResponse(req, res, error.message);
  }
}

// not yet
export const resetPassword = async (req, res) => {
  try {
    const { userId } = req.user;
    const user = await User.scope('withSecretColumns').findOne({
      where: { id: userId },
    });

    const reqPass = crypto
      .createHash('md5')
      .update(req.body.oldPassword)
      .digest('hex');
    if (reqPass !== user.password) {
      throw new Error('Old password is incorrect');
    }

    const newPass = crypto
      .createHash('md5')
      .update(req.body.newPassword)
      .digest('hex');

    await User.update({ password: newPass }, { where: { id: user.id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
