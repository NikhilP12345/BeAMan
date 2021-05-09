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
  socket.on('joinRoom', ({geocode, uid, roomId}, callback) => {
    const {user, error} = addUser(uid, geocode, roomId, socket.id);
    if(error) callback(error);
    socket.join(roomId);
    io.broadcast.to(roomId).emit('adminKnowJoin', {admin: 'admin', text : "New joined",  user: user}); // only admin or all
    io.to(roomId).emit('allUser', { user: user, users: getUsersInRoom(roomId) });
    
  })
  socket.on('updateLocation', ({geocode, uid, roomId}, callback) => {
    const {user, error} = updateLocation(uid, geocode, roomId, socket.id);

    if(error) callback(error);
    io.to(roomId).emit('update', {user: user});

    callback();
  })
  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    
    if(user){
      io.to(user.roomId).emit('adminKnowJoin', { user: 'admin', text: "User left", user: user }); // only admi or all
      io.to(user.roomId).emit('allUser', { user: user.room, users: getUsersInRoom(user.room)});
    }
  })
});



