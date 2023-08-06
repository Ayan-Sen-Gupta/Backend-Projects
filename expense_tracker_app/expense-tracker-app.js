const path = require('path');
const express = require('express');
var cors = require('cors');
const bodyParser = require('body-parser');

const sequelize = require('./utilities/database');
const errorController = require('./controllers/error');
const userRoutes = require('./routes/user');

const app = express(); 

app.set('views', 'views');

app.use(cors());
app.use(bodyParser.json({extended:false}));
app.use(express.static(path.join(__dirname, 'public'))); 

app.use('/user', userRoutes);
app.use(errorController.get404);

sequelize.sync()
         .then(result => {
            app.listen(3000);
         })
         .catch(err => {
            console.log(err); 
         })

