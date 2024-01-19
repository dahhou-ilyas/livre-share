const User = require('../models/User');

module.exports={
    getUsers:async(req,res)=>{
        try {
            const users = await User.find({}).exec();
            return res.status(200).json(users);
        } catch (error) {
            console.error('Erreur lors de la récupération des utilisateurs dans le contrôleur :', error);
            return res.status(500).json({ message: 'Erreur serveur' });
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
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    },
    addUsers:async (req,res)=>{
        const {username,email,password}=req.body
        try {
            const newUser = new User(req.body); // Utilisez req.body pour récupérer les données du corps de la requête
    
            // Enregistrez le nouvel utilisateur dans la base de données
            const savedUser = await newUser.save();
    
            return res.status(201).json(savedUser);
        } catch (error) {
            console.error('Erreur lors de l\'ajout de l\'utilisateur :', error);
            return res.status(500).json({ message: 'Erreur serveur' });
        }
    }
}