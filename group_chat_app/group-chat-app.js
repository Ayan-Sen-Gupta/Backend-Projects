const path = require('path');
const express = require('express');
const fs = require('fs');
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv  = require('dotenv');


dotenv.config();

const sequelize = require('./utilities/database');
const errorController = require('./controllers/error');
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/user-group'); 


const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat'); 
const groupRoutes = require('./routes/group'); 



const app = express(); 

app.set('views', 'views');

app.use(
   cors({
      origin: "null",
      credentials: true
    })
);
app.use(bodyParser.json({extended:false}));
app.use(express.json());       
app.use(express.urlencoded({extended: true})); 
app.use(express.static(path.join(__dirname, 'public')));
 


app.use('/user', userRoutes);
app.use('/chat', chatRoutes);
app.use('/group', groupRoutes);


app.use(errorController.get404);

User.hasMany(Chat);
Chat.belongsTo(User);

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup } );

Group.hasMany(Chat);
Chat.belongsTo(Group);




sequelize.sync()
         .then(result => {
            app.listen(process.env.PORT || 3000);
         })
         .catch(err => {
            console.log(err);  
         }) 

