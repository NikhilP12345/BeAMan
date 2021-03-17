const functions = require("firebase-functions");
const express = require('express');

const bodyParser = require('body-parser');
const userClaimRoutes = require('./routes/user/update');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/user', userClaimRoutes);


exports.beAMan = functions.https.onRequest(app);
// const port = process.env.PORT || 8080;
// app.listen(port, () => {
//   console.log('Hello world listening on port', port);
// });


