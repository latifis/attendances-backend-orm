const Joi = require("joi");

export const getOtherUserProfile = {
  body: {
    userId: Joi.number().required(),
  },
};

export const changePassword = {
  body: {
    oldPassword: Joi.string().required(),
    newPassword: Joi.string().required(),
  },
};

export const register = {
  body: {
    name: Joi.string().required(),
    username: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

export const login = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  },
};

export const updateUserById = {
  body: {
    name: Joi.string().required(),
    password: Joi.string().required(),
  }
}

export const location = {
  body: {
    //no need
  }
}

export const checkIn = {
  body: {
    //no need
  }
}

export const checkOut = {
  body: {
    //no need
  }
}
export const getLocation = {
  body: {
    latitude:Joi.string().required(),
    longitude:Joi.string().required()
  }
}
export const deleteUser = {
  body: {
    //no need
  }
}
export const resetPassword = {
  body: {
    password: Joi.string().required(),
    newPassword: Joi.string().required()
  }
}
