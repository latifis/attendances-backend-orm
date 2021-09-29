'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user"
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "username"
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "user@gmail.com"
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "userpass"
    },
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    verifiedToken: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "123"
    },
    isAdmin: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    isApproved: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: 0
    },
    latitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: -112256432
    },
    longitude: {
      type: DataTypes.FLOAT,
      allowNull: true,
      defaultValue: -121456432
    },
  }, {});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};