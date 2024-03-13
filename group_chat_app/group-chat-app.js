const path = require('path');
const express = require('express');
const fs = require('fs');
var cors = require('cors');
const bodyParser = require('body-parser');
const dotenv  = require('dotenv');
const { instrument } = require('@socket.io/admin-ui');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const httpServer = http.createServer(app);
const io = socketIo(httpServer,{
   cors: {
        origin: ['null', 'https://admin.socket.io']
      }
 });


 instrument(io, { auth: false });


dotenv.config();

const sequelize = require('./utilities/database');
const errorController = require('./controllers/error');
const chatController = require('./controllers/chat');
const User = require('./models/user');
const Chat = require('./models/chat');
const Group = require('./models/group');
const UserGroup = require('./models/user-group'); 
const GroupInvitation = require('./models/group-invitation');  


const userRoutes = require('./routes/user');
const chatRoutes = require('./routes/chat'); 
const groupRoutes = require('./routes/group'); 
const groupInvitationRoutes = require('./routes/group-invitation');
const adminRoutes = require('./routes/admin');

const socketAuthentication = require('./middlewares/authentication');

 

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
app.use('/group-invitation', groupInvitationRoutes);
app.use('/admin', adminRoutes);


app.use(errorController.get404);
app.use(chatController.onConnection);

User.hasMany(Chat);
Chat.belongsTo(User);

Group.belongsToMany(User, { through: UserGroup });
User.belongsToMany(Group, { through: UserGroup } );

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.hasMany(GroupInvitation);
GroupInvitation.belongsTo(User);




sequelize.sync({force: false})
         .then(result => {

            const connection = (socket) => {
                
               io.use((socket,next) => {
                   socketAuthentication.socketAuthenticate(socket,next);
               })

               console.log(socket.id);
               chatController.onConnection(io,socket);
            }

            io.on('connection', connection);

            httpServer.listen(process.env.PORT || 3000);
         })
         .catch(err => {
            console.log(err);   
         }) 

