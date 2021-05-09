const { user } = require("firebase-functions/lib/providers/auth");

users={
    roomId: {
      victim: {
            socketId: 'effef',
            uid: 'uid',
            geocode: 'geocode'
      },
      helpers:[{
            socketId: 'sddg',
            uid: 'dsfsg',
            geocode: 'dfg'
        }
      ]
    }
}

dummyHelpers = [
    {
        socketId: '',
        roomId: ''
    }
];
const addUser = (uid, geocode, roomId, socketId) => {
    if(!uid || !geocode || !roomId || !socketId) return {error: 'Data missing'} // error handling by VIMALLL :)
    if(socketId === users.roomId.victim.socketId) return {error: 'Creator'}
    const user = users.helpers.find((user) => {
        return socketId === user.socketId && uid === user.uid;
    })
    if(user) return {error: "Already exist"};
    const newUser = {
        socketId: socketId,
        uid: uid,
        geocode: geocode
    }
    const newUsers = [
        ...users,
        newUser
    ]
    users = newUsers;

    const dummyHelper = {
        socketId: socketId,
        roomId: roomId
    }

    dummyHelpers.push(dummyHelper)
    //retrieve data info of user in db through uid
    userData = {}// from db?? Vimal
    return {user: user};
}

const getUsersInRoom = (roomId) => {

    const allUsers = [
        ...users.roomId.helpers
    ]
    // retrieve user data fom db 
    return allUsers
}

const updateLocation = (uid, geocode, roomId, socketId) => {
    if(!uid || !geocode || !roomId || !socketId) return {error: 'Data missing'}
    if(users.roomId.victim.socketId === socketId){
        const victimUser = {
            ...users.roomId.victim
        }
        victimUser.geocode = geocode;
        users.roomId.victim = victimUser;
        return victimUser;
    }
    const helpersArray = [ 
        ...users.roomId.helpers
    ]
    const userFindIndex = helpersArray.findIndex((user) => {
        return user.socketId === socketId && user.uid === uid
    })
    helpersArray[userFindIndex].geocode = geocode
    users.roomId.helpers = helpersArray;
    return helpersArray[userFindIndex]
}

const removeUser = (socketId) => {
    const userIndex = dummyHelpers.findIndex((user) => user.socketId === socketId);
    if(userIndex !== -1){
        const removeUser = dummyHelpers.splice(userIndex, 1)[0];
        const deletedUserRoomid = removeUser.socketId;
        if(users.deletedUserRoomid.victim.socketId === socketId){
            // save in db
            //end room
            //vimal??

        }
        else{
            userIndex = users.deletedUserRoomid.helpers.findIndex((user) => user.socketId === socketId);
            return users.deletedUserRoomid.helpers.splice(userIndex, 1)[0];
        }
       
    }
}



