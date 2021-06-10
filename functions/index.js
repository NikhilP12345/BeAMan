const functions = require("firebase-functions");
const express = require('express');

const bodyParser = require('body-parser');
const userRoutes = require('./routes/user/update');
const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET, POST, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});
app.use('/user', userRoutes);


exports.beAMan = functions.https.onRequest(app);
// const port = process.env.PORT || 8000;
// app.listen(port, () => console.log(`Server running on port ${port}`));



