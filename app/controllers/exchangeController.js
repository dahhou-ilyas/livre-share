const User = require('../models/User');
const Book=require('../models/Book');
const mongoose=require('mongoose');

module.exports={
    //cette methode n'a pas encore teste
    exchangeResponse:async (req,res)=>{
        const user_ownerId=req.params.userId;
        const {status,bookId,man_who_requested_the_bookId}=req.body;
        try {
            if(status==="Accept"){
                const [user_owner, man_who_requested] = await Promise.all([
                    User.findById(user_ownerId),
                    User.findById(man_who_requested_the_bookId)
                ]);
                if(!user_owner || man_who_requested){
                    res.status(404).json({message:"users or user not found"});
                }

                const filter_owner = {
                    '_id': user_ownerId,
                    'notifications.content.user': man_who_requested_the_bookId,
                    'notifications.content.book': bookId
                  };
            
                const update_owner = {
                  $set: {
                    'notifications.$.status': status,
                  },
                };

                const filter_request={
                    '_id': man_who_requested_the_bookId,
                    'exchangeRequests.fromUser':user_ownerId,
                    'exchangeRequests.book':bookId
                }
                const update_request = {
                    $pull: {
                        'exchangeRequests': {
                          'fromUser': user_ownerId,
                          'book': bookId
                        }
                    }
                }
                  
                const [result1, result2] = await Promise.all([
                    User.findOneAndUpdate(filter_owner, update_owner, { new: true }),
                    User.findOneAndUpdate(filter_request, update_request, { new: true })
                ]);

                //il faut ensuite mettre à jour les booksortant et les booksentrant

                // il faut ajouter le book correspondant à la userowner dans le les book entrant dans la collection de la user request 
                // en suite on va ajouter le book dans le document correspondat à la user owner dans les book sotant

                if (!result) {
                  return res.status(404).json({ message: "Notification not found" });
                }
                

            }
        } catch (error) {
            
        }
    }
}