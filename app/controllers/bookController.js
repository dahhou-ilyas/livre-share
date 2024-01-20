const Book=require('../models/Book');
const User = require('../models/User');
const mongoose=require('mongoose');

module.exports={
    addBook:async (req,res)=>{
        const session =await mongoose.startSession()
        session.startTransaction();
        const id=req.params.id;
        const {title,author,genre,publicationYear}=req.body;
        if(!title || !author){
            res.status(400).json({message:"title and author are required !!!"});
        }
        try {
            const user=await User.findById(id);
            if(!user){
                res.status(400).json({message:"user not found"});
            }
            const book=new Book({title,author,genre,publicationYear,addedBy:user._id.toString()});
            book.save({session});

            await session.commitTransaction();
            session.endSession();
            console.log("succes : transaction passé avec succé");
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({error:"error dans la base de donné"})
            throw error
        }
    }
};