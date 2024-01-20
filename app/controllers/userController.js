const User = require('../models/User');

module.exports={
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
        const id=req.params.id;
        try{
            const user=await User.findByIdAndDelete(id);
            if(!user){
                res.status(404).json({message:"utilisateur not found"});
            }
            res.status(204).send();
        }catch(e){
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
    }
}