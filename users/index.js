const express = require('express');
const cors = require('cors');
require('dotenv').config();
const userRoutes = require('./routes');
const mongoose = require('mongoose');

const USER_DB_URL = process.env.USER_DB_URL || 'mongodb://localhost:27017/user-db';

mongoose.connect(USER_DB_URL, {useNewUrlParser: true, useUnifiedTopology: true}, (err) => {
    if (err) {
        console.error('---Error while connecting to mongodb database----',err);
    }
    else{
        console.log('---Successfully connected to mongodb user database---');
        
    }
})
const app = express();
const port = process.env.USER_SERVICE_PORT || 3000;
app.use(cors());
app.use(express.json());

app.use('/', userRoutes);

app.listen(port, () => {
    console.log(`UserService listening on port ${port}!`);
});

