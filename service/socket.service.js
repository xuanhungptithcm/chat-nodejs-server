var waitForYouModel = require('./../models/waitForYou.model');
var message = require('./../utils/message');
module.exports = {
    makeFriend: makeFriend
}
function makeFriend(request) {
    var recived = {
        sendRequestMakeFriendId: request.sendRequestMakeFriendId,
        idNeedMakeFriend: request.idNeedMakeFriend
    }
    return new Promise((resovle, reject) => {
        if (recived.sendRequestMakeFriendId && recived.idNeedMakeFriend) {
            waitForYouModel.updateOne({ ownerID: recived.sendRequestMakeFriendId },
                {
                    $push: {
                        listWaitFriend: recived.idNeedMakeFriend
                    }
                }, function (error, success) {
                    if (error) {
                        reject(error);
                    } else {                        
                        resovle(success);
                    }
                });
        }
    })


}