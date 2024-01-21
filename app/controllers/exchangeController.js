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
                if(!user_owner || !man_who_requested){
                    res.status(404).json({message:"users or user not found"});
                }
                const bookExists = await Book.exists({ _id: bookId,addedBy: user_ownerId });
                if(!bookExists){
                    res.status(404).json({message:"book not found"});
                }
                const filter_owner = {
                    '_id': user_ownerId,
                    'notifications.content.user': man_who_requested_the_bookId,
                    'notifications.content.book': bookId
                  };
            
                const update_owner = {
                  $set: {
                    'notifications.$.status': status,
                    'library.$.status':"reserved"
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
                user_owner.outgoingBooks.push({
                    book:bookId,
                    toUser:man_who_requested_the_bookId
                })

                man_who_requested.incomingBooks.push({
                    book:bookId,
                    fromUser:user_ownerId,
                })
                //il faut modifier aussi la library (en modifiant le status reserved)
                //aussi il faut faire des transaction handle error pour n'est modifer le database lors d'un erreur
                await Promise.all([man_who_requested.save(),user_owner.save()])
                res.status(200).json({message:"echange est bine valide",status})

            }
        } catch (error) {
            res.status(500).json({error:"erreur dans la base de donné"})
        }
    },
    hello: (req, res) => {
        res.send("eeeeeee");
    }
}