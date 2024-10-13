// controllers/transactionController.js
const { parse } = require('path');
const db = require('../models'); // Make sure the path is correct
const User = db.User;
const Transaction = db.Transaction;

exports.getBalance = async (req, res) => {
  console.log("get balamce", req.user);
  const userId = req.user.userId;
  try {
    const user = await User.findByPk(userId);
    res.json({ balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.credit = async(req,res)=>{
  const { amount } =req.body;
  const userId = req.user.userId;

  try{

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount)) {
    return res.status(400).json({ error: 'Invalid amount.' });
    }

    const user = await User.findByPk(userId);

    user.balance = parseFloat(user.balance)
    user.balance = user.balance + parsedAmount;

    await user.save();
    
    await Transaction.create({ transactionType: "credit", amount: parsedAmount, fromUserId: userId,toUserId: userId });
     res.json({ message: 'credit  successful', balance: user.balance });

  }catch(err){
    res.status(500).json({ error: err.message });
  }
}

exports.withdraw = async (req, res) => {
  const { amount } = req.body;
  const parsedAmount = parseFloat(amount);
  const userId = req.user.userId;

  try {
    // Error checking
    if (isNaN(parsedAmount)) {
    return res.status(400).json({ error: 'Invalid amount.' });
    }


    const user = await User.findByPk(userId);
    user.balance = parseFloat(user.balance);
    if (user.balance < parsedAmount) return res.status(400).json({ message: 'Insufficient funds' });

    user.balance = user.balance- parsedAmount;
    await user.save();

    await Transaction.create({ transactionType: 'withdrawal', amount: parsedAmount, fromUserId: userId });
    res.json({ message: 'Withdrawal successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.transfer = async (req, res) => {
  const { toUserId, amount } = req.body;
  const fromUserId = req.user.userId;

  try {
    const fromUser = await User.findByPk(fromUserId);
    const toUser = await User.findByPk(toUserId);

    if (!toUser) return res.status(404).json({ message: 'Recipient user not found' });

    fromUser.balance = parseFloat(fromUser.balance);
    amount = parseFloat(amount);
    
    // Erorr checking

    if (isNaN(amount)) {
    return res.status(400).json({ error: 'Invalid amount.' });
    }


    if (fromUser.balance < amount) return res.status(400).json({ message: 'Insufficient funds' });
    toUser.balance = parseFloat(toUser.balance);

    fromUser.balance -= amount;
    toUser.balance +=  amount;
    await fromUser.save();
    await toUser.save();

    await Transaction.create({ transactionType: 'transfer', amount, fromUserId, toUserId });
    res.json({ message: 'Transfer successful', balance: fromUser.balance });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};



exports.transactionHistory = async(req,res)=>{
  const userId = req.user.userId;

  try{
    const transactions = await Transaction.findAll({
      where:{
        [db.Sequelize.Op.or]: [
          { fromUserId: userId },
          { toUserId: userId }
        ]
      },
      include: [
        { model: User, as: 'sender', attributes: ['username'] },
        { model: User, as: 'recipient', attributes: ['username'] }
      ],
      order: [['createdAt', 'DESC']]
    });


    res.json({
      userId: userId,
      transactionHistory: transactions
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }};