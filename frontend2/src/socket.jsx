import {io} from "socket.io-client"
const socket=io("http://127.0.0.1:3124/",{
    path:"/chat",
    autoConnect:false,
    closeOnBeforeunload:false
})
export const setSocket=function({user,query}){
    socket.io.opts.extraHeaders={
        user:JSON.stringify(user)
    }
    socket.io.opts.query=query
}
export default socket