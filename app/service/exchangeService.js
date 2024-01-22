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
        
    }
}