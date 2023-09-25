const path = require('path');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv  = require('dotenv');


const sequelize = require('./utilities/database');
const errorController = require('./controllers/error');
const User = require('./models/user');
const Expense = require('./models/expense');
const Order = require('./models/premium');
const PasswordRequests = require('./models/password-request'); 
const DownloadExpenses = require('./models/expense-file'); 

const userRoutes = require('./routes/user');
const expenseRoutes = require('./routes/expense');
const premiumRoutes = require('./routes/premium');
const passwordRoutes = require('./routes/password-request');

dotenv.config();
const app = express(); 

app.set('views', 'views');

app.use(cors());
app.use(bodyParser.json({extended:false}));
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/user', userRoutes);
app.use('/expense', expenseRoutes);
app.use('/premium', premiumRoutes);
app.use('/password', passwordRoutes);
app.use(errorController.get404);

User.hasMany(Expense);
Expense.belongsTo(User);

User.hasMany(Order);
Order.belongsTo(User);

User.hasMany(PasswordRequests);
PasswordRequests.belongsTo(User);

User.hasMany(DownloadExpenses);
DownloadExpenses.belongsTo(User);

sequelize.sync()
         .then(result => {
            app.listen(3000);
         })
         .catch(err => {
            console.log(err); 
         }) 

