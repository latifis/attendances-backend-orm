import jwt from "jsonwebtoken";
import crypto from "crypto";
import axios from "axios";
import {
  User
} from "../../models";
import {
  successResponse,
  errorResponse,
  uniqueId
} from "../../helpers";

const nodemailer = require("nodemailer")
const {
  google
} = require("googleapis")

const CLIENT_ID = "990618082111-ff735j3j5bc1222m0qc4h1bhqr67pomt.apps.googleusercontent.com"
const CLIENT_SECRET = "5SZD6sV1Bp_O83kHFX0iveXk"
const REDIRECT_URI = "https://developers.google.com/oauthplayground"
const REFRESH_TOKEN =
  "1//0422SCXweBnP3CgYIARAAGAQSNwF-L9IrzLe-gd7fmhwtAxvhd0f61vYVRkIHSwMrU5L9LHldaipe9M8J-7PFYfNQTmqxjTYeBoc"
const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI)
oAuth2Client.setCredentials({
  refresh_token: REFRESH_TOKEN
})

export const register = async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      verifiedToken
    } = req.body;
    if (process.env.IS_GOOGLE_AUTH_ENABLE === "true") {
      if (!req.body.code) {
        throw new Error("code must be defined");
      }
      const {
        code
      } = req.body;
      const customUrl = `${process.env.GOOGLE_CAPTCHA_URL}?secret=${process.env.GOOGLE_CAPTCHA_SECRET_SERVER}&response=${code}`;
      const response = await axios({
        method: "post",
        url: customUrl,
        data: {
          secret: process.env.GOOGLE_CAPTCHA_SECRET_SERVER,
          response: code,
        },
        config: {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        },
      });
      if (!(response && response.data && response.data.success === true)) {
        throw new Error("Google captcha is not valid");
      }
    }

    const user = await User.findOne({
      where: {
        email
      },
    });
    if (user) {
      throw new Error("User already exists with same email");
    }
    const reqPass = crypto.createHash("md5").update(password).digest("hex");
    const payload = {
      name,
      username,
      email,
      password: reqPass,
      isVerified: false,
      verifiedToken: uniqueId(),
    };

    const newUser = await User.create(payload);
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// .scope("withSecretColumns")

export const login = async (req, res) => {
  try {
    const {
      email,
      verifiedToken
    } = req.body;
    const user = await User.findOne({
      where: {
        email
      },
    });
    if (!user) {
      throw new Error("Incorrect Email!");
    }
    const reqPass = crypto
      .createHash("md5")
      .update(req.body.password || "")
      .digest("hex");
    if (reqPass !== user.password) {
      throw new Error("Incorrect Password");
    }
    const token = jwt.sign({
        user: {
          userId: user.id,
          email: user.email,
          createdAt: new Date(),
        },
      },
      process.env.SECRET
    );
    delete user.dataValues.password;
  

    if(!user.isVerified){
      async function sendMail() {
        try {
          const accessToken = await oAuth2Client.getAccessToken()
  
          const transport = nodemailer.createTransport({
            service: "Gmail",
            auth: {
              type: 'OAuth2',
              user: 'testingalvi@gmail.com',
              clientId: CLIENT_ID,
              clientSecret: CLIENT_SECRET,
              refreshToken: REFRESH_TOKEN,
              accessToken: accessToken,
            }
          })
  
          const mailOptions = {
            from: 'TESTINGALVI 🗿 <testingalvi@gmail.com>',
            to: email,
            subject: `Hello ${user.username}`,
            text: '<h1>Hello from gmail email using API</h1>',
            html: `Verify token <link>${token}<link>`
          };
  
          const result = await transport.sendMail(mailOptions)
          return result
  
        } catch (error) {
          return error
        }
      }
      sendMail().then(result => console.log("Email sent...", result))
        .catch(error => console.log(error.message))
  
    }

    return successResponse(req, res, {
      user,
      verifiedToken: token
    });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// not yet
export const forgetPassword = async (req, res) => {
  const {
    email
  } = req.body;

  User.findOne({
    email
  }, (err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User with this email already exists."
      });
    }

    const token = jwt.sign({
      name,
      email,
      password
    }, process.env.JWT_ACC_ACTIVATE, {
      expiresIn: "20m"
    });
    const data = {
      from: 'testingalvi@gmail.com',
      to: email,
      subject: `Account Activation Link',
      html: '<h2>Please click on given link to activate your account</h2><p>${process.env.CLIENT_URL}/authentication/activate${token}</p>`
    }
  })
};

export const userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

export const profile = async (req, res) => {
  try {
    const {
      user
    } = req.user;
    const userId = await User.findOne({
      where: {
        id: user
      }
    });
    return successResponse(req, res, {
      userId
    });
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
        id: id,
      },
    });
    if (updated) {
      const updatedUser = await User.findOne({
        where: {
          id: id,
        },
      });
      return res.status(200).json({
        user: updatedUser,
      });
    }
    throw new Error("User not found");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const updateUserById = async (req, res) => {
  try {
    User.update({
      name: req.body.name,
      phone: req.body.phone,
      password: req.body.password,
      avatar: req.body.avatar,
    }, {
      where: {
        id: req.params.id
      }
    }).then((result) => res.json(result));
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const deleteUser = async (req, res) => {
  try {
    const {
      id
    } = req.params;
    const deleted = await User.destroy({
      where: {
        id: id
      },
    });
    if (deleted) {
      return res.status(204).send("User deleted");
    }
    throw new Error("User not found");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// not yet
export const checkIn = async (req, res) => {
  try {
    return res.status(200).send("todos");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// not yet
export const checkOut = async (req, res) => {
  try {
    return res.status(200).send("checkout");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

// not yet
export const getLocation = async (req, res) => {
  try {
    return res.status(200).send("todos");
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};



// not yet
export const resetPassword = async (req, res) => {
  try {
    const {
      userId
    } = req.user;
    const user = await User.scope("withSecretColumns").findOne({
      where: {
        id: userId
      },
    });

    const reqPass = crypto
      .createHash("md5")
      .update(req.body.oldPassword)
      .digest("hex");
    if (reqPass !== user.password) {
      throw new Error("Old password is incorrect");
    }

    const newPass = crypto
      .createHash("md5")
      .update(req.body.newPassword)
      .digest("hex");

    await User.update({
      password: newPass
    }, {
      where: {
        id: user.id
      }
    });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};