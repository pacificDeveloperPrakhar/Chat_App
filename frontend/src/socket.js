import { io } from 'socket.io-client';
const URL = process.env.NODE_ENV === 'production' ? undefined : 'http://localhost:3124';
socketHandler={}
export const setSocket=({user,query})=>{
 socket.io.opts.extraHeaders={
 user:JSON.stringify(user)}
 socket.io.opts.query=query
}

export default socket = io(URL,{
    path:"/chat",
// socket will be connected during the mounting and there is some user data stored in the redux store
    autoConnect:false,
    closeOnBeforeunload:false

});