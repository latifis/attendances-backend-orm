'use strict';
module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
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
      location: {
        type: DataTypes.FLOAT,
        allowNull: true,
        defaultValue: -123456432
      },
      createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      },
      updatedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: new Date()
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};