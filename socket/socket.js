var socketService = require('./../service/socket.service');

module.exports = function(io){

    io.on('connection', (socket) => {
        // Bắt sự kiện làm bạn đưa vào danh sách chờ kết bạn
        socket.on('make friend', (request) => {
            var recived = {
                sendRequestMakeFriendId: request.sendRequestMakeFriendId,
                idNeedMakeFriend: request.idNeedMakeFriend
            }
            console.log(recived);
            
            socketService.makeFriend(recived)
            .then(response => {
                io.emit('wait_to_accept', response);
            }).catch(err => {
                io.emit('wait_to_accept', err);
            })
        });

        // Chấp nhận sự kiện làm bạn đưa vào danh sách bạn bè thật
        socket.on('accept friend', (request) => {
            socketService.acceptFriend(request)
            .then(response => {

            }).catch(err => {
                console.log(err);
            })
        });

        // Huỷ sự kiện làm bạn
        socket.on('cancle make friend', (request)=>{
            socketService.cancleMakeFriend(request)
            .then(response => {

            }).catch(err => {
                console.log(err);
            });
        });

        // Nhắn Tin
        socket.on('send message', (request) => {
            socketService.sendMessage(request)
            .then(response => {
                
            }).catch(err => {
                console.log(err);
            });
        });
    })
}
