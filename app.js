
const express = require('express');

const { connectDB } = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
if(process.env.NODE_ENV !== "production"){
    require("dotenv").config();
}

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
