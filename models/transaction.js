// models/transaction.js
'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Transaction extends Model {
    static associate(models) {
      Transaction.belongsTo(models.User, { foreignKey: 'fromUserId', as: 'sender' });
      Transaction.belongsTo(models.User, { foreignKey: 'toUserId', as: 'recipient' });
    }
  }
  Transaction.init({
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    fromUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'User', // Ensure this matches your actual table name
        key: 'id',
      },
    },
    toUserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users', // Ensure this matches your actual table name
        key: 'id',
      },
    }},
    { sequelize, modelName: 'Transaction' }
  );
  return Transaction;
};
