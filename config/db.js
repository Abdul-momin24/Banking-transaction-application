// config/db.js
const { Sequelize } = require('sequelize');
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: 'mysql',
  logging: false,
});

const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('MySQL connected');
  } catch (err) {
    console.error('Unable to connect to the database:', err);
    process.exit(1);
  }
};

sequelize.sync({ force: true }).then(() => {
  console.log("Database & tables created!");
});


module.exports = { sequelize, connectDB };
