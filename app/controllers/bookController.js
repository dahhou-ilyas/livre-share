const Book=require('../models/Book');
const User = require('../models/User');
const mongoose=require('mongoose');

module.exports={
    addBook:async (req,res)=>{
        const session =await mongoose.startSession()
        session.startTransaction();
        const id=req.params.userId;
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

            user.library.push({book:book._id,status:"available"})
            user.save({session})

            await session.commitTransaction();
            session.endSession();
            console.log("succes : transaction passé avec succé");
            res.status(201).json(book)
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            res.status(500).json({error:"error dans la base de donné"})
            throw error
        }
    },
    deletebook:async (req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
        const userId=req.params.userId;
        const bookId=req.params.bookId;
        try {
            const deletedBook = await Book.findByIdAndDelete(bookId, { session });
            if (!deletedBook) {
                res.status(404).json({ message: "Book not found" });
                await session.abortTransaction();
                session.endSession();
                return;
            }

            const user = await User.findByIdAndUpdate(
                userId,
                { $pull: { library: { book: bookId } } },
                { session, new: true }
            );

            await session.commitTransaction();
            session.endSession();

            res.status(200).json({ message: "Book deleted successfully", deletedBook });
        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.error("Error:", error);
            res.status(500).json({ error: "Database error" });
        }

    }
};