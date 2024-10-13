'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // Define associations here if any
      User.hasMany(models.Transaction, { foreignKey: 'fromUserId' });
    }
  }

  // Initialize the User model
  User.init(
    {
      username: { type: DataTypes.STRING, allowNull: false, unique: true },
      password: { type: DataTypes.STRING, allowNull: false },
      balance: { type: DataTypes.DECIMAL(12, 3), allowNull: false, defaultValue: 0.00 }
    },
    {
      sequelize, // Ensure this is the passed sequelize instance
      modelName: 'User',
    }
  );

  return User;
};
