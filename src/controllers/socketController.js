const appError = require("../utils/appErrors");

// this is to authenticate socket connection
exports.authenticatePollingHandshake=async function (socket,next) {
    
}

//extracting the user from the socket connection with the help of custom header send
exports.extractUser=(socket, next) => {
    if(!socket?.handshake?.headers?.user?.length){

        console.log("cannot authenticate to the websocket")
        return next(new appError("cannot authenticate to the websocket",400))
    }
    socket.request.user=JSON.parse(socket.handshake.headers.user)
    next()
    };