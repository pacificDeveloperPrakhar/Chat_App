const { db } = require("../db/db_connection");
const { users } = require("../db/schema/schema")
const { eq } = require("drizzle-orm");
 
exports.socketConnectedToUser=async function(id,socketId){
    const {socket_connected}=(await db.select({socket_connected:users.socketConnected}).from(users).where(eq(users.id,id)))[0]
  
    console.log(`${socketId} has been connected `)
    socket_connected.push(socketId)
    await db
    .update(users)
    .set({ socketConnected:socket_connected })  // Store the updated array
    .where(eq(users.id, id));
}
//this project is made by prakhar
exports.socketDisconnectedFromUser = async function(id, socketId) {
    if (id && socketId) {
      try {
        // Fetch the current user data, especially the socketIds array
        const user = (await db
          .select({socket_connected:users.socketConnected})
          .from(users)
          .where(eq(users.id, id))
      )[0];  // Ensure you're getting the single user

      
      if (user && Array.isArray(user.socket_connected)) {
          // Remove the socketId from the array
          const socket_connected = user.socket_connected.filter(id => id !== socketId);
          
          // Update the user in the database with the modified socketIds array
          await db
          .update(users)
          .set({ socketConnected:socket_connected })  // Store the updated array
          .where(eq(users.id, id));
          
          console.log(`Socket ID ${socketId} removed for user with ID: ${id}`);
        }
    } catch (error) {
        console.error('Error removing socket ID on disconnect:', error);
      }
    }
  };
  //now making the socket connected array empty for all the users
  exports.clearSocketArrays=async function () {
    await db.update(users).set({socketConnected:[]})
  }