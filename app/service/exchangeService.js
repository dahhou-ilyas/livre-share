const User = require('../models/User');
const Book=require('../models/Book');

module.exports={
    removeOutgoingBook: async(originaleUserId,notOriginUserId,bookId)=>{
        const filter = {
            '_id': originaleUserId,
            'outgoingBooks.book': bookId,
            'outgoingBooks.toUser': notOriginUserId
        };
        const update = {
            $pull: {
              'outgoingBooks': {
                'book': bookId,
                'toUser': notOriginUserId
              }
            }
        };
        const result = await User.findOneAndUpdate(filter, update, { new: true });
        if(!result){
            return {status:404,data:"le book ou les user ne pas existe"}
        }
        return {status:200,data:result}
    },
    removeIncomingBook:async (originaleUserId,notOriginUserId,bookId)=>{
        const filter = {
            '_id': notOriginUserId,
            'incomingBooks.book': bookId,
            'incomingBooks.fromUser': originaleUserId
        };
        const update = {
            $pull: {
              'incomingBooks': {
                'book': bookId,
                'fromUser': originaleUserId
              }
            }
        };
        const result = await User.findOneAndUpdate(filter, update, { new: true });
        if(!result){
            return {status:404,data:"le book ou les user ne pas existe"}
        }
        return {status:200,data:result}
    },
    changeLibraryStatus:async (originaleUserId,bookId)=>{
        const filter = {
            '_id': originaleUserId,
            'library.book': bookId
        };
        const update = {
          $set: {
            'library.$.status': 'available'
          }
        };
        const result = await User.findOneAndUpdate(filter, update, { new: true });
        if(!result){
            return {status:404,data:"user or book not found"}
        }
        return {status:200,data:result}
    },
    resolveNotification:async (originaleUserId,notOriginUserId,bookId)=>{
        const filter = {
            '_id': originaleUserId,
            'notifications.content.user': notOriginUserId,
            'notifications.content.book': bookId
        };
        const update = {
            $set: {
              'notifications.$.status': 'Resolved'
            }
        };
        const result = await User.findOneAndUpdate(filter, update, { new: true });
        if(!result){
            return {status:404,data:"user or book not found"};
        }
        return {status:200,data:result};
    }
}