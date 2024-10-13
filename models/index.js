'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require('../config/config.json')[process.env.NODE_ENV || 'development'];
const db = {};

// Initialize Sequelize instance
const sequelize = new Sequelize(config.database, config.username, config.password, config);

// Load models dynamically
fs.readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model; // Store models in the db object
  });

// Associate models if defined
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db); // Call associate method for each model
  }
});

db.sequelize = sequelize; // Add sequelize instance to db object
db.Sequelize = Sequelize;  // Add Sequelize constructor to db object

module.exports = db; // Export the db object containing all models
