const Razorpay = require('razorpay');
const Order = require('../models/premium');
const Expense = require('../models/expense');
const User = require('../models/user');
const userController = require('./user');
const dotenv  = require('dotenv');

const result = dotenv.config();

exports.buyPremium = async (req, res) => {
    try {
        
        var razorpay = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        const amount = 2500;
         
        
        razorpay.orders.create({amount, currency: "INR"}, (err, order) => {
            if(err) {
                throw new Error(JSON.stringify(err));
            }
        
          
            const promise = Order.create({ orderId: order.id, status: 'Pending', userId: req.user.id})
                        .then(() => {
                            return res.status(201).json({ order, key_id : razorpay.key_id});
                        }).catch(err => {
                            throw new Error(err);
                        })
                
      })

    }catch(err){
        console.log('Issue in buyPremium', JSON.stringify(err));
        res.status(403).json({ 
            error: 'Something went wrong'
        })
    }
}

exports.onTransaction = async (req, res ) => {
    try {
        const userId = req.user.id;
        const orderId = req.body.order_id;
        const paymentId = req.body.payment_id;
        
        const order  = await Order.findOne({where : {orderId : orderId}})

        if(!paymentId){
          const response = await order.update({status: 'Failed'});
          return res.status(200).json(response);
        }

        const promise1 =  order.update({ paymentId: paymentId, status: 'Successful'});
        const promise2 =  req.user.update({ isPremiumUser: true }); 

        Promise.all([promise1, promise2]).then(()=> {
            return res.status(202).json({message: "Transaction Successful", token: userController.generateAccessToken(userId,undefined,true) });
        }).catch((error) => {
            throw new Error(error);
        })      
                
    } catch (err) {
        console.log('Issue in onTransaction', JSON.stringify(err));
        res.status(403).json({ 
            error: 'Transaction Failed'
        })

    }
}

exports.getLeaderBoard = async (req, res ) => {
    try {
        const userId = req.user.id;
        const expenses = await Expense.findAll();
        const users = await User.findAll();
        
        const userAggregatedExpenses = {};

        expenses.forEach((expense) => {
          
            const expenseUserId = expense.dataValues.userId;
             const expenseAmount = expense.dataValues.expenseAmount;
             
            if(userAggregatedExpenses[expenseUserId])
               userAggregatedExpenses[expenseUserId] = userAggregatedExpenses[expenseUserId] + expenseAmount;
            else
               userAggregatedExpenses[expenseUserId] = expenseAmount;
        });
     
       var leaderBoard = [];
       users.forEach((user) => {
        const userName = user.dataValues.name;
        const userId = user.dataValues.id;

           leaderBoard.push({ name: userName, total_expense: userAggregatedExpenses[userId] || 0 });
       });

           leaderBoard.sort((a,b) => b.total_expense - a.total_expense);
           res.status(200).json(leaderBoard);
                
    }catch(err) {
        console.log('Issue in getLeaderBoard', JSON.stringify(err));
        res.status(403).json({ 
            error: 'Something went wrong'
        });

    }
}