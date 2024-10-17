import {io} from "socket.io-client"
const socket=io(import.meta.env.VITE_ROOT_SERVER,{
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