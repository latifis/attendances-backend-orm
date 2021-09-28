'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    avatar: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
    isApproved: DataTypes.BOOLEAN,
    isVerified: DataTypes.BOOLEAN,
    location: DataTypes.FLOAT
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};