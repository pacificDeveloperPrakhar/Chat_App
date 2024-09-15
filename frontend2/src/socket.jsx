import {io} from "socket.io-client"
import socket from "../../frontend/src/socket"
export const setSocket=function({user,query}){
    socket.io.opts.extraHeaders={
        user:JSON.stringify(user)
    }
    socket.io.opts.query=query
}
export default socket=io("http://127.0.0.1:3124/",{
    path:"chat",
    autoConnect:false,
    closeOnBeforeunload:false
})