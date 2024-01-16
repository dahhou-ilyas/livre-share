const mongoose=require('mongoose');

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
})