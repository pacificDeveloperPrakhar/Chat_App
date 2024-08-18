// this is to authenticate socket connection
exports.authenticatePollingHandshake=async function (socket,next) {
    
}

//extracting the user from the socket connection with the help of custom header send
exports.extractUser=(socket, next) => {
    socket.request.user=JSON.parse(socket.handshake.headers.userid)
    next()
    };