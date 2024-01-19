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
    }
}