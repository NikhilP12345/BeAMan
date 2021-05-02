// const rooms = [
//     {
//       roomID: {
//         victim : 'userId',
//         neighbourHelpers: ['id1', 'id2'],
//         contactHelpers: [5484, 444]
//       }
//     }
//   ];
  
//   // Create room for the victim
//   const createRoom = ({userId, roomId}) => {
//     if(!userId || !roomId) return { error: 'userId and room are required.' };
//     const existingNeighbourHelper = rooms.find((room) => room.id === roomId);
//     if(existingNeighbourHelper) return {error: 'room already present'};
    
//     const room = { 
//       roomId: {
//         victim: userId,
//         neighbourHelpers: [],
//         contactHelpers: []
//       }
//     };
//     // nearby geocoders and contacts
//     rooms.push(room);
  
//     return room;
//   }
  
  
//   // Join user to room
//   // function userJoin(socketId, userInfo, roomId) {
//   //   const user = { socketId: socketId, userInfo: userInfo, roomId };
  
//   //   if (!users[roomId]) {
//   //     throw 'Room not found';
//   //   }
  
//   //   users[roomId].helpers.push(user);
  
//   //   return user;
//   // }
  
  
//   // // Get current user via roomId and socketId
//   // function getCurrentUser(roomId, socketId) {
//   //   let userList = users[roomId].helpers;
//   //   userList.push(users[roomId].victim);
  
//   //   return userList.find(user => user.socketId === socketId);
//   // }
  
//   // // User leaves chat
//   // function userLeave(roomId, socketId) {
//   //   const roomInfo = users[roomId];
  
//   //   // Has the victim left the room
//   //   if (roomInfo.victim.socketId === socketId) {
//   //     return roomInfo.victim;
//   //   }
  
//   //   const index = roomInfo.helpers.findIndex(user => user.id === id);
  
//   //   if (index !== -1) {
//   //     return users.splice(index, 1)[0];
//   //   }
//   // }
  
//   // // Get victim of the room
//   // function getRoomVictim(roomId) {
//   //   return users[roomId].victim;
//   // }
  
//   // // Get helpers of the room
//   // function getRoomHelpers(roomId) {
//   //   return users[roomId].helpers;
//   // }
  
//   module.exports = {
//     createRoom
//   };
//   // userJoin,
//   // getCurrentUser,
//   // userLeave,
//   // getRoomVictim,
//   // getRoomHelpers