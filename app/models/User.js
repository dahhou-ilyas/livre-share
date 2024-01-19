const mongoose=require('mongoose');
const bcrypt=require('bcrypt')


const userSchema=new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    preferences: {
        literaryGenres: [{
            type: String,
        }],
        favoriteAuthors: [{
            authorName: {
            type: String,
            required: false,
            },
            intensity: {
            type: Number, // Peut être une note de 1 à 5 pour représenter l'intensité de l'intérêt
            }
        }]
    },
    library: [{
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        status: {
          type: String, // "available", "reserved", etc.
        },
    }],
    exchangeRequests: [{
        fromUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        status: {
          type: String, // "pending", "accepted", "rejected", etc.
        },
    }],
    chatHistory: [{
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        messages: [{
          content: {
            type: String,
          },
          timestamp: {
            type: Date,
            default: Date.now,
          },
        }],
      }],
      exchangeHistory: [{
        book: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Book',
        },
        withUser: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      }],
})
// Middleware pour hacher le mot de passe avant de sauvegarder l'utilisateur
userSchema.pre('save',async function(next){
    try{
        const salt=await bcrypt.genSalt(10);

        const hashPassword=await bcrypt.hash(this.password,salt);
        this.password = hashPassword;
        next();
    }catch (error) {
        next(error);
    }
})

const User=mongoose.model('User',userSchema);
module.exports=User;

