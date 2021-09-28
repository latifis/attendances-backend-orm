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
        defaultValue: ""
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      isAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0
      },
      isApproved: {
        type: DataTypes.BOOLEAN,
        defaultValue: 0,
        allowNull: true,
      },
      isVerified: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
      },
      location: {
        type: DataTypes.FLOAT
      },
      createdAt: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Users');
  }
};