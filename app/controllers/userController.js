const User = require('../models/User');
const Book=require('../models/Book');
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
const { generateAccessToken } = require('../service/generateAccessToken');



module.exports={
    login:async (req,res)=>{
        const {username,password}=req.body;
        try {
            const user=await User.findOne({username});
            if(!user){
                res.status(404).json({ message: 'Authentication failed' });
            }
            const passwordMatch=await bcrypt.compare(password,user.password);
            if(!passwordMatch){
                res.status(401).json({ message: 'Authentication failed' });
            }
            const token=generateAccessToken(user._id,username)
            res.status(200).json({token});
        } catch (error) {
            res.status(500).json({error:"error dans la base de donne"})
        }
    },
    getUsers:async(req,res)=>{
        try {
            const users = await User.find({}).exec();
            return res.status(200).json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs dans le contrôleur :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    },
    getUserById:async (req,res)=>{
        const userId=req.params.id;
        try{
            const user=await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'Utilisateur non trouvé' });
            }
            return res.status(200).json(user);
        }catch (error){
            console.error('Erreur lors de la récupération de l\'utilisateur dans le contrôleur :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    },
    addUsers:async (req,res)=>{
        const {username,email,password,preferences}=req.body
        if(!username || !email || !password){
            res.status(400).json({message:"not full information"})
        }
        try {
            const newUser = new User({username,email,password,preferences}); // Utilisez req.body pour récupérer les données du corps de la requête
            // Enregistrez le nouvel utilisateur dans la base de données
            const savedUser = await newUser.save();
    
            return res.status(201).json(savedUser);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
            return res.status(500).json({ error: 'Erreur serveur' });
        }
    },
    deleteUser:async (req,res)=>{
        const session = await mongoose.startSession();
        session.startTransaction();
        const id=req.params.id;
        try{
            const user=await User.findByIdAndDelete(id);
            if(!user){
                await session.abortTransaction();
                session.endSession();
                res.status(404).json({message:"user not found"});
            }
            await Book.deleteMany({addedBy:id});

            await session.commitTransaction();
            session.endSession();
            
            res.status(204).send();
        }catch(e){
            await session.abortTransaction();
            session.endSession();
            console.error('Erreur lors de la suppression de l\'utilisateur et des livres:', e);
            res.status(500).json({error:"'Erreur serveur'"})
        }
    },
    updateUsers:async (req,res)=>{
        const id=req.params.id;
        const {username,email,password,preferences}=req.body;
        try {
            const existingUser=await User.find({$or:[{username},{email}]});
            if (existingUser && existingUser._id.toString() !== id) {
                return res.status(400).json({ message: 'L\'username ou l\'email est déjà utilisé par un autre utilisateur.' });
            }
            
            const updatedUser = await User.findByIdAndUpdate(
                id,
                { username, email, password, preferences },
                { new: true } // Pour obtenir l'utilisateur mis à jour dans la réponse
            );
            
            if (!updatedUser) {
                return res.status(404).json({ message: 'Utilisateur non trouvé.' });
            }
            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'utilisateur :', error);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    },
    sendExchangeRequest:async (req,res)=>{
        const {fromUser,bookId}=req.body;
        const userId=req.params.userId;
        
        try {
            const user_request=await User.findById(userId);
            const user_resonse=await User.findById(fromUser);

            if(!user_request || !user_resonse){
                res.status(404).json({message:"utilisateru not found"});
            }
            const bookExistsForUser = await Book.exists({ _id: bookId, addedBy: fromUser });
            if(!bookExistsForUser){
                res.status(404).json({message:"le book ne existe pas dans la collection de user"})
            }
            user_request.exchangeRequests.push({
                fromUser,
                book: bookId,
                status: "pending",
            });
            user_resonse.notifications.push({
                type:"exchange Request",
                content:{
                    user:userId,
                    book:bookId,
                }
            })
            await user_request.save();
            await user_resonse.save();
            res.status(201).json({ message: 'Demande d\'échange envoyée avec succès' });
        } catch (error) {
            console.error('Erreur lors de l\'envoi de la demande d\'échange :', error);
            res.status(500).json({ error: 'Erreur serveur' });
        }
    }
}