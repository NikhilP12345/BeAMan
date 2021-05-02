const functions = require("firebase-functions");
const express = require('express');

const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/update');
const mainRoutes = require('./routes/oneClick/manager');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/user', userRoutes);
app.use('/room', mainRoutes);


// exports.beAMan = functions.https.onRequest(app);
const port = process.env.PORT || 5000;
const server = app.listen(port);
const io = require('./socket/socket').init(server);
io.on('connection', socket => {
  console.log('Client connected');
});



