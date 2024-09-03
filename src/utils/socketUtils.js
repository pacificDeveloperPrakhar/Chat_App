
const { db } = require("../db/db_connection");
const { users,conversations,message:messages } = require("../db/schema/schema")
const { eq ,and,arrayContains,inArray} = require("drizzle-orm");
const appError = require("./appErrors");

 
exports.socketConnectedToUser=async function(id,socketId){
    const user=(await db.select({socket_connected:users.socketConnected}).from(users).where(eq(users.id,id)))[0]
    if(!user)
      throw new appError("no user was found during the socket connection",400);
    const {socket_connected}=user
      
    
    console.log(`${socketId} has been connected `)
    socket_connected.push(socketId)
    await db
    .update(users)
    .set({ socketConnected:socket_connected ,userStatus:"active"})  // Store the updated array
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
          .set({ socketConnected:socket_connected ,userStatus:(socket_connected.length?"active":"inactive")})  // Store the updated array
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
    await db.update(users).set({socketConnected:[],userStatus:"inactive"})
  }

//   now a socket function to get all the users and return them
exports.getSocketUsers=async function ({userStatus}) {
    let userArr
    if(userStatus)
    usersArr=await db.select().from(users).where(eq(users.userStatus,userStatus));
    else
    usersArr=await db.select().from(users).where(eq(users.is_verified,true))
    return await usersArr
    
}
//create a room if it exists then return the existing one
exports.getTheConversations=async function findMatchingConversation(me,users) {
// Combine and flatten the arrays
const participantsArray = [me.id, ...users.map(user => user.id)];
const usernameArray = [me.username, ...users.map(user => user.username)];

// Remove duplicates using Set
const uniqueParticipants = [...new Set(participantsArray)];
const uniqueUsernames = [...new Set(usernameArray)];
// Convert the participantsArray to a sorted version to ensure consistent comparison
const sortedParticipants = participantsArray.sort();
const usersArray = [me, ...users].filter(
  (user, index, self) =>
    index === self.findIndex(u => u.id === user.id)
);


  // looking for the conversation if it exists
  const matchingConversations = await db.select().from(conversations)
    .where(
        eq(
          conversations.participantsId, uniqueParticipants  // Compare sorted participants
        
      )
    );

  // Return the conversation if found
  // if the conversation row already exits then return the existing row of the corresponding conversation
  if(matchingConversations.length)
  {
    return matchingConversations;
  }
   const conversation=(await db.insert(conversations).values({
    participants:usersArray,
    roomName:JSON.stringify(uniqueUsernames),
    participantsId:uniqueParticipants
  }).returning({
    id:conversations.id,
  }))[0]
  return await db.update(conversations).set({
    roomName:conversation.id
  }).where(eq(conversations.id,conversation.id)).returning()
}

exports.getAllConversations=async function (id) {
 const conversationsAll=await db.select().from(conversations).where(arrayContains(conversations.participantsId,id))
  return conversationsAll
}
// to create the room for initating the conversation and joining all the corresponding sockets of the users to that room`
exports.createRoomForConversation=async function(conversation,io,socketCollection){
  const allSocketsForRoom=(await db.select({socketConnected:users.socketConnected}).from(users).where(inArray(users.id,conversation?.[0].participantsId)))
 for(let i=0;i<allSocketsForRoom.length;i++){
  allSocketsForRoom[i].socketConnected.forEach((socketId=>{
    if(!socketCollection?.[socketId])
      return
    socketCollection?.[socketId]?.join(conversation?.[0].roomName);
  }))
 }
//  after creating the conversation it will emit the new conversation has been created to notify all the sockets connected that
// the new conversation has been created and they have been included
 io.in(conversation?.[0].roomName).emit("create_conversations",conversation?.[0])
}

exports.storeChatAndEmit=async function(socket,io,mssg){
  const {userId,conversationId}=mssg;
  
    const user=(await db.select({senderId:users.id,profileUrl:users.profileUrl}).from(users).where(eq(users.id,userId)))[0]
    if(!user)
      throw new appError("no user was found in the database",403)
    const conversation=(await db.select().from(conversations).where(eq(conversations.id,conversationId)))[0]
    if(!conversation)
      throw new appError("no conversation does exist in the database",403)
    // preparing the message's field prior to storing it into the database
    const message={}
   message.profilePic=user.profileUrl||"";
   message.senderId=user.senderId;
   message.conversationsId=conversation.id;
   if(mssg.text)
    message.text=mssg.text;
   if(mssg.file)
    message.file=mssg.file;
  const resultingMessage=(await db.insert(messages).values(message).returning({id:messages.id,text:messages.text,file:messages.file,senderId:messages.senderId,conversationId:messages.conversationsId,type:messages.type,profilePic:messages.profilePic}))[0]
  io.in(conversation.roomName).emit("chatMessage",resultingMessage)
}